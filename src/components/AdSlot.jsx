'use client'

import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT } from '../lib/adsense'

// Espacio de anuncio AdSense reutilizable.
// - Si `slot` está vacío, no renderiza nada (espacio preparado, inofensivo).
// - Cuando se le pasa un data-ad-slot válido, muestra el anuncio.
export default function AdSlot({ slot, format = 'auto', style }) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!slot || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch { /* AdSense aún no cargado; se reintenta en el próximo render */ }
  }, [slot])

  if (!slot) return null

  return (
    <div style={{ margin: '32px auto', textAlign: 'center', ...style }} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
