'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Key, BarChart3, Blinds, Grid2x2, Layers, Wind,
  ArrowRight, Check, Sparkles, Building2, Wrench
} from 'lucide-react'

const INMOBILIARIA = [
  {
    icon: Home,
    label: 'Venta de Propiedades',
    description: 'Estrategia de marketing profesional para encontrar el comprador ideal al mejor precio.',
    color: 'blue',
    href: '/propiedades?tipo=Venta',
    tag: 'Popular',
  },
  {
    icon: Key,
    label: 'Arriendos',
    description: 'Gestión completa del proceso. Seleccionamos inquilinos confiables y manejamos contratos.',
    color: 'green',
    href: '/propiedades?tipo=Arriendo',
    tag: null,
  },
  {
    icon: BarChart3,
    label: 'Avalúos Certificados',
    description: 'Valoración técnica respaldada por aliados bancarios para decisiones informadas.',
    color: 'amber',
    href: '/servicios/avaluos',
    tag: 'Certificado',
  },
]

const HOGAR = [
  { icon: Blinds,  label: 'Cortinas Blackout',   description: 'Control de luz total con acabados premium y garantía de instalación.', color: 'blue'  },
  { icon: Grid2x2, label: 'Mallas de Seguridad',  description: 'Protección certificada contra insectos con materiales de alta resistencia.', color: 'green' },
  { icon: Layers,  label: 'Vidrios y Espejos',    description: 'Instalación y reemplazo con vidrio templado y materiales de calidad.', color: 'amber' },
  { icon: Wind,    label: 'Aires Acondicionados',  description: 'Instalación y mantenimiento preventivo de sistemas eficientes.', color: 'blue'  },
]

const PACKAGES = [
  {
    name: 'Kit Hogar Seguro',
    price: '$850.000',
    desc: 'Ideal para nuevas familias',
    features: ['Mallas para 3 ventanas', 'Instalación incluida', 'Garantía 6 meses', 'Visita técnica gratis'],
    popular: false,
    btnColor: 'btn-primary',
  },
  {
    name: 'Apartamento Nuevo',
    price: '$1.500.000',
    desc: 'El más solicitado',
    features: ['Cortinas blackout completas', 'Mallas de seguridad', 'Vidrios templados en baños', 'Garantía 12 meses', 'Asesoría de decoración'],
    popular: true,
    btnColor: 'btn-amber',
  },
  {
    name: 'Solución Airbnb',
    price: '$2.200.000',
    desc: 'Máxima rentabilidad',
    features: ['Pack apartamento completo', 'Vidrios y espejos', 'Aire acondicionado', 'Asesoría Airbnb', 'Mantenimiento mensual'],
    popular: false,
    btnColor: 'btn-secondary',
  },
]

const colorStyles: Record<string, { bg: string; icon: string; border: string }> = {
  blue:  { bg: 'bg-primary-50',   icon: 'text-primary-600',   border: 'border-primary-100'   },
  green: { bg: 'bg-secondary-50', icon: 'text-secondary-600', border: 'border-secondary-100' },
  amber: { bg: 'bg-amber-50',     icon: 'text-amber-600',     border: 'border-amber-100'     },
}

const TABS = [
  { key: 'inmobiliaria', label: 'Servicios Inmobiliarios', icon: Building2 },
  { key: 'hogar',        label: 'Servicios del Hogar',     icon: Wrench    },
]

