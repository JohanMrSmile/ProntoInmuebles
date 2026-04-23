import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'

/**
 * POST /api/lead — Lead capture endpoint
 *
 * Receives lead data from forms and WhatsApp CTAs.
 * De-duplicates by phone number (upsert: updates existing lead if phone matches).
 * Persists to Supabase 'leads' table.
 */

interface LeadPayload {
  name:          string
  phone:         string
  email?:        string
  service?:      string
  message?:      string
  page?:         string
  visitor_id?:   string
  session_id?:   string
  utm_source?:   string
  utm_medium?:   string
  utm_campaign?: string
  utm_term?:     string
  utm_content?:  string
  referrer?:     string
}

// Server-side Supabase client
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * Normalize phone: strip spaces, dashes, parens
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\+]/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    
    // Rate limit: 10 leads per minute per IP
    const { success } = rateLimit(`lead_${ip}`, 10, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json() as LeadPayload

    // Validate required fields
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Nombre requerido (mín 2 caracteres)' }, { status: 400 })
    }
    if (!body.phone || body.phone.trim().length < 7) {
      return NextResponse.json({ error: 'Teléfono requerido (mín 7 dígitos)' }, { status: 400 })
    }

    const normalizedPhone = normalizePhone(body.phone)

    const leadData = {
      name:         body.name.trim(),
      phone:        normalizedPhone,
      email:        body.email?.trim() || null,
      service:      body.service || 'general',
      message:      body.message || '',
      page:         body.page || null,
      visitor_id:   body.visitor_id || null,
      session_id:   body.session_id || null,
      utm_source:   body.utm_source || null,
      utm_medium:   body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_term:     body.utm_term || null,
      utm_content:  body.utm_content || null,
      referrer:     body.referrer || null,
      status:       'new' as const,
      ip:           ip === 'unknown' ? null : ip,
      user_agent:   request.headers.get('user-agent') || null,
      source:       body.referrer?.includes('whatsapp') ? 'whatsapp' : 'form',
      created_at:   new Date().toISOString(),
    }

    const supabase = getSupabase()

    if (supabase) {
      // Check for existing lead with same phone (dedup)
      const { data: existing } = await supabase
        .from('leads')
        .select('id, name, phone, status')
        .eq('phone', normalizedPhone)
        .maybeSingle()

      if (existing) {
        // Update the existing lead with new interaction data
        const { error } = await supabase
          .from('leads')
          .update({
            name:         leadData.name,
            email:        leadData.email || undefined,
            service:      leadData.service,
            message:      leadData.message,
            page:         leadData.page,
            utm_source:   leadData.utm_source,
            utm_medium:   leadData.utm_medium,
            utm_campaign: leadData.utm_campaign,
            updated_at:   new Date().toISOString(),
          })
          .eq('id', existing.id)

        if (error) {
          console.error('[Lead API] Supabase update error:', error.message)
        }

        return NextResponse.json(
          { ok: true, lead_id: existing.id, action: 'updated' },
          { status: 200 }
        )
      }

      // Insert new lead
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select('id')
        .single()

      if (error) {
        console.error('[Lead API] Supabase insert error:', error.message)
        // Fallback: log locally
        console.log('[Lead API] Lead data (fallback):', JSON.stringify(leadData, null, 2))
        return NextResponse.json({ ok: true, lead_id: null, action: 'logged' }, { status: 200 })
      }

      return NextResponse.json(
        { ok: true, lead_id: data?.id, action: 'created' },
        { status: 201 }
      )
    }

    // No Supabase: log to console
    console.log('[Lead API] Lead captured (no DB):', JSON.stringify(leadData, null, 2))
    return NextResponse.json(
      { ok: true, lead_id: `local-${Date.now()}`, action: 'logged' },
      { status: 200 }
    )
  } catch (err) {
    console.error('[Lead API] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Preflight
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
