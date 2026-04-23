import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo Pronto Inmuebles recopila, utiliza y protege tu información personal.',
}

export default function PrivacidadPage() {
  return (
    <section className="section bg-white">
      <div className="container-max max-w-3xl">
        <span className="eyebrow-blue mb-4">Legal</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mt-3 mb-8">
          Política de Privacidad
        </h1>

        <div className="prose prose-slate max-w-none font-sans text-sm leading-relaxed space-y-6">
          <p className="text-slate-500">
            Última actualización: Abril 2026
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">1. Información que recopilamos</h2>
          <p>
            En <strong>{siteConfig.name}</strong> recopilamos la siguiente información cuando nos contactas a través de nuestros formularios o WhatsApp:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-600">
            <li>Nombre completo</li>
            <li>Número de teléfono / WhatsApp</li>
            <li>Correo electrónico (opcional)</li>
            <li>Servicio de interés</li>
            <li>Mensaje o consulta</li>
          </ul>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">2. Uso de la información</h2>
          <p>Utilizamos tu información exclusivamente para:</p>
          <ul className="list-disc pl-6 space-y-1 text-slate-600">
            <li>Responder a tus consultas inmobiliarias</li>
            <li>Ofrecerte propiedades que se ajusten a tus necesidades</li>
            <li>Coordinar visitas y asesorías</li>
            <li>Mejorar nuestros servicios</li>
          </ul>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">3. Protección de datos</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tu información personal contra acceso no autorizado, pérdida o alteración. No compartimos tu información con terceros sin tu consentimiento explícito.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">4. Cookies y análisis</h2>
          <p>
            Utilizamos cookies y herramientas de análisis web (Google Analytics) para entender cómo los visitantes interactúan con nuestro sitio. Esta información es anónima y se utiliza únicamente para mejorar la experiencia del usuario.
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">5. Tus derechos</h2>
          <p>
            De acuerdo con la Ley 1581 de 2012 (Colombia), tienes derecho a conocer, actualizar, rectificar y eliminar tu información personal. Para ejercer estos derechos, contáctanos en:
          </p>
          <p>
            📧 <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-600 hover:underline">{siteConfig.contact.email}</a><br />
            📱 <a href={`tel:${siteConfig.contact.phone}`} className="text-primary-600 hover:underline">{siteConfig.contact.phone}</a>
          </p>

          <h2 className="font-display font-bold text-xl text-slate-900 !mt-8">6. Cambios en esta política</h2>
          <p>
            Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
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
