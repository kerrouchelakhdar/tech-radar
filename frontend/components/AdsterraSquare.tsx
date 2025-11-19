'use client'

import AdsterraAd from './AdsterraAd'

export default function AdsterraSquare() {
  // Placeholder key - User needs to replace this with a real 300x250 key from Adsterra
  // For now, we use the same key but it might not render correctly if the format doesn't match.
  // Ideally, the user should provide a new key.
  // I will use a placeholder and instruct the user.
  const AD_KEY = "PUT_YOUR_300x250_KEY_HERE" 
  
  // Since I don't have a real key, I'll comment this out and show a placeholder box
  // or use the existing key just to show *something* (though it might be cut off).
  // Better to use a placeholder box until they add the key.
  
  if (AD_KEY === "PUT_YOUR_300x250_KEY_HERE") {
     return (
        <div className="flex justify-center my-6">
            <div className="w-[300px] h-[250px] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm text-center p-4">
                Adsterra 300x250<br/>(Add Key in components/AdsterraSquare.tsx)
            </div>
        </div>
     )
  }

  return (
    <div className="block md:hidden">
      <AdsterraAd 
        id={AD_KEY}
        width={300} 
        height={250} 
      />
    </div>
  )
}
