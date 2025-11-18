from typing import List, Dict, Optional
from bs4 import BeautifulSoup
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from utils.dedup import slugify

# Try to import AI enhancer (optional)
try:
    from utils.ai_enhancer import get_enhancer
    AI_ENHANCER_AVAILABLE = True
except ImportError:
    AI_ENHANCER_AVAILABLE = False
    print("[stage3] AI enhancer not available (missing groq package)")

def clean_html(html: str) -> str:
    """Extract plain text from HTML for summaries/descriptions"""
    if not html:
        return ''

    soup = BeautifulSoup(html, 'html.parser')

    # Remove script and style tags
    for tag in soup(['script', 'style', 'iframe']):
        tag.decompose()

    text = soup.get_text(separator=' ', strip=True)
    # Clean extra whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def sanitize_html(html: str) -> str:
    """Sanitize and keep basic structure (p, headings, lists, links)."""
    if not html:
        return ''

    soup = BeautifulSoup(html, 'html.parser')

    # Remove unwanted tags entirely
    for tag in soup(['script', 'style', 'iframe', 'noscript', 'svg']):
        tag.decompose()

    # Drop common non-article sections
    for selector in [
        '[aria-label="advertisement"]', '.ad', '.ads', '.advert', '.advertisement',
        '.share', '.social', '.newsletter', '.subscribe', '.paywall', '.promo'
    ]:
        for node in soup.select(selector):
            node.decompose()

    # Allowlist of tags to keep; unwrap everything else but keep inner text
    allowed = {
        'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'blockquote', 'pre', 'code', 'a', 'figure', 'figcaption', 'img'
    }
    for tag in list(soup.find_all(True)):
        if tag.name not in allowed:
            tag.unwrap()
        else:
            # Clean attributes
            attrs = dict(tag.attrs)
            for attr in list(attrs.keys()):
                if tag.name == 'a' and attr in {'href', 'title'}:
                    continue
                if tag.name == 'img' and attr in {'src', 'alt', 'title'}:
                    continue
                # Remove all other attributes (style, class, data-*, etc.)
                tag.attrs.pop(attr, None)

            if tag.name == 'a':
                # Ensure safe outbound links
                href = tag.get('href')
                if href:
                    tag['rel'] = 'nofollow noopener noreferrer'
                    tag['target'] = '_blank'

    # Remove consecutive empty paragraphs
    for p in soup.find_all('p'):
        if not p.get_text(strip=True) and not p.find('img'):
            p.decompose()

    return str(soup)

def extract_full_html(entry: Dict) -> Optional[str]:
    """Prefer full HTML if present in the RSS entry."""
    # content:encoded usually appears under 'content' as a list
    content_list = entry.get('content')
    if isinstance(content_list, list):
        for c in content_list:
            if isinstance(c, dict):
                val = c.get('value') or c.get('content')
                if val and len(val) > 300:  # heuristic to ensure not a tiny snippet
                    return val

    # summary_detail may contain HTML
    summary_detail = entry.get('summary_detail')
    if isinstance(summary_detail, dict):
        if summary_detail.get('type') == 'text/html':
            val = summary_detail.get('value')
            if val and len(val) > 300:
                return val

    # Fallback to description if it's long enough
    desc = entry.get('description')
    if desc and len(desc) > 300:
        return desc

    return None

def extract_image_url(entry: Dict) -> str:
    """Extract image URL from RSS entry"""
    # Try media_content
    media = entry.get('media', [])
    if media and isinstance(media, list):
        for m in media:
            if isinstance(m, dict) and m.get('url'):
                return m['url']

    # Try enclosures
    enclosures = entry.get('enclosures', [])
    if enclosures and isinstance(enclosures, list):
        for enc in enclosures:
            if isinstance(enc, dict):
                url = enc.get('href') or enc.get('url')
                if url and any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    return url

    # Try description HTML for img tags
    desc = entry.get('description', '')
    if '<img' in desc:
        soup = BeautifulSoup(desc, 'html.parser')
        img = soup.find('img')
        if img and img.get('src'):
            return img['src']

    return None

def extract_keywords(title: str, description: str, category: str) -> List[str]:
    """Extract keywords from title and description"""
    text = f"{title} {description}".lower()

    # Remove common words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'as'}
    
    # Extract words (2+ chars)
    words = re.findall(r'\b[a-z]{2,}\b', text)
    filtered = [w for w in words if w not in stop_words]

    # Count frequency
    freq = {}
    for word in filtered:
        freq[word] = freq.get(word, 0) + 1

    # Sort by frequency
    top_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:5]
    keywords = [word for word, _ in top_words]

    # Add category as keyword
    keywords.insert(0, category.lower().replace(' ', '-'))

    return keywords[:5]

def transform_entry(entry: Dict) -> Dict:
    """Transform RSS entry to article format with optional AI enhancement"""
    title = entry.get('title', 'Untitled')[:70]
    description_html = entry.get('description', '')
    description_clean = clean_html(description_html)[:240]

    # Prefer full HTML if available
    full_html = extract_full_html(entry)
    content_html = sanitize_html(full_html) if full_html else ''

    # If no full HTML, use a paragraph from cleaned description
    if not content_html and description_clean:
        content_html = f"<p>{description_clean}</p>"

    # Try AI enhancement if content is short
    if AI_ENHANCER_AVAILABLE and content_html:
        try:
            enhancer = get_enhancer()
            if enhancer:
                enhanced = enhancer.enhance_content(content_html, title)
                if enhanced:
                    print(f"[stage3] AI enhanced: {title[:50]}...")
                    content_html = enhanced
        except Exception as e:
            print(f"[stage3] AI enhancement failed: {e}")

    # Append a CTA to read the original
    cta = f"<p><a href=\"{entry['source_url']}\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">Read the full article on {entry['source_name']}</a></p>"
    content = f"{content_html}\n{cta}" if content_html else cta

    # Extract or generate keywords
    keywords = extract_keywords(title, description_clean, entry['category'])

    # Get image
    image_url = extract_image_url(entry)

    return {
        'title': title,
        'slug': slugify(title),
        'description': description_clean[:180] if description_clean else title[:160],
        'content': content,
        'category': entry['category'],
        'source_name': entry['source_name'],
        'source_url': entry['source_url'],
        'image_url': image_url,
        'seo_keywords': keywords
    }

def run_stage(entries: List[Dict]) -> List[Dict]:
    """Transform RSS entries to article format"""
    articles = []

    for entry in entries:
        try:
            article = transform_entry(entry)
            articles.append(article)
        except Exception as e:
            print(f'[stage3] transform error: {e}')
            continue

    print(f'[stage3] transformed {len(entries)} -> {len(articles)} articles')
    return articles

