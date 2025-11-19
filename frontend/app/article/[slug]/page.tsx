import { getArticleBySlug, type Article } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import InArticleAd from '@/components/InArticleAd'
import AdsterraInline from '@/components/AdsterraInline'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image_url,
    datePublished: article.published_date,
    dateModified: article.published_date,
    author: {
      "@type": "Organization",
      name: article.source_name
    },
    publisher: {
      "@type": "Organization",
      name: "Tech Radar",
      logo: {
        "@type": "ImageObject",
        url: "https://techradar.com/logo.png"
      }
    },
    articleSection: article.category,
    keywords: (article as Article).seo_keywords?.join(", ")
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Tech Radar
              </span>
            </Link>
          </div>
        </header>

        {/* Article Content */}
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Category Badge */}
          <div className="animate-fade-in">
            <Link 
              href={`/category/${encodeURIComponent(article.category)}`}
              className="inline-block category-badge mb-6 transform hover:scale-105 transition-all"
            >
              {article.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent animate-fade-in-up animation-delay-500">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-gray-600 mb-8 animate-fade-in animation-delay-700">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="font-semibold">{article.source_name}</span>
            </div>
            <span></span>
            <time dateTime={article.published_date} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.published_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </time>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative overflow-hidden rounded-2xl mb-10 shadow-2xl animate-scale-in animation-delay-1000 group">
              <Image
                src={article.image_url}
                alt={article.title}
                width={1200}
                height={600}
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          )}

          {/* Top Ad - Adsterra */}
          <AdsterraInline />

          {/* Adsterra Banner */}
          <AdsterraInline />

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-10 animate-fade-in-up animation-delay-500">
            <p className="text-2xl text-gray-700 leading-relaxed font-medium border-l-4 border-indigo-600 pl-6 py-2 bg-gradient-to-r from-indigo-50 to-transparent rounded-r-lg">
              {article.description}
            </p>
          </div>

          {/* In-Article Ad */}
          <InArticleAd />

          {/* Content */}
          {article.content && (
            <div 
              className="prose prose-lg max-w-none prose-headings:font-black prose-headings:bg-gradient-to-r prose-headings:from-gray-900 prose-headings:to-gray-700 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg animate-fade-in-up"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}

          {/* Read Original Link */}
          <div className="mt-12 relative group animate-scale-in">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Read the Full Story
              </h3>
              <a
                href={article.source_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-bold hover:text-indigo-700 text-lg flex items-center gap-2 group/link"
              >
                Continue reading on {article.source_name}
                <svg className="w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Keywords */}
          {article.seo_keywords && article.seo_keywords.length > 0 && (
            <div className="mt-10 animate-fade-in">
              <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.seo_keywords.map((keyword: string, i: number) => (
                  <span 
                    key={keyword}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-indigo-50 hover:to-purple-50 text-gray-700 hover:text-indigo-700 rounded-full text-sm font-semibold border-2 border-gray-200 hover:border-indigo-300 transform hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Ad - Adsterra */}
          <div className="mt-16">
            <AdsterraInline />
          </div>
        </article>

        {/* Footer */}
        <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white mt-16">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-black">Tech Radar</span>
              </div>
              <p className="text-gray-400 text-sm">
                 {new Date().getFullYear()} Tech Radar. Curated from top tech sources worldwide.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
