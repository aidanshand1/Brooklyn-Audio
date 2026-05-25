'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { BROAD_CATEGORIES } from '@/lib/categories'

interface Product {
  _id: string
  name: string
  brand: string
  model?: string
  condition: 'new' | 'used' | 'demo'
  price?: number
  priceOnRequest: boolean
  description?: string
  image?: any
  slug?: { current: string }
  category: {
    name: string
    slug: { current: string }
  }
}

interface ProductGridProps {
  products: Product[]
  initialFilter?: string
  initialSubFilter?: string
}

const PAGE_SIZE = 50

export function ProductGrid({ products, initialFilter = 'all', initialSubFilter }: ProductGridProps) {
  const [activeFilter] = useState(initialFilter)
  const [activeSubFilter] = useState(initialSubFilter)
  const [sortBy, setSortBy] = useState('default')
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (activeFilter !== 'all') {
      const broad = BROAD_CATEGORIES.find(c => c.key === activeFilter)
      if (broad?.conditionFilter) {
        filtered = filtered.filter(p => p.condition === 'used' || p.condition === 'demo')
      } else if (activeSubFilter) {
        filtered = filtered.filter(p => p.category?.slug?.current === activeSubFilter)
      } else if (broad?.subcategories.length) {
        const slugs = broad.subcategories.map(s => s.slug)
        filtered = filtered.filter(p => slugs.includes(p.category?.slug?.current))
      }
    }

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.price || 999999) - (a.price || 999999))
    }

    setPage(1)
    return filtered
  }, [products, activeFilter, activeSubFilter, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeLabel = activeSubFilter
    ? BROAD_CATEGORIES.find(c => c.key === activeFilter)?.subcategories.find(s => s.slug === activeSubFilter)?.label
    : BROAD_CATEGORIES.find(c => c.key === activeFilter)?.label

  return (
    <div id="products" className="bg-white">
      {/* Controls */}
      <div className="flex items-center justify-between px-10 py-4 border-b border-[var(--border)]">
        <div className="text-xs text-[var(--muted)]">
          {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
          {activeFilter !== 'all' && activeLabel && (
            <span className="text-[var(--light)]"> — {activeLabel}</span>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="font-sans text-xs text-[var(--text)] bg-white border border-[var(--border)] py-1.5 px-3 cursor-pointer outline-none"
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Products */}
      <div className="px-10 py-8">
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-[var(--border)]">
            <div className="font-serif text-3xl font-light text-[var(--muted)] mb-3">Nothing here yet</div>
            <p className="text-[13px] text-[var(--muted)] mb-6">
              We may have unlisted stock — get in touch and we'll check for you.
            </p>
            <Link
              href="/contact"
              className="inline-block font-sans text-[11px] font-medium tracking-wider uppercase px-7 py-3 bg-[var(--burgundy)] text-white hover:bg-[var(--burgundy2)] transition-colors"
            >
              Contact us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
            {paginatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={page === 1}
              className="font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-2.5 border border-[var(--border)] text-[var(--text)] hover:bg-[var(--burgundy)] hover:text-white hover:border-[var(--burgundy)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--text)] disabled:hover:border-[var(--border)]"
            >
              ← Prev
            </button>
            <span className="font-sans text-xs text-[var(--muted)] px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={page === totalPages}
              className="font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-2.5 border border-[var(--border)] text-[var(--text)] hover:bg-[var(--burgundy)] hover:text-white hover:border-[var(--burgundy)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--text)] disabled:hover:border-[var(--border)]"
            >
              Next →
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-[var(--burgundy)] text-white flex items-center justify-between px-8 py-7">
          <div>
            <div className="font-serif text-2xl font-light text-white mb-1">
              Don't see what you're after?
            </div>
            <div className="text-[13px] text-[#d4b8b8]">
              Call or email — we may have unlisted stock or can special order.
            </div>
          </div>
          <Link
            href="/contact"
            className="font-sans text-[11px] font-medium tracking-wider uppercase px-7 py-3 bg-white text-[var(--burgundy)] transition-colors hover:bg-[var(--cream)] whitespace-nowrap"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const conditionStyle = {
    new: 'bg-[var(--red)] text-white',
    demo: 'bg-[#5a5a5a] text-white',
    used: 'bg-[var(--text)] text-white',
  }
  const conditionLabel = { new: 'New', demo: 'Demo', used: 'Used' }

  const productHref = product.slug?.current ? `/product/${product.slug.current}` : null
  const enquireHref = `/contact?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`

  const cardContent = (
    <>
      {/* Image */}
      <div className="bg-[var(--cream)] aspect-square flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <Image
            src={urlFor(product.image).width(400).height(400).url()}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="font-serif text-7xl text-[var(--border2)] select-none">◎</span>
        )}
        <span className={`absolute top-3 left-3 text-[10px] font-medium px-2 py-0.5 tracking-wider ${conditionStyle[product.condition]}`}>
          {conditionLabel[product.condition]}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-medium text-[var(--muted)] tracking-widest uppercase mb-1.5">
          {product.brand}
        </div>
        <div className="font-serif text-[18px] font-normal text-[var(--text)] leading-snug flex-1">
          {product.name}
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
          {product.priceOnRequest ? (
            <div className="text-xs text-[var(--muted)] tracking-wider">Price on request</div>
          ) : (
            <div className="font-serif text-[22px] font-normal text-[var(--burgundy)]">
              ${product.price?.toLocaleString()}
            </div>
          )}
          <Link
            href={enquireHref}
            className="flex-shrink-0 text-[10px] font-medium tracking-wider uppercase text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--burgundy)] hover:text-white hover:border-[var(--burgundy)] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Enquire
          </Link>
        </div>
      </div>
    </>
  )

  if (productHref) {
    return (
      <Link
        href={productHref}
        className="bg-white border border-[var(--border)] flex flex-col group hover:border-[var(--border2)] hover:shadow-lg transition-all duration-200 relative overflow-hidden"
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="bg-white border border-[var(--border)] flex flex-col group hover:border-[var(--border2)] hover:shadow-lg transition-all duration-200 relative overflow-hidden">
      {cardContent}
    </div>
  )
}
