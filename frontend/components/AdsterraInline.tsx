'use client'

import { useEffect, useRef } from 'react'

export default function AdsterraInline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (containerRef.current && !loadedRef.current) {
      loadedRef.current = true
      
      // Create config script
      const configScript = document.createElement('script')
      configScript.type = 'text/javascript'
      configScript.text = `
        atOptions = {
          'key': '0e6fddea93ae128a932a17ebaaf6bcb4',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `
      containerRef.current.appendChild(configScript)

      // Create invoke script
      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = '//www.highperformanceformat.com/0e6fddea93ae128a932a17ebaaf6bcb4/invoke.js'
      containerRef.current.appendChild(invokeScript)
    }
  }, [])

  return (
    <div className="w-full flex justify-center items-center my-6">
      <div 
        ref={containerRef}
        className="w-full max-w-[728px] mx-auto" 
        style={{ minHeight: '90px' }}
      />
    </div>
  )
}
