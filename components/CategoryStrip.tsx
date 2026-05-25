'use client'

import Link from 'next/link'
import { BROAD_CATEGORIES } from '@/lib/categories'

interface CategoryStripProps {
  activeCategory?: string
}

export function CategoryStrip({ activeCategory = 'all' }: CategoryStripProps) {
  return (
    <div className="bg-white border-b border-[var(--border)] relative z-40">
      <div className="flex divide-x divide-[var(--border)]">
        {BROAD_CATEGORIES.map(({ key, label, subcategories }) => {
          const isActive = activeCategory === key
          const hasChildren = subcategories.length > 0

          return (
            <div
              key={key}
              className={`relative group flex-1 border-b-2 transition-colors ${
                isActive ? 'border-[var(--red)]' : 'border-transparent'
              }`}
            >
              <Link
                href={key === 'all' ? '/' : `/category/${key}`}
                scroll={false}
                className={`flex items-center justify-center gap-1 px-4 py-4 transition-colors ${
                  isActive ? 'bg-white' : 'hover:bg-[var(--cream)]'
                }`}
              >
                <span className={`text-[11px] font-medium tracking-wider uppercase whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[var(--red)]'
                    : 'text-[var(--muted)] group-hover:text-[var(--text)]'
                }`}>
                  {label}
                </span>
                {hasChildren && (
                  <svg
                    className={`w-2.5 h-2.5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[var(--red)]' : 'text-[var(--light)] group-hover:text-[var(--muted)]'
                    }`}
                    viewBox="0 0 10 6"
                    fill="none"
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>

              {hasChildren && (
                <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-[var(--border)] shadow-md min-w-[190px]">
                  {subcategories.map(sub => (
                    <Link
                      key={sub.slug}
                      href={`/category/${key}?sub=${sub.slug}`}
                      scroll={false}
                      className="block px-4 py-2.5 text-[13px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--cream)] transition-colors whitespace-nowrap"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
