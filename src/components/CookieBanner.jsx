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
    // Disable GA tracking
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
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9000,
            width: 'min(600px, calc(100vw - 32px))',
          }}
        >
          <div style={{
            background: 'rgba(17,13,48,0.96)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '20px',
            padding: '24px 28px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px rgba(124,58,237,0.2)',
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(124,58,237,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#a855f7',
              }}>
                <Cookie size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '6px' }}>
                  Usamos cookies 🍪
                </p>
                <p style={{ color: '#9d8fc2', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  Utilizamos cookies para analizar el tráfico del sitio (Google Analytics) y mejorar tu experiencia.
                  Puedes aceptar todas o solo las esenciales.
                </p>

                <AnimatePresence>
                  {showDetail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { name: 'Esenciales', desc: 'Necesarias para que el sitio funcione correctamente.', required: true },
                          { name: 'Analíticas', desc: 'Google Analytics — nos ayuda a entender cómo usan el sitio los visitantes.', required: false },
                        ].map(c => (
                          <div key={c.name} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 14px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)',
                            border: '1px solid rgba(124,58,237,0.2)',
                          }}>
                            <div>
                              <div style={{ fontWeight: 600, color: '#ddd6fe', fontSize: '0.82rem' }}>{c.name}</div>
                              <div style={{ color: '#9d8fc2', fontSize: '0.75rem' }}>{c.desc}</div>
                            </div>
                            <div style={{
                              padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
                              background: c.required ? 'rgba(124,58,237,0.3)' : 'rgba(217,70,239,0.2)',
                              color: c.required ? '#a855f7' : '#d946ef',
                            }}>
                              {c.required ? 'Siempre activa' : 'Opcional'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onClick={accept}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '9px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                      color: 'white', fontWeight: 700, fontSize: '0.82rem',
                    }}
                  >
                    <Check size={14} /> Aceptar todas
                  </button>
                  <button
                    onClick={reject}
                    style={{
                      padding: '9px 20px', borderRadius: '10px', cursor: 'pointer',
                      background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                      color: '#c4b5fd', fontWeight: 600, fontSize: '0.82rem',
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
                    }}
                  >
                    <Settings size={13} /> {showDetail ? 'Ocultar' : 'Personalizar'}
                  </button>
                </div>
              </div>

              <button
                onClick={reject}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5b95', flexShrink: 0 }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
