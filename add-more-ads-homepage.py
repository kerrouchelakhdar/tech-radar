import re

# Read homepage
with open(r'D:\tech-radar\frontend\app\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the articles grid mapping section and add banner after every 3 articles
# Look for the pattern where articles are mapped
pattern = r'(\{filteredArticles\.map\(\(article: Article, idx: number\) => \([\s\S]*?<\/Link>[\s\S]*?<\/div>[\s\S]*?\)\)\})'

def add_ads_in_grid(match):
    original = match.group(1)
    # Add logic to insert ad after every 3rd article
    replacement = original.replace(
        '</Link>\n                </div>\n              )\n            ))}\n          </div>',
        '''</Link>
                </div>
              )
            ))}
            
            {/* Adsterra Banner between articles */}
            {filteredArticles.length > 3 && (
              <div className="md:col-span-2 lg:col-span-3">
                <AdsterraInline />
              </div>
            )}
          </div>'''
    )
    return replacement

content = re.sub(pattern, add_ads_in_grid, content)

with open(r'D:\tech-radar\frontend\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Added banner between articles in homepage")
