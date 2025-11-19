'use client'

import { useEffect, useRef } from 'react'

interface AdsterraAdProps {
  id: string
  width: number
  height: number
  className?: string
}

export default function AdsterraAd({ id, width, height, className = "" }: AdsterraAdProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return

    // Clear content to ensure clean state
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key': '${id}',
              'format': 'iframe',
              'height': ${height},
              'width': ${width},
              'params': {}
            };
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/${id}/invoke.js"></script>
        </body>
      </html>
    `)
    doc.close()
  }, [id, width, height])

  return (
    <div className={`flex justify-center items-center my-6 ${className}`}>
      <iframe
        ref={iframeRef}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        title={`ad-${id}`}
        scrolling="no"
      />
    </div>
  )
}
