import type { Metadata } from 'next'
import ContactoContent from '@/components/ContactoContent'

export const metadata: Metadata = {
  title: 'Contacto | Pronto Inmuebles',
  description: 'Contáctanos para una asesoría inmobiliaria personalizada. Estamos aquí para ayudarte con la compra, venta o servicios integrales para tu hogar.',
}

export default function ContactoPage() {
  return <ContactoContent />
}
