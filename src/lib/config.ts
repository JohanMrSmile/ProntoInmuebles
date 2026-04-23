/**
 * Configuración del sitio
 * Centraliza toda la información de contacto y configuración
 */

export const siteConfig = {
  name: 'Pronto Inmuebles',
  description: 'Inmobiliaria y Servicios para el Hogar',
  url: 'https://prontoinmuebles.com',
  ogImage: '/og-image.jpg',

  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || '+57 300 123 4567',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '573001234567',
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || '573001234567').replace('+', '')}`,
    email: process.env.NEXT_PUBLIC_EMAIL || 'info@prontoinmuebles.com',
    address: process.env.NEXT_PUBLIC_ADDRESS || 'Centro Comercial Plaza Mayor, Local 234',
    calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/prontoinmuebles/asesoria',
  },

  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || 'https://facebook.com/prontoinmuebles',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || 'https://instagram.com/prontoinmuebles',
    tiktok: process.env.NEXT_PUBLIC_TIKTOK || 'https://tiktok.com/@prontoinmuebles',
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  },

  navigation: {
    main: [
      { name: 'Inicio', href: '/' },
      { name: 'Propiedades', href: '/propiedades' },
      { name: 'Servicios', href: '/servicios' },
      { name: 'Contacto', href: '#contacto' },
    ],
  },

  services: {
    inmobiliaria: [
      { name: 'Venta de apartamentos', href: '/propiedades', icon: 'apartment' },
      { name: 'Venta de casas', href: '/propiedades', icon: 'house' },
      { name: 'Lotes y fincas', href: '/propiedades', icon: 'land' },
      { name: 'Arriendos', href: '/propiedades', icon: 'key' },
      { name: 'Avalúos', href: '/servicios', icon: 'document' },
    ],
    hogar: [
      { name: 'Blackout', href: '/servicios', icon: 'blinds' },
      { name: 'Mallas de seguridad', href: '/servicios', icon: 'shield' },
      { name: 'Vidrios templados', href: '/servicios', icon: 'glass' },
      { name: 'Aires acondicionados', href: '/servicios', icon: 'air' },
    ],
  },

  packages: [
    {
      id: 'kit-hogar-seguro',
      name: 'Kit Hogar Seguro',
      price: 850000,
      priceText: 'Desde $850.000',
      description: 'Mallas de seguridad + Blackout',
      features: ['Mallas para balcones', 'Cortinas blackout (hasta 3 ventanas)', 'Instalación incluida'],
      popular: false,
    },
    {
      id: 'paquete-apartamento-nuevo',
      name: 'Paquete Apartamento Nuevo',
      price: 1500000,
      priceText: 'Desde $1.500.000',
      description: 'Todo listo para estrenar',
      features: ['Blackout completo', 'Mallas de seguridad', 'Vidrios templados en baños', 'Asesoría de decoración'],
      popular: true,
    },
    {
      id: 'solucion-airbnb',
      name: 'Solución Airbnb Lista',
      price: 2200000,
      priceText: 'Desde $2.200.000',
      description: 'Propiedad lista para rentar',
      features: ['Blackout premium', 'Mallas certificadas', 'Vidrios templados', 'Aire acondicionado', 'Mantenimiento mensual'],
      popular: false,
    },
  ],
}

/**
 * Formatea precio en moneda colombiana
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formatea área en metros cuadrados
 */
export function formatArea(area: number): string {
  return `${area} m²`
}

/**
 * Genera enlace de WhatsApp
 */
export function getWhatsAppLink(message?: string): string {
  const baseUrl = siteConfig.contact.whatsappUrl
  if (!message) return baseUrl

  const url = new URL(baseUrl)
  url.searchParams.set('text', message)
  return url.toString()
}