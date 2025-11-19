import re

# Read homepage
with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace top-banner AdUnit with Adsterra (it's already there, just remove the AdUnit one)
content = re.sub(
    r'          <AdsterraInline />\n\n          <AdUnit slot="top-banner" />',
    '          <AdsterraInline />',
    content
)

# Remove AdUnit import if exists
content = content.replace("import AdUnit from '@/components/AdUnit'\n", "")

with open(r'D:\tech-radar\frontend\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Removed AdSense from homepage, keeping only Adsterra")
