import type { Metadata } from 'next'
import PropiedadesContent from '@/components/PropiedadesContent'
import { getProperties } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Catálogo de Propiedades | Pronto Inmuebles',
  description: 'Explora nuestro catálogo exclusivo de casas, apartamentos y locales en venta y arriendo. Encuentra tu espacio ideal con asesoría profesional.',
}

export default async function PropiedadesPage() {
  const properties = await getProperties() ?? []

  return <PropiedadesContent properties={properties} />
}
