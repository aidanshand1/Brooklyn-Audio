/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Sanity product images use a custom loader (lib/sanityImageLoader.ts) and
    // skip Vercel's optimizer; this only affects local images like the showroom photo.
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

module.exports = nextConfig
