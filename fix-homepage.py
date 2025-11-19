import re

# Read the file
with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Script import
content = content.replace("import Script from 'next/script'\n", "")

# Write back
with open(r'D:\tech-radar\frontend\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Homepage updated - removed Script import!")
