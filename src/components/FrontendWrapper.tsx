'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

export default function FrontendWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Si estamos en la ruta de Sanity Studio, no renderizamos la UI del frontend
  const isStudio = pathname?.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
