'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Send, CheckCircle2, Shield, MessageCircle } from 'lucide-react'
import { getWhatsAppLink, siteConfig } from '@/lib/config'

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Teléfono / WhatsApp',
    tag: 'Atención inmediata',
    getValue: (c: typeof siteConfig.contact) => c.phone,
    getHref: (c: typeof siteConfig.contact) => `tel:${c.phone}`,
  },
  {
    icon: Mail,
    label: 'Correo Electrónico',
    tag: 'Consultas formales',
    getValue: (c: typeof siteConfig.contact) => c.email,
    getHref: (c: typeof siteConfig.contact) => `mailto:${c.email}`,
  },
  {
    icon: MapPin,
    label: 'Oficina Principal',
    tag: 'Visítanos',
    getValue: (c: typeof siteConfig.contact) => c.address,
    getHref: () => '#',
  },
]

export default function ContactoContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess,    setIsSuccess]    = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const service = String(formData.get('service') || '').trim()
    const message = String(formData.get('message') || '').trim()

    const whatsappMessage = [
      'Hola, acabo de completar el formulario de contacto.',
      '',
      `Nombre: ${name}`,
      email ? `Correo: ${email}` : '',
      phone ? `Teléfono: ${phone}` : '',
      service ? `Servicio de interés: ${service}` : '',
      message ? `Mensaje: ${message}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    window.open(getWhatsAppLink(whatsappMessage), '_blank')
    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 5000)
    form.reset()
  }

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_28%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-blue-400/18 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-cyan-400/16 blur-3xl pointer-events-none" />

      {/* ── Page header ── */}
      <div className="bg-white/55 backdrop-blur-sm border-b border-cyan-200/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="eyebrow-blue mb-5">
              <MessageCircle className="w-3 h-3" />
              Contacto
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.05] mt-4 mb-5">
              Estamos para{' '}
              <span className="text-gradient-brand">ayudarte</span>
            </h1>
            <p className="text-slate-500 font-sans text-lg leading-relaxed">
              Respondemos a todas las consultas en menos de 2 horas hábiles. Elige el canal que prefieras.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-3">
              {CONTACT_ITEMS.map(item => {
                const href    = item.getHref(siteConfig.contact)
                const display = item.getValue(siteConfig.contact)
                return (
                  <a
                    key={item.label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-5 p-5 bg-white rounded-card-lg border border-neutral-200 hover:border-primary-200 hover:shadow-card transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-card bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-200">
                      <item.icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] font-sans mb-0.5">{item.tag}</p>
                      <p className="font-sans font-semibold text-slate-900 text-sm truncate">{display}</p>
                      <p className="font-sans text-xs text-slate-400 mt-0.5">{item.label}</p>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* WhatsApp shortcut */}
            <a
              href={getWhatsAppLink('Hola, quiero una asesoría personalizada')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp py-4 text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir por WhatsApp ahora
            </a>

            {/* Privacy card */}
            <div className="flex items-start gap-4 p-5 rounded-card-lg bg-slate-900 text-white">
              <div className="w-10 h-10 rounded-card bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-5 h-5 text-secondary-400" />
              </div>
              <div>
                <p className="font-sans font-semibold text-sm text-white mb-1">Privacidad garantizada</p>
                <p className="font-sans text-xs text-white/55 leading-relaxed">
                  Tus datos están protegidos bajo estrictas normas de seguridad y confidencialidad. No compartimos tu información.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="rounded-card-xl overflow-hidden border border-white/70 bg-white/90 backdrop-blur-sm" style={{ boxShadow: '0 24px 64px -12px rgba(15,23,42,0.18), 0 4px 16px -4px rgba(15,23,42,0.08)' }}>

              {/* Gradient header strip */}
              <div className="relative px-8 pt-8 pb-7 overflow-hidden" style={{ background: 'linear-gradient(135deg, #131218 0%, #17536B 38%, #2FA3C5 72%, #C9A25A 100%)' }}>
                <div className="absolute inset-0 bg-noise opacity-40" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/8 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-6 w-32 h-32 bg-secondary-400/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-secondary-400" />
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.15em] font-sans">Formulario de contacto</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-1">
                    ¿Cómo podemos<br />ayudarte hoy?
                  </h3>
                  <p className="font-sans text-white/65 text-sm">Respuesta garantizada en menos de 2 horas.</p>
                </div>
              </div>

              {/* Form body */}
              <div className="bg-white/95">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -12 }}
                      onSubmit={handleSubmit}
                      className="p-8 flex flex-col gap-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="c-name" className="form-label">Nombre completo *</label>
                          <input id="c-name" name="name" type="text" required placeholder="Ej. Juan Pérez" className="form-input bg-slate-50/80 border-neutral-200 focus:bg-white shadow-inner" />
                        </div>
                        <div>
                          <label htmlFor="c-email" className="form-label">Correo electrónico *</label>
                          <input id="c-email" name="email" type="email" required placeholder="juan@ejemplo.com" className="form-input bg-slate-50/80 border-neutral-200 focus:bg-white shadow-inner" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="c-phone" className="form-label">Teléfono / WhatsApp</label>
                        <input id="c-phone" name="phone" type="tel" placeholder="+57 300 000 0000" className="form-input bg-slate-50/80 border-neutral-200 focus:bg-white shadow-inner" />
                      </div>

                      <div>
                        <label htmlFor="c-service" className="form-label">Servicio de interés</label>
                        <select id="c-service" name="service" className="form-input text-slate-700 bg-slate-50/80 border-neutral-200 focus:bg-white shadow-inner">
                          <option value="">Selecciona una opción</option>
                          <option value="compra">Compra de inmueble</option>
                          <option value="venta">Venta de inmueble</option>
                          <option value="arriendo">Arriendo</option>
                          <option value="avaluo">Avalúo certificado</option>
                          <option value="remodelacion">Remodelación / Diseño</option>
                          <option value="otro">Otro servicio</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="c-message" className="form-label">Mensaje *</label>
                        <textarea
                          id="c-message"
                          name="message"
                          rows={3}
                          required
                          placeholder="¿En qué podemos ayudarte hoy?"
                          className="form-input resize-none bg-slate-50/80 border-neutral-200 focus:bg-white shadow-inner"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-card font-sans font-bold text-sm text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #131218 0%, #17536B 40%, #2FA3C5 72%, #20B85E 100%)', boxShadow: '0 12px 32px -8px rgba(47,163,197,0.42)' }}
                      >
                        {isSubmitting ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar mensaje ahora
                          </>
                        )}
                      </button>

                      <p className="text-xs text-slate-400 font-sans text-center leading-relaxed">
                        Al enviar aceptas nuestra{' '}
                        <a href="/privacidad" className="text-primary-500 hover:text-primary-700 transition-colors">política de privacidad</a>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-10 flex flex-col items-center gap-6 text-center py-16"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-secondary-50 border-2 border-secondary-200 flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-secondary-500" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary-400 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">¡Mensaje recibido!</h3>
                        <p className="font-sans text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                          Un asesor se comunicará contigo en breve para brindarte una atención personalizada.
                        </p>
                      </div>
                      <button onClick={() => setIsSuccess(false)} className="btn-outline text-sm py-2.5 px-6">
                        Enviar otro mensaje
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
