/**
 * Client-side tracker — sends events to /api/track asynchronously
 * Uses navigator.sendBeacon for reliability (fires even on page close)
 * Falls back to fetch for non-critical events
 */

import { getStoredUTMs, getVisitorId, getSessionId } from './utm'

type EventType =
  | 'page_view'
  | 'whatsapp_click'
  | 'scroll_depth'
  | 'time_on_site'
  | 'cta_click'
  | 'form_submit'
  | 'phone_click'
  | 'property_view'
  | 'service_view'

interface TrackOptions {
  /** Additional metadata for the event */
  metadata?: Record<string, unknown>
  /** Use sendBeacon instead of fetch (good for unload events) */
  beacon?: boolean
}

const TRACK_ENDPOINT = '/api/track'

/**
 * Track an event — fire-and-forget, never blocks UI
 */
export function track(eventType: EventType, opts: TrackOptions = {}) {
  if (typeof window === 'undefined') return

  const utms = getStoredUTMs()

  const payload = {
    event:        eventType,
    url:          window.location.href,
    visitor_id:   getVisitorId(),
    session_id:   getSessionId(),
    utm_source:   utms.utm_source,
    utm_medium:   utms.utm_medium,
    utm_campaign: utms.utm_campaign,
    utm_term:     utms.utm_term,
    utm_content:  utms.utm_content,
    referrer:     utms.referrer,
    metadata:     opts.metadata || {},
  }

  // Use sendBeacon for page-unload events (more reliable)
  if (opts.beacon && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    navigator.sendBeacon(TRACK_ENDPOINT, blob)
    return
  }

  // Standard async fetch — fire and forget
  fetch(TRACK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true, // Allow request to survive page navigation
  }).catch(() => {
    // Silently fail — tracking should never break the UX
  })
}

/**
 * Track a WhatsApp click — captures lead data before redirect
 */
export function trackWhatsApp(location: string, propertyId?: string | number) {
  track('whatsapp_click', {
    metadata: {
      location,
      ...(propertyId && { property_id: propertyId }),
    },
  })
}

/**
 * Submit a lead to /api/lead — returns the result
 */
export async function submitLead(data: {
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
}): Promise<{ ok: boolean; lead_id?: string; action?: string }> {
  if (typeof window === 'undefined') return { ok: false }

  const utms = getStoredUTMs()

  const payload = {
    ...data,
    page:         window.location.pathname,
    visitor_id:   getVisitorId(),
    session_id:   getSessionId(),
    utm_source:   utms.utm_source,
    utm_medium:   utms.utm_medium,
    utm_campaign: utms.utm_campaign,
    utm_term:     utms.utm_term,
    utm_content:  utms.utm_content,
    referrer:     utms.referrer,
  }

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch {
    console.error('[Tracker] Failed to submit lead')
    return { ok: false }
  }
}
