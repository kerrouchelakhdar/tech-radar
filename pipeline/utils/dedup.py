import re
import hashlib
from typing import Set, List
from .supabase_client import get_supabase

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    slug = text.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug[:60]

def get_existing_urls() -> Set[str]:
    """Get all existing source URLs from database"""
    sb = get_supabase()
    try:
        resp = sb.table('articles').select('source_url').execute()
        return {article['source_url'] for article in resp.data if article.get('source_url')}
    except Exception as e:
        print(f'[dedup] warning: could not fetch existing URLs: {e}')
        return set()

def get_existing_slugs() -> Set[str]:
    """Get all existing slugs from database"""
    sb = get_supabase()
    try:
        resp = sb.table('articles').select('slug').execute()
        return {article['slug'] for article in resp.data if article.get('slug')}
    except Exception as e:
        print(f'[dedup] warning: could not fetch existing slugs: {e}')
        return set()

def is_duplicate(article: dict, existing_urls: Set[str], existing_slugs: Set[str]) -> bool:
    """Check if article is duplicate"""
    # Check source URL
    if article.get('source_url') in existing_urls:
        return True
    
    # Check slug
    slug = slugify(article.get('title', ''))
    if slug in existing_slugs:
        return True
    
    return False

def generate_content_hash(title: str, description: str) -> str:
    """Generate hash for content similarity detection"""
    content = f"{title.lower()}{description.lower()}"
    return hashlib.md5(content.encode()).hexdigest()

def filter_duplicates(articles: List[dict]) -> List[dict]:
    """Remove duplicates from article list"""
    existing_urls = get_existing_urls()
    existing_slugs = get_existing_slugs()
    
    filtered = []
    seen_hashes = set()
    
    for article in articles:
        # Skip if already in database
        if is_duplicate(article, existing_urls, existing_slugs):
            continue
        
        # Skip if similar article in current batch
        content_hash = generate_content_hash(
            article.get('title', ''),
            article.get('description', '')
        )
        if content_hash in seen_hashes:
            continue
        
        seen_hashes.add(content_hash)
        filtered.append(article)
    
    return filtered
