'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
}

const PAGE_SIZE = 50

export function ProductGrid({ products, initialFilter = 'all' }: ProductGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subFromUrl = searchParams.get('sub') ?? undefined

  const [activeSub, setActiveSub] = useState<string | undefined>(subFromUrl)
  const [sortBy, setSortBy] = useState('default')
  const [page, setPage] = useState(1)
  const mounted = useRef(false)

  // Sidebar filters
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set())

  const category = initialFilter !== 'all'
    ? BROAD_CATEGORIES.find(c => c.key === initialFilter)
    : null

  const showSidebar = initialFilter !== 'all'

  useEffect(() => {
    setActiveSub(subFromUrl)
  }, [subFromUrl])

  // Reset sidebar filters when subcategory changes
  useEffect(() => {
    setSelectedBrands(new Set())
    setPriceMin('')
    setPriceMax('')
    setSelectedConditions(new Set())
  }, [activeSub])

  const handleSubClick = (sub: string | undefined) => {
    setActiveSub(sub)
    const params = new URLSearchParams()
    if (sub) params.set('sub', sub)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      const next = new Set(prev)
      next.has(brand) ? next.delete(brand) : next.add(brand)
      return next
    })
  }

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => {
      const next = new Set(prev)
      next.has(condition) ? next.delete(condition) : next.add(condition)
      return next
    })
  }

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }, [page])

  useEffect(() => {
    setPage(1)
  }, [initialFilter, activeSub, sortBy, selectedBrands, priceMin, priceMax, selectedConditions])

  // Step 1: category/subcategory filter only (used to derive available sidebar options)
  const categoryFiltered = useMemo(() => {
    let filtered = products
    if (initialFilter !== 'all') {
      const broad = BROAD_CATEGORIES.find(c => c.key === initialFilter)
      if (broad?.conditionFilter) {
        filtered = filtered.filter(p => p.condition === 'used' || p.condition === 'demo')
      } else if (activeSub) {
        filtered = filtered.filter(p => p.category?.slug?.current === activeSub)
      } else if (broad?.subcategories.length) {
        const slugs = broad.subcategories.map(s => s.slug)
        filtered = filtered.filter(p => slugs.includes(p.category?.slug?.current))
      }
    }
    return filtered
  }, [products, initialFilter, activeSub])

  // Available options derived from category scope (not affected by sidebar filters)
  const availableBrands = useMemo(() =>
    [...new Set(categoryFiltered.map(p => p.brand))].sort()
  , [categoryFiltered])

  const availableConditions = useMemo(() =>
    [...new Set(categoryFiltered.map(p => p.condition))].sort()
  , [categoryFiltered])

  const priceRange = useMemo(() => {
    const priced = categoryFiltered.filter(p => p.price != null)
    if (!priced.length) return null
    return {
      min: Math.min(...priced.map(p => p.price!)),
      max: Math.max(...priced.map(p => p.price!)),
    }
  }, [categoryFiltered])

  // Step 2: apply sidebar filters + sort
  const filteredProducts = useMemo(() => {
    let filtered = categoryFiltered

    if (selectedBrands.size > 0) {
      filtered = filtered.filter(p => selectedBrands.has(p.brand))
    }

    const min = parseFloat(priceMin)
    const max = parseFloat(priceMax)
    if (!isNaN(min)) filtered = filtered.filter(p => p.price != null && p.price >= min)
    if (!isNaN(max)) filtered = filtered.filter(p => p.price != null && p.price <= max)

    if (selectedConditions.size > 0) {
      filtered = filtered.filter(p => selectedConditions.has(p.condition))
    }

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => {
        if (a.price == null && b.price == null) return 0
        if (a.price == null) return 1
        if (b.price == null) return -1
        return a.price - b.price
      })
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => {
        if (a.price == null && b.price == null) return 0
        if (a.price == null) return 1
        if (b.price == null) return -1
        return b.price - a.price
      })
    }

    return filtered
  }, [categoryFiltered, selectedBrands, priceMin, priceMax, selectedConditions, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeLabel = activeSub
    ? category?.subcategories.find(s => s.slug === activeSub)?.label
    : category?.label

  const hasActiveFilters = selectedBrands.size > 0 || priceMin || priceMax || selectedConditions.size > 0

  const clearFilters = () => {
    setSelectedBrands(new Set())
    setPriceMin('')
    setPriceMax('')
    setSelectedConditions(new Set())
  }

  const conditionLabel: Record<string, string> = { new: 'New', demo: 'Demo', used: 'Used' }

  return (
    <div id="products" className="bg-white">

      {/* Subcategory tabs */}
      {category && category.subcategories.length > 0 && !category.conditionFilter && (
        <div className="flex items-center border-b border-[var(--border)] px-10 overflow-x-auto">
          <button
            onClick={() => handleSubClick(undefined)}
            className={`font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              !activeSub ? 'border-[var(--red)] text-[var(--red)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            All
          </button>
          {category.subcategories.map(sub => (
            <button
              key={sub.slug}
              onClick={() => handleSubClick(sub.slug)}
              className={`font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
                activeSub === sub.slug ? 'border-[var(--red)] text-[var(--red)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex">

        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-52 shrink-0 border-r border-[var(--border)] sticky top-[60px] self-start max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="p-6 space-y-7">

              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--text)]">Filter</span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] text-[var(--muted)] hover:text-[var(--red)] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Price range */}
              {priceRange && (
                <div>
                  <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-3">
                    Price (CAD)
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={`$${priceRange.min.toLocaleString()}`}
                      value={priceMin}
                      onChange={e => setPriceMin(e.target.value)}
                      className="w-full font-sans text-xs text-[var(--text)] border border-[var(--border)] bg-white px-2 py-1.5 outline-none focus:border-[var(--text)] transition-colors"
                    />
                    <span className="text-[var(--border2)] text-xs shrink-0">–</span>
                    <input
                      type="number"
                      placeholder={`$${priceRange.max.toLocaleString()}`}
                      value={priceMax}
                      onChange={e => setPriceMax(e.target.value)}
                      className="w-full font-sans text-xs text-[var(--text)] border border-[var(--border)] bg-white px-2 py-1.5 outline-none focus:border-[var(--text)] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Condition */}
              {availableConditions.length > 1 && !category?.conditionFilter && (
                <div>
                  <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-3">
                    Condition
                  </div>
                  <div className="space-y-2">
                    {availableConditions.map(c => (
                      <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedConditions.has(c)}
                          onChange={() => toggleCondition(c)}
                          className="w-3.5 h-3.5 accent-[var(--red)]"
                        />
                        <span className="text-xs text-[var(--text)] group-hover:text-[var(--red)] transition-colors">
                          {conditionLabel[c] ?? c}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand */}
              {availableBrands.length > 0 && (
                <div>
                  <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-3">
                    Brand
                  </div>
                  <div className="space-y-2">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.has(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-3.5 h-3.5 accent-[var(--red)]"
                        />
                        <span className="text-xs text-[var(--text)] group-hover:text-[var(--red)] transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Controls */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-[var(--border)]">
            <div className="text-xs text-[var(--muted)]">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              {activeLabel && initialFilter !== 'all' && (
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
          <div className="px-8 py-8">
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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                {paginatedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-2.5 border border-[var(--border)] text-[var(--text)] hover:bg-[var(--burgundy)] hover:text-white hover:border-[var(--burgundy)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--text)] disabled:hover:border-[var(--border)]"
                >
                  ← Prev
                </button>
                <span className="font-sans text-xs text-[var(--muted)] px-4">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  className="font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-2.5 border border-[var(--border)] text-[var(--text)] hover:bg-[var(--burgundy)] hover:text-white hover:border-[var(--burgundy)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--text)] disabled:hover:border-[var(--border)]"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-[var(--burgundy)] text-white flex items-center justify-between px-10 py-7">
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
  )
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter()

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
          ) : product.price != null ? (
            <div className="font-serif text-[22px] font-normal text-[var(--burgundy)]">
              ${product.price.toLocaleString()}
            </div>
          ) : (
            <div className="text-xs text-[var(--muted)] tracking-wider">Contact for pricing</div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(enquireHref) }}
            className="flex-shrink-0 text-[10px] font-medium tracking-wider uppercase text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--burgundy)] hover:text-white hover:border-[var(--burgundy)] transition-all"
          >
            Enquire
          </button>
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
