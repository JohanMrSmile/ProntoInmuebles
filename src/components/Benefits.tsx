'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShieldCheck, Megaphone, Banknote, Zap, TrendingUp, Users, Clock, Award, MessageCircle, ArrowRight } from 'lucide-react'
//prueba
const STATS = [
  { value: '500+',  label: 'Propiedades gestionadas', icon: TrendingUp },
  { value: '1.2k+', label: 'Clientes satisfechos',    icon: Users      },
  { value: '<2h',   label: 'Tiempo de respuesta',     icon: Clock      },
  { value: '10+',   label: 'Años de experiencia',     icon: Award      },
]

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Asesoría Legal Completa',
    description: 'Acompañamiento jurídico en cada etapa. Contratos blindados y respaldo legal certificado en todas las transacciones.',
    color: 'blue',
    stat: '100%', statLabel: 'Transacciones seguras',
  },
  {
    icon: Megaphone,
    title: 'Marketing Profesional',
    description: 'Fotografía HDR, tours 360° y presencia en portales líderes. Tu propiedad visible para miles de compradores.',
    color: 'green',
    stat: '3x', statLabel: 'Mayor visibilidad',
  },
  {
    icon: Banknote,
    title: 'Aliados Bancarios',
    description: 'Acceso a las mejores tasas hipotecarias del mercado. Facilitamos tu crédito con más de 15 entidades financieras.',
    color: 'amber',
    stat: '15+', statLabel: 'Entidades aliadas',
  },
  {
    icon: Zap,
    title: 'Cierre Ágil',
    description: 'Proceso documentado y optimizado para cerrar en tiempo récord. Promedio de 28 días desde el primer contacto.',
    color: 'blue',
    stat: '28d', statLabel: 'Cierre promedio',
  },
]

const colorMap: Record<string, { bg: string; icon: string; stat: string; border: string; glow: string }> = {
  blue:  { bg: 'bg-primary-50',   icon: 'text-primary-600',   stat: 'text-primary-700',   border: 'border-primary-100',   glow: 'rgba(37,99,235,0.12)'   },
  green: { bg: 'bg-secondary-50', icon: 'text-secondary-600', stat: 'text-secondary-700', border: 'border-secondary-100', glow: 'rgba(16,185,129,0.12)'  },
  amber: { bg: 'bg-amber-50',     icon: 'text-amber-600',     stat: 'text-amber-700',     border: 'border-amber-100',     glow: 'rgba(245,158,11,0.12)'  },
}

export default function Benefits() {
  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-warm-100 via-warm-200 to-primary-50/40" id="beneficios">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,163,197,0.08),transparent_40%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-200/12 blur-3xl pointer-events-none" />
      <div className="relative z-10 container-max">

        {/* ── Header ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-14 items-end">
          <div>
            <span className="eyebrow-blue mb-4">Por qué elegirnos</span>
            <h2 className="section-title text-4xl md:text-5xl mt-3">
              La diferencia que{' '}
              <span className="text-gradient-brand">sí importa</span>
            </h2>
          </div>
          <p className="section-subtitle text-base lg:text-right">
            Más de 10 años en el mercado inmobiliario colombiano nos respaldan. Cada detalle importa cuando se trata de tu patrimonio.
          </p>
        </div>

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="flex flex-col items-center gap-2 p-5 rounded-card-lg bg-slate-50 border border-neutral-200/70 text-center"
            >
              <div className="w-10 h-10 rounded-card bg-primary-50 border border-primary-100 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary-600" />
              </div>
              <p className="font-display font-bold text-2xl text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-sans leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Benefit cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b, i) => {
            const c = colorMap[b.color]
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                className="group bg-white rounded-card-lg border border-neutral-200/70 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 24px -6px rgba(15,23,42,0.08)' }}
                whileHover={{ boxShadow: `0 16px 48px -10px ${c.glow}, 0 4px 12px -4px rgba(15,23,42,0.08)` } as any}
              >
                <div className={`w-11 h-11 rounded-card ${c.bg} border ${c.border} flex items-center justify-center`}>
                  <b.icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <div>
                  <p className={`text-2xl font-display font-bold ${c.stat}`}>{b.stat}</p>
                  <p className="text-[10px] font-sans text-slate-400 uppercase tracking-widest">{b.statLabel}</p>
                </div>
                <div className="border-t border-neutral-100 pt-3">
                  <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">{b.title}</h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── CTA after social proof ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 pt-10 border-t border-neutral-200/60">
          <Link href="/propiedades" className="btn-primary px-7 py-3.5 text-sm">
            Ver propiedades disponibles
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#contacto"
            className="btn-outline px-7 py-3.5 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Hablar con un asesor
          </a>
        </div>

      </div>
    </section>
  )
}
