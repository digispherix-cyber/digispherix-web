import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '0.875rem',
  color: 'white',
  background: 'rgba(12,9,35,0.8)',
  border: '1px solid rgba(124,58,237,0.3)',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('exit_popup_shown')) return

    let enabled = false
    const enable = () => { enabled = true }

    const handleMouseLeave = (e) => {
      if (!enabled) return
      if (e.clientY <= 5) {
        setVisible(true)
        sessionStorage.setItem('exit_popup_shown', '1')
      }
    }

    const handleVisibility = () => {
      if (!enabled) return
      if (document.hidden && !sessionStorage.getItem('exit_popup_shown')) {
        setVisible(true)
        sessionStorage.setItem('exit_popup_shown', '1')
      }
    }

    // Espera 8s antes de activar — evita mostrar a quien acaba de llegar
    const timer = setTimeout(() => {
      enabled = true
      document.addEventListener('mouseleave', handleMouseLeave)
      document.addEventListener('visibilitychange', handleVisibility)
    }, 8000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = `Hola DigiSpherix! 👋\n\nSoy ${name.trim()} y me interesa una cotización.\nMi WhatsApp es: ${phone.trim()}\n\n¡Contáctenme cuando puedan!`
    window.open(`https://wa.me/523320318435?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  const close = () => setVisible(false)

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(5,3,20,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99990,
            }}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 32 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99991,
              width: 'calc(100% - 32px)',
              maxWidth: '420px',
              background: 'rgba(17,13,48,0.98)',
              border: '1px solid rgba(124,58,237,0.45)',
              borderRadius: '20px',
              padding: '36px 28px 28px',
              boxShadow: '0 0 80px rgba(124,58,237,0.2), 0 0 0 1px rgba(217,70,239,0.1)',
            }}
          >
            {/* Glow superior */}
            <div style={{
              position: 'absolute', top: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: '200px', height: '2px',
              background: 'linear-gradient(90deg, transparent, #d946ef, #7c3aed, transparent)',
              borderRadius: '99px',
            }} />

            <button
              onClick={close}
              aria-label="Cerrar"
              style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6b5fa0', padding: '6px', lineHeight: 0,
              }}
            >
              <X size={18} />
            </button>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>🚀</div>
                <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.15rem', marginBottom: '8px' }}>
                  ¡Te contactamos pronto!
                </h3>
                <p style={{ color: '#9d8fc2', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Revisa tu WhatsApp — te respondemos en menos de 24 horas.
                </p>
                <button
                  onClick={close}
                  style={{
                    marginTop: '20px', background: 'none', border: 'none',
                    cursor: 'pointer', color: '#6b5fa0', fontSize: '0.8rem',
                  }}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>🤔</div>
                <h3 style={{
                  color: 'white', fontWeight: 800, fontSize: '1.3rem',
                  marginBottom: '8px', lineHeight: 1.25,
                }}>
                  ¿Te vas sin cotizar?
                </h3>
                <p style={{ color: '#c4b5fd', fontSize: '0.875rem', marginBottom: '22px', lineHeight: 1.65 }}>
                  Deja tu WhatsApp y te contactamos —{' '}
                  <span style={{ color: 'white', fontWeight: 600 }}>
                    cotización gratis en menos de 24 h.
                  </span>
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    id="exit-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    maxLength={60}
                    style={inputStyle}
                  />
                  <input
                    id="exit-phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Tu WhatsApp (ej. +52 332 000 0000)"
                    required
                    type="tel"
                    maxLength={25}
                    style={inputStyle}
                  />
                  <button
                    type="submit"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                      color: 'white', fontWeight: 700, fontSize: '0.95rem',
                      marginTop: '4px', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <MessageCircle size={18} />
                    Contáctame por WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#6b5fa0', fontSize: '0.8rem', padding: '6px',
                    }}
                  >
                    No, gracias
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
