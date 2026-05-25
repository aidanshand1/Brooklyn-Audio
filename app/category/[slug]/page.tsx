import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Hero } from '@/components/Hero'
import { CategoryStrip } from '@/components/CategoryStrip'
import { ProductGrid } from '@/components/ProductGrid'
import { client } from '@/lib/sanity'
import { BROAD_CATEGORIES } from '@/lib/categories'

async function getProducts() {
  const query = `*[_type == "product" && inStock == true] | order(featured desc, _createdAt desc) {
    _id,
    name,
    brand,
    model,
    condition,
    price,
    priceOnRequest,
    description,
    image,
    slug,
    category->{
      name,
      slug
    }
  }`
  return client.fetch(query)
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sub?: string }>
}) {
  const [{ slug }, { sub }, products] = await Promise.all([
    params,
    searchParams,
    getProducts(),
  ])

  const category = BROAD_CATEGORIES.find(c => c.key === slug)
  if (!category) notFound()

  const activeSub = category.subcategories.find(s => s.slug === sub)

  return (
    <>
      <Hero />
      <CategoryStrip activeCategory={slug} />

      {/* Category header */}
      <div className="bg-[var(--cream)] border-b border-[var(--border)] px-12 py-7">
        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)] mb-2">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Shop</Link>
          <span>›</span>
          {activeSub ? (
            <>
              <Link href={`/category/${slug}`} className="hover:text-[var(--text)] transition-colors">
                {category.label}
              </Link>
              <span>›</span>
              <span className="text-[var(--text)]">{activeSub.label}</span>
            </>
          ) : (
            <span className="text-[var(--text)]">{category.label}</span>
          )}
        </div>
        <h1 className="font-serif text-[36px] font-light text-[var(--text)] leading-none">
          {activeSub ? activeSub.label : category.label}
        </h1>
        <p className="text-[13px] text-[var(--muted)] mt-2">{category.description}</p>
      </div>

      <ProductGrid products={products} initialFilter={slug} initialSubFilter={sub} />
    </>
  )
}

export async function generateStaticParams() {
  return BROAD_CATEGORIES.filter(c => c.key !== 'all').map(c => ({ slug: c.key }))
}
