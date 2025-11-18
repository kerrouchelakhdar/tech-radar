import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Article = {
  id: number
  title: string
  slug: string
  description: string
  content: string
  category: string
  image_url: string | null
  source_name: string | null
  source_url: string | null
  seo_keywords: string[]
  published_date: string
  created_at: string
}

export async function getArticles(category?: string, limit = 20) {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(limit)
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Article[]
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data as Article
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('articles')
    .select('category')
  
  if (error) throw error
  
  const unique = Array.from(new Set(data.map(a => a.category)))
  return unique.sort()
}
