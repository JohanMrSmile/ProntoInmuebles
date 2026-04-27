'use client'

import { Calendar } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/tracking'

interface PropertyAgendaCTAProps {
  propertyTitle: string
  slug: string
}

export default function PropertyAgendaCTA({ propertyTitle, slug }: PropertyAgendaCTAProps) {
  return (
    <a
      href={buildWhatsAppLink({
        message: `Hola, quiero agendar una visita para ver la propiedad "${propertyTitle}"`,
        context: 'property',
        metadata: {
          referencia: slug,
          accion: 'agendar_visita'
        }
      })}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackWhatsAppClick({
          context: 'property',
          location: 'property_cta',
          label: 'Agendar visita',
          metadata: {
            referencia: slug,
            accion: 'agendar_visita'
          }
        })
      }
      className="flex items-center justify-center gap-2 py-3 rounded-button border-2 border-white/20 text-white text-sm font-semibold font-sans hover:bg-white/10 transition-all"
    >
      <Calendar className="w-4 h-4 text-gold-400" />
      Agendar visita
    </a>
  )
}
