/**
 * Shared TypeScript types for property data.
 * Used across components, pages, and data fetching.
 */

export type Property = {
  _id: string
  title: string
  slug: string
  location: string
  price: string
  priceValue: number
  image: string
  propertyType: string
  type: string // transactionType: 'Venta' | 'Arriendo'
  beds: number
  baths: number
  sqft: number
  description: string
  lat?: number
  lng?: number
  featured?: boolean
  gallery?: string[]
}
