import { siteConfig } from '@/lib/config'

type PropertySchemaInput = {
  id: number | string
  title: string
  description: string
  image: string
  location: string
  price: string
  priceValue: number
  type: string
  propertyType: string
  beds: number
  baths: number
  sqft: number
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: 'Cartagena',
      addressRegion: 'Bolívar',
      addressCountry: 'CO',
    },
    areaServed: {
      '@type': 'City',
      name: 'Cartagena',
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
    ],
  }
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: 'es-CO',
    publisher: {
      '@id': `${siteConfig.url}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/propiedades?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getPropertySchema(property: PropertySchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${siteConfig.url}/propiedades/${property.id}#property`,
    name: property.title,
    description: property.description,
    image: [property.image],
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.sqft,
      unitCode: 'MTK',
    },
    numberOfRooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressRegion: 'Bolívar',
      addressCountry: 'CO',
    },
    offers: {
      '@type': 'Offer',
      price: property.priceValue,
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      category: property.type,
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@id': `${siteConfig.url}#organization`,
      },
      url: `${siteConfig.url}/propiedades/${property.id}`,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Tipo de propiedad',
        value: property.propertyType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Tipo de negocio',
        value: property.type,
      },
    ],
  }
}
