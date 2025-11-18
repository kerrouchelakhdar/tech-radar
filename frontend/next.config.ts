import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'techcrunch.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'i1.wp.com' },
      { protocol: 'https', hostname: 'i2.wp.com' },
      { protocol: 'https', hostname: 'cdn.vox-cdn.com' },
      { protocol: 'https', hostname: 'github.blog' },
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'css-tricks.com' },
      { protocol: 'https', hostname: 'files.smashing.media' },
      { protocol: 'https', hostname: 'cdn.freecodecamp.org' },
      { protocol: 'https', hostname: 'thenewstack.io' },
      { protocol: 'https', hostname: 'images.thenewstack.io' },
      { protocol: 'https', hostname: 'www.bleepstatic.com' },
      { protocol: 'https', hostname: 'krebsonsecurity.com' },
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'www.kdnuggets.com' },
      { protocol: 'https', hostname: 'ai.googleblog.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'dev.to' },
    ],
  },
}

export default nextConfig
