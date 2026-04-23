import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso del sitio web de Pronto Inmuebles.',
}

export default function TerminosPage() {
  return (
    <section className="section bg-white">
      <div className="container-max max-w-3xl">
        <span className="eyebrow-blue mb-4">Legal</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mt-3 mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose prose-slate max-w-none font-sans text-sm leading-relaxed space-y-6">
          <p className="text-slate-500">
            Última actualización: Abril 2026
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">1. Aceptación de términos</h2>
          <p>
            Al acceder y utilizar el sitio web de <strong>{siteConfig.name}</strong> ({siteConfig.url}), aceptas cumplir con estos términos y condiciones de uso.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">2. Servicios</h2>
          <p>
            {siteConfig.name} ofrece servicios de intermediación inmobiliaria y servicios para el hogar en Cartagena, Colombia. La información publicada en este sitio tiene carácter informativo y no constituye una oferta vinculante.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">3. Propiedad intelectual</h2>
          <p>
            Todo el contenido presente en este sitio web, incluyendo textos, imágenes, logotipos, diseños y código fuente, es propiedad de {siteConfig.name} y está protegido por las leyes de propiedad intelectual de Colombia.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">4. Información de propiedades</h2>
          <p>
            Los precios, características y disponibilidad de las propiedades publicadas están sujetos a cambios sin previo aviso. Las imágenes son referenciales y pueden no reflejar el estado actual del inmueble.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">5. Limitación de responsabilidad</h2>
          <p>
            {siteConfig.name} no se hace responsable por daños directos o indirectos derivados del uso de este sitio web o de la información contenida en él. Las transacciones inmobiliarias se formalizan mediante contratos legales independientes.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">6. Contacto</h2>
          <p>
            Para preguntas sobre estos términos, contáctanos en:<br />
            📧 <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 hover:underline">{siteConfig.contact.email}</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/" className="btn-outline text-sm px-6 py-2.5">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
