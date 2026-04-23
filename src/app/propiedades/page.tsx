import type { Metadata } from 'next'
import PropiedadesContent from '@/components/PropiedadesContent'
import { getProperties } from '@/lib/sanity'
import { properties as staticProperties } from '@/lib/properties'

export const metadata: Metadata = {
  title: 'Catálogo de Propiedades | Pronto Inmuebles',
  description: 'Explora nuestro catálogo exclusivo de casas, apartamentos y locales en venta y arriendo. Encuentra tu espacio ideal con asesoría profesional.',
}

export default async function PropiedadesPage() {
  const sanityProperties = await getProperties() || []
  const sanitySlugs = new Set(sanityProperties.map(p => p.slug))
  const filteredStatic = staticProperties.filter(p => !sanitySlugs.has(p.slug))
  
  // Combine both so the user doesn't lose the examples
  const properties = [...sanityProperties, ...filteredStatic]

  return <PropiedadesContent properties={properties} />
}
