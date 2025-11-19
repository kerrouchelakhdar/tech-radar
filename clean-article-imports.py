with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove any lines with AdsterraBanner
cleaned_lines = [line for line in lines if 'AdsterraBanner' not in line]

with open(r'D:\tech-radar\frontend\app\article\[slug]\page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(cleaned_lines)

print('✓ Removed all AdsterraBanner references')
