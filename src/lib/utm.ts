/**
 * Sistema de captura y persistencia de parámetros UTM
 * Usa localStorage para persistir durante toda la sesión del usuario
 * Genera un visitor_id único para identificar anónimos
 */

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landing_page?: string
  timestamp?: string
  visitor_id?: string
}

const UTM_STORAGE_KEY = 'pronto_utm_data'
const VISITOR_ID_KEY  = 'pronto_visitor_id'
const SESSION_ID_KEY  = 'pronto_session_id'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

/**
 * Genera o recupera un visitor_id único (persiste en localStorage)
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''

  try {
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }
}

/**
 * Genera o recupera un session_id único (persiste en sessionStorage durante la visita)
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY)
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem(SESSION_ID_KEY, id)
    }
    return id
  } catch {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }
}

/**
 * Captura UTMs de la URL actual y los guarda en localStorage
 * Solo sobrescribe si llegan nuevos UTMs (permite re-atribución por campaña)
 */
export function captureUTMs(): UTMParams {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const hasNewUtms = UTM_KEYS.some(key => params.has(key))

  // Si la URL trae nuevos UTMs, actualizar (re-atribución)
  if (hasNewUtms) {
    const utms: UTMParams = {}
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) utms[key] = value
    }
    utms.referrer = document.referrer || 'direct'
    utms.landing_page = window.location.pathname
    utms.timestamp = new Date().toISOString()
    utms.visitor_id = getVisitorId()

    try {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms))
    } catch {
      // localStorage no disponible
    }
    return utms
  }

  // Si no hay UTMs nuevos, intentar leer los existentes
  const existing = getStoredUTMs()
  if (existing.utm_source) return existing

  // Primera visita sin UTMs: guardar referrer y metadata
  const utms: UTMParams = {
    referrer: document.referrer || 'direct',
    landing_page: window.location.pathname,
    timestamp: new Date().toISOString(),
    visitor_id: getVisitorId(),
  }

  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utms))
  } catch {
    // localStorage no disponible
  }

  return utms
}

/**
 * Obtiene UTMs guardados
 */
export function getStoredUTMs(): UTMParams {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Genera string de UTMs para agregar al mensaje de WhatsApp
 */
export function getUTMSummary(): string {
  const utms = getStoredUTMs()
  const parts: string[] = []

  if (utms.utm_source) parts.push(`Fuente: ${utms.utm_source}`)
  if (utms.utm_medium) parts.push(`Medio: ${utms.utm_medium}`)
  if (utms.utm_campaign) parts.push(`Campaña: ${utms.utm_campaign}`)
  if (utms.landing_page) parts.push(`Página: ${utms.landing_page}`)

  return parts.length > 0 ? `\n---\n📊 ${parts.join(' | ')}` : ''
}

/**
 * Genera datos del lead para envío a backend/webhook
 */
export function buildLeadPayload(extra: Record<string, string> = {}) {
  const utms = getStoredUTMs()

  return {
    ...extra,
    ...utms,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }
}
