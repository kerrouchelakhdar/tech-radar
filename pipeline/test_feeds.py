import feedparser

feeds = [
    'https://techcrunch.com/feed/',
    'https://css-tricks.com/feed/',
    'https://www.smashingmagazine.com/feed/',
    'https://github.blog/feed/',
]

for url in feeds:
    feed = feedparser.parse(url)
    if feed.entries:
        entry = feed.entries[0]
        has_content = 'content' in entry
        has_summary = len(entry.get('summary', ''))
        
        print(f"\n{url}")
        print(f"  - Has 'content' field: {has_content}")
        print(f"  - Summary length: {has_summary}")
        
        if has_content:
            content_value = entry['content'][0].get('value', '')
            print(f"  - Content length: {len(content_value)}")
