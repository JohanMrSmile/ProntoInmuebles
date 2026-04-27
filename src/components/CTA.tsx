'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Calendar, Check, Phone, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { trackCTA, trackPhoneClick, trackWhatsAppLead, trackLeadCapture } from '@/lib/analytics'
import { trackWhatsAppClick } from '@/lib/tracking'
import { getUTMSummary } from '@/lib/utm'

const BENEFITS = [
  'Asesoría legal sin costo adicional',
  'Respuesta en menos de 2 horas',
  'Sin comisiones ocultas',
  'Acompañamiento integral hasta el cierre',
]

export default function CTA() {
  const [waUrl, setWaUrl] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const serviceRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    setWaUrl(buildWhatsAppLink({
      message: 'Hola, quiero agendar una asesoría gratuita',
      context: 'lead_capture',
      metadata: { origen: 'cta_section' }
    }))
  }, [])

  const handleQuickSubmit = () => {
    const name = nameRef.current?.value?.trim()
    const phone = phoneRef.current?.value?.trim()
    const service = serviceRef.current?.value

    if (!name || !phone) {
      // Focus en el primer campo vacío
      if (!name) nameRef.current?.focus()
      else phoneRef.current?.focus()
      return
    }

    setSending(true)

    const utmInfo = getUTMSummary()
    const message = [
      '📋 *Consulta Rápida — Pronto Inmuebles*',
      '',
      `👤 Nombre: ${name}`,
      `📱 Teléfono: ${phone}`,
      `🏠 Servicio: ${service || 'No seleccionado'}`,
      utmInfo,
    ].filter(Boolean).join('\n')

    trackLeadCapture('CTA Quick Form', service || 'general')
    trackWhatsAppLead('CTA Section Quick Form')

    setTimeout(() => {
      setSending(false)
      setSent(true)
      const waLink = buildWhatsAppLink({
        message,
        context: 'lead_capture',
        metadata: { origen: 'cta_form', servicio: service || 'general' }
      })
      trackWhatsAppClick({
        context: 'lead_capture',
        location: 'cta_section',
        label: 'Quick Form Submit',
        metadata: { origen: 'cta_form', servicio: service || 'general' }
      })
      window.open(waLink, '_blank')
      // Reset después de 3 segundos
      setTimeout(() => setSent(false), 3000)
    }, 600)
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-28" id="cta">
      {/* Gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #131218 0%, #17536B 38%, #2FA3C5 72%, #C9A25A 100%)' }} />
      <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: 'radial-gradient(circle, rgba(201,162,90,0.26) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-7"
          >
            <span className="eyebrow-white">
              <Sparkles className="w-3 h-3" />
              Asesoría Gratuita
            </span>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-white leading-[1.07]">
              ¿Listo para tu
              <br />
              próximo paso?
            </h2>

            <p className="text-white/70 font-sans text-base leading-relaxed max-w-md">
              Agenda una consulta sin costo con nuestros expertos. Te acompañamos desde el primer contacto hasta el cierre.
            </p>

            <ul className="flex flex-col gap-3">
              {BENEFITS.map(b => (
                <li key={b} className="flex items-center gap-3 text-white/82 text-sm font-sans">
                  <div className="w-5 h-5 rounded-full bg-secondary-400/20 border border-secondary-300/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-secondary-300" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-1">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackWhatsAppLead('CTA Section')
                    trackWhatsAppClick({
                      context: 'lead_capture',
                      location: 'cta_section',
                      label: 'Escribir por WhatsApp'
                    })
                  }}
                  className="btn-whatsapp px-6 py-3.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escribir por WhatsApp
                </a>
              )}
              <a
                href={siteConfig.contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA('agendar_videollamada', 'CTA Section')}
                className="btn-outline-white px-6 py-3.5"
              >
                <Calendar className="w-4 h-4" />
                Agendar videollamada
              </a>
            </div>

            <a
              href={`tel:${siteConfig.contact.phone}`}
              onClick={() => trackPhoneClick('CTA Section')}
              className="inline-flex items-center gap-2 text-white/55 hover:text-white/85 text-sm font-sans transition-colors duration-200 w-fit"
            >
              <Phone className="w-3.5 h-3.5" />
              {siteConfig.contact.phone}
            </a>
          </motion.div>

          {/* Right — quick contact card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="bg-white rounded-card-xl p-7 md:p-9 flex flex-col gap-6" style={{ boxShadow: '0 32px 80px rgba(15,23,42,0.28)' }}>
              <div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-1.5">Contáctanos ahora</h3>
                <p className="text-sm text-slate-500 font-sans">Respondemos en menos de 2 horas hábiles</p>
              </div>

              {sent ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <Check className="w-8 h-8 text-secondary-500" />
                  </div>
                  <p className="font-display font-bold text-xl text-slate-900">¡Te redirigimos a WhatsApp!</p>
                  <p className="text-sm text-slate-500 font-sans">Un asesor te atenderá en minutos.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="cta-name" className="form-label">Nombre completo</label>
                    <input
                      ref={nameRef}
                      id="cta-name"
                      type="text"
                      placeholder="Tu nombre"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-phone" className="form-label">Teléfono / WhatsApp</label>
                    <input
                      ref={phoneRef}
                      id="cta-phone"
                      type="tel"
                      placeholder="+57 300 000 0000"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-service" className="form-label">¿Qué necesitas?</label>
                    <select ref={serviceRef} id="cta-service" className="form-input text-slate-700">
                      <option value="">Selecciona un servicio</option>
                      <option>Comprar propiedad</option>
                      <option>Arrendar propiedad</option>
                      <option>Avalúo certificado</option>
                      <option>Servicios del hogar</option>
                    </select>
                  </div>
                </div>
              )}

              {!sent && (
                <button
                  className="btn-primary w-full py-3.5"
                  onClick={handleQuickSubmit}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Enviar consulta
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
              <p className="text-xs text-slate-400 font-sans text-center">
                Al enviar aceptas nuestra <a href="/privacidad" className="text-primary-500 hover:underline">política de privacidad</a>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
