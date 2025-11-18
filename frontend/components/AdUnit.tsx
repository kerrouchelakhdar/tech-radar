"use client"

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  slot: string
  className?: string
}

export default function AdUnit({ slot, className = '' }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    let tries = 0
    const pushAd = () => {
      const container = containerRef.current
      // @ts-ignore
      const status = insRef.current?.getAttribute?.('data-adsbygoogle-status')
      const width = container?.offsetWidth ?? 0
      if (status === 'done') return
      if (width > 0) {
        try {
          // @ts-ignore
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {
          // ignore
        }
      } else if (tries < 24) {
        tries += 1
        setTimeout(pushAd, 250)
      }
    }

    const onResize = () => pushAd()
    window.addEventListener('resize', onResize)
    const raf = requestAnimationFrame(pushAd)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={containerRef} className={`ad-container w-full min-h-[120px] ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-1">Advertisement</div>
      <ins
        ref={insRef as any}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
