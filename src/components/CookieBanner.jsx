import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cookie, X, Check, Settings } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('ds_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('ds_cookie_consent', 'all')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('ds_cookie_consent', 'essential')
    window['ga-disable-G-PHN5G7P9L7'] = true
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9000,
            padding: '12px 16px',
          }}
        >
          <div style={{
            maxWidth: '620px',
            margin: '0 auto',
            background: 'rgba(17,13,48,0.97)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '16px 16px 0 0',
            padding: '20px 20px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -8px 40px rgba(124,58,237,0.15)',
          }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(124,58,237,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#a855f7',
                }}>
                  <Cookie size={17} />
                </div>
                <span style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                  Usamos cookies 🍪
                </span>
              </div>
              <button
                onClick={reject}
                aria-label="Cerrar banner de cookies"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5b95', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <p style={{ color: '#9d8fc2', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '14px' }}>
              Usamos Google Analytics para mejorar tu experiencia. Puedes aceptar todas o solo las esenciales.
            </p>

            {/* Detail */}
            <AnimatePresence>
              {showDetail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', marginBottom: '12px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { name: 'Esenciales', desc: 'Necesarias para que el sitio funcione.', required: true },
                      { name: 'Analíticas', desc: 'Google Analytics — mide visitas y comportamiento.', required: false },
                    ].map(c => (
                      <div key={c.name} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px', borderRadius: '10px',
                        background: 'rgba(124,58,237,0.1)',
                        border: '1px solid rgba(124,58,237,0.2)',
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#ddd6fe', fontSize: '0.8rem' }}>{c.name}</div>
                          <div style={{ color: '#9d8fc2', fontSize: '0.72rem' }}>{c.desc}</div>
                        </div>
                        <div style={{
                          padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600,
                          background: c.required ? 'rgba(124,58,237,0.3)' : 'rgba(217,70,239,0.2)',
                          color: c.required ? '#a855f7' : '#d946ef', whiteSpace: 'nowrap',
                        }}>
                          {c.required ? 'Siempre activa' : 'Opcional'}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={accept}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                  color: 'white', fontWeight: 700, fontSize: '0.82rem', flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Check size={14} /> Aceptar todas
              </button>
              <button
                onClick={reject}
                style={{
                  padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', flex: 1,
                  background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                  color: '#c4b5fd', fontWeight: 600, fontSize: '0.82rem',
                  justifyContent: 'center', textAlign: 'center',
                }}
              >
                Solo esenciales
              </button>
              <button
                onClick={() => setShowDetail(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#7c3aed', fontSize: '0.78rem', fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                <Settings size={13} /> {showDetail ? 'Ocultar' : 'Personalizar'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
