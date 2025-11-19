import re

# Read article page
with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all AdUnit components with AdsterraInline
# Pattern 1: Replace article-top AdUnit
content = re.sub(
    r'          {/\* Top Ad \*/}\n          <AdUnit slot="article-top" />',
    '          {/* Top Ad - Adsterra */}\n          <AdsterraInline />',
    content
)

# Pattern 2: Replace article-bottom AdUnit
content = re.sub(
    r'          {/\* Bottom Ad \*/}\n          <AdUnit slot="article-bottom" className="mt-16" />',
    '          {/* Bottom Ad - Adsterra */}\n          <div className="mt-16">\n            <AdsterraInline />\n          </div>',
    content
)

# Remove AdUnit import if exists
content = content.replace("import AdUnit from '@/components/AdUnit'\n", "")

with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Replaced AdSense with Adsterra in article page")
