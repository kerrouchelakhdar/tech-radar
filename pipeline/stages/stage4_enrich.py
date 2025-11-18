from typing import List, Dict
import sys
from pathlib import Path
import time

sys.path.insert(0, str(Path(__file__).parent.parent))
from utils.dedup import filter_duplicates
from utils.image_fetch import get_image_for_article
from utils.supabase_client import get_supabase

def enrich_article(article: Dict) -> Dict:
    """Add image if missing"""
    if not article.get('image_url'):
        article['image_url'] = get_image_for_article(
            article.get('source_url', ''),
            article.get('title', ''),
            article.get('category', 'technology')
        )
        time.sleep(0.3)  # Rate limit image fetching
    
    return article

def run_stage(articles: List[Dict]) -> List[Dict]:
    """Filter duplicates and enrich articles"""
    # Remove duplicates
    unique = filter_duplicates(articles)
    print(f'[stage4] dedup: {len(articles)} -> {len(unique)}')
    
    # Enrich with images
    enriched = []
    for article in unique:
        try:
            enriched_article = enrich_article(article)
            enriched.append(enriched_article)
        except Exception as e:
            print(f'[stage4] enrich error: {e}')
            enriched.append(article)  # Add without enrichment
    
    print(f'[stage4] enriched {len(enriched)} articles')
    return enriched
