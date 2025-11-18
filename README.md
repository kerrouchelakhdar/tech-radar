# Tech Radar - RSS News Aggregator

Automated tech news aggregator powered by RSS feeds. Publishes curated articles from top tech sources with zero LLM costs.

## Features
- 🔄 Auto-fetch from 15+ RSS sources
- 📰 Smart deduplication & quality filtering
- 🎨 Modern Next.js 15 frontend
- 💰 AdSense integration
- 🚀 SEO optimized (metadata, JSON-LD, sitemap)
- ☁️ Vercel deployment ready
- 🗄️ Supabase backend

## Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Python 3.11, feedparser, BeautifulSoup
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (free tier)

## Categories
- AI & Machine Learning
- Web Development
- Cloud & DevOps
- Mobile Development
- Cybersecurity
- Data Science

## Quick Start

### 1. Setup Supabase
Create a new Supabase project and run:
```sql
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  source_name TEXT,
  source_url TEXT UNIQUE,
  seo_keywords TEXT[],
  published_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(published_date DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
```

### 2. Configure Environment
```bash
# pipeline/.env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
REVALIDATE_SECRET=your_random_secret

# frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
REVALIDATE_SECRET=your_random_secret
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-YOUR_ID
```

### 3. Install Dependencies
```bash
# Pipeline
cd pipeline
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 4. Run Pipeline
```bash
cd pipeline
python main.py              # Single run
python run_forever.py       # Continuous (every 30 min)
```

### 5. Deploy Frontend
```bash
cd frontend
vercel --prod
```

## RSS Sources
- TechCrunch, The Verge, Hacker News
- Dev.to, GitHub Blog, CSS-Tricks
- Smashing Magazine, freeCodeCamp
- And more (see `pipeline/config/feeds.json`)

## Revenue
- Google AdSense (auto ads + manual placements)
- Affiliate links (optional)
- Sponsored posts (future)

## License
MIT
