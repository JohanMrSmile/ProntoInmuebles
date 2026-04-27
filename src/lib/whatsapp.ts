import { siteConfig } from './config'

export type WhatsAppContext =
  | 'hero'
  | 'property'
  | 'service'
  | 'lead_capture'

export interface WhatsAppOptions {
  message: string
  context: WhatsAppContext
  metadata?: Record<string, string | number | undefined>
}

export function buildWhatsAppLink({
  message,
  context,
  metadata
}: WhatsAppOptions): string {
  const phone = siteConfig.contact.whatsapp

  if (!phone) {
    throw new Error('WhatsApp phone not configured in siteConfig')
  }

  if (!message) {
    throw new Error('Message is required for WhatsApp link')
  }

  const isBrowser = typeof window !== 'undefined'
  const path = isBrowser ? window.location.pathname : 'unknown'
  const timestamp = new Date().toISOString()

  const metadataLines = metadata
    ? Object.entries(metadata)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')
    : null

  const fullMessage = [
    message,
    '',
    '---',
    '📍 Información adicional:',
    `- Contexto: ${context}`,
    `- Página: ${path}`,
    metadataLines,
    `- Fecha: ${timestamp}`
  ]
    .filter(Boolean)
    .join('\n')

  const MAX_LENGTH = 1800
  const safeMessage =
    fullMessage.length > MAX_LENGTH
      ? fullMessage.slice(0, MAX_LENGTH) + '\n...'
      : fullMessage

  const encodedMessage = encodeURIComponent(safeMessage)

  if (process.env.NODE_ENV === 'development') {
    console.log('[WhatsAppLink]', {
      context,
      path,
      metadata
    })
  }

  return `https://wa.me/${phone}?text=${encodedMessage}`
}

export function generateWhatsAppLink(message: string): string {
  return buildWhatsAppLink({
    message,
    context: 'lead_capture'
  })
}
