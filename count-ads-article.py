import re

with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'AdsterraInline', content)
print(f'✓ عدد إعلانات Adsterra في صفحة المقال: {len(matches)}')

# Find contexts
positions = [m.start() for m in re.finditer(r'AdsterraInline', content)]
for i, pos in enumerate(positions, 1):
    # Get some context before the ad
    context_start = max(0, pos - 150)
    context = content[context_start:pos]
    lines = context.split('\n')
    if lines:
        # Get the comment before the ad
        for line in reversed(lines):
            if '{/*' in line:
                print(f'  {i}. {line.strip()}')
                break
