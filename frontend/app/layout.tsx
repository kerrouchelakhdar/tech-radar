import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

// Public config
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Tech Radar'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tech-radar.vercel.app'
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const adsterraSrc = process.env.NEXT_PUBLIC_ADSTERRA_SRC
const adsterraInline = process.env.NEXT_PUBLIC_ADSTERRA_SNIPPET
const adsterraLocal = process.env.NEXT_PUBLIC_ADSTERRA_LOCAL

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
  other: {
    // Monetag verification
    monetag: '64740fd2e7a205a2692db03557ba2c22',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
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

        {/* Adsterra inline snippet */}
        {adsterraInline && (
          <Script
            id="adsterra-inline"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: adsterraInline }}
          />
        )}

        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
