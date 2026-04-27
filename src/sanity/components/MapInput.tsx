'use client'

import { useCallback, useEffect, useRef } from 'react'
import { set, unset } from 'sanity'
import type { ObjectInputProps } from 'sanity'
import 'leaflet/dist/leaflet.css'

export function MapInput(props: ObjectInputProps) {
  const { value, onChange } = props
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Default to Cartagena center if no value
  const lat = (value as any)?.lat || 10.3910
  const lng = (value as any)?.lng || -75.4794
  const hasValue = !!(value as any)?.lat

  const updateLocation = useCallback((newLat: number, newLng: number) => {
    onChange(set({
      _type: 'mapLocation',
      lat: Number(newLat.toFixed(6)),
      lng: Number(newLng.toFixed(6))
    }))
  }, [onChange])

  const clearLocation = useCallback(() => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
    onChange(unset())
  }, [onChange])

  // Store values in refs for useEffect access without re-triggering
  const valuesRef = useRef({ lat, lng, hasValue, updateLocation })
  valuesRef.current = { lat, lng, hasValue, updateLocation }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    async function initMap() {
      // Dynamic import to avoid SSR issues
      const L = (await import('leaflet')).default
      if (cancelled || !mapRef.current) return

      const { lat: currentLat, lng: currentLng, hasValue: currentHasValue, updateLocation: currentUpdateLocation } = valuesRef.current

      const map = L.map(mapRef.current, {
        center: [currentLat, currentLng],
        zoom: currentHasValue ? 15 : 12,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
      }).addTo(map)

      const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })

      if (valuesRef.current.hasValue) {
        markerRef.current = L.marker([valuesRef.current.lat, valuesRef.current.lng], { icon: greenIcon, draggable: true }).addTo(map)

        markerRef.current.on('dragend', (e: any) => {
          const newPos = e.target.getLatLng()
          valuesRef.current.updateLocation(newPos.lat, newPos.lng)
        })
      }

      map.on('click', (e: any) => {
        if (!markerRef.current) {
          markerRef.current = L.marker(e.latlng, { icon: greenIcon, draggable: true }).addTo(map)
          markerRef.current.on('dragend', (event: any) => {
            const newPos = event.target.getLatLng()
            valuesRef.current.updateLocation(newPos.lat, newPos.lng)
          })
        } else {
          markerRef.current.setLatLng(e.latlng)
        }
        valuesRef.current.updateLocation(e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map
      setTimeout(() => map.invalidateSize(), 300)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px', 
          border: '1px solid #cad1dc',
          zIndex: 1 // Keep leaflet controls under sanity UI dropdowns
        }} 
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>
          {hasValue 
            ? `📍 Seleccionado: ${(value as any).lat}, ${(value as any).lng}` 
            : '🖱️ Haz clic en el mapa para ubicar la propiedad'}
        </span>
        {hasValue && (
          <button 
            type="button" 
            onClick={clearLocation}
            style={{ 
              padding: '6px 12px', 
              background: '#fee2e2', 
              color: '#dc2626', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontSize: '12px', 
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Eliminar Pin
          </button>
        )}
      </div>
    </div>
  )
}
