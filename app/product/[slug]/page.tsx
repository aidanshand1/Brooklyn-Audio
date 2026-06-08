import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
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
  specifications?: string
  image?: any
  slug: { current: string }
  category: {
    name: string
    slug: { current: string }
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    brand,
    model,
    condition,
    price,
    priceOnRequest,
    description,
    specifications,
    image,
    slug,
    category->{
      name,
      slug
    }
  }`
  return client.fetch(query, { slug })
}

const conditionLabel = { new: 'New', demo: 'Demo', used: 'Used' }
const conditionMeta: Record<string, { dot: string; text: string }> = {
  new:  { dot: 'bg-[var(--red)]',  text: 'text-[var(--red)]' },
  demo: { dot: 'bg-[#5a5a5a]',     text: 'text-[#5a5a5a]' },
  used: { dot: 'bg-[var(--text)]', text: 'text-[var(--text)]' },
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const enquireHref = `/contact?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`
  const cond = conditionMeta[product.condition]

  const categorySlug = product.category?.slug?.current
  const broadCategoryKey = BROAD_CATEGORIES.find(
    bc => bc.key === categorySlug || bc.subcategories.some(s => s.slug === categorySlug)
  )?.key

  return (
    <div className="bg-white">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="border-b border-[var(--border)] px-12 py-3">
        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Shop</Link>
          <span className="text-[var(--border2)]">›</span>
          {product.category && broadCategoryKey && (
            <>
              <Link href={`/category/${broadCategoryKey}`} className="hover:text-[var(--text)] transition-colors">
                {product.category.name}
              </Link>
              <span className="text-[var(--border2)]">›</span>
            </>
          )}
          <span className="text-[var(--text)] truncate max-w-[300px]">{product.name}</span>
        </div>
      </div>

      {/* ── Three-column body ──────────────────────────────────── */}
      {/* [Image 400px] | [Buy panel 340px] | [Description flex-1] */}
      <div className="grid grid-cols-[400px_340px_1fr] min-h-[560px]">

        {/* Col 1 — Image */}
        <div className="bg-[var(--cream)] flex items-center justify-center relative border-r border-[var(--border)] sticky top-0 self-start" style={{ height: 'calc(100vh - 120px)', maxHeight: 600 }}>
          {product.image ? (
            <Image
              src={urlFor(product.image).width(800).height(800).url()}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-contain p-10"
              priority
            />
          ) : (
            <span className="font-serif text-[120px] text-[var(--border2)] select-none">◎</span>
          )}
          <span className={`absolute top-4 left-4 text-[10px] font-medium px-2.5 py-1 tracking-wider ${
            product.condition === 'new' ? 'bg-[var(--red)] text-white' :
            product.condition === 'demo' ? 'bg-[#5a5a5a] text-white' :
            'bg-[var(--text)] text-white'
          }`}>
            {conditionLabel[product.condition]}
          </span>
        </div>

        {/* Col 2 — Buy panel */}
        <div className="border-r border-[var(--border)] flex flex-col divide-y divide-[var(--border)]">

          {/* Name + brand */}
          <div className="px-8 pt-9 pb-7">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cond.dot}`} />
              <span className={`text-[10px] font-medium tracking-widest uppercase ${cond.text}`}>
                {conditionLabel[product.condition]}
              </span>
              <span className="text-[var(--border2)]">·</span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)]">
                {product.brand}
              </span>
            </div>
            <h1 className="font-serif text-[28px] font-light text-[var(--text)] leading-tight">
              {product.name}
            </h1>
            {product.model && (
              <div className="text-[11px] text-[var(--muted)] mt-1.5">Model: {product.model}</div>
            )}
          </div>

          {/* Price */}
          <div className="px-8 py-6">
            {product.priceOnRequest ? (
              <>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-1.5">Price</div>
                <div className="font-serif text-[20px] font-light text-[var(--muted)] italic">Available on request</div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-1.5">Price (CAD)</div>
                <div className="font-serif text-[42px] font-light text-[var(--burgundy)] leading-none">
                  ${product.price?.toLocaleString()}
                </div>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="px-8 py-6 space-y-2.5">
            <Link
              href={enquireHref}
              className="flex items-center justify-center w-full font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-4 bg-[var(--burgundy)] text-white hover:bg-[var(--burgundy2)] transition-colors"
            >
              Enquire about this item
            </Link>
            <a
              href="tel:9024638773"
              className="flex items-center justify-center gap-2 w-full font-sans text-[11px] font-medium tracking-wider uppercase px-5 py-3.5 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" /></svg>
              (902) 463-8773
            </a>
          </div>

          {/* Trust signals */}
          <div className="px-8 py-6">
            <ul className="space-y-3">
              {[
                'In-store listening sessions available',
                'Expert advice since 1994',
                'Special orders welcome',
              ].map(text => (
                <li key={text} className="flex items-start gap-2.5 text-[12px] text-[var(--muted)]">
                  <span className="text-[var(--border2)] mt-px leading-none">◈</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Col 3 — Description + specs */}
        <div className="flex flex-col divide-y divide-[var(--border)]">

          {product.description ? (
            <div className="px-10 py-10 flex-1">
              <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-5">
                About this item
              </div>
              <p className="font-serif text-[19px] font-light text-[var(--text)] leading-relaxed max-w-[600px] whitespace-pre-line">
                {product.description}
              </p>
            </div>
          ) : (
            <div className="px-10 py-10 flex-1 flex items-center justify-center">
              <p className="text-[13px] text-[var(--muted)] italic">No description available.</p>
            </div>
          )}

          {product.specifications && (
            <div className="px-10 py-10 bg-[var(--offwhite)]">
              <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--muted)] mb-6">
                Specifications
              </div>
              <dl className="divide-y divide-[var(--border)] max-w-[600px]">
                {product.specifications.split('\n').filter(Boolean).map((line, i) => {
                  const colonIdx = line.indexOf(':')
                  if (colonIdx === -1) {
                    return (
                      <div key={i} className="py-2.5">
                        <span className="text-[11px] font-semibold text-[var(--text)] uppercase tracking-wide">{line}</span>
                      </div>
                    )
                  }
                  const label = line.slice(0, colonIdx).trim()
                  const value = line.slice(colonIdx + 1).trim()
                  return (
                    <div key={i} className="grid grid-cols-[180px_1fr] gap-4 py-2.5">
                      <dt className="text-[11px] text-[var(--muted)] uppercase tracking-wide pt-px">{label}</dt>
                      <dd className="text-[13px] text-[var(--text)]">{value}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom CTA banner ──────────────────────────────────── */}
      <div className="bg-[var(--burgundy)] text-white flex items-center justify-between px-12 py-10">
        <div>
          <div className="font-serif text-[28px] font-light text-white mb-1">
            Want to hear it first?
          </div>
          <div className="text-[13px] text-[#d4b8b8]">
            We offer listening sessions at our Dartmouth showroom — by appointment.
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:9024638773"
            className="font-sans text-[11px] font-medium tracking-wider uppercase px-7 py-3 border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors whitespace-nowrap"
          >
            Book by phone
          </a>
          <Link
            href={enquireHref}
            className="font-sans text-[11px] font-medium tracking-wider uppercase px-7 py-3 bg-white text-[var(--burgundy)] hover:bg-[var(--cream)] transition-colors whitespace-nowrap"
          >
            Send an enquiry
          </Link>
        </div>
      </div>
    </div>
  )
}
