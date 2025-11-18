from typing import List, Dict
import sys
from pathlib import Path
import json
from datetime import datetime, timezone, timedelta
import requests

sys.path.insert(0, str(Path(__file__).parent.parent))
from utils.supabase_client import get_supabase, load_config

def check_category_rate_limit(category: str, max_per_hour: int) -> bool:
    """Check if category has room for more articles"""
    sb = get_supabase()
    
    try:
        since = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
        resp = sb.table('articles').select('id', count='exact').eq('category', category).gte('published_date', since).execute()
        
        count = getattr(resp, 'count', 0)
        if count >= max_per_hour:
            print(f'[stage5] skip {category} - rate limit ({count}/{max_per_hour} last hour)')
            return False
        return True
    except Exception as e:
        print(f'[stage5] rate check error: {e}')
        return True  # Allow on error

def insert_article(article: Dict) -> bool:
    """Insert single article into database"""
    sb = get_supabase()
    
    try:
        data = {
            'title': article['title'],
            'slug': article['slug'],
            'description': article['description'],
            'content': article['content'],
            'category': article['category'],
            'source_name': article.get('source_name'),
            'source_url': article.get('source_url'),
            'image_url': article.get('image_url'),
            'seo_keywords': article.get('seo_keywords', []),
            'published_date': datetime.now(timezone.utc).isoformat()
        }
        
        sb.table('articles').insert(data).execute()
        print(f"[stage5] inserted: {article['title'][:50]}")
        return True
    
    except Exception as e:
        error_msg = str(e)
        if '23505' in error_msg or 'duplicate' in error_msg.lower():
            print(f"[stage5] skip duplicate: {article['title'][:40]}")
        else:
            print(f"[stage5] insert error: {error_msg[:100]}")
        return False

def revalidate_site():
    """Trigger Next.js revalidation"""
    cfg = load_config()
    revalidate_url = cfg.get('revalidate_url')
    secret = cfg.get('revalidate_secret')
    
    if not revalidate_url or not secret:
        print('[stage5] skip revalidation (missing config)')
        return
    
    try:
        resp = requests.post(
            revalidate_url,
            json={'secret': secret, 'path': '/'},
            timeout=10
        )
        if resp.status_code == 200:
            print('[stage5] revalidated site')
        else:
            print(f'[stage5] revalidate failed: {resp.status_code}')
    except Exception as e:
        print(f'[stage5] revalidate error: {e}')

def run_stage(articles: List[Dict]) -> int:
    """Publish articles to database"""
    config_path = Path(__file__).parent.parent / 'config' / 'feeds.json'
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    rate_limits = config.get('rate_limits', {})
    max_total = rate_limits.get('max_articles_per_run', 10)
    max_per_category = rate_limits.get('max_per_category_per_hour', 2)
    
    # Limit total
    articles = articles[:max_total]
    
    inserted_count = 0
    category_counts = {}
    
    for article in articles:
        category = article['category']
        
        # Check category rate limit
        if not check_category_rate_limit(category, max_per_category):
            continue
        
        # Check batch category limit
        if category_counts.get(category, 0) >= max_per_category:
            continue
        
        # Insert
        if insert_article(article):
            inserted_count += 1
            category_counts[category] = category_counts.get(category, 0) + 1
    
    print(f'[stage5] inserted {inserted_count}/{len(articles)} articles')
    
    if inserted_count > 0:
        revalidate_site()
    
    return inserted_count
