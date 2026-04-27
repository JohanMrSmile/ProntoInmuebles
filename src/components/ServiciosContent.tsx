'use client'

import { Shield, Sparkles, Droplets, PenTool, CheckCircle2, type LucideIcon, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/tracking'

interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  image: string
  features: string[]
  stat: string
}

const services: Service[] = [
  {
    id: 'avaluos',
    title: 'Avalúos Inmobiliarios Certificados',
    description: 'Asegura el valor máximo de tu propiedad antes de vender o arrendar. Recibe un certificado técnico validado en 48 horas que respalda tu precio ante compradores e instituciones financieras.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    features: ['Evaluación técnica certificada', 'Validada ante entidades bancarias', 'Entrega en 48 horas garantizadas'],
    stat: '+300 avalúos entregados',
  },
  {
    id: 'remodelacion',
    title: 'Remodelaciones que Elevan Tu Inversión',
    description: 'Una remodelación bien ejecutada puede aumentar el valor de mercado de tu propiedad hasta un 25%. Transformamos espacios ordinarios en hogares que enamoran desde la primera visita.',
    icon: PenTool,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    features: ['Diseño de Interiores personalizado', 'Materiales de primera calidad', 'Seguimiento obra en tiempo real'],
    stat: '+120 proyectos finalizados',
  },
  {
    id: 'limpieza',
    title: 'Mantenimiento que Protege tu Patrimonio',
    description: 'Una propiedad descuidada pierde valor cada mes. Nuestro servicio de mantenimiento profesional mantiene tu inmueble en condición de exhibición: listo para arrendar o vender en cualquier momento.',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    features: ['Limpieza profunda certificada', 'Productos ecológicos e hipoalergénicos', 'Personal verificado con respaldo'],
    stat: '98% de satisfacción',
  },
  {
    id: 'decoracion',
    title: 'Estilismo que Acelera la Venta',
    description: 'Las propiedades decoradas profesionalmente se venden un 40% más rápido y atraen ofertas más altas. Nuestros diseñadores crean ambientes que conectan emocionalmente con los compradores desde la primera visita.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    features: ['Home staging profesional', 'Selección de mobiliario y accesorios', 'Fotografía optimizada para portales'],
    stat: '40% más rápido en venta',
  }
]

export default function ServiciosContent() {
  return (
    <div className="pt-24 pb-24 min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-100 via-teal-100 to-blue-100">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_28%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/18 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/16 rounded-full blur-[100px] translate-y-1/3 pointer-events-none" />

      {/* Hero Header — Premium UI */}
      <div className="relative py-24 mb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-secondary-200/50 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2" /> Expertos a tu Servicio
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-slate-900 font-bold mb-10 tracking-tighter leading-[0.9]">
              Protege y <br />
              <span className="text-secondary-600 italic">Maximiza</span> tu Patrimonio
            </h1>
            <p className="text-xl text-neutral-600 font-medium leading-relaxed max-w-2xl mx-auto italic">
              &ldquo;Más allá de transacciones, gestionamos plusvalía. Soluciones integrales para activos inmobiliarios exigentes.&rdquo;
            </p>
          </motion.div>

          {/* Trust Accreditation Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-10 mt-16 p-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-soft max-w-4xl mx-auto"
          >
            {[
              { label: 'Proyectos Certificados', value: '+500' },
              { label: 'Inversión Optimizada', value: '+120' },
              { label: 'Años de Trayectoria', value: '10+' },
              { label: 'Clientes VIP', value: '100%' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-2xl font-display font-bold text-slate-900 mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Specialty Services List */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-32">
        <div className="space-y-40">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}
              >
                {/* Visual Showcase Side */}
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 1 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2 relative group"
                >
                  <div className={`absolute -inset-6 ${idx % 2 === 1 ? 'bg-secondary-500/5' : 'bg-primary-500/5'} rounded-[4rem] blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="relative h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-strong border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                    
                    {/* Status Badge on UI */}
                    <div className="absolute bottom-10 left-10 right-10">
                      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/50 flex items-center gap-5">
                         <div className="w-12 h-12 bg-primary-800 rounded-2xl flex items-center justify-center shrink-0">
                           <Icon className="w-6 h-6 text-gold-400" />
                         </div>
                         <div>
                            <div className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mb-1 italic">Impacto Comprobado</div>
                            <div className="text-slate-900 font-display font-bold text-lg tracking-tight leading-none">{service.stat}</div>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 1 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2 space-y-10"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-px bg-primary-500 shadow-sm" />
                      <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em]">División de Especialidad</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-neutral-600 text-lg font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-neutral-100 shadow-soft group/feature hover:border-primary-200 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center group-hover/feature:bg-secondary-500 transition-colors duration-300">
                          <CheckCircle2 className="w-4 h-4 text-secondary-500 group-hover/feature:text-white transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-8">
                    <a
                      href={buildWhatsAppLink({
                        message: `Hola, estoy interesado en ${service.title}`,
                        context: 'service',
                        metadata: { servicio: service.title }
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackWhatsAppClick({
                          context: 'service',
                          location: 'services_card',
                          label: service.title,
                          metadata: { servicio: service.title }
                        })
                      }
                      className="w-full sm:w-auto px-10 py-5 bg-primary-800 hover:bg-primary-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-brand active:scale-95 text-center inline-flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Solicitar Consultoría Técnica
                    </a>
                    <div className="hidden sm:block">
                       <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tiempo de Respuesta</div>
                       <div className="text-slate-900 font-display font-medium text-sm italic underline transition-all decoration-primary-200 decoration-2">&lt; 2 Horas Laborales</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Final Strategy CTA Section — Interaction Fix */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 mb-32"
      >
        <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-strong border border-neutral-100 relative overflow-hidden text-center group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.3em] mb-6 block">Diagnóstico Gratuito</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              ¿Cómo podemos <span className="text-primary-600 italic">valorizar</span> tu inmueble hoy?
            </h2>
            <p className="text-neutral-600 text-lg font-medium leading-relaxed mb-12">
              Agenda una sesión estratégica de 20 minutos con un consultor senior. Analizaremos tu propiedad y te brindaremos un plan de acción sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href={buildWhatsAppLink({
                  message: 'Hola, quiero agendar una consulta VIP',
                  context: 'lead_capture',
                  metadata: { origen: 'servicios_cta_final' }
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    context: 'lead_capture',
                    location: 'services_card',
                    label: 'Consulta VIP'
                  })
                }
                className="w-full sm:w-auto px-12 py-6 bg-primary-600 hover:bg-primary-500 text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-widest transition-all shadow-brand hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Agendar Mi Consulta VIP
              </a>
              <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-neutral-200 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                <Shield className="w-4 h-4 text-secondary-500" /> Confidencial & Sin Costo
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
