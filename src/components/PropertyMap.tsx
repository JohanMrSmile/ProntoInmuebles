'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/lib/types'

type PropertyMapProps = {
  properties: Property[];
  activePropertyId: string | null;
  hoveredPropertyId: string | null;
  onMarkerClick: (id: string | null) => void;
  onMarkerHover: (id: string | null) => void;
}

export default function PropertyMap({ 
  properties, 
  activePropertyId, 
  hoveredPropertyId, 
  onMarkerClick, 
  onMarkerHover 
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersMapRef = useRef<Map<string, any>>(new Map())
  const leafletRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const propertiesByIdRef = useRef<Map<string, Property>>(new Map())

  // Icon cache
  const iconsRef = useRef<{ green: any; blue: any; active: any } | null>(null)

  const createIcons = useCallback((L: any) => {
    if (iconsRef.current) return iconsRef.current

    const green = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    const blue = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    const active = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [32, 52],
      iconAnchor: [16, 52],
      popupAnchor: [1, -45],
      shadowSize: [52, 52],
    })

    iconsRef.current = { green, blue, active }
    return iconsRef.current
  }, [])

  // 1. Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    let cleanupContainerEvents: (() => void) | null = null

    async function initMap() {
      const L = (await import('leaflet')).default

      if (cancelled || !mapRef.current) return

      const mapContainer = mapRef.current

      const center: [number, number] = [10.3910, -75.4794]
      const map = L.map(mapRef.current, {
        center,
        zoom: 13,
        scrollWheelZoom: false,
        preferCanvas: true,
        zoomControl: true,
        closePopupOnClick: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: 19,
      }).addTo(map)

      const stopWheel = (e: any) => {
        L.DomEvent.stop(e)
      }

      const handleEnter = () => {
        map.scrollWheelZoom.enable()
        L.DomEvent.on(mapContainer, 'wheel', stopWheel)
      }

      const handleLeave = () => {
        map.scrollWheelZoom.disable()
        L.DomEvent.off(mapContainer, 'wheel', stopWheel)
      }

      L.DomEvent.on(mapContainer, 'mouseenter', handleEnter)
      L.DomEvent.on(mapContainer, 'mouseleave', handleLeave)

      cleanupContainerEvents = () => {
        L.DomEvent.off(mapContainer, 'mouseenter', handleEnter)
        L.DomEvent.off(mapContainer, 'mouseleave', handleLeave)
        L.DomEvent.off(mapContainer, 'wheel', stopWheel)
      }

      map.on('click', () => {
        map.closePopup()
        onMarkerClick(null)
      })

      mapInstanceRef.current = map
      leafletRef.current = L
      setReady(true)
    }

    initMap()

    return () => {
      cancelled = true
      if (cleanupContainerEvents) {
        cleanupContainerEvents()
        cleanupContainerEvents = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [onMarkerClick])

  // 2. Sync markers with properties (Creation/Deletion ONLY)
  useEffect(() => {
    if (!ready || !mapInstanceRef.current || !leafletRef.current) return

    const L = leafletRef.current
    const map = mapInstanceRef.current
    const icons = createIcons(L)

    // Clear existing markers to ensure fresh state on property changes (filters)
    markersMapRef.current.forEach(m => m.remove())
    markersMapRef.current.clear()
    propertiesByIdRef.current.clear()

    const bounds: [number, number][] = []

    properties.forEach(property => {
      const lat = Number(property.lat)
      const lng = Number(property.lng)
      
      // Skip if coordinates are invalid, NaN, or exactly 0,0 (default/empty)
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return
      
      propertiesByIdRef.current.set(property._id, property)
      bounds.push([lat, lng])

      const icon = property.type === 'Venta' ? icons.green : icons.blue
      const marker = L.marker([lat, lng], { 
        icon,
        riseOnHover: true,
      }).addTo(map)

      // Content Injection — uses slug for the link
      const popupContent = `
        <div style="width:260px;font-family:inherit;line-height:1.4">
          <div style="position:relative;height:140px;overflow:hidden;border-radius:12px;margin:1px">
            <img src="${property.image}" alt="${property.title}" style="width:100%;height:100%;object-fit:cover"/>
            <span style="position:absolute;top:10px;left:10px;padding:4px 10px;border-radius:10px;font-size:10px;font-weight:700;color:white;background:${property.type === 'Venta' ? '#1859A0' : '#22A75D'};text-transform:uppercase">${property.type}</span>
          </div>
          <div style="padding:12px 8px 4px">
            <h4 style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#1a1a2e;letter-spacing:-0.02em">${property.title}</h4>
            <div style="font-size:16px;font-weight:800;color:#D4AF37;margin-bottom:10px">${property.price}</div>
            <div style="display:flex;gap:12px;font-size:11px;font-weight:600;color:#666;margin-bottom:12px;text-transform:uppercase">
              <span>🏠 ${property.propertyType}</span>
              <span>🛌 ${property.beds} Hab</span>
            </div>
            <a href="/propiedades/${property.slug}" 
               style="display:block;text-align:center;padding:10px;background:#1a1a2e;color:white;border-radius:12px;font-size:11px;font-weight:700;text-decoration:none;text-transform:uppercase;">
              Ver Detalles
            </a>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'custom-property-popup',
        autoPan: true,
        autoClose: false,
        closeOnClick: false
      })

      // Event Listeners
      marker.on('click', () => {
        onMarkerClick(property._id)
        marker.openPopup() 
      })

      marker.on('mouseover', () => onMarkerHover(property._id))
      marker.on('mouseout', () => onMarkerHover(null))

      marker.on('popupclose', () => {
        onMarkerHover(null) 
      })

      markersMapRef.current.set(property._id, marker)
    })

    if (bounds.length > 0) {
      // setTimeout is required to fix the Leaflet grey-tile bug when container sizes change dynamically
      setTimeout(() => {
        map.invalidateSize()
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      }, 100)
    }
  }, [properties, ready, createIcons, onMarkerClick, onMarkerHover])

  // 3. Independent Sync of Selection/Hover state (NO RE-CREATION)
  useEffect(() => {
    if (!ready || !leafletRef.current || !iconsRef.current) return

    const icons = iconsRef.current
    const map = mapInstanceRef.current
    const targetId = activePropertyId || hoveredPropertyId

    markersMapRef.current.forEach((marker, id) => {
      const property = propertiesByIdRef.current.get(id)
      if (!property) return
      
      if (id === targetId) {
        marker.setIcon(icons.active)
        marker.setZIndexOffset(1000)
        
        if (id === activePropertyId) {
          map.flyTo(marker.getLatLng(), 15, { animate: true, duration: 0.8 })
          if (!marker.isPopupOpen()) {
            marker.openPopup()
          }
        }
      } else {
        const normalIcon = property.type === 'Venta' ? icons.green : icons.blue
        marker.setIcon(normalIcon)
        marker.setZIndexOffset(0)
        if (marker.isPopupOpen()) marker.closePopup()
      }
    })
  }, [activePropertyId, hoveredPropertyId, ready, properties])

  return (
    <>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '450px' }}
      />
      <style jsx global>{`
        .custom-property-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.2);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .custom-property-popup .leaflet-popup-content {
          margin: 0;
          width: 260px !important;
        }
        .custom-property-popup .leaflet-popup-close-button {
          top: 12px;
          right: 12px;
          color: white;
          width: 26px;
          height: 26px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .leaflet-marker-icon {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease !important;
        }
      `}</style>
    </>
  )
}
