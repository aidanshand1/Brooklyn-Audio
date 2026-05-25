'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const isShop = pathname === '/' || pathname.startsWith('/category/')

  return (
    <nav className="bg-white border-b border-[var(--border)] sticky top-0 z-50 flex items-center justify-between px-10 h-[60px]">
      <Link
        href="/"
        className="font-serif text-xl font-semibold text-[var(--text)] tracking-wide"
      >
        Brooklyn <span className="text-[var(--red)]">Audio</span>
      </Link>

      <div className="flex gap-1">
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
        className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
      >
        (902) 463-8773
      </a>
    </nav>
  )
}
