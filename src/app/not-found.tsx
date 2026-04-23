'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowRight, Phone, MapPin } from 'lucide-react'
import { siteConfig } from '@/lib/config'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="max-w-2xl w-full text-center">

          {/* 404 number */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8 inline-block"
          >
            <span
              className="font-display font-bold leading-none select-none"
              style={{
                fontSize: 'clamp(8rem, 20vw, 14rem)',
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 40%, #93C5FD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </span>
            {/* Glow behind number */}
            <div className="absolute inset-0 blur-3xl bg-primary-200/40 -z-10 scale-75" />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-center gap-5"
          >
            <span className="eyebrow-blue">
              <MapPin className="w-3 h-3" />
              Página no encontrada
            </span>

            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight">
              Esta dirección no existe<br />en nuestro catálogo
            </h1>

            <p className="font-sans text-slate-500 text-base leading-relaxed max-w-md">
              La página que buscas fue movida, eliminada o nunca existió. Te ayudamos a encontrar lo que necesitas.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <Link
                href="/"
                className="btn-primary px-7 py-3.5 text-sm"
              >
                <Home className="w-4 h-4" />
                Ir al inicio
              </Link>
              <Link
                href="/propiedades"
                className="btn-outline px-7 py-3.5 text-sm"
              >
                Ver propiedades
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-neutral-200 mt-4" />

            {/* Contact shortcut */}
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-2.5 text-slate-500 hover:text-primary-600 transition-colors group font-sans text-sm"
            >
              <div className="w-8 h-8 rounded-card bg-white border border-neutral-200 flex items-center justify-center group-hover:border-primary-200 group-hover:bg-primary-50 transition-all">
                <Phone className="w-3.5 h-3.5" />
              </div>
              ¿Necesitas ayuda? Llámanos: <span className="font-semibold text-slate-700">{siteConfig.contact.phone}</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-neutral-200 bg-white py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-display font-bold text-primary-700 text-sm">Pronto Inmuebles</span>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-sans">
            <Link href="/servicios" className="hover:text-slate-600 transition-colors">Servicios</Link>
            <Link href="/nosotros"  className="hover:text-slate-600 transition-colors">Nosotros</Link>
            <Link href="/contacto"  className="hover:text-slate-600 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
