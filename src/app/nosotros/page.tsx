import type { Metadata } from 'next'
import NosotrosContent from '@/components/NosotrosContent'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Pronto Inmuebles',
  description: 'Conoce al equipo detrás de Pronto Inmuebles. Más de 10 años conectando familias con su hogar ideal en Colombia.',
}

export default function NosotrosPage() {
  return <NosotrosContent />
}
