import re

# Read the file
with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Script import if exists
content = content.replace("import Script from 'next/script'\n", "")

# Add AdsterraInline import if not exists
if "import AdsterraInline from '@/components/AdsterraInline'" not in content:
    content = content.replace(
        "import InArticleAd from '@/components/InArticleAd'",
        "import InArticleAd from '@/components/InArticleAd'\nimport AdsterraInline from '@/components/AdsterraInline'"
    )

# Replace the entire Adsterra Banner section with the new component
# This pattern matches the div and all Script tags inside
pattern = r'          {/\* Adsterra Banner \*/}[\s\S]*?          {/\* Description \*/}'
replacement = '''          {/* Adsterra Banner */}
          <AdsterraInline />

          {/* Description */}'''

content = re.sub(pattern, replacement, content)

# Write back
with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Article page completely fixed!")
