import type { Metadata } from 'next'
import ServiciosContent from '@/components/ServiciosContent'

export const metadata: Metadata = {
  title: 'Servicios Integrales Inmobiliarios | Pronto Inmuebles',
  description: 'Avalúos certificados, remodelaciones premium, mantenimiento y decoración para tu propiedad en Colombia. Más de 500 proyectos completados.',
}

export default function ServiciosPage() {
  return <ServiciosContent />
}
