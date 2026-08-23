'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Globe, Smartphone } from 'lucide-react'
import SiteBuilder from './SiteBuilder'
import AppBuilder from './AppBuilder'

// Envuelve los dos constructores (sitio web y app Android) con un switch de
// pestañas estilo la tabla de Precios. Cada constructor se renderiza en modo
// "embedded" (sin su propia sección/encabezado); aquí se maneja el título y
// las pestañas.

const TABS = [
  { id: 'web', label: 'Sitio Web', icon: Globe },
  { id: 'app', label: 'App Android', icon: Smartphone },
]

const COPY = {
  web: {
    title: 'Arma tu sitio',
    desc: 'Arrastra o toca los bloques para armar una vista previa de tu sitio ideal, puedes repetirlos las veces que quieras. Cuando quede como te gusta, descarga la imagen y te cotizamos gratis.',
  },
  app: {
    title: 'Arma tu app',
    desc: 'Arrastra o toca las pantallas para diseñar tu app Android dentro del celular. Reordénalas, ajústalas y, cuando quede como la imaginas, descarga la imagen y te cotizamos gratis.',
  },
}

export default function BuilderStudio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('web')
  const copy = COPY[tab]

  return (
    <section id="constructor" ref={ref} className="ds-section relative" style={{ color: 'var(--text)' }}>
      <div className="ds-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--accent-2)' }}>
            Pruébalo tú mismo
          </p>
          <h2 className="section-title gradient-text">{copy.title}</h2>
          <p className="section-subtitle">{copy.desc}</p>
        </motion.div>

        {/* Switch de pestañas (estilo tabla de precios) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px', padding: '0 16px' }}>
          <div
            style={{
              display: 'flex', gap: '4px', padding: '6px', borderRadius: '999px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
            }}
          >
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 24px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    ...(active
                      ? { background: 'linear-gradient(135deg, #7c3aed, #d946ef)', color: 'white' }
                      : { background: 'transparent', color: 'var(--text-muted)' }),
                  }}
                >
                  <Icon size={17} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Constructor activo. La key fuerza remmontaje al cambiar de pestaña
            para que cada constructor empiece limpio. */}
        {tab === 'web' ? <SiteBuilder key="web" embedded /> : <AppBuilder key="app" />}
      </div>
    </section>
  )
}
