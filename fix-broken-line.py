with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 188 (index 187)
if len(lines) > 187 and lines[187].strip() == '}':
    # Replace the broken line with proper code
    lines[187] = '''                (
                  <div className="md:col-span-2 lg:col-span-3 my-8">
                    <AdsterraInline />
                  </div>
                )
              }
'''

with open(r'D:\tech-radar\frontend\app\page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("✓ Fixed broken conditional in homepage")
