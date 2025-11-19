import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/types/article'

interface CategoryPageProps {
  params: Promise<{
    name: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  const supabase = supabaseServer()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', decodedName)
    .order('published_date', { ascending: false })
    .limit(20)
    .returns<Article[]>()

  if (error) {
    console.error('Error fetching articles:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{decodedName}</h1>
        <p className="text-gray-600">Error loading articles</p>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{decodedName}</h1>
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-xl text-gray-500 font-medium">No articles found in this category yet.</p>
          <p className="text-gray-400 mt-2">Check back later for updates.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{decodedName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  return {
    title: `${decodedName} - Tech Radar`,
    description: `Latest ${decodedName} articles and news`,
  }
}
