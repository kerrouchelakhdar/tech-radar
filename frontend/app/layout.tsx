import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Tech Radar'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-radar.vercel.app'
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Latest Tech News & Developer Insights`,
    template: `%s | ${siteName}`
  },
  description: 'Curated tech news from top sources. AI, Web Dev, Cloud, Cybersecurity, Data Science, and more. Updated every 30 minutes.',
  keywords: ['tech news', 'developer news', 'AI news', 'web development', 'cloud computing', 'cybersecurity', 'data science'],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: siteName,
    description: 'Latest tech news and developer insights',
    siteName: siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Latest tech news and developer insights',
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
