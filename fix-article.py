import re

# Read the file
with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import
content = content.replace(
    "import Script from 'next/script'",
    "import AdsterraInline from '@/components/AdsterraInline'"
)

# Replace Adsterra banner section
pattern = r'            \{/\* Adsterra Banner \*/\}.*?            \{/\* Description \*/\}'
replacement = '''            {/* Adsterra Banner */}
            <AdsterraInline />

            {/* Description */}'''
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Article page updated successfully!")
