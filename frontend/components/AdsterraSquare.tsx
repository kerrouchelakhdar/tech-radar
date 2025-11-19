'use client'

import AdsterraAd from './AdsterraAd'

export default function AdsterraSquare() {
  const AD_KEY = "6de5a16b41a886cbaf5ba46d9bb49596" 

  return (
    <div className="w-full flex justify-center md:hidden my-4">
      <AdsterraAd 
        id={AD_KEY}
        width={300} 
        height={250} 
      />
    </div>
  )
}
