import re

# Read homepage
with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken conditional - it should show Adsterra banner every 6 articles
pattern = r'{{\(idx \+ 1\) % 6 === 0 &&[\s\n]*}'
replacement = '''(idx + 1) % 6 === 0 && (
                <div className="md:col-span-2 lg:col-span-3 my-8">
                  <AdsterraInline />
                </div>
              )}'''

content = re.sub(pattern, replacement, content)

with open(r'D:\tech-radar\frontend\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed syntax error in homepage")
