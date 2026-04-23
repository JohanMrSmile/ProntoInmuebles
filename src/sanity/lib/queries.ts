import { groq } from 'next-sanity'

// Obtener las últimas propiedades
export const getPropertiesQuery = groq`
  *[_type == "property"] | order(_createdAt desc) {
    _id,
    title,
    propertyType,
    businessType,
    price,
    address,
    "imageUrl": images[0].asset->url,
    bedrooms,
    bathrooms,
    area
  }
`

// Obtener las últimas 20 reseñas
export const getReviewsQuery = groq`
  *[_type == "review"] | order(_createdAt desc) [0...20] {
    _id,
    author,
    text,
    rating,
    "imageUrl": image.asset->url
  }
`
