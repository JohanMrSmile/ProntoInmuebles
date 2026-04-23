'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/config'
import { trackWhatsAppLead } from '@/lib/analytics'
import { getUTMSummary } from '@/lib/utm'

const TESTIMONIALS = [
  { name: 'María Fernanda López', role: 'Compradora · Bocagrande, Cartagena',    rating: 5, text: 'Increíble experiencia. El equipo de Pronto Inmuebles nos acompañó en cada paso y encontramos el apartamento perfecto frente al mar en menos de 3 semanas. Su conocimiento del mercado cartagenero es impresionante.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&fit=crop&crop=faces' },
  { name: 'Carlos Andrés Mejía',  role: 'Propietario · Manga, Cartagena',       rating: 5, text: 'Vendí mi propiedad al mejor precio del mercado gracias a la estrategia de marketing y la red de compradores que manejan. Profesionales de primera, sin duda volvería a trabajar con ellos.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&fit=crop&crop=faces' },
  { name: 'Diana Marcela Torres', role: 'Arrendataria · El Laguito, Cartagena', rating: 5, text: 'El proceso de arriendo fue súper transparente. Me explicaron todo, gestionaron el contrato y el apartamento con vista al mar superó todas mis expectativas. Responden súper rápido por WhatsApp.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop&crop=faces' },
  { name: 'Juan Pablo Vargas',    role: 'Empresa · Centro Histórico, Cartagena', rating: 5, text: 'Buscábamos una oficina en el casco histórico y en tiempo récord Pronto encontró la ubicación ideal para nuestra empresa. El seguimiento post-firma también fue excelente.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&fit=crop&crop=faces' },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return
    const id = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(id)
  }, [autoplay])

  const prev = () => { setAutoplay(false); setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length) }
  const next = () => { setAutoplay(false); setCurrent(c => (c + 1) % TESTIMONIALS.length) }
  const t = TESTIMONIALS[current]

  return (
    <section className="section relative overflow-hidden bg-charcoal-900" id="testimonios">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.05]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary-600/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 container-max">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="eyebrow-white mb-4">
            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
            Testimonios
          </span>
          <h2 className="section-title text-white text-4xl md:text-5xl mt-3">
            Lo que dicen{' '}
            <span className="text-gradient-gold">nuestros clientes</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-card-xl border border-white/10 p-8 md:p-12 flex flex-col gap-7 text-center"
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)' }}
            >
              <Quote className="w-9 h-9 text-gold-400/50 mx-auto" />

              <p className="text-white/85 text-xl md:text-2xl font-display font-medium leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/15 flex-shrink-0">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold font-sans text-sm">{t.name}</p>
                  <p className="text-white/60 font-sans text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-pill border border-white/15 text-white/60 hover:text-white hover:border-white/35 flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoplay(false); setCurrent(i) }}
                  className={`rounded-pill transition-all duration-300 ${i === current ? 'w-6 h-2 bg-gold-400' : 'w-2 h-2 bg-white/25 hover:bg-white/45'}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-pill border border-white/15 text-white/60 hover:text-white hover:border-white/35 flex items-center justify-center transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 mt-14 max-w-sm mx-auto text-center">
          {[
            { value: '1.2k+', label: 'Clientes felices' },
            { value: '4.9★',  label: 'Google Reviews'   },
            { value: '98%',   label: 'Satisfacción'     },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display font-bold text-2xl text-gold-400">{s.value}</p>
              <p className="text-white/55 text-xs font-sans mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA after social proof */}
        <div className="flex justify-center mt-10">
          <a
            href={getWhatsAppLink('Hola, quiero unirme a sus clientes satisfechos' + (typeof window !== 'undefined' ? getUTMSummary() : ''))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppLead('Testimonials Section')}
            className="btn-whatsapp px-8 py-3.5 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Únete a +1.200 clientes satisfechos
          </a>
        </div>

      </div>
    </section>
  )
}
