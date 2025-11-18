import { getArticles } from '@/lib/supabase'

export const revalidate = 3600

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const articles = await getArticles(undefined, 200)

  const urls = [
    `${baseUrl}/`,
  ]

  const items = [
    ...urls.map((u) => `\n  <url>\n    <loc>${u}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>`),
    ...articles.map((a) => `\n  <url>\n    <loc>${baseUrl}/article/${a.slug}</loc>\n    <lastmod>${new Date(a.published_date).toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`)
  ].join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}\n</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300'
    }
  })
}
