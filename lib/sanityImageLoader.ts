import type { ImageLoaderProps } from 'next/image'

/**
 * next/image loader for Sanity images.
 *
 * Sanity's image CDN already resizes and converts formats, so we ask it for
 * each size directly instead of routing every image through Vercel's Image
 * Optimization (which is billed per transformation).
 *
 * Expects a URL built with urlFor(...).width(w).height(h); keeps its crop
 * (rect) and aspect ratio, and scales the height to the requested width.
 */
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src)
  const w = Number(url.searchParams.get('w'))
  const h = Number(url.searchParams.get('h'))

  url.searchParams.set('w', String(width))
  if (w && h) url.searchParams.set('h', String(Math.round((h * width) / w)))
  url.searchParams.set('q', String(quality ?? 75))
  url.searchParams.set('auto', 'format')

  return url.toString()
}
