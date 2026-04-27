'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageCircle, Search, Star, Home, Key, MapPin, ArrowRight, ChevronDown } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { trackCTA, trackSearch, trackWhatsAppLead } from '@/lib/analytics'
import { trackWhatsAppClick } from '@/lib/tracking'

const STATS = [
  { value: '500+', label: 'Propiedades' },
  { value: '4.9★', label: 'Calificación' },
  { value: '10+', label: 'Años de experiencia' },
  { value: '98%', label: 'Satisfacción' },
]

const TABS = [
  { key: 'Venta', label: 'Comprar', icon: Home },
  { key: 'Arriendo', label: 'Arrendar', icon: Key },
]

const CITIES = ['Bocagrande', 'El Laguito', 'Getsemaní', 'Manga']

const FEATURED = [
  { image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=75', label: 'Bocagrande' },
  { image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=75', label: 'El Laguito' },
  { image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=75', label: 'Getsemaní' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.10, duration: 0.50, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
}

export default function Hero() {
  const [waUrl, setWaUrl] = useState('')
  const [activeTab, setActiveTab] = useState('Venta')
  const [city, setCity] = useState('Bocagrande')
  const router = useRouter()

  useEffect(() => {
    setWaUrl(buildWhatsAppLink({
      message: 'Hola, me interesa una propiedad en Pronto Inmuebles',
      context: 'hero'
    }))
  }, [])

  const handleSearch = () => {
    trackSearch(city, activeTab)
    router.push(`/propiedades?tipo=${activeTab}&ciudad=${city}`)
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Propiedades premium en Colombia"
          fill priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/94 via-primary-900/86 to-secondary-800/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/68 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.07]" />
      </div>

      {/* ── Floating ambient orbs ── */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-[0.06] blur-3xl bg-primary-400 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-[0.05] blur-3xl bg-secondary-400 pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          {/* Left — headline + search */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Eyebrow */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <span className="eyebrow-white text-xs">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                #1 Inmobiliaria en Cartagena · Colombia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-white font-bold text-[2.6rem] sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] leading-[1.04] text-balance"
            >
              Encuentra el hogar{' '}
              <span className="relative inline-block">
                <span className="text-gradient-gold">que mereces</span>
                <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 220 6" fill="none" preserveAspectRatio="none">
                  <path d="M2 4 Q55 1 110 3.5 Q165 6 218 2" stroke="#C9A25A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                </svg>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-white/90 text-lg leading-relaxed font-sans max-w-lg"
            >
              Tu aliado inmobiliario en Cartagena y el Caribe colombiano. Compra, arrienda o valúa con asesores expertos.
            </motion.p>

            {/* ── Search bar ── */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="w-full max-w-xl"
            >
              {/* Tabs */}
              <div className="flex gap-1 mb-3">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-sm font-semibold font-sans transition-all duration-200 ${activeTab === tab.key
                        ? 'bg-white text-primary-700 shadow-soft'
                        : 'text-white/70 hover:text-white hover:bg-white/15'
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input row */}
              <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-card-lg border border-white/40 shadow-panel-lg overflow-hidden">
                <div className="flex items-center gap-2.5 flex-1 px-4 py-3.5">
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="flex-1 bg-transparent text-slate-800 text-sm font-medium font-sans focus:outline-none cursor-pointer"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-px h-8 bg-neutral-200 flex-shrink-0" />
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold text-sm font-sans transition-all duration-200 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Buscar</span>
                </button>
              </div>
            </motion.div>

            {/* CTA row */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-3">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackWhatsAppLead('Hero Section')
                    trackWhatsAppClick({
                      context: 'hero',
                      location: 'hero_cta'
                    })
                  }}
                  className="btn-whatsapp px-5 py-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  Habla con un asesor
                </a>
              )}
              <Link
                href="/propiedades"
                onClick={() => trackCTA('ver_propiedades', 'Hero Section')}
                className="btn-outline-white px-5 py-3"
              >
                Ver propiedades
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {STATS.map(s => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-white font-bold text-xl font-display">{s.value}</span>
                  <span className="text-white/70 text-xs font-sans">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — featured mini-gallery */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 hidden lg:flex flex-col gap-3"
          >
            {/* Main big card */}
            <div className="relative rounded-card-lg overflow-hidden aspect-[4/3] group">
              <Image
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80"
                alt="Propiedad destacada"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-display font-bold text-lg">Penthouse Vista al Mar</p>
                    <div className="flex items-center gap-1 text-white/85 text-xs font-sans mt-0.5">
                      <MapPin className="w-3 h-3" /> Bocagrande, Cartagena
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-300 font-bold text-sm font-sans">$1.850M</p>
                    <span className="eyebrow-white text-[10px] py-0.5 px-2">En Venta</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two small cards */}
            <div className="grid grid-cols-2 gap-3">
              {FEATURED.slice(1).map((item, i) => (
                <Link key={i} href="/propiedades" className="relative rounded-card overflow-hidden aspect-square group block">
                  <Image src={item.image} alt={item.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 1024px) 50vw, 20vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold font-sans">
                    <MapPin className="w-3 h-3 text-gold-300" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Trust row */}
            <div className="flex items-center justify-between px-4 py-3 rounded-card glass border border-white/20">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white/40 bg-primary-700 flex items-center justify-center overflow-hidden">
                      <span className="text-white text-[9px] font-bold font-sans">{['MF', 'CA', 'DM', 'JP'][i - 1]}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/90 text-xs font-sans">+1.200 clientes</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
                <span className="text-white/85 text-xs font-sans ml-1">4.9</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/35 text-[10px] font-sans uppercase tracking-widest">Explorar</span>
          <ChevronDown className="w-4 h-4 text-white/35" />
        </motion.div>
      </div>
    </section>
  )
}
