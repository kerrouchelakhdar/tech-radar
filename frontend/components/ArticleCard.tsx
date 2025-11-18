import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/types/article'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/article/${article.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={article.image_url || '/placeholder.jpg'}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
            {article.category}
          </span>
          {article.source_name && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {article.source_name}
              </span>
            </>
          )}
        </div>
        
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between">
          <time className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(article.published_date || article.created_at)}
          </time>
          
          <Link
            href={`/article/${article.slug}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  )
}
