'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const isShop = pathname === '/' || pathname.startsWith('/category/') || pathname.startsWith('/product/')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/?q=${encodeURIComponent(q)}`)
    else router.push('/')
  }

  return (
    <nav className="bg-white border-b border-[var(--border)] sticky top-0 z-50 flex items-center gap-6 px-10 h-[60px]">
      <Link
        href="/"
        className="font-serif text-xl font-semibold text-[var(--text)] tracking-wide shrink-0"
      >
        Brooklyn <span className="text-[var(--red)]">Audio</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-xs border border-[var(--border)] px-3 py-1.5 bg-white hover:border-[var(--border2)] focus-within:border-[var(--text)] transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 font-sans text-xs text-[var(--text)] bg-transparent outline-none placeholder:text-[var(--muted)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); router.push('/') }}
            className="text-[var(--muted)] hover:text-[var(--text)] transition-colors text-xs leading-none"
          >
            ✕
          </button>
        )}
      </form>

      <div className="flex gap-1 shrink-0 ml-auto">
        <Link
          href="/"
          className={`text-xs px-4 py-2 rounded transition-all ${
            isShop
              ? 'text-[var(--red)] font-medium'
              : 'font-normal text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--cream)]'
          }`}
        >
          Shop
        </Link>
        <Link
          href="/about"
          className={`text-xs px-4 py-2 rounded transition-all ${
            pathname === '/about'
              ? 'text-[var(--red)] font-medium'
              : 'font-normal text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--cream)]'
          }`}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={`text-xs px-4 py-2 rounded transition-all ${
            pathname === '/contact'
              ? 'text-[var(--red)] font-medium'
              : 'font-normal text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--cream)]'
          }`}
        >
          Contact
        </Link>
      </div>

      <a
        href="tel:9024638773"
        className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors shrink-0"
      >
        (902) 463-8773
      </a>
    </nav>
  )
}
