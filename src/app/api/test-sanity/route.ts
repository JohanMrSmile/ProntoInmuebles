import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

/**
 * GET /api/test-sanity
 * 
 * Simple endpoint to verify connection with Sanity CMS.
 */
export async function GET() {
  try {
    // Try to fetch the project dataset info or a simple query
    const data = await sanityClient.fetch('*[_type == "product"][0...1]')
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexión con Sanity exitosa',
      count: data.length,
      sample: data[0] || 'No hay productos aún en Sanity, pero la conexión funciona.'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Error al conectar con Sanity',
      error: error.message
    }, { status: 500 })
  }
}
