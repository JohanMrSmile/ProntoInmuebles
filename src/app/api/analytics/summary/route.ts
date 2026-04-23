import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/analytics/summary
 * 
 * Returns aggregated metrics for the dashboard.
 * Requires x-api-key header for basic protection.
 */
export async function GET(request: NextRequest) {
  // Basic security: require an API key to view analytics
  const apiKey = request.headers.get('x-api-key')
  // For simplicity, we check against a fixed key or just the service role key
  // You should configure an ANALYTICS_API_KEY in .env.local
  const expectedKey = process.env.ANALYTICS_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Get Lead Attribution from view
    const { data: attributionData, error: attributionError } = await supabase
      .from('lead_attribution')
      .select('*')

    if (attributionError) {
      console.error('[Analytics API] Error fetching attribution:', attributionError.message)
    }

    // 2. Get Event Funnel from view
    const { data: funnelData, error: funnelError } = await supabase
      .from('event_funnel')
      .select('*')

    if (funnelError) {
      console.error('[Analytics API] Error fetching funnel:', funnelError.message)
    }

    // 3. Get Totals
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    const { count: totalEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        totals: {
          leads: totalLeads || 0,
          events: totalEvents || 0,
        },
        leadAttribution: attributionData || [],
        eventFunnel: funnelData || [],
      }
    }, { status: 200 })

  } catch (err) {
    console.error('[Analytics API] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
