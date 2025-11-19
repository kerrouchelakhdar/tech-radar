"use client"

import { getArticles, type Article } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import AdsterraInline from '@/components/AdsterraInline'
import AdsterraSquare from '@/components/AdsterraSquare'
import { useState, useEffect } from 'react'

const categories = [
  "AI & Machine Learning",
  "Web Development",
  "Cloud & DevOps",
  "Mobile Development",
  "Cybersecurity",
  "Data Science"
]

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await getArticles(undefined, 30)
      setArticles(data)
    }
    fetchArticles()
  }, [])

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Animated Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce-slow shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Tech Radar
                </h1>
              </div>
              <p className="text-white/90 text-lg font-medium flex items-center gap-2 animate-fade-in animation-delay-500">
                <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                Stay ahead with real-time tech insights  Refreshed every 30 min
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end animate-fade-in-left animation-delay-700">
              <div className="text-sm text-white/80 mb-1">Powered by</div>
              <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                15+ Sources
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-scale-in animation-delay-1000">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative flex items-center">
                <svg className="absolute left-5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles, topics, technologies..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearching(true)
                    setTimeout(() => setIsSearching(false), 300)
                  }}
                  className="w-full pl-14 pr-6 py-4 bg-white/95 backdrop-blur-sm text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 placeholder-gray-500 font-medium shadow-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/"
              className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white whitespace-nowrap text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              All
            </Link>
            {categories.map((cat, i) => (
              <Link
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className="px-6 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 border-2 border-gray-200 hover:border-indigo-300 whitespace-nowrap text-sm font-bold text-gray-700 hover:text-indigo-700 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Adsterra Banner - Top */}
        <AdsterraInline />
        <AdsterraSquare />
        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 animate-fade-in">
            <p className="text-gray-600 font-medium">
              Found <span className="text-indigo-600 font-bold">{filteredArticles.length}</span> articles
              {isSearching && <span className="ml-2 inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>}
            </p>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredArticles.map((article: Article, idx: number) => (
            <div 
              key={article.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Link href={`/article/${article.slug}`} className="group block">
                <div className="article-card transform hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                  {article.image_url && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        width={400}
                        height={200}
                        className="article-card-image group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="article-card-content">
                    <span className="category-badge animate-pulse-slow">{article.category}</span>
                    <h2 className="article-title group-hover:text-indigo-600">{article.title}</h2>
                    <p className="article-description">{article.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        {article.source_name}  {new Date(article.published_date).toLocaleDateString()}
                      </div>
                      <svg className="w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {(idx + 1) % 3 === 0 &&
                (
                  <div className="md:col-span-2 lg:col-span-3 my-8 flex flex-col items-center gap-4">
                    <AdsterraInline />
                    <AdsterraSquare />
                  </div>
                )
              }
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && searchQuery && (
          <div className="text-center py-20 animate-fade-in">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-500 font-medium">No articles found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white mt-16">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center animate-bounce-slow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-black">Tech Radar</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
               {new Date().getFullYear()} Tech Radar. Curated from top tech sources worldwide.
            </p>
            <div className="flex justify-center gap-8 text-sm mb-6">
              <Link href="/about" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">About</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">Privacy</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform">Contact</Link>
            </div>
            <div className="flex justify-center gap-4">
              {['twitter', 'github', 'linkedin'].map((social, i) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 transform animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

