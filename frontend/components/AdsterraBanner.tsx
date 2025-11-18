'use client'

import { useEffect, useRef } from 'react'

interface AdsterraBannerProps {
  className?: string
}

export default function AdsterraBanner({ className = '' }: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (scriptLoadedRef.current || !bannerRef.current) return

    try {
      // Adsterra configuration
      const atOptions = {
        key: '0e6fddea93ae128a932a17ebaaf6bcb4',
        format: 'iframe',
        height: 90,
        width: 728,
        params: {},
      }

      // Inject config into window
      ;(window as any).atOptions = atOptions

      // Load Adsterra script
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.highperformanceformat.com/${atOptions.key}/invoke.js`
      script.async = true

      bannerRef.current.appendChild(script)
      scriptLoadedRef.current = true
    } catch (error) {
      console.error('Adsterra banner load error:', error)
    }

    // Cleanup
    return () => {
      if (bannerRef.current) {
        bannerRef.current.innerHTML = ''
      }
      scriptLoadedRef.current = false
    }
  }, [])

  return (
    <div className={`w-full flex justify-center items-center my-6 ${className}`}>
      <div
        ref={bannerRef}
        className="w-full max-w-[728px] mx-auto"
        style={{
          minHeight: '90px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </div>
  )
}