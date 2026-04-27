import type { WhatsAppLocation } from '@/types/tracking'

export type WhatsAppClickContext =
  | 'hero'
  | 'property'
  | 'service'
  | 'lead_capture'

export interface WhatsAppClickEvent {
  context: WhatsAppClickContext
  location: WhatsAppLocation
  label?: string
  metadata?: Record<string, string | number>
}

export function trackWhatsAppClick(event: WhatsAppClickEvent): void {
  // Validación de seguridad con warning en development
  if (!event.context || !event.location) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WA_CLICK_INVALID]', event)
    }
    return
  }

  const isBrowser = typeof window !== 'undefined'

  const payload = {
    ...event,
    source: 'whatsapp_cta',
    timestamp: new Date().toISOString(),
    path: isBrowser ? window.location.pathname : 'server'
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[WA_CLICK]', JSON.stringify(payload, null, 2))
  }

  const dataLayer = (window as any).dataLayer

  if (isBrowser && Array.isArray(dataLayer)) {
    dataLayer.push({
      event: 'whatsapp_click',
      ...payload
    })
  }
}
