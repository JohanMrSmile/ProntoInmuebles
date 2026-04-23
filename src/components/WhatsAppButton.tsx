'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Phone, ChevronRight } from 'lucide-react'
import { getWhatsAppLink, siteConfig } from '@/lib/config'
import { trackCTA, trackPhoneClick, trackWhatsAppLead } from '@/lib/analytics'
import { getUTMSummary } from '@/lib/utm'
import { trackWhatsApp, submitLead } from '@/lib/tracker'

const QUICK_MSGS = [
  'Quiero comprar una propiedad',
  'Necesito arrendar un apartamento',
  'Quiero un avalúo de mi inmueble',
]

export default function WhatsAppButton() {
  const [open,    setOpen]    = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(t)
  }, [])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const buildWaUrl = useCallback((msg: string) => {
    const utmInfo = getUTMSummary()
    return getWhatsAppLink(msg + utmInfo)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">

      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="bg-white/95 backdrop-blur-md rounded-card-xl border border-white/70 w-[320px] overflow-hidden"
            style={{ boxShadow: '0 24px 70px -18px rgba(15,23,42,0.28), 0 10px 24px -10px rgba(15,23,42,0.10)' }}
            role="dialog"
            aria-label="Chat de WhatsApp"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-primary-800 via-primary-700 to-secondary-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 ring-1 ring-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm font-sans">Pronto Inmuebles</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                    <span className="text-[11px] text-white/70 font-sans">Responde en minutos</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors p-1 rounded" aria-label="Cerrar chat">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat bubble */}
            <div className="px-4 pt-4 pb-2">
              <div className="bg-gradient-to-br from-primary-50 to-warm-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 inline-block max-w-[85%] border border-primary-100/80 shadow-soft">
                <p className="text-sm text-slate-800 font-sans leading-relaxed">
                  👋 ¡Hola! ¿En qué podemos ayudarte hoy?
                </p>
                <p className="text-[10px] text-slate-400 font-sans text-right mt-1">Ahora ✓✓</p>
              </div>
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-4 flex flex-col gap-1.5">
              {QUICK_MSGS.map(msg => (
                <a
                  key={msg}
                  href={buildWaUrl(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    submitLead({ name: 'WhatsApp Quick Reply', phone: '0000000000', service: msg })
                    trackWhatsAppLead(`Floating Widget Quick Reply: ${msg}`)
                    trackWhatsApp(`Quick Reply: ${msg}`)
                    setOpen(false)
                  }}
                  className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-card bg-white border border-neutral-200/80 hover:border-primary-200 hover:bg-primary-50/60 hover:shadow-soft transition-all duration-200 text-left"
                >
                  <span className="text-xs font-medium text-slate-700 font-sans group-hover:text-primary-700 leading-snug">{msg}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-500 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t border-neutral-100 px-4 py-3 flex gap-2 bg-slate-50/70">
              <a
                href={buildWaUrl('Hola, me interesa una propiedad')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  submitLead({ name: 'WhatsApp Widget', phone: '0000000000', service: 'floating_widget' })
                  trackWhatsAppLead('Floating Widget Main CTA')
                  trackWhatsApp('Floating Widget Main CTA')
                  setOpen(false)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-card bg-gradient-to-r from-secondary-500 to-primary-600 hover:from-secondary-600 hover:to-primary-700 text-white text-xs font-bold font-sans transition-all duration-200 shadow-green"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                onClick={() => trackPhoneClick('Floating Widget')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-card border border-neutral-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold font-sans transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-primary-500" />
                Llamar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => {
          trackCTA('toggle_whatsapp_widget', 'Floating Widget')
          setOpen(v => !v)
        }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-secondary-500 to-primary-600 hover:from-secondary-600 hover:to-primary-700 flex items-center justify-center text-white transition-all duration-200"
        style={{ boxShadow: '0 8px 28px rgba(32,184,94,0.28), 0 4px 16px rgba(47,163,197,0.24)' }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26, delay: 0.15 }}
        aria-label="Contactar por WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.14 }}><X className="w-6 h-6" /></motion.span>
            : <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.14 }}><MessageCircle className="w-6 h-6" /></motion.span>
          }
        </AnimatePresence>

        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-secondary-400 animate-ping opacity-25" />
        )}
      </motion.button>
    </div>
  )
}
