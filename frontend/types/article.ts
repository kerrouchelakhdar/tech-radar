export interface Article {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: string
  source_name: string
  source_url: string
  image_url: string | null
  seo_keywords: string[]
  published_date: string
  created_at: string
}
