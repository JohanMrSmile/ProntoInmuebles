import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Cliente de Supabase para el frontend
 *
 * Configuración necesaria en .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Si no están configurados, el cliente será null pero la app funcionará
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Tipos para las tablas de la base de datos
 */
export interface Lead {
  id?: string
  created_at?: string
  name: string
  phone: string
  email?: string
  service: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  source?: string
  notes?: string
}

export interface Property {
  id?: string
  created_at?: string
  title: string
  description: string
  type: 'apartment' | 'house' | 'lot' | 'farm' | 'commercial'
  status: 'sale' | 'rent' | 'sold' | 'rented'
  price: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  location: string
  address?: string
  images?: string[]
  features?: string[]
  featured?: boolean
}

export interface Service {
  id?: string
  created_at?: string
  title: string
  description: string
  category: 'real_estate' | 'home_services'
  price_min?: number
  price_max?: number
  images?: string[]
}

export interface Testimonial {
  id?: string
  created_at?: string
  name: string
  role: string
  location: string
  text: string
  rating: number
  service: string
  avatar?: string
}

/**
 * Funciones para interactuar con la base de datos
 */

// Leads
export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>) {
  if (!supabase) {
    console.log('Supabase no configurado. Lead guardado localmente:', lead)
    return { ...lead, id: 'local-' + Date.now() }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getLeads() {
  if (!supabase) {
    console.log('Supabase no configurado.')
    return []
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  if (!supabase) {
    console.log('Supabase no configurado.')
    return null
  }

  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Properties
export async function getProperties(filters?: {
  type?: Property['type']
  status?: Property['status']
  location?: string
  featured?: boolean
}) {
  if (!supabase) {
    console.log('Supabase no configurado.')
    return []
  }

  let query = supabase.from('properties').select('*')

  if (filters?.type) query = query.eq('type', filters.type)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.location) query = query.ilike('location', `%${filters.location}%`)
  if (filters?.featured) query = query.eq('featured', true)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProperty(id: string) {
  if (!supabase) {
    console.log('Supabase no configurado.')
    return null
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Testimonials
export async function getTestimonials() {
  if (!supabase) {
    console.log('Supabase no configurado.')
    return []
  }

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Storage para imágenes
 */
export async function uploadImage(bucket: string, path: string, file: File) {
  if (!supabase) {
    throw new Error('Supabase no configurado')
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) throw error
  return data
}

export function getPublicUrl(bucket: string, path: string) {
  if (!supabase) {
    return ''
  }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}