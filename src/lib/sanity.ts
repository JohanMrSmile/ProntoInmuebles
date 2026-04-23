import { createClient } from 'next-sanity'

/**
 * Sanity CMS Client
 * Configured with caching strategy: revalidate every 3600s (1 hour)
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'y66p1066' // Placeholder to prevent build crash
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // We use Next.js caching instead of Sanity's CDN
})

// Optional: Client for draft/preview mode or writing (requires token)
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN, // Keep this token secure
})

/**
 * Fetch products from Sanity
 */
export async function getProducts(params: { category?: string, page?: number, per_page?: number } = {}) {
  const page = params.page || 1
  const limit = params.per_page || 10
  const start = (page - 1) * limit
  const end = start + limit - 1

  let query = `*[_type == "product" && defined(slug.current)]`
  
  if (params.category) {
    query = `*[_type == "product" && references(*[_type == "category" && slug.current == $category]._id)]`
  }

  query += ` | order(createdAt desc) [${start}..${end}] {
    _id,
    title,
    slug,
    price,
    "imageUrl": mainImage.asset->url,
    category->{title, slug}
  }`

  const data = await sanityClient.fetch(query, { category: params.category }, {
    next: { revalidate: 3600 }
  })

  return data
}

/**
 * Fetch product categories from Sanity
 */
export async function getCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    "imageUrl": image.asset->url
  }`

  const data = await sanityClient.fetch(query, {}, {
    next: { revalidate: 3600 }
  })

  return data
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    price,
    description,
    "imageUrl": mainImage.asset->url,
    category->{title, slug}
  }`

  const data = await sanityClient.fetch(query, { slug }, {
    next: { revalidate: 3600 }
  })

  return data
}
