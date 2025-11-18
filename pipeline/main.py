#!/usr/bin/env python3
"""
Tech Radar - RSS News Aggregator Pipeline
Fetches, filters, transforms, and publishes tech news from RSS feeds.
"""

from stages import stage1_fetch, stage2_filter, stage3_transform, stage4_enrich, stage5_publish

def pipeline():
    """Run complete RSS aggregation pipeline"""
    print('[pipeline] Starting Tech Radar RSS aggregation...')
    
    # Stage 1: Fetch RSS feeds
    entries = stage1_fetch.run_stage()
    if not entries:
        print('[pipeline] No entries fetched. Exiting.')
        return
    
    # Stage 2: Filter by quality and freshness
    filtered = stage2_filter.run_stage(entries)
    if not filtered:
        print('[pipeline] No entries passed filters. Exiting.')
        return
    
    # Stage 3: Transform to article format
    articles = stage3_transform.run_stage(filtered)
    if not articles:
        print('[pipeline] No articles transformed. Exiting.')
        return
    
    # Stage 4: Deduplicate and enrich
    enriched = stage4_enrich.run_stage(articles)
    if not enriched:
        print('[pipeline] No unique articles. Exiting.')
        return
    
    # Stage 5: Publish to database
    inserted = stage5_publish.run_stage(enriched)
    
    if inserted > 0:
        print(f'[pipeline] ✅ Successfully published {inserted} articles!')
    else:
        print('[pipeline] No new articles published.')
    
    print('[pipeline] Done.')

if __name__ == '__main__':
    pipeline()
