import { getStoredUTMs } from './utm'

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// ── Helpers ──

function gtag(...args: unknown[]) {
  const w = window as unknown as Record<string, unknown>
  if (typeof window !== 'undefined' && w.gtag) {
    ;(window as unknown as Record<string, unknown> & { gtag: (...a: unknown[]) => void }).gtag(...args)
  }
}

function pushDataLayer(data: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    const w = window as unknown as Record<string, unknown> & { dataLayer?: Record<string, unknown>[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push(data)
  }
}

// ── Core ──

export const pageview = (url: string) => {
  gtag('config', GA_TRACKING_ID, { page_path: url })
  pushDataLayer({ event: 'page_view', page_path: url })
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  const utms = getStoredUTMs()

  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    // Include UTM data para atribución
    ...(utms.utm_source && { utm_source: utms.utm_source }),
    ...(utms.utm_medium && { utm_medium: utms.utm_medium }),
    ...(utms.utm_campaign && { utm_campaign: utms.utm_campaign }),
  })

  // También push a dataLayer para GTM
  pushDataLayer({
    event: action,
    event_category: category,
    event_label: label,
    value,
    ...utms,
  })
}

// ── Tracking Functions ──

export const trackCTA = (ctaName: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaName} | ${location}`,
  })
}

export const trackPhoneClick = (location: string) => {
  event({
    action: 'phone_click',
    category: 'conversion',
    label: `Phone from ${location}`,
  })
}

export const trackSearch = (city: string, type: string) => {
  event({
    action: 'property_search',
    category: 'engagement',
    label: `${type} en ${city}`,
  })
}

export const trackFormSubmit = (formName: string, status: 'success' | 'error' = 'success') => {
  event({
    action: `form_submit_${status}`,
    category: 'conversion',
    label: formName,
  })
}

export const trackWhatsAppLead = (location: string, propertyId?: string | number) => {
  event({
    action: 'generate_lead_whatsapp',
    category: 'conversion',
    label: `WhatsApp from ${location}${propertyId ? ` (Prop: ${propertyId})` : ''}`,
  })
}

export const trackServiceView = (serviceName: string) => {
  event({
    action: 'service_view',
    category: 'engagement',
    label: serviceName,
  })
}

export const trackLeadCapture = (source: string, service: string) => {
  event({
    action: 'lead_captured',
    category: 'conversion',
    label: `${service} from ${source}`,
    value: 1,
  })
}
