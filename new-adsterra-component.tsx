'use client'

import { useEffect, useRef } from 'react'

export default function AdsterraInline() {
  const bannerRef = useRef<HTMLDivElement>(null)
  const scriptAddedRef = useRef(false)

  useEffect(() => {
    if (bannerRef.current && !scriptAddedRef.current) {
      const uniqueId = `adsterra-${Math.random().toString(36).substr(2, 9)}`
      const wrapper = document.createElement('div')
      wrapper.id = uniqueId
      
      const configScript = document.createElement('script')
      configScript.type = 'text/javascript'
      configScript.innerHTML = `
        atOptions = {
          'key': '0e6fddea93ae128a932a17ebaaf6bcb4',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
        document.write('<scr' + 'ipt type="text/javascript" src="//www.highperformanceformat.com/0e6fddea93ae128a932a17ebaaf6bcb4/invoke.js"></scr' + 'ipt>');
      `
      
      wrapper.appendChild(configScript)
      bannerRef.current.appendChild(wrapper)
      scriptAddedRef.current = true
    }
  }, [])

  return (
    <div className="w-full flex justify-center items-center my-6">
      <div 
        ref={bannerRef}
        className="w-full max-w-[728px] mx-auto" 
        style={{ minHeight: '90px' }}
      />
    </div>
  )
}
