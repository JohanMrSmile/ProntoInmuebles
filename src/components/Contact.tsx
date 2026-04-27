'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, Loader2, Phone, Mail, MapPin, MessageCircle, Zap, Shield, Sparkles, Clock, Home } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { trackFormSubmit, trackPhoneClick, trackWhatsAppLead, trackCTA } from '@/lib/analytics'
import { track, submitLead, trackWhatsApp } from '@/lib/tracker'
import { trackWhatsAppClick } from '@/lib/tracking'
import { getUTMSummary } from '@/lib/utm'

const schema = z.object({
  name:    z.string().min(2, 'Nombre requerido'),
  phone:   z.string().min(7, 'Teléfono requerido'),
  service: z.string().min(1, 'Selecciona un servicio'),
  email:   z.string().email('Email inválido').optional().or(z.literal('')),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const SERVICES = ['Comprar propiedad', 'Arrendar propiedad', 'Avalúo', 'Servicios del hogar', 'Otro']

const BENEFITS = [
  { icon: Zap, text: 'Respuesta en menos de 2 horas' },
  { icon: Shield, text: 'Sin compromiso ni presión' },
  { icon: Sparkles, text: 'Asesoría personalizada gratis' },
]

const SERVICE_CARDS = [
  { value: 'Comprar propiedad', label: 'Comprar propiedad', description: 'Casa, apartamento, lote', icon: '🏠', featured: true },
  { value: 'Arrendar propiedad', label: 'Arrendar', description: 'Propiedades en arriendo', icon: '🔑' },
  { value: 'Avalúo', label: 'Avalúo', description: 'Conocer valor de mi propiedad', icon: '📊' },
  { value: 'Servicios del hogar', label: 'Blackout / Mallas', description: 'Servicios para el hogar', icon: '🛡️' },
  { value: 'Paquete completo', label: 'Paquete completo', description: 'Combina servicios y ahorra', icon: '✨', featured: true },
  { value: 'Otro', label: 'Otro', description: 'Cuéntanos qué necesitas', icon: '💬' },
]

const CONTACT_ITEMS = [
  { icon: Phone,         label: 'Teléfono',  getHref: (c: typeof siteConfig.contact) => `tel:${c.phone}`,              getValue: (c: typeof siteConfig.contact) => c.phone   },
  { icon: MessageCircle, label: 'WhatsApp',  getHref: () => buildWhatsAppLink({ message: 'Hola, quiero información sobre sus servicios.', context: 'lead_capture', metadata: { origen: 'contact_items' } }), getValue: () => 'Escríbenos ahora' },
  { icon: Mail,          label: 'Email',     getHref: (c: typeof siteConfig.contact) => `mailto:${c.email}`,           getValue: (c: typeof siteConfig.contact) => c.email   },
  { icon: MapPin,        label: 'Dirección', getHref: () => '#',                                                       getValue: (c: typeof siteConfig.contact) => c.address },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const selectedService = watch('service')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // 1. Submit lead to /api/lead (async, with UTM attribution)
      submitLead({
        name:    data.name,
        phone:   data.phone,
        email:   data.email,
        service: data.service,
        message: data.message,
      }).catch(() => { /* silent */ })

      // 2. Track form submission (server-side + GA)
      track('form_submit', { metadata: { form: 'contact', service: data.service } })
      trackFormSubmit('contact_form', 'success')

      // 3. Build WhatsApp message with UTM info
      const utmInfo = getUTMSummary()
      const message = [
        'Hola, acabo de completar el formulario de contacto.',
        '',
        `Nombre: ${data.name}`,
        `Teléfono: ${data.phone}`,
        `Servicio de interés: ${data.service}`,
        data.email ? `Email: ${data.email}` : '',
        data.message ? `Mensaje: ${data.message}` : '',
        utmInfo,
      ]
        .filter(Boolean)
        .join('\n')

      const waUrl = buildWhatsAppLink({
        message,
        context: 'lead_capture',
        metadata: { origen: 'contact_form', servicio: data.service }
      })

      // 4. Track WhatsApp click (server-side)
      trackWhatsApp('Contact Form Submit')
      trackWhatsAppLead('Contact Form Submit')
      trackWhatsAppClick({
        context: 'lead_capture',
        location: 'cta_section',
        label: 'Contact Form Submit',
        metadata: { servicio: data.service }
      })

      // 5. Redirect to WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer')

      setSubmitted(true)
      reset()
    } catch {
      trackFormSubmit('contact_form', 'error')
      alert('Error al enviar. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-warm-100 via-warm-200 to-primary-50/30 py-24" id="contacto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,163,197,0.10),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(32,184,94,0.08),transparent_30%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-primary-300/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary-300/8 blur-3xl pointer-events-none" />
      <div className="relative z-10 container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary-200/50 shadow-sm">
            Escríbenos Directamente
          </span>
          <h2 className="font-display font-bold text-slate-900 text-4xl md:text-6xl tracking-tight mb-6">
            ¿Cómo podemos <span className="text-primary-600 italic">ayudarte?</span>
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Estamos a un solo mensaje de distancia. Elige lo que necesitas y un experto senior te atenderá.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {BENEFITS.map(benefit => (
              <div key={benefit.text} className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <benefit.icon className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{benefit.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            {submitted ? (
              <div className="bg-white/92 backdrop-blur-sm rounded-[2rem] p-10 md:p-12 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] border border-white/70 flex flex-col items-center gap-5 text-center">
                <div className="w-20 h-20 rounded-[1.75rem] bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-3xl text-slate-900 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-slate-500 font-sans text-sm leading-relaxed max-w-sm">
                    Te redirigimos a WhatsApp para darte una atención inmediata y personalizada.
                  </p>
                </div>
                <button onClick={() => setSubmitted(false)} className="btn-outline text-sm py-2.5 px-6">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white/92 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] border border-white/70 flex flex-col gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <input type="hidden" {...register('service')} />

                <div className="relative z-10">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">
                    1. Especialidad requerida
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SERVICE_CARDS.map(card => (
                      <button
                        key={`${card.label}-${card.description}`}
                        type="button"
                        onClick={() => setValue('service', card.value, { shouldValidate: true })}
                        className={`group relative p-5 rounded-[1.75rem] border-2 transition-all duration-300 min-h-[148px] flex flex-col items-center justify-center text-center ${selectedService === card.value ? 'border-primary-500 bg-primary-50 shadow-sm scale-[1.02]' : 'border-neutral-100 bg-white/90 hover:bg-primary-50/70 hover:border-primary-200 hover:shadow-sm'}`}
                      >
                        {card.featured ? (
                          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[8px] font-bold rounded-full tracking-[0.15em] shadow-lg transition-all duration-300 ${selectedService === card.value ? 'bg-amber-400 text-white opacity-100' : 'bg-amber-400 text-white opacity-0 group-hover:opacity-100'}`}>
                            CONFIANZA
                          </span>
                        ) : null}
                        <div className={`text-3xl mb-4 transition-all duration-300 ${selectedService === card.value ? '' : 'grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100'}`}>{card.icon}</div>
                        <div className={`font-display font-bold text-sm mb-1 leading-tight transition-colors duration-300 ${selectedService === card.value ? 'text-primary-700' : 'text-slate-900 group-hover:text-primary-700'}`}>{card.label}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest text-center px-2 transition-colors duration-300 ${selectedService === card.value ? 'text-primary-500' : 'text-neutral-400 group-hover:text-primary-500'}`}>{card.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.service && <p className="mt-4 text-xs text-red-500 font-bold uppercase tracking-wider">{errors.service.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-2">
                      Nombre completo
                    </label>
                    <input {...register('name')} type="text" placeholder="Ej: Alejandro Silva" className="w-full px-6 py-5 rounded-[1.5rem] bg-neutral-50/80 border-2 border-neutral-100 transition-all duration-300 focus:bg-white focus:outline-none focus:border-primary-500 focus:shadow-sm shadow-inner" />
                    {errors.name && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-wider ml-4">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-2">
                      WhatsApp / contacto
                    </label>
                    <input {...register('phone')} type="tel" placeholder="+57 3..." className="w-full px-6 py-5 rounded-[1.5rem] bg-neutral-50/80 border-2 border-neutral-100 transition-all duration-300 focus:bg-white focus:outline-none focus:border-primary-500 focus:shadow-sm shadow-inner" />
                    {errors.phone && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-wider ml-4">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-2">
                      Correo electrónico
                    </label>
                    <input {...register('email')} type="email" placeholder="tu@email.com" className="w-full px-6 py-5 rounded-[1.5rem] bg-neutral-50/80 border-2 border-neutral-100 transition-all duration-300 focus:bg-white focus:outline-none focus:border-primary-500 focus:shadow-sm shadow-inner" />
                    {errors.email && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-wider ml-4">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-2">
                      Servicio seleccionado
                    </label>
                    <div className="w-full px-6 py-5 rounded-[1.5rem] bg-neutral-50/80 border-2 border-neutral-100 text-sm font-medium text-slate-700 min-h-[64px] flex items-center shadow-inner">
                      {selectedService || 'Selecciona una especialidad arriba'}
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-2">
                    Cuéntanos qué necesitas
                  </label>
                  <textarea {...register('message')} rows={4} placeholder="Describe tu necesidad y te contactamos por WhatsApp." className="w-full px-6 py-5 rounded-[1.5rem] bg-neutral-50/80 border-2 border-neutral-100 transition-all duration-300 focus:bg-white focus:outline-none focus:border-primary-500 focus:shadow-sm resize-none shadow-inner" />
                </div>

                <button type="submit" disabled={loading} className="w-full relative py-6 rounded-[1.5rem] text-white font-bold text-sm tracking-widest uppercase transition-all duration-500 shadow-[0_18px_40px_-12px_rgba(47,163,197,0.45)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 overflow-hidden group" style={{ background: 'linear-gradient(135deg, #131218 0%, #17536B 42%, #2FA3C5 74%, #20B85E 100%)' }}>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <div className="relative flex items-center justify-center gap-4">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        <span>Solicitar atención inmediata</span>
                      </>
                    )}
                  </div>
                </button>

                <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-[0.1em] relative z-10">
                  Privacidad garantizada • Sin compromisos • <a href="/privacidad" className="text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-primary-200">Política de privacidad</a>
                </p>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col gap-6 h-full"
          >
            <a
              href={buildWhatsAppLink({
                message: 'Hola, quiero información sobre sus servicios.',
                context: 'lead_capture',
                metadata: { origen: 'contact_side_card' }
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppLead('Contact Section Side Card')
                trackWhatsAppClick({
                  context: 'lead_capture',
                  location: 'cta_section',
                  label: 'Side Card WhatsApp'
                })
              }}
              className="bg-white p-6 rounded-[1.75rem] hover:shadow-lg transition-all duration-300 group border-l-4 border-l-[#25D366]"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] transition-colors duration-300">
                  <MessageCircle className="w-7 h-7 text-[#25D366] group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">WhatsApp oficial</div>
                  <div className="font-display font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors tracking-tight">{siteConfig.contact.phone}</div>
                </div>
              </div>
            </a>

            <a
              href={`tel:${siteConfig.contact.phone}`}
              onClick={() => trackPhoneClick('Contact Section Side Card')}
              className="bg-white p-6 rounded-[1.75rem] hover:shadow-lg transition-all duration-300 group border-l-4 border-l-primary-500"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                  <Phone className="w-7 h-7 text-primary-500 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Línea de atención</div>
                  <div className="font-display font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors tracking-tight">{siteConfig.contact.phone}</div>
                </div>
              </div>
            </a>

            <div className="bg-neutral-900 p-8 rounded-[1.75rem] flex-grow border border-white/5 relative overflow-hidden shadow-[0_24px_70px_-24px_rgba(15,23,42,0.5)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
              <h3 className="text-white font-display font-bold text-xl mb-8 relative z-10">Oficinas Centrales</h3>

              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-amber-400 mt-1" />
                  <div>
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Disponibilidad</div>
                    <div className="text-white text-sm font-medium">Lun - Sáb: 8:00 AM - 6:00 PM</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-amber-400 mt-1" />
                  <div>
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Visítanos</div>
                    <div className="text-white text-sm font-medium leading-relaxed">{siteConfig.contact.address}<br /><span className="text-white/40 text-[10px] uppercase tracking-widest">Cartagena, Colombia</span></div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-amber-400 mt-1" />
                  <div>
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Correo</div>
                    <div className="text-white text-sm font-medium leading-relaxed break-all">{siteConfig.contact.email}</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <div className="text-amber-400 font-display font-bold text-2xl">4.9★</div>
                  <div className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">Rating Google</div>
                </div>
                <div>
                  <div className="text-primary-400 font-display font-bold text-2xl">100%</div>
                  <div className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">Verificado</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {CONTACT_ITEMS.filter(item => item.label === 'Email' || item.label === 'Dirección').map(item => {
                const href = item.getHref(siteConfig.contact)
                const display = item.getValue(siteConfig.contact)
                return (
                  <a
                    key={item.label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={() => {
                      if (item.label === 'Email') trackCTA('email_click', 'Contact Section Extra Card')
                    }}
                    className="group flex items-center gap-4 p-4 rounded-[1.5rem] border border-neutral-200 hover:border-primary-200 hover:bg-white bg-white/80 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-200">
                      <item.icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] font-sans">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-800 font-sans mt-0.5">{display}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
