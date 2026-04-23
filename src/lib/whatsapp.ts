/**
 * Utilidades para WhatsApp Business API
 * Preparado para integración con n8n en el futuro
 */

import { getWhatsAppLink } from './config'

export interface WhatsAppConfig {
  phoneNumber: string
  businessId?: string
  accessToken?: string
}

/**
 * Genera un enlace de WhatsApp con mensaje predefinido
 */
export function generateWhatsAppLink(
  message: string,
  _phone?: string
): string {
  return getWhatsAppLink(message)
}

/**
 * Mensajes preconfigurados para diferentes servicios
 */
export const WHATSAPP_MESSAGES = {
  // Inmobiliaria
  venta: 'Hola, estoy interesado/a en comprar una propiedad.',
  arriendo: 'Hola, busco una propiedad en arriendo.',
  avaluo: 'Hola, necesito un avalúo inmobiliario.',

  // Servicios para el hogar
  blackout: 'Hola, necesito información sobre cortinas blackout.',
  mallas: 'Hola, necesito información sobre mallas de seguridad.',
  vidrios: 'Hola, necesito información sobre vidrios templados.',
  aires: 'Hola, necesito información sobre mantenimiento de aires acondicionados.',

  // Paquetes
  kitHogarSeguro: 'Hola, me interesa el Kit Hogar Seguro (mallas + blackout).',
  paqueteApartamentoNuevo: 'Hola, me interesa el Paquete Apartamento Nuevo.',
  solucionAirbnb: 'Hola, me interesa la Solución Airbnb Lista.',

  // General
  asesoramiento: 'Hola, quiero asesoramiento gratuito sobre mis opciones.',
  contacto: 'Hola, quiero información sobre sus servicios.',
}

/**
 * Formatea un número de teléfono para WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Eliminar espacios, guiones y paréntesis
  let formatted = phone.replace(/[\s\-\(\)]/g, '')

  // Si no tiene código de país, agregar +57 (Colombia)
  if (!formatted.startsWith('+')) {
    if (formatted.startsWith('57')) {
      formatted = formatted
    } else {
      formatted = '57' + formatted
    }
  }

  // Eliminar el + para el formato de wa.me
  return formatted.replace('+', '')
}

/**
 * Genera mensaje personalizado para lead
 */
export function generateLeadMessage(data: {
  name: string
  service: string
  details?: string
}): string {
  const { name, service, details } = data
  let message = `Hola, mi nombre es ${name}. `

  switch (service) {
    case 'venta':
      message += 'Estoy interesado/a en comprar una propiedad.'
      break
    case 'arriendo':
      message += 'Busco una propiedad en arriendo.'
      break
    case 'avaluo':
      message += 'Necesito un avalúo inmobiliario.'
      break
    case 'blackout':
      message += 'Necesito información sobre cortinas blackout.'
      break
    case 'mallas':
      message += 'Necesito información sobre mallas de seguridad.'
      break
    case 'vidrios':
      message += 'Necesito información sobre vidrios templados.'
      break
    case 'aires':
      message += 'Necesito información sobre aires acondicionados.'
      break
    case 'paquete':
      message += 'Me interesa uno de sus paquetes.'
      break
    default:
      message += 'Necesito información sobre sus servicios.'
  }

  if (details) {
    message += ` ${details}`
  }

  return message
}

/**
 * Configuración para n8n webhook (preparado para automatización)
 */
export const N8N_WEBHOOK_CONFIG = {
  // URL del webhook de n8n (se configurará cuando se implemente)
  url: process.env.N8N_WEBHOOK_URL || '',
  // Eventos disponibles
  events: {
    NEW_LEAD: 'lead.created',
    PROPERTY_INTEREST: 'property.interest',
    SERVICE_REQUEST: 'service.request',
    CONTACT_FORM: 'contact.form',
  }
}

/**
 * Envía datos a n8n webhook (preparado para futuro)
 */
export async function sendToN8N(
  event: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const webhookUrl = N8N_WEBHOOK_CONFIG.url

    if (!webhookUrl) {
      console.log('n8n webhook not configured, skipping...')
      return false
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Error sending to n8n:', error)
    return false
  }
}