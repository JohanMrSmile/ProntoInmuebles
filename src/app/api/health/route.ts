import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/health
 * 
 * Health check endpoint for monitoring uptime and database connectivity.
 * Useful for Vercel/Netlify status checks or external monitors.
 */
export async function GET() {
  const status = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      supabase: 'unknown',
    }
  }

  try {
    // Check Supabase connectivity
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      // A simple lightweight query to check connection
      const { error } = await supabase.from('leads').select('id').limit(1)
      status.services.supabase = error ? 'error' : 'ok'
    } else {
      status.services.supabase = 'not_configured'
    }

    const isHealthy = Object.values(status.services).every(s => s === 'ok' || s === 'not_configured')

    return NextResponse.json(status, { 
      status: isHealthy ? 200 : 503 
    })
  } catch (err) {
    status.status = 'error'
    status.services.supabase = 'error'
    return NextResponse.json(status, { status: 503 })
  }
}
