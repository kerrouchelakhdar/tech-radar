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
    notFound()
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
