'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ style }) {
  // Arranca en null para no asumir el tema en el primer render del servidor
  // (el script en layout.jsx ya puso el atributo correcto antes de pintar);
  // se sincroniza en useEffect, después de montar.
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
  }, [])

  const toggle = () => {
    const next = !isLight
    setIsLight(next)
    document.documentElement.setAttribute('data-theme', next ? 'light' : 'dark')
    try { localStorage.setItem('theme', next ? 'light' : 'dark') } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      title={isLight ? 'Modo oscuro' : 'Modo claro'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '38px', height: '38px', borderRadius: '50%',
        border: '1px solid var(--border)', background: 'var(--bg-card-alt)',
        color: 'var(--accent-2)', cursor: 'pointer', flexShrink: 0,
        ...style,
      }}
    >
      {isLight ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  )
}
