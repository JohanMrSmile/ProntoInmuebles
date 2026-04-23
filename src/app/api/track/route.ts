import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'

/**
 * POST /api/track — Server-side event tracking
 *
 * Receives events from the client and persists them to Supabase.
 * Falls back to console logging if Supabase is not configured.
 *
 * Supported event types:
 *   - page_view
 *   - whatsapp_click
 *   - scroll_depth
 *   - time_on_site
 *   - cta_click
 *   - form_submit
 */

const VALID_EVENTS = [
  'page_view',
  'whatsapp_click',
  'scroll_depth',
  'time_on_site',
  'cta_click',
  'form_submit',
  'phone_click',
  'property_view',
  'service_view',
] as const

type EventType = typeof VALID_EVENTS[number]

interface TrackPayload {
  event:        EventType
  url:          string
  visitor_id?:  string
  session_id?:  string
  utm_source?:  string
  utm_medium?:  string
  utm_campaign?:string
  utm_term?:    string
  utm_content?: string
  referrer?:    string
  metadata?:    Record<string, unknown>
}

// Server-side Supabase client (uses service role key for writes)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    
    // Rate limit: 60 requests per minute per IP
    const { success } = rateLimit(`track_${ip}`, 60, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json() as TrackPayload

    // Validate event type
    if (!body.event || !VALID_EVENTS.includes(body.event)) {
      return NextResponse.json(
        { error: 'Invalid event type', valid: VALID_EVENTS },
        { status: 400 }
      )
    }

    const eventData = {
      event_type:   body.event,
      url:          body.url || '',
      visitor_id:   body.visitor_id || null,
      session_id:   body.session_id || null,
      utm_source:   body.utm_source || null,
      utm_medium:   body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_term:     body.utm_term || null,
      utm_content:  body.utm_content || null,
      referrer:     body.referrer || null,
      metadata:     body.metadata || {},
      ip:           ip === 'unknown' ? null : ip,
      user_agent:   request.headers.get('user-agent') || null,
      created_at:   new Date().toISOString(),
    }

    const supabase = getSupabase()

    if (supabase) {
      const { error } = await supabase
        .from('events')
        .insert([eventData])

      if (error) {
        console.error('[Track API] Supabase error:', error.message)
        // Don't fail the request — log and return success
      }
    } else {
      // Fallback: log to console (useful during development)
      console.log('[Track API] Event logged (no DB):', JSON.stringify(eventData, null, 2))
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[Track API] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Respond to preflight requests
export async function OPTIONS() {
  const origin = process.env.ALLOWED_ORIGIN || '*'
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
