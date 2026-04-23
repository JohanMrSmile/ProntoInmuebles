'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Shield, Calendar, Search, FileText, TrendingUp, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AvaluosPage() {
  const inclusions = [
    {
      icon: Search,
      title: 'Inspección Física Detallada',
      description: 'Análisis de las características del inmueble (acabados, materiales, distribución, estado de conservación, antigüedad y mejoras realizadas).'
    },
    {
      icon: MapPin,
      title: 'Ubicación y Entorno',
      description: 'Consideración de la zona, infraestructura urbana, conectividad vial, seguridad, equipamiento y potencial de plusvalía.'
    },
    {
      icon: FileText,
      title: 'Revisión Legal',
      description: 'Cotejo de títulos de propiedad, documentos catastrales y verificaciones para asegurar que el inmueble no tenga problemas legales.'
    },
    {
      icon: TrendingUp,
      title: 'Metodología de Valoración',
      description: 'Aplicación de enfoques de mercado, de costo (valor de reposición de construcción más terreno) y de ingresos para propiedades en alquiler.'
    }
  ]

  const benefits = [
    'Precisión en el Precio: Evita fijar un precio basado en emociones y sé competitivo.',
    'Seguridad y Transparencia: Reducimos el riesgo de fraudes o complicaciones legales.',
    'Ahorro de Tiempo de Gestión: Nos encargamos de coordinar las visitas y la documentación técnica.',
    'Facilitación de Créditos: Requisito exigido por instituciones financieras para otorgar hipotecas.',
    'Negociación Profesional: Actúa como una base sólida para negociar con compradores o vendedores.'
  ]

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link href="/servicios" className="inline-flex items-center text-neutral-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Servicios
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 mb-12">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Servicio Profesional
                </div>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
                  Avalúos Inmobiliarios
                </h1>
                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                  Un dictamen técnico, formal y con validez legal que determina el valor real de tu propiedad. Protege tu patrimonio y toma decisiones con bases sólidas y respaldo de expertos certificados.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contacto" className="btn bg-primary-400 hover:bg-primary-500 text-white rounded-xl py-3 px-8 font-medium transition-colors">
                    Solicitar Avalúo
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="relative h-[300px] lg:h-auto">
              <Image 
                src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80"
                alt="Documentos de Avalúo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-display text-3xl font-bold text-neutral-800 mb-8">¿Qué incluye nuestro reporte?</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {inclusions.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100"
                  >
                    <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">{item.title}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-secondary-50 rounded-3xl p-8 sticky top-32"
            >
              <h3 className="font-display text-2xl font-bold text-secondary-900 mb-6">Beneficios</h3>
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-secondary-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-secondary-800 text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-secondary-100">
                <p className="text-sm text-secondary-600 mb-4 text-center">Asesoría directa con nuestros peritos</p>
                <Link href="/contacto" className="w-full py-4 bg-white hover:bg-neutral-50 text-secondary-600 rounded-xl font-medium transition-colors flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 mr-2" />
                  Contactar Asesor
                </Link>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  )
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
