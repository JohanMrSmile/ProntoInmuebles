'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Phone, MapPin, Mail, Instagram, Facebook } from 'lucide-react'
import { getWhatsAppLink, siteConfig } from '@/lib/config'

const NAV_COLS = [
  {
    title: 'Inmobiliaria',
    links: [
      { label: 'Propiedades en Venta', href: '/propiedades?tipo=Venta' },
      { label: 'Propiedades en Arriendo', href: '/propiedades?tipo=Arriendo' },
      { label: 'Avalúos', href: '/servicios/avaluos' },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { label: 'Cortinas Blackout', href: '/servicios' },
      { label: 'Mallas de Seguridad', href: '/servicios' },
      { label: 'Vidrios y Espejos', href: '/servicios' },
      { label: 'Aires Acondicionados', href: '/servicios' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
]

const SOCIAL = [
  { icon: Facebook,  href: siteConfig.social.facebook,  label: 'Facebook'  },
  { icon: Instagram, href: siteConfig.social.instagram, label: 'Instagram' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-charcoal-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,163,197,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(32,184,94,0.10),transparent_24%),radial-gradient(circle_at_bottom_center,rgba(201,162,90,0.10),transparent_28%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-8 relative z-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-white/8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="w-10 h-10 relative rounded-full">
                <div className="absolute inset-0 rounded-full bg-primary-400/20 blur-md scale-110 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                <Image src="/logo.png" alt={siteConfig.name} fill className="object-contain" sizes="40px" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg leading-none">Pronto</p>
                <p className="text-[9px] font-bold text-white/45 uppercase tracking-[0.18em] font-sans">Inmuebles</p>
              </div>
            </Link>

            <p className="text-white/70 text-sm font-sans leading-relaxed max-w-[220px]">
              Inmobiliaria y servicios para el hogar en Colombia. Tu aliado integral de confianza.
            </p>

            <div className="flex items-center gap-2">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-card bg-white/6 hover:bg-primary-600/90 border border-white/8 hover:border-primary-400/50 flex items-center justify-center text-white/55 hover:text-white transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-card bg-white/6 hover:bg-secondary-500 border border-white/8 hover:border-secondary-400/50 flex items-center justify-center text-white/55 hover:text-white transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.title} className="flex flex-col gap-4">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] font-sans">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-primary-300 font-sans transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-6 border-b border-white/8">
          <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-2 text-white/68 hover:text-white text-xs font-sans transition-colors">
            <Phone className="w-3.5 h-3.5 text-primary-300" />{siteConfig.contact.phone}
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 text-white/68 hover:text-white text-xs font-sans transition-colors">
            <Mail className="w-3.5 h-3.5 text-primary-300" />{siteConfig.contact.email}
          </a>
          <span className="flex items-center gap-2 text-white/55 text-xs font-sans">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />{siteConfig.contact.address}
          </span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-white/45 text-xs font-sans">
            &copy; {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacidad" className="text-white/45 hover:text-primary-300 text-xs font-sans transition-colors">Privacidad</Link>
            <Link href="/terminos"   className="text-white/45 hover:text-primary-300 text-xs font-sans transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
