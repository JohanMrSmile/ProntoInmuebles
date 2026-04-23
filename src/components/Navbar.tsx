'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, MessageCircle, ChevronRight } from 'lucide-react'
import { getWhatsAppLink, siteConfig } from '@/lib/config'
import { trackPhoneClick, trackWhatsAppLead } from '@/lib/analytics'

/* ─── Section IDs that the observer will track ─── */
const OBSERVED_SECTIONS = ['servicios', 'beneficios', 'galeria', 'testimonios', 'cta', 'contacto']

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection,  setActiveSection]  = useState<string | null>(null)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const navLinks = siteConfig.navigation.main.map(link => ({ href: link.href, label: link.name }))

  /* ─── Smooth-scroll handler for hash links on homepage ─── */
  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith('#')) return
    if (!isHome) return
    e.preventDefault()
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileOpen(false)
  }

  /* ─── Scroll listener for navbar background + progress ─── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ─── IntersectionObserver: track visible sections on homepage ─── */
  useEffect(() => {
    if (!isHome) { setActiveSection(null); return }

    const observers: IntersectionObserver[] = []
    const visibleSections = new Map<string, number>()

    // Small delay to wait for DOM sections to mount
    const timer = setTimeout(() => {
      OBSERVED_SECTIONS.forEach(id => {
        const el = document.getElementById(id)
        if (!el) return

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio)
            } else {
              visibleSections.delete(id)
            }

            // Pick the section with highest intersection ratio
            if (visibleSections.size === 0) {
              setActiveSection(null)
            } else {
              let best = ''
              let bestRatio = 0
              visibleSections.forEach((ratio, sectionId) => {
                if (ratio > bestRatio) { best = sectionId; bestRatio = ratio }
              })
              setActiveSection(best)
            }
          },
          { threshold: [0, 0.15, 0.3, 0.5], rootMargin: '-80px 0px -20% 0px' }
        )

        observer.observe(el)
        observers.push(observer)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observers.forEach(o => o.disconnect())
    }
  }, [isHome])

  /* ─── Close mobile menu on route change ─── */
  useEffect(() => { setMobileOpen(false) }, [pathname])

  /* ─── Lock body scroll when mobile menu is open ─── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ─── Determine if a nav link is "active" ─── */
  const isLinkActive = useCallback((href: string): boolean => {
    // Subpages: exact pathname match
    if (!isHome) return pathname === href

    // Homepage with hash links:
    if (href === '/') {
      // "Inicio" is active only when no section is in view (user is at the top)
      return activeSection === null
    }

    if (href.startsWith('#')) {
      const sectionId = href.slice(1)
      return activeSection === sectionId
    }

    return false
  }, [isHome, pathname, activeSection])

  const solid = scrolled || !isHome
  const navBg = solid
    ? 'bg-white/88 backdrop-blur-xl border-b border-primary-100/60'
    : 'bg-transparent'

  return (
    <>
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ boxShadow: solid ? '0 10px 40px -18px rgba(18,62,80,0.20)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative w-12 h-12 flex-shrink-0">
                {/* Glow ring */}
                <div className={`absolute inset-0 rounded-full blur-md transition-all duration-500 scale-110 ${
                  solid
                    ? 'bg-primary-400/30 group-hover:bg-primary-400/55'
                    : 'bg-white/18 group-hover:bg-white/30'
                }`} />
                <Image
                  src="/logo.png"
                  alt={siteConfig.name}
                  fill
                  className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-lg"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className={`font-display font-bold text-[20px] tracking-tight transition-colors duration-300 ${solid ? 'text-charcoal-700' : 'text-white'}`}>
                  Pronto
                </span>
                <span className={`font-sans text-[9px] font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${solid ? 'text-charcoal-300' : 'text-white/55'}`}>
                  Inmuebles
                </span>
              </div>
            </Link>

            {/* Desktop nav — centered pill container */}
            <nav className="hidden lg:flex items-center">
              <div className={`flex items-center gap-0.5 px-2 py-1 rounded-pill transition-all duration-300 ${solid ? 'bg-white/72 border border-primary-100/70 shadow-soft backdrop-blur-md' : 'bg-white/12 backdrop-blur-sm border border-white/12'}`}>
                {navLinks.map(link => {
                  const resolvedHref = link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href
                  const active = isLinkActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={resolvedHref}
                      onClick={handleNavClick(link.href)}
                      className={`relative px-4 py-1.5 text-sm font-semibold font-sans rounded-pill transition-all duration-200
                        ${active
                          ? solid
                            ? 'bg-gradient-to-r from-primary-50 to-warm-100 text-primary-700 shadow-soft'
                            : 'bg-white/20 text-white'
                          : solid
                            ? 'text-charcoal-400 hover:text-primary-700 hover:bg-primary-50/80'
                            : 'text-white/80 hover:text-white hover:bg-white/15'
                        }`}
                    >
                      {link.label}
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-pill"
                          style={{ boxShadow: solid ? '0 4px 14px rgba(47,163,197,0.14)' : 'none' }}
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                onClick={() => trackPhoneClick('Navbar Desktop')}
                className={`flex items-center gap-1.5 text-sm font-medium font-sans px-3 py-1.5 rounded-pill transition-all duration-200 ${solid ? 'text-charcoal-400 hover:text-primary-700 hover:bg-primary-50/80' : 'text-white/75 hover:text-white hover:bg-white/12'}`}
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xl:inline">{siteConfig.contact.phone}</span>
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppLead('Navbar Desktop')}
                className="btn-whatsapp px-4 py-2 text-sm rounded-pill"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`lg:hidden p-2 rounded-card transition-colors duration-200 ${solid ? 'text-charcoal-600 hover:bg-primary-50/70' : 'text-white hover:bg-white/15'}`}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-[2px]">
          <motion.div
            className="h-full origin-left"
            style={{
              background: 'linear-gradient(90deg, #2FA3C5, #20B85E 65%, #C9A25A)',
              scaleX: scrollProgress / 100,
            }}
          />
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-white flex flex-col"
              style={{ boxShadow: '-8px 0 40px rgba(15,23,42,0.18)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 relative">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" sizes="28px" />
                  </div>
                  <span className="font-display font-bold text-primary-700">Pronto Inmuebles</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-card text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav id="mobile-navigation" className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const resolvedHref = link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href
                  const active = isLinkActive(link.href)
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={resolvedHref}
                        onClick={handleNavClick(link.href)}
                        className={`flex items-center justify-between px-4 py-3 rounded-card text-sm font-semibold font-sans transition-all duration-200
                          ${active
                            ? 'bg-primary-50 text-primary-700 border border-primary-100'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                          }`}
                      >
                        {link.label}
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-primary-400' : 'text-slate-300'}`} />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-neutral-100 flex flex-col gap-2.5">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  onClick={() => trackPhoneClick('Navbar Mobile Drawer')}
                  className="flex items-center gap-3 px-4 py-3 rounded-card bg-slate-50 border border-neutral-200 text-sm font-semibold text-slate-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppLead('Navbar Mobile Drawer')}
                  className="btn-whatsapp w-full py-3 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Escribir por WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
