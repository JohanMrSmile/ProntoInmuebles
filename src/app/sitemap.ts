import { MetadataRoute } from 'next'
import { getProperties } from '@/lib/sanity'
import { properties as staticProperties } from '@/lib/properties'
import { siteConfig } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static routes
  const routes = [
    '',
    '/propiedades',
    '/servicios',
    '/servicios/avaluos',
    '/contacto',
    '/nosotros',
    '/privacidad',
    '/terminos'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes (Properties) — Sanity first, then fallback
  let properties = await getProperties()
  if (!properties || properties.length === 0) {
    properties = staticProperties
  }

  const propertyRoutes = properties.map((property) => ({
    url: `${baseUrl}/propiedades/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...routes, ...propertyRoutes]
}
