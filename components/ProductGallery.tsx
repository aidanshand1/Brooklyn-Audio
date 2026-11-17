'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { sanityImageLoader } from '@/lib/sanityImageLoader'

export interface GalleryImage {
  key: string
  src: string
  thumb: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  alt: string
  /** Overlay content (e.g. condition badge), positioned by the caller */
  children?: ReactNode
}

export function ProductGallery({ images, alt, children }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const current = images[active]

  return (
    <div
      className="bg-[var(--cream)] relative flex flex-col border-r border-[var(--border)] sticky top-0 self-start"
      style={{ height: 'calc(100vh - 120px)', maxHeight: 600 }}
    >
      <div className="flex-1 min-h-0 flex items-center justify-center">
        {current ? (
          <Image
            key={current.key}
            loader={sanityImageLoader}
            src={current.src}
            alt={images.length > 1 ? `${alt} (image ${active + 1} of ${images.length})` : alt}
            width={800}
            height={800}
            className="w-full h-full object-contain p-10"
            priority={active === 0}
          />
        ) : (
          <span className="font-serif text-[120px] text-[var(--border2)] select-none">◎</span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.key}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`shrink-0 w-14 h-14 bg-white border transition-colors ${
                i === active
                  ? 'border-[var(--text)]'
                  : 'border-[var(--border)] hover:border-[var(--border2)]'
              }`}
            >
              <Image
                loader={sanityImageLoader}
                src={img.thumb}
                alt=""
                width={112}
                height={112}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {children}
    </div>
  )
}
