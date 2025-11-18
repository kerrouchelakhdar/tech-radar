from typing import List, Dict
from datetime import datetime, timezone, timedelta
import json
from pathlib import Path

def load_config():
    """Load rate limiting configuration"""
    config_path = Path(__file__).parent.parent / 'config' / 'feeds.json'
    with open(config_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('rate_limits', {})

def is_too_old(published_str: str, max_hours: int) -> bool:
    """Check if article is too old"""
    if not published_str:
        return False
    
    try:
        from dateutil import parser
        pub_date = parser.parse(published_str)
        if pub_date.tzinfo is None:
            pub_date = pub_date.replace(tzinfo=timezone.utc)
        
        age = datetime.now(timezone.utc) - pub_date
        return age > timedelta(hours=max_hours)
    except Exception:
        return False

def is_too_short(title: str, description: str) -> bool:
    """Check if article content is too short"""
    return len(title) < 20 or len(description) < 50

def run_stage(entries: List[Dict]) -> List[Dict]:
    """Filter entries by quality and freshness"""
    config = load_config()
    max_age = config.get('max_article_age_hours', 72)
    
    filtered = []
    
    for entry in entries:
        # Skip if too old
        if is_too_old(entry.get('published', ''), max_age):
            continue
        
        # Skip if too short
        if is_too_short(entry.get('title', ''), entry.get('description', '')):
            continue
        
        # Skip if no link
        if not entry.get('link'):
            continue
        
        filtered.append(entry)
    
    print(f'[stage2] filtered {len(entries)} -> {len(filtered)} (removed stale/low-quality)')
    return filtered
