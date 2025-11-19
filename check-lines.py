with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and fix the broken line
for i, line in enumerate(lines):
    if i >= 185 and i <= 192:
        print(f"{i+1}: {line}", end='')
