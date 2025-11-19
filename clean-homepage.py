import re

# Read homepage
with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove AdUnit import
content = re.sub(r"import AdUnit from '@/components/AdUnit'\n?", "", content)

# Remove all AdUnit component usages
content = re.sub(r'\s*<AdUnit[^>]*/>[\n\r]*', '\n', content)

# Clean up extra blank lines
content = re.sub(r'\n\n\n+', '\n\n', content)

with open(r'D:\tech-radar\frontend\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Removed all AdUnit references from homepage")
