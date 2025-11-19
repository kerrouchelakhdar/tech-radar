import sys
import os
from pathlib import Path
import time

# Add pipeline directory to path
sys.path.append(str(Path(__file__).parent))

from utils.supabase_client import get_supabase
from stages.stage3_transform import fetch_article_content, sanitize_html

def fix_short_articles():
    supabase = get_supabase()
    
    # Fetch articles with short content (e.g., less than 1000 characters)
    # Note: Supabase API might not support filtering by length directly easily in all client versions,
    # so we might fetch a batch and filter in python, or use a raw query if possible.
    # For simplicity, let's fetch recent articles and check them.
    
    print("Fetching articles...")
    # Fetch last 100 articles
    response = supabase.table('articles').select('*').order('published_date', desc=True).limit(100).execute()
    articles = response.data
    
    print(f"Found {len(articles)} articles. Checking for short content...")
    
    count = 0
    for article in articles:
        content = article.get('content', '')
        if not content or len(content) < 1000:
            print(f"Fixing article: {article['title']} (Length: {len(content)})")
            
            source_url = article.get('source_url')
            if not source_url:
                print("  No source URL, skipping.")
                continue
                
            try:
                full_html = fetch_article_content(source_url)
                if full_html and len(full_html) > len(content):
                    new_content = sanitize_html(full_html)
                    
                    # Add CTA if missing
                    if "Read the full article on" not in new_content:
                        cta = f"<p><a href=\"{source_url}\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">Read the full article on {article['source_name']}</a></p>"
                        new_content += f"\n{cta}"
                    
                    # Update in Supabase
                    supabase.table('articles').update({'content': new_content}).eq('id', article['id']).execute()
                    print(f"  Updated! New length: {len(new_content)}")
                    count += 1
                    time.sleep(1) # Be nice to sources
                else:
                    print("  Could not fetch better content.")
            except Exception as e:
                print(f"  Error fixing article: {e}")
                
    print(f"Finished. Fixed {count} articles.")

if __name__ == "__main__":
    fix_short_articles()
