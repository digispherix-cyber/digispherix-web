'use client'

import { useEffect } from 'react'

const SELECTOR = '.btn-primary, .btn-secondary'
const STRENGTH = 0.3
const EASE_BACK = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'

// Efecto "imán": los botones .btn-primary y .btn-secondary se desplazan
// ligeramente hacia el cursor al pasar por encima. Un solo listener
// delegado en document cubre todos los botones del sitio (incluidos los
// que se agregan después, como al cambiar de página) sin envolver cada
// botón individualmente.
export default function MagneticButtons() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let current = null

    const release = (el) => {
      el.style.transition = EASE_BACK
      el.style.transform = ''
    }

    const onMove = (e) => {
      const el = e.target.closest ? e.target.closest(SELECTOR) : null
      if (el !== current) {
        if (current) release(current)
        current = el
        if (current) current.style.transition = 'transform 0.1s linear'
      }
      if (el) {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) * STRENGTH
        const y = (e.clientY - (r.top + r.height / 2)) * STRENGTH
        el.style.transform = `translate(${x}px, ${y}px)`
      }
    }

    const onWindowLeave = () => {
      if (current) { release(current); current = null }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onWindowLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onWindowLeave)
      if (current) release(current)
    }
  }, [])

  return null
}
