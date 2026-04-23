import { MetadataRoute } from 'next'
import { properties } from '@/lib/properties'
import { siteConfig } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
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
    lastModified: '2026-04-22',
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes (Properties)
  const propertyRoutes = properties.map((property) => ({
    url: `${baseUrl}/propiedades/${property.id}`,
    lastModified: '2026-04-22',
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...routes, ...propertyRoutes]
}
