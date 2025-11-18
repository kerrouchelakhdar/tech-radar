import json
from pathlib import Path
from typing import List, Dict
import feedparser
from datetime import datetime, timezone

def load_feeds() -> List[Dict]:
    """Load RSS feeds configuration"""
    config_path = Path(__file__).parent.parent / 'config' / 'feeds.json'
    with open(config_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['feeds']

def fetch_feed(feed_config: Dict) -> List[Dict]:
    """Fetch and parse a single RSS feed"""
    url = feed_config['url']
    category = feed_config['category']
    source_name = feed_config['name']
    
    try:
        print(f'[fetch] fetching {source_name}...')
        feed = feedparser.parse(url)
        
        if not feed.entries:
            print(f'[fetch] no entries from {source_name}')
            return []
        
        entries = []
        for entry in feed.entries[:20]:  # Limit to 20 newest
            entries.append({
                'title': entry.get('title', 'Untitled'),
                'link': entry.get('link', ''),
                'description': entry.get('description', '') or entry.get('summary', ''),
                'published': entry.get('published', '') or entry.get('updated', ''),
                'category': category,
                'source_name': source_name,
                'source_url': entry.get('link', ''),
                'media': entry.get('media_content', []),
                'enclosures': entry.get('enclosures', [])
            })
        
        print(f'[fetch] {source_name}: {len(entries)} entries')
        return entries
    
    except Exception as e:
        print(f'[fetch] error with {source_name}: {e}')
        return []

def run_stage() -> List[Dict]:
    """Fetch from all RSS feeds"""
    feeds = load_feeds()
    all_entries = []
    
    for feed_config in feeds:
        entries = fetch_feed(feed_config)
        all_entries.extend(entries)
    
    print(f'[stage1] total fetched: {len(all_entries)} entries')
    return all_entries
