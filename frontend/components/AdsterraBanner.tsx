'use client'

import Script from 'next/script'

interface AdsterraBannerProps {
  className?: string
}

export default function AdsterraBanner({ className = '' }: AdsterraBannerProps) {
  const adId = `adsterra-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={`w-full flex justify-center items-center my-6 ${className}`}>
      <div className="w-full max-w-[728px] mx-auto" style={{ minHeight: '90px' }}>
        <Script
          id={`${adId}-config`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key': '0e6fddea93ae128a932a17ebaaf6bcb4',
                'format': 'iframe',
                'height': 90,
                'width': 728,
                'params': {}
              };
            `
          }}
        />
        <Script
          id={`${adId}-invoke`}
          strategy="afterInteractive"
          src="//www.highperformanceformat.com/0e6fddea93ae128a932a17ebaaf6bcb4/invoke.js"
        />
      </div>
    </div>
  )
}