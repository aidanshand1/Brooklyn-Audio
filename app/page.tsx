import { Suspense } from 'react'
import { Hero } from '@/components/Hero'
import { CategoryStrip } from '@/components/CategoryStrip'
import { ShowroomSection } from '@/components/ShowroomSection'
import { ProductGrid } from '@/components/ProductGrid'
import { client } from '@/lib/sanity'

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

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <Hero />
      <CategoryStrip activeCategory="all" />
      <ShowroomSection />
      <Suspense>
        <ProductGrid products={products} initialFilter="all" />
      </Suspense>
    </>
  )
}
