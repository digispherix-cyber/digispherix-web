'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Gift, MessageCircle, Sparkles } from 'lucide-react'

// Tarjeta "rasca y gana": el visitante raspa el recubrimiento con el mouse o
// el dedo (canvas + globalCompositeOperation destination-out) y revela un
// premio. Al descubrir ~55% se limpia solo y aparece el CTA de WhatsApp.

const OFFERS = [
  { emoji: '🎉', text: '10% de descuento en tu proyecto' },
  { emoji: '🛠️', text: '1 mes de soporte técnico gratis' },
  { emoji: '🎨', text: 'Logo profesional gratis con tu sitio' },
  { emoji: '🌐', text: 'Dominio .com.mx gratis el primer año' },
  { emoji: '💡', text: 'Sesión de consultoría gratis (30 min)' },
]

export default function ScratchCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const drawingRef = useRef(false)
  const movesRef = useRef(0)

  const [offer, setOffer] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Elegir el premio en el cliente (evita desajuste de hidratación por Math.random).
  useEffect(() => {
    setOffer(OFFERS[Math.floor(Math.random() * OFFERS.length)])
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Pinta el recubrimiento rascable sobre el canvas.
  const paintCoating = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const rect = wrap.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    grad.addColorStop(0, '#7c3aed')
    grad.addColorStop(1, '#d946ef')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, rect.width, rect.height)

    // patrón sutil de destellos
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    for (let i = 0; i < 40; i++) {
      const x = (i * 53 + 20) % rect.width
      const y = (i * 71 + 15) % rect.height
      ctx.beginPath(); ctx.arc(x, y, (i % 3) + 1, 0, Math.PI * 2); ctx.fill()
    }

    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = '700 20px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎁  Rasca aquí', rect.width / 2, rect.height / 2 - 2)
    ctx.font = '400 13px Inter, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('desliza el cursor para descubrir tu premio', rect.width / 2, rect.height / 2 + 22)
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  }, [])

  useEffect(() => {
    if (reduced) return
    paintCoating()
    const onResize = () => { if (!revealed) paintCoating() }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [paintCoating, reduced, revealed])

  const revealAll = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setRevealed(true)
  }, [])

  const scratchedEnough = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const img = ctx.getImageData(0, 0, width, height).data
    let clear = 0, total = 0
    // muestrea cada 40 píxeles (rendimiento)
    for (let i = 3; i < img.length; i += 40 * 4) {
      total++
      if (img[i] === 0) clear++
    }
    return total > 0 && clear / total > 0.55
  }, [])

  const scratchAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 26, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    movesRef.current += 1
    if (movesRef.current % 6 === 0 && scratchedEnough()) revealAll()
  }, [revealed, scratchedEnough, revealAll])

  const onPointerDown = (e) => { drawingRef.current = true; scratchAt(e.clientX, e.clientY) }
  const onPointerMove = (e) => { if (drawingRef.current) scratchAt(e.clientX, e.clientY) }
  const onPointerUp = () => {
    drawingRef.current = false
    // al soltar, si ya se raspó bastante, revelar
    if (!revealed && scratchedEnough()) revealAll()
  }

  const waMsg = encodeURIComponent(
    offer
      ? `Hola DigiSpherix! Rasqué su tarjeta y gané: ${offer.text}. Me gustaría reclamarlo. 🎁`
      : `Hola DigiSpherix! Me interesa su promoción.`
  )

  return (
    <section ref={ref} className="ds-section relative" style={{ color: 'var(--text)' }}>
      <div className="ds-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--accent-2)' }}>
            Regalo para ti
          </p>
          <h2 className="section-title gradient-text">Rasca y gana</h2>
          <p className="section-subtitle">
            Antes de que nos escribas, llévate un premio. Rasca la tarjeta y descubre tu beneficio exclusivo.
          </p>
        </motion.div>

        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Tarjeta */}
          <div
            style={{
              position: 'relative', borderRadius: '20px', overflow: 'hidden',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
              boxShadow: '0 20px 50px rgba(124,58,237,0.18)',
            }}
          >
            {/* Premio (debajo del recubrimiento) */}
            <div
              ref={wrapRef}
              style={{
                minHeight: '210px', padding: '32px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', gap: '10px',
                background: 'radial-gradient(circle at 50% 40%, rgba(124,58,237,0.12), transparent 70%)',
              }}
            >
              <div style={{ fontSize: '2.6rem', lineHeight: 1 }}>{offer ? offer.emoji : '🎁'}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-2)' }}>
                ¡Ganaste!
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-strong)', maxWidth: '320px', lineHeight: 1.25 }}>
                {offer ? offer.text : ' '}
              </div>
            </div>

            {/* Recubrimiento rascable */}
            {!reduced && (
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  touchAction: 'none', cursor: 'grab',
                  opacity: revealed ? 0 : 1,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: revealed ? 'none' : 'auto',
                }}
              />
            )}
          </div>

          {/* CTA + reveal manual */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '22px' }}>
            <motion.a
              href={`https://wa.me/523320318435?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              initial={false}
              animate={{ opacity: revealed ? 1 : 0.5, scale: revealed ? 1 : 0.98 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: revealed ? 'auto' : 'none' }}
            >
              <MessageCircle size={16} /> Reclamar mi premio
            </motion.a>

            {!revealed && (
              <button
                onClick={revealAll}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.85rem',
                }}
              >
                <Sparkles size={14} /> o revélalo directo
              </button>
            )}
            {revealed && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                Válido al mencionarlo en tu primer mensaje. Un premio por cliente.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
