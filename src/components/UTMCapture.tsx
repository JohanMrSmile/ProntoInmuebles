'use client'

import { useEffect } from 'react'
import { captureUTMs } from '@/lib/utm'

/**
 * Componente silencioso que captura UTMs al montar la app.
 * Se renderiza en el layout pero no tiene output visual.
 */
export default function UTMCapture() {
  useEffect(() => {
    captureUTMs()
  }, [])

  return null
}
