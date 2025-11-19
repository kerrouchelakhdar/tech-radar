import requests
from bs4 import BeautifulSoup
from typing import Optional
import time

def get_og_image(url: str) -> Optional[str]:
    """Extract Open Graph image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code != 200:
            return None
        
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        # Try og:image
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            return og_image['content']
        
        # Try twitter:image
        tw_image = soup.find('meta', attrs={'name': 'twitter:image'})
        if tw_image and tw_image.get('content'):
            return tw_image['content']
        
        # Try first large image
        img = soup.find('img', width=lambda w: w and int(w) > 400)
        if img and img.get('src'):
            return img['src']
        
        return None
    except Exception as e:
        print(f'[image] error fetching from {url[:50]}: {e}')
        return None

def get_unsplash_image(query: str, fallback: bool = True) -> Optional[str]:
    """Get random image from Unsplash (fallback)"""
    if not fallback:
        return None
    
    try:
        # Use Unsplash Source API (no key needed)
        query_clean = query.replace(' ', ',')[:50]
        url = f'https://source.unsplash.com/800x450/?{query_clean}'
        return url
    except Exception:
        return 'https://source.unsplash.com/800x450/?technology,code'

def get_image_for_article(source_url: str, title: str, category: str) -> str:
    """Get best available image for article"""
    # Try source URL first
    if source_url:
        og_image = get_og_image(source_url)
        if og_image:
            return og_image
        time.sleep(0.5)  # Rate limit
    
    # Fallback to Unsplash with category/title
    query = f"{category} {title.split()[0]}"
    return get_unsplash_image(query, fallback=True)
