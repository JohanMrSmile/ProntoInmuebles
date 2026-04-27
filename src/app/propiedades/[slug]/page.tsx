import { ArrowLeft, MapPin, Bed, Bath, Home, Calendar, Phone, Shield, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/sanity'
import { properties as staticProperties } from '@/lib/properties'
import { siteConfig } from '@/lib/config'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import FadeIn from '@/components/FadeIn'
import PropertyAgendaCTA from '@/components/PropertyAgendaCTA'
import { Metadata, ResolvingMetadata } from 'next'
import WhatsAppCTA from '@/components/WhatsAppCTA'
import { getPropertySchema } from '@/lib/schema'
import type { Property } from '@/lib/types'

type Props = { params: { slug: string } }

/**
 * Fetch property: try Sanity first, then fallback to static data
 */
async function getProperty(slug: string): Promise<Property | null> {
  // Try Sanity first
  const sanityProperty = await getPropertyBySlug(slug)
  if (sanityProperty) return sanityProperty

  // Fallback to static data
  const staticProperty = staticProperties.find(p => p.slug === slug)
  return staticProperty || null
}

export async function generateStaticParams() {
  // Get slugs from Sanity
  const sanitySlugs = await getAllPropertySlugs()

  // Combine with static slugs
  const staticSlugs = staticProperties.map(p => p.slug)
  const allSlugs = Array.from(new Set([...sanitySlugs, ...staticSlugs]))

  return allSlugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return { title: 'Propiedad no encontrada' }

  return {
    title: `${property.title} en ${property.location}`,
    description: `${property.title}, ${property.propertyType} con ${property.beds} habitaciones en ${property.location}. Precio: ${property.price}.`,
    openGraph: {
      title: `${property.title} | Pronto Inmuebles`,
      description: property.description.substring(0, 160) + '...',
      images: [{ url: property.image }],
    },
  }
}

export default async function PropertyDetail({ params }: Props) {
  const property = await getProperty(params.slug)
  if (!property) notFound()

  const propertySchema = getPropertySchema(property)

  const whatsappUrl = buildWhatsAppLink({
    message: `Hola, me interesa la propiedad "${property.title}"`,
    context: 'property',
    metadata: {
      referencia: params.slug
    }
  })

  const STATS = [
    { icon: Bed,      label: 'Habitaciones', value: property.beds        },
    { icon: Bath,     label: 'Baños',        value: property.baths       },
    { icon: Home,     label: 'Superficie',   value: `${property.sqft}m²` },
    { icon: Calendar, label: 'Estado',       value: 'Disponible'         },
  ]

  const TRUST_ITEMS = [
    'Verificación técnica completa',
    'Asesoría jurídica incluida',
    'Documentación al día',
    'Tour virtual disponible',
  ]

  return (
    <div className="pt-24 pb-20 min-h-screen bg-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <nav className="mb-8 pt-8">
          <Link href="/propiedades" className="group inline-flex items-center gap-2.5 text-sm font-semibold text-neutral-500 hover:text-primary-600 transition-colors font-sans">
            <div className="w-8 h-8 rounded-xl bg-white shadow-soft border border-neutral-100 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Volver al catálogo
          </Link>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 flex flex-col gap-7">
            <FadeIn className="relative aspect-video rounded-card-lg overflow-hidden shadow-panel-lg">
              <Image src={property.image} alt={property.title} fill className="object-cover" priority unoptimized />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge bg-white/95 backdrop-blur-sm text-neutral-800 shadow-soft font-semibold">{property.propertyType}</span>
                <span className={`badge text-white font-semibold ${property.type === 'Venta' ? 'bg-primary-600' : 'bg-secondary-600'}`}>{property.type}</span>
              </div>
              {property.featured && (
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                    <span className="text-white text-xs font-semibold font-sans">Propiedad destacada</span>
                  </div>
                </div>
              )}
            </FadeIn>

            <div className="card p-7">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-neutral-900 leading-tight mb-3">{property.title}</h1>
              <div className="flex items-center gap-2 text-neutral-500 text-sm font-sans">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                {property.location}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {STATS.map((s, i) => (
                <div key={i} className="stat-box">
                  <s.icon className="w-5 h-5 text-primary-500 mb-1" />
                  <p className="text-xs text-neutral-400 font-sans uppercase tracking-wider">{s.label}</p>
                  <p className="font-display font-bold text-lg text-neutral-900">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="card p-7">
              <h2 className="font-display font-bold text-xl text-neutral-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary-500 rounded-full flex-shrink-0" />
                Descripción
              </h2>
              <p className="text-neutral-600 font-sans text-base leading-relaxed">{property.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-4">
              <FadeIn x={20}>
                <div className="rounded-card-lg overflow-hidden shadow-panel-lg" style={{ background: 'linear-gradient(135deg, #0D2744 0%, #061520 100%)' }}>
                  <div className="p-7">
                    <p className="text-white/60 text-xs font-sans uppercase tracking-wider mb-1">Precio</p>
                    <p className="font-display font-bold text-4xl text-white mb-1">{property.price}</p>
                    <p className="text-gold-400 text-xs font-sans font-semibold uppercase tracking-wider mb-7">
                      {property.type === 'Arriendo' ? 'Por mes' : 'Precio final'}
                    </p>
                    <div className="flex flex-col gap-3">
                      <WhatsAppCTA whatsappUrl={whatsappUrl} propertyId={property._id} />
                      <PropertyAgendaCTA propertyTitle={property.title} slug={params.slug} />
                    </div>
                  </div>
                  <div className="border-t border-white/10 px-7 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-sans">Llamar directo</p>
                      <p className="text-white font-semibold text-sm font-sans">{siteConfig.contact.phone}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-secondary-500" />
                  <h4 className="font-display font-bold text-base text-neutral-900">Garantía inmobiliaria</h4>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {TRUST_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm font-sans text-neutral-600">
                      <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
