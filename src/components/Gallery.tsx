'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, MapPin, Expand, Images } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/config'
import { trackWhatsAppLead } from '@/lib/analytics'
import { getUTMSummary } from '@/lib/utm'

const CATEGORIES = ['Todos', 'Apartamentos', 'Casas', 'Oficinas', 'Remodelaciones']

const FALLBACK_PROJECTS = [
  { id: 1, title: 'Penthouse Bocagrande',          category: 'Apartamentos',   location: 'Bocagrande, Cartagena',       image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', wide: true  },
  { id: 2, title: 'Casa Colonial Centro Histórico', category: 'Casas',          location: 'Centro Histórico, Cartagena', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80', wide: false },
]

export default function Gallery({ initialProperties = [] }: { initialProperties?: any[] }) {
  const [active,   setActive]   = useState('Todos')
  const [lightbox, setLightbox] = useState<any | null>(null)

  const projects = initialProperties.length > 0 
    ? initialProperties.map((p, index) => ({
        id: p._id,
        title: p.title,
        category: p.propertyType || 'Apartamentos',
        location: p.address || 'Cartagena',
        image: p.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        wide: index === 0 || index === 4 // Hacer wide al primero y quinto para el masonry layout
      }))
    : FALLBACK_PROJECTS

  const filtered = active === 'Todos' ? projects : projects.filter(p => p.category === active)

  // Close lightbox with Escape key
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  return (
    <section className="section relative overflow-hidden bg-gradient-to-br from-primary-50/60 via-warm-100 to-secondary-50/40" id="galeria">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,163,197,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(32,184,94,0.08),transparent_30%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary-300/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-secondary-300/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 container-max">

        {/* Header */}
        <div className="text-center mb-10 max-w-xl mx-auto">
          <span className="eyebrow-blue mb-4">
            <Images className="w-3 h-3" />
            Galería
          </span>
          <h2 className="section-title text-4xl md:text-5xl mt-3 mb-4">
            Nuestros <span className="text-gradient-brand">proyectos</span>
          </h2>
          <p className="section-subtitle text-base">
            Resultados reales de propiedades e instalaciones que hablan por sí solos.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={active === cat ? 'filter-pill-active' : 'filter-pill-inactive'}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, delay: i * 0.04 }}
                className={`relative overflow-hidden rounded-card-lg cursor-pointer group ${project.wide ? 'sm:col-span-2' : ''}`}
                onClick={() => setLightbox(project)}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-display font-bold text-lg leading-snug">{project.title}</p>
                  <div className="flex items-center gap-1.5 text-white/70 text-xs font-sans mt-1">
                    <MapPin className="w-3 h-3" />{project.location}
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Expand className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="badge badge-dark bg-black/35 backdrop-blur-sm">{project.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative bg-white rounded-card-lg overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
              style={{ boxShadow: '0 32px 80px rgba(15,23,42,0.35)' }}
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-video flex-shrink-0">
                <Image src={lightbox.image} alt={lightbox.title} fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/65 rounded-card flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-2xl text-slate-900">{lightbox.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm font-sans mt-1">
                      <MapPin className="w-3.5 h-3.5" />{lightbox.location}
                    </div>
                  </div>
                  <span className="badge badge-primary shrink-0">{lightbox.category}</span>
                </div>
                <a
                  href={getWhatsAppLink(`Hola, me interesa el proyecto: ${lightbox.title} en ${lightbox.location}` + (typeof window !== 'undefined' ? getUTMSummary() : ''))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppLead('Gallery Lightbox', lightbox.id)}
                  className="btn-whatsapp py-3 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por este proyecto
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
