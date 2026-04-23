'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Home, MapPin, Bed, Bath, ArrowRight, SlidersHorizontal, Search, X, DollarSign, Building, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import type { Property } from '@/lib/types'
import dynamic from 'next/dynamic'

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-neutral-100 rounded-card animate-pulse flex items-center justify-center">
      <p className="text-neutral-400 text-sm font-sans">Cargando mapa...</p>
    </div>
  ),
})

type PropiedadesContentProps = {
  properties: Property[]
}

export default function PropiedadesContent({ properties }: PropiedadesContentProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    propertyType: 'Todas',
    transactionType: 'Todas',
    minPrice: '',
    maxPrice: '',
  })
  const [activePropertyId,  setActivePropertyId]  = useState<string | null>(null)
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6
  const cardRefsMap       = useRef<Map<string, HTMLDivElement>>(new Map())
  const activeTimeoutRef  = useRef<NodeJS.Timeout | null>(null)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch          = p.title.toLowerCase().includes(filters.search.toLowerCase()) || p.location.toLowerCase().includes(filters.search.toLowerCase())
      const matchPropertyType    = filters.propertyType    === 'Todas' || p.propertyType === filters.propertyType
      const matchTransactionType = filters.transactionType === 'Todas' || p.type         === filters.transactionType
      const price = p.priceValue || 0
      const min   = filters.minPrice ? parseInt(filters.minPrice) : 0
      const max   = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity
      return matchSearch && matchPropertyType && matchTransactionType && price >= min && price <= max
    })
  }, [filters, properties])

  const displayProperties = useMemo(() => {
    if (!activePropertyId) return filteredProperties
    const active = filteredProperties.find(p => p._id === activePropertyId)
    if (!active) return filteredProperties
    return [active, ...filteredProperties.filter(p => p._id !== activePropertyId)]
  }, [filteredProperties, activePropertyId])

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return displayProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [displayProperties, currentPage])

  const totalPages = Math.ceil(displayProperties.length / ITEMS_PER_PAGE)

  const handlePropertySelect = useCallback((id: string | null) => {
    if (activeTimeoutRef.current) { clearTimeout(activeTimeoutRef.current); activeTimeoutRef.current = null }
    setActivePropertyId(id)
  }, [])

  const handleMarkerHover = useCallback((id: string | null) => { setHoveredPropertyId(id) }, [])

  const resetFilters = () => setFilters({ search: '', propertyType: 'Todas', transactionType: 'Todas', minPrice: '', maxPrice: '' })

  return (
    <div className="pt-24 min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-100 to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_28%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-cyan-400/18 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-400/16 blur-3xl pointer-events-none" />

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="section-eyebrow-primary mb-4">
              <LayoutGrid className="w-3 h-3" />
              Catálogo
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-neutral-900 font-bold mt-3">
              Encuentra tu <span className="text-gradient-brand">espacio ideal</span>
            </h1>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-button border font-semibold text-sm font-sans transition-all duration-200 ${
              isAdvancedOpen
                ? 'bg-primary-500 text-white border-primary-500 shadow-brand'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isAdvancedOpen ? 'Ocultar filtros' : 'Filtros avanzados'}
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 flex flex-col gap-6">

        {/* Search + pill filters */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por zona o nombre..."
              className="w-full pl-11 pr-4 py-3 rounded-button border border-neutral-200 bg-neutral-50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            {['Todas', 'Venta', 'Arriendo'].map(type => (
              <button
                key={type}
                onClick={() => setFilters({ ...filters, transactionType: type })}
                className={filters.transactionType === type ? 'filter-pill-active' : 'filter-pill-inactive'}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {isAdvancedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="card p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="form-label flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary-500" />Tipo de Propiedad</label>
                  <select className="form-input" value={filters.propertyType} onChange={e => setFilters({ ...filters, propertyType: e.target.value })}>
                    {['Todas', 'Apartamento', 'Apartaestudio', 'Casa', 'Local', 'Bodega', 'Loft', 'Estudio'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-primary-500" />Precio Mínimo</label>
                  <input type="number" placeholder="$ 0" className="form-input" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                </div>
                <div>
                  <label className="form-label flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-primary-500" />Precio Máximo</label>
                  <input type="number" placeholder="Sin límite" className="form-input" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
                <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                  <button onClick={resetFilters} className="btn border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex-1 py-3 text-sm">Limpiar</button>
                  <button onClick={() => setIsAdvancedOpen(false)} className="btn-primary flex-1 py-3 text-sm">Aplicar</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results counter */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500 font-sans">
            <span className="font-semibold text-neutral-900">{filteredProperties.length}</span> propiedades encontradas
          </p>
          {activePropertyId && (
            <button onClick={() => setActivePropertyId(null)} className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 font-sans">
              <X className="w-3.5 h-3.5" /> Quitar selección
            </button>
          )}
        </div>

        {/* Grid + Map */}
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Property cards */}
          <div className="w-full xl:w-[55%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedProperties.length > 0 ? paginatedProperties.map(property => (
                  <motion.div
                    key={property._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    ref={el => { if (el) cardRefsMap.current.set(property._id, el); else cardRefsMap.current.delete(property._id) }}
                    onMouseEnter={() => handleMarkerHover(property._id)}
                    onMouseLeave={() => handleMarkerHover(null)}
                    className={`property-card transition-all duration-500 ${
                      activePropertyId  === property._id ? 'active-highlight' : ''
                    } ${hoveredPropertyId === property._id && activePropertyId !== property._id ? 'hovered-highlight' : ''}`}
                  >
                    <Link href={`/propiedades/${property.slug}`} className="block">
                      <div className="property-card-image">
                        <Image src={property.image} alt={property.title} fill className="object-cover" unoptimized />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="badge bg-white text-neutral-800 shadow-soft text-[10px]">{property.propertyType}</span>
                          <span className={`badge text-white text-[10px] ${property.type === 'Venta' ? 'bg-primary-600' : 'bg-secondary-600'}`}>
                            {property.type}
                          </span>
                        </div>
                        {activePropertyId === property._id && (
                          <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setActivePropertyId(null) }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-soft flex items-center justify-center text-neutral-700 hover:bg-gold-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display font-bold text-lg text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors">
                            {property.title}
                          </h3>
                          <span className="text-secondary-600 font-display font-bold text-base whitespace-nowrap flex-shrink-0">{property.price}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-sans">
                          <MapPin className="w-3.5 h-3.5 text-primary-400" />
                          {property.location}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-neutral-500 text-xs font-sans">
                              <Bed className="w-3.5 h-3.5 text-gold-500" /> {property.beds} Hab
                            </span>
                            <span className="flex items-center gap-1.5 text-neutral-500 text-xs font-sans">
                              <Bath className="w-3.5 h-3.5 text-gold-500" /> {property.baths} Baños
                            </span>
                          </div>
                          <div className="w-8 h-8 bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-200">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Home className="w-8 h-8 text-neutral-300" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">Sin resultados</h3>
                    <p className="text-neutral-500 text-sm font-sans mb-4">Prueba ajustando los filtros.</p>
                    <button onClick={resetFilters} className="btn-primary text-sm px-5 py-2.5">Ver todas</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1))
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }} 
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-button text-sm font-semibold text-neutral-600 disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1)
                        window.scrollTo({ top: 300, behavior: 'smooth' })
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-button text-sm font-semibold transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-transparent hover:border-neutral-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1))
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }} 
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-button text-sm font-semibold text-neutral-600 disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="w-full xl:w-[45%] xl:sticky xl:top-28 xl:self-start">
            <div className="card overflow-hidden" style={{ height: '620px' }}>
              <PropertyMap
                properties={filteredProperties}
                onMarkerClick={handlePropertySelect}
                onMarkerHover={handleMarkerHover}
                activePropertyId={activePropertyId}
                hoveredPropertyId={hoveredPropertyId}
              />
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                <span className="text-xs text-neutral-500 font-sans">Mapa en tiempo real</span>
              </div>
              <span className="text-xs text-neutral-400 font-sans">{filteredProperties.length} resultados</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .active-highlight {
          box-shadow: 0 0 0 3px #2FA3C5, 0 12px 40px -8px rgba(47,163,197,0.30) !important;
          transform: translateY(-2px);
          z-index: 10;
          position: relative;
        }
        .hovered-highlight {
          box-shadow: 0 0 0 2px rgba(47,163,197,0.40), 0 8px 24px -6px rgba(47,163,197,0.18) !important;
        }
      `}</style>
    </div>
  )
}
