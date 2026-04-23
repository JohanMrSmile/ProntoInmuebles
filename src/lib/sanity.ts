import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import type { Property } from '@/lib/types'

/**
 * Sanity CMS Data Layer
 * All GROQ queries and data fetching for properties.
 * Uses the official Sanity client from /sanity/lib/client.ts
 */

// ─── GROQ Queries ────────────────────────────────────────

const PROPERTY_LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  location,
  price,
  priceValue,
  "image": image.asset->url,
  propertyType,
  "type": transactionType,
  "beds": bedrooms,
  "baths": bathrooms,
  "sqft": area,
  description,
  "lat": mapLocation.lat,
  "lng": mapLocation.lng,
  featured
`

const PROPERTY_DETAIL_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  location,
  price,
  priceValue,
  "image": image.asset->url,
  "gallery": gallery[].asset->url,
  propertyType,
  "type": transactionType,
  "beds": bedrooms,
  "baths": bathrooms,
  "sqft": area,
  description,
  "lat": mapLocation.lat,
  "lng": mapLocation.lng,
  featured
`

// ─── Fetch Functions ────────────────────────────────────

/**
 * Fetch all properties from Sanity
 * Returns normalized Property[] matching the shared type
 */
export async function getProperties(): Promise<Property[]> {
  const query = `*[_type == "property" && defined(slug.current)] | order(featured desc, _createdAt desc) {
    ${PROPERTY_LIST_FIELDS}
  }`

  try {
    const data = await client.fetch(query, {}, {
      next: { revalidate: 0 } // Cache desactivado para actualizaciones inmediatas
    })
    return data || []
  } catch (error) {
    console.error('[Sanity] Error fetching properties:', error)
    return []
  }
}

/**
 * Fetch a single property by slug
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const query = `*[_type == "property" && slug.current == $slug][0] {
    ${PROPERTY_DETAIL_FIELDS}
  }`

  try {
    const data = await client.fetch(query, { slug }, {
      next: { revalidate: 0 } // Cache desactivado para actualizaciones inmediatas
    })
    return data || null
  } catch (error) {
    console.error('[Sanity] Error fetching property by slug:', error)
    return null
  }
}

/**
 * Get all property slugs for generateStaticParams
 */
export async function getAllPropertySlugs(): Promise<string[]> {
  const query = `*[_type == "property" && defined(slug.current)].slug.current`

  try {
    const slugs = await client.fetch(query, {}, {
      next: { revalidate: 0 }
    })
    return slugs || []
  } catch (error) {
    console.error('[Sanity] Error fetching slugs:', error)
    return []
  }
}

/**
 * Image URL helper — re-export for convenience
 */
export { urlFor }
