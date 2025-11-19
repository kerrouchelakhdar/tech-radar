import re

# Read article page
with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add more ads in article content
# 1. Add banner after content section (before Footer)
# 2. Add another banner in the middle

# Add banner before footer
content = content.replace(
    '          {/* Footer */}',
    '''          {/* Bottom Adsterra Banner */}
          <div className="mt-16">
            <AdsterraInline />
          </div>

          {/* Footer */}'''
)

# Add banner after source link (middle of article)
content = content.replace(
    '            {/* In-Article Ad */}\n            <InArticleAd />',
    '''            {/* In-Article Ad */}
            <InArticleAd />
            
            {/* Mid-Article Adsterra Banner */}
            <div className="my-12">
              <AdsterraInline />
            </div>'''
)

with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Added more banners in article page")
