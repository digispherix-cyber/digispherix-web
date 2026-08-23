'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'

export default function NewsletterForm({ variant = 'card' }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot (oculto)
  const [state, setState] = useState('idle') // idle | loading | ok | error
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (state === 'loading') return
    if (!consent) { setState('error'); setMsg('Marca la casilla para continuar.'); return }
    setState('loading'); setMsg('')
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website }),
      })
      const data = await r.json().catch(() => ({}))
      if (r.ok && data.ok) {
        setState('ok'); setMsg('¡Listo! Ya estás suscrito a nuestro boletín. ¡Gracias!'); setEmail(''); setConsent(false)
      } else {
        setState('error'); setMsg(data.error || 'No se pudo suscribir. Intenta de nuevo.')
      }
    } catch {
      setState('error'); setMsg('No se pudo suscribir. Intenta de nuevo.')
    }
  }

  const wrap = variant === 'card'
    ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(217,70,239,0.08))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: 'clamp(28px, 4vw, 44px)', textAlign: 'center' }
    : { textAlign: 'left' }

  return (
    <div style={wrap}>
      {variant === 'card' && (
        <>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,58,237,0.2)', color: 'var(--accent-4)', marginBottom: '14px' }}>
            <Mail size={22} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-strong)', marginBottom: '8px' }}>Suscríbete a nuestro boletín</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 20px' }}>
            Recibe nuestros nuevos artículos, herramientas y consejos para tu negocio. Sin spam, cancela cuando quieras.
          </p>
        </>
      )}
      {variant === 'footer' && (
        <>
          <h4 style={{ color: 'var(--text-strong)', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>Suscríbete al boletín de noticias</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '14px' }}>Nuevos artículos, herramientas y consejos. Sin spam.</p>
        </>
      )}

      {state === 'ok' ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600, fontSize: '0.95rem' }}>
          <Check size={18} /> {msg}
        </div>
      ) : (
        <form onSubmit={submit} style={{ maxWidth: variant === 'card' ? '460px' : '100%', margin: variant === 'card' ? '0 auto' : 0 }}>
          {/* honeypot: invisible para humanos, tentador para bots */}
          <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com"
              style={{ flex: '1 1 200px', minWidth: 0, boxSizing: 'border-box', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 14px', color: 'var(--text-strong)', fontSize: '0.95rem', outline: 'none' }}
            />
            <button type="submit" disabled={state === 'loading'} className="btn-primary justify-center" style={{ flex: variant === 'card' ? '0 0 auto' : '1 1 100%' }}>
              {state === 'loading' ? <><Loader2 size={16} className="spin" /> Enviando…</> : 'Suscribirme'}
            </button>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, textAlign: 'left', cursor: 'pointer' }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ accentColor: '#d946ef', width: '15px', height: '15px', marginTop: '2px', flexShrink: 0 }} />
            <span>Acepto recibir correos de DigiSpherix y la <a href="/aviso-de-privacidad" style={{ color: 'var(--accent-4)', textDecoration: 'none' }}>política de privacidad</a>. Tus datos se gestionan con MailerLite.</span>
          </label>

          {state === 'error' && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '8px', textAlign: 'left' }}>{msg}</p>}
        </form>
      )}
    </div>
  )
}
