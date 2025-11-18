'use client'

import { useEffect, useRef } from 'react'

interface AdsterraBannerProps {
  className?: string
}

export default function AdsterraBanner({ className = '' }: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null)
  const scriptAddedRef = useRef(false)

  useEffect(() => {
    if (scriptAddedRef.current || !bannerRef.current) return

    try {
      // Create config script first
      const configScript = document.createElement('script')
      configScript.type = 'text/javascript'
      configScript.innerHTML = `
        atOptions = {
          'key' : '0e6fddea93ae128a932a17ebaaf6bcb4',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `
      
      // Create invoke script
      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = '//www.highperformanceformat.com/0e6fddea93ae128a932a17ebaaf6bcb4/invoke.js'
      invokeScript.async = true

      // Append both scripts
      bannerRef.current.appendChild(configScript)
      bannerRef.current.appendChild(invokeScript)
      
      scriptAddedRef.current = true
    } catch (error) {
      console.error('Adsterra banner error:', error)
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