export default function Services() {
  const [tab, setTab] = useState<'inmobiliaria' | 'hogar'>('inmobiliaria')

  return (
    <section className="section relative overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-100 to-blue-100" id="servicios">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_28%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/18 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-400/16 blur-3xl pointer-events-none" />
      <div className="relative z-10 container-max">

        {/* ── Header ── */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="eyebrow-blue mb-4">
            <Sparkles className="w-3 h-3" />
            Todo en un solo lugar
          </span>
          <h2 className="section-title text-4xl md:text-5xl mt-3 mb-4">
            Servicios diseñados{' '}
            <span className="text-gradient-brand">para ti</span>
          </h2>
          <p className="section-subtitle text-base">
            Desde encontrar tu propiedad ideal hasta equiparla por completo. Somos tu aliado integral en Colombia.
          </p>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-neutral-200 rounded-card p-1 gap-1 shadow-soft">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as typeof tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-button text-sm font-semibold font-sans transition-all duration-200 ${
                  tab === t.key
                    ? 'bg-primary-600 text-white shadow-brand'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Panel: Inmobiliaria ── */}
        <AnimatePresence mode="wait">
          {tab === 'inmobiliaria' && (
            <motion.div
              key="inmobiliaria"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid md:grid-cols-3 gap-5 mb-14">
                {INMOBILIARIA.map((svc, i) => {
                  const c = colorStyles[svc.color]
                  return (
                    <motion.div
                      key={svc.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                      <Link href={svc.href} className="group card-elevated p-7 flex flex-col gap-5 h-full block">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-card ${c.bg} border ${c.border} flex items-center justify-center`}>
                            <svc.icon className={`w-6 h-6 ${c.icon}`} />
                          </div>
                          {svc.tag && (
                            <span className={`badge ${svc.color === 'blue' ? 'badge-primary' : svc.color === 'green' ? 'badge-green' : 'badge-amber'}`}>
                              {svc.tag}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{svc.label}</h3>
                          <p className="text-sm text-slate-500 font-sans leading-relaxed">{svc.description}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-sm font-semibold ${c.icon} group-hover:gap-3 transition-all duration-200 font-sans`}>
                          Conocer más <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Packages */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="divider-amber" />
                  <span className="eyebrow-amber">Paquetes Especiales</span>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {PACKAGES.map((pkg, i) => (
                    <motion.div
                      key={pkg.name}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className={`relative bg-white rounded-card-lg border transition-all duration-300 flex flex-col p-6 gap-5 ${
                        pkg.popular
                          ? 'border-amber-300 ring-2 ring-amber-200'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                      style={{ boxShadow: pkg.popular ? '0 8px 32px -8px rgba(245,158,11,0.25)' : '0 4px 24px -6px rgba(15,23,42,0.08)' }}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="btn-amber px-3 py-1 text-xs rounded-pill shadow-amber">Más popular</span>
                        </div>
                      )}
                      <div>
                        <p className="font-display font-bold text-lg text-slate-900">{pkg.name}</p>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">{pkg.desc}</p>
                        <p className="text-3xl font-display font-bold text-slate-900 mt-3">{pkg.price}</p>
                        <p className="text-xs text-slate-400 font-sans">Pago único · IVA incluido</p>
                      </div>
                      <ul className="flex flex-col gap-2 flex-1">
                        {pkg.features.map(f => (
                          <li key={f} className="flex items-center gap-2.5 text-sm font-sans text-slate-700">
                            <Check className="w-4 h-4 flex-shrink-0 text-secondary-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href="/servicios" className={`${pkg.btnColor} py-2.5 text-sm`}>
                        Solicitar paquete
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Panel: Hogar ── */}
          {tab === 'hogar' && (
            <motion.div
              key="hogar"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {HOGAR.map((svc, i) => {
                  const c = colorStyles[svc.color]
                  return (
                    <motion.div
                      key={svc.label}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link href="/servicios" className="group card-elevated p-6 flex flex-col gap-4 h-full block">
                        <div className={`w-11 h-11 rounded-card ${c.bg} border ${c.border} flex items-center justify-center`}>
                          <svc.icon className={`w-5 h-5 ${c.icon}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-lg text-slate-900 mb-1.5">{svc.label}</h3>
                          <p className="text-sm text-slate-500 font-sans leading-relaxed">{svc.description}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${c.icon} group-hover:gap-2.5 transition-all duration-200 font-sans`}>
                          Ver más <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
