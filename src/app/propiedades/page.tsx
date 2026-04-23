import type { Metadata } from 'next'
import PropiedadesContent from '@/components/PropiedadesContent'

export const metadata: Metadata = {
  title: 'Catálogo de Propiedades | Pronto Inmuebles',
  description: 'Explora nuestro catálogo exclusivo de casas, apartamentos y locales en venta y arriendo. Encuentra tu espacio ideal con asesoría profesional.',
}

export default function PropiedadesPage() {
  return <PropiedadesContent />
}
