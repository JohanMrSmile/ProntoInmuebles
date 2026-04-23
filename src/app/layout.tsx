import type { Metadata } from 'next'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import AutoTracker from '@/components/AutoTracker'
import FrontendWrapper from '@/components/FrontendWrapper'
import { getOrganizationSchema, getWebsiteSchema } from '@/lib/schema'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Pronto Inmuebles | Liderazgo Inmobiliario y Servicios del Hogar',
    template: '%s | Pronto Inmuebles'
  },
  metadataBase: new URL('https://prontoinmuebles.com'),
  description: 'Descubre la excelencia en bienes raíces y soluciones integrales para el hogar en Cartagena. Compra, venta, arriendo y mantenimiento con estándares de alta calidad.',
  keywords: ['inmobiliaria cartagena', 'venta de casas cartagena', 'arriendo apartamentos cartagena', 'bocagrande propiedades', 'avalúos certificados', 'remodelaciones cartagena'],
  authors: [{ name: 'Pronto Inmuebles Team' }],
  creator: 'Pronto Inmuebles',
  publisher: 'Pronto Inmuebles',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://prontoinmuebles.com',
    siteName: 'Pronto Inmuebles',
    title: 'Pronto Inmuebles | Inmobiliaria y Servicios Premium',
    description: 'Elevando el estándar inmobiliario en Cartagena. Propiedades en Bocagrande, El Laguito, Manga y el Caribe colombiano.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Pronto Inmuebles Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pronto Inmuebles | Soluciones Inmobiliarias',
    description: 'Expertos en el mercado inmobiliario de Cartagena y el Caribe colombiano.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = getOrganizationSchema()
  const websiteSchema = getWebsiteSchema()
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="es" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body className="font-sans text-neutral-800 antialiased selection:bg-primary-100 selection:text-primary-900 scroll-smooth">
        {/* Skip to content — accesibilidad */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Saltar al contenido
        </a>

        {/* Google Tag Manager — Carga diferida */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}

        {/* Google Analytics — Carga diferida */}
        {gaId && !gtmId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}

        {/* GTM noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Auto Tracker — UTM capture + page_view + scroll_depth + time_on_site */}
        <AutoTracker />

        <FrontendWrapper>
          {children}
        </FrontendWrapper>
      </body>
    </html>
  )
}