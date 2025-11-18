import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

// Public config
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Tech Radar'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-radar.vercel.app'
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const adsterraSrc = process.env.NEXT_PUBLIC_ADSTERRA_SRC
const adsterraInline = process.env.NEXT_PUBLIC_ADSTERRA_SNIPPET
const adsterraLocal = process.env.NEXT_PUBLIC_ADSTERRA_LOCAL // e.g. "/adsterra.js"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Latest Tech News & Developer Insights`,
    template: `%s | ${siteName}`,
  },
  description:
    'Curated tech news from top sources. AI, Web Dev, Cloud, Cybersecurity, Data Science, and more. Updated every 30 minutes.',
  keywords: [
    'tech news',
    'developer news',
    'AI news',
    'web development',
    'cloud computing',
    'cybersecurity',
    'data science',
  ],
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
        {/* Monetag site verification (hardcoded as requested) */}
        <meta name="monetag" content="64740fd2e7a205a2692db03557ba2c22" />

        {/* Google AdSense (optional) */}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Adsterra via external script URL */}
        {adsterraSrc && (
          <Script id="adsterra-src" async src={adsterraSrc} strategy="afterInteractive" />
        )}

        {/* Adsterra via local public file (e.g. /adsterra.js) */}
        {adsterraLocal && (
          <Script id="adsterra-local" async src={adsterraLocal} strategy="afterInteractive" />
        )}

        {/* Adsterra inline snippet (paste only JS content, no <script> tag) */}
        {adsterraInline && (
          <Script
            id="adsterra-inline"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: adsterraInline }}
          />
        )}

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-gray-50">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
const monetagMeta = process.env.NEXT_PUBLIC_MONETAG_META
const adsterraSrc = process.env.NEXT_PUBLIC_ADSTERRA_SRC
const adsterraInline = process.env.NEXT_PUBLIC_ADSTERRA_SNIPPET

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Tech Radar'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-radar.vercel.app'
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
  },
  description: 'Curated tech news from top sources. AI, Web Dev, Cloud, Cybersecurity, Data Science, and more. Updated every 30 minutes.',
  keywords: ['tech news', 'developer news', 'AI news', 'web development', 'cloud computing', 'cybersecurity', 'data science'],
        )}
        {monetagMeta && (
          <meta name="monetag" content={monetagMeta} />
        )}
        {adsterraSrc && (
          <Script
            id="adsterra-src"
            async
            src={adsterraSrc}
            strategy="afterInteractive"
          />
        )}
        {adsterraInline && (
          <Script
            id="adsterra-inline"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: adsterraInline }}
          />
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
