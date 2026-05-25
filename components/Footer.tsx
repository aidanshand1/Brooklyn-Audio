import Link from 'next/link'
import { BROAD_CATEGORIES } from '@/lib/categories'

export function Footer() {
  const shopCategories = BROAD_CATEGORIES.filter(c => c.key !== 'all')

  return (
    <footer className="bg-[var(--text)] text-white px-10 pt-11 pb-5">
      <div className="grid grid-cols-4 gap-10 mb-8">
        <div>
          <div className="font-serif text-[22px] font-light mb-2 text-white">
            Brooklyn Audio
          </div>
          <div className="text-xs text-[#a09890] leading-relaxed">
            Getting you in the groove since 1994.<br />
            Dartmouth, Nova Scotia.
          </div>
        </div>

        <div>
          <div className="text-[10px] font-medium tracking-wide uppercase text-[#a09890] mb-3">
            Shop
          </div>
          <ul className="space-y-1.5">
            <li>
              <Link href="/" className="text-[#c8c0b8] text-xs hover:text-white transition-colors">All products</Link>
            </li>
            {shopCategories.map(c => (
              <li key={c.key}>
                <Link href={`/category/${c.key}`} className="text-[#c8c0b8] text-xs hover:text-white transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-medium tracking-wide uppercase text-[#a09890] mb-3">
            Hours
          </div>
          <div className="text-xs text-[#a09890] leading-loose">
            Tue–Thu: 11am–8pm<br />
            Fri–Sat: 10am–5pm<br />
            Sun–Mon: Closed
          </div>
        </div>

        <div>
          <div className="text-[10px] font-medium tracking-wide uppercase text-[#a09890] mb-3">
            Contact
          </div>
          <ul className="space-y-1">
            <li><a href="tel:9024638773" className="text-[#c8c0b8] text-xs hover:text-white transition-colors">(902) 463-8773</a></li>
            <li><a href="mailto:jody.crane@ns.sympatico.ca" className="text-[#c8c0b8] text-xs hover:text-white transition-colors">jody.crane@ns.sympatico.ca</a></li>
            <li className="mt-3">
              <Link href="/about" className="text-[#c8c0b8] text-xs hover:text-white transition-colors">About</Link>
            </li>
            <li>
              <Link href="/contact" className="text-[#c8c0b8] text-xs hover:text-white transition-colors">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-[#2e2a27] pt-4 flex justify-between">
        <div className="text-[11px] text-[#6b6460]">
          © 2026 Brooklyn Audio Inc. All rights reserved.
        </div>
        <div className="text-[11px] text-[#6b6460]">
          Est. 1994 · Dartmouth, NS
        </div>
      </div>
    </footer>
  )
}
