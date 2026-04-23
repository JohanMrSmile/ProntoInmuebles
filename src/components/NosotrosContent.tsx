'use client'

import { Heart, Target, Clock, Shield, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Value {
  icon: LucideIcon
  title: string
  description: string
}

const values: Value[] = [
  {
    icon: Heart,
    title: 'Compromiso',
    description: 'Trabajamos con dedicación en cada proyecto y cada cliente.'
  },
  {
    icon: Target,
    title: 'Excelencia',
    description: 'Buscamos los estándares más altos del mercado en cada detalle.'
  },
  {
    icon: Shield,
    title: 'Confianza',
    description: 'Construimos relaciones transparentes y seguras a largo plazo.'
  },
  {
    icon: Clock,
    title: 'Eficiencia',
    description: 'Optimizamos nuestro tiempo y el tuyo para mejores resultados.'
  }
]

export default function NosotrosContent() {
  return (
    <div className="pt-24 pb-24 min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-50">
       {/* Background Ornaments */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.14),transparent_28%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/18 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-400/16 blur-3xl pointer-events-none" />
      
      {/* Hero Header — Premium Redesign */}
      <div className="relative py-24 mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-primary-200/50">
              Nuestra Identidad
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-slate-900 font-bold mb-10 tracking-tighter leading-[0.9]">
              Construyendo <br />
              <span className="text-primary-600 italic">Legado</span> y Hogar
            </h1>
            <p className="text-xl text-neutral-500 font-medium leading-relaxed max-w-2xl mx-auto italic">
              &ldquo;Más que una inmobiliaria, somos tu aliado estratégico en la creación de patrimonio y bienestar para tu familia.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Historia / Descripción - Premium UI */}
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="absolute -inset-4 bg-primary-500/10 rounded-[4rem] blur-3xl group-hover:bg-primary-500/20 transition-all duration-700 pointer-events-none" />
            <div className="relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-strong border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Equipo profesional de Pronto Inmuebles"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-10"
          >
            <div className="space-y-6">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Nuestra Trayectoria</h2>
              <p className="text-neutral-500 text-lg font-medium leading-relaxed">
                Pronto Inmuebles nació con la visión de revolucionar la forma en que las familias cartageneras y del Caribe colombiano acceden, mantienen y disfrutan sus propiedades. 
              </p>
              <p className="text-neutral-500 text-lg font-medium leading-relaxed">
                Hoy, actuamos como tu aliado estratégico en el mercado inmobiliario de Cartagena, brindando desde opciones premium en Bocagrande, El Laguito y el Centro Histórico, hasta servicios integrales de mantenimiento y valorización de activos.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10">
              {[
                ['+500', 'Familias Felices', 'badge-primary'],
                ['+10', 'Años de Experiencia', 'badge-secondary'],
                ['98%', 'Tasa de Éxito', 'badge-neutral']
              ].map(([num, label, style]) => (
                <div key={label} className="text-center p-8 bg-white rounded-[2rem] shadow-soft border border-neutral-100 hover:border-primary-200 transition-colors group">
                  <p className="font-display text-3xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">{num}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Valores — Advanced Grid */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em] mb-4 block">Nuestros Pilares</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6">Valores que nos definen</h2>
          <p className="text-neutral-500 max-w-xl mx-auto font-medium">Los principios que guían cada decisión y nos permiten ofrecer un servicio de clase mundial.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div 
                key={v.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-neutral-100 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-soft">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-4 tracking-tight">{v.title}</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed">{v.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
