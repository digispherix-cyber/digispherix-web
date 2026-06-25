'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const start = performance.now()
    const duration = 350

    const tick = (now) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setVisible(false), 80)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#0c0923',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '32px',
          }}
        >
          {/* Glowing orbs */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '20%', left: '30%',
                width: '300px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', bottom: '20%', right: '25%',
                width: '250px', height: '250px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(217,70,239,0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          {/* Logo animado */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            style={{ position: 'relative' }}
          >
            {/* Ring giratorio */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-16px',
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#7c3aed',
                borderRightColor: '#d946ef',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-8px',
                borderRadius: '50%',
                border: '1px solid transparent',
                borderBottomColor: '#a855f7',
                borderLeftColor: '#ec4899',
                opacity: 0.5,
              }}
            />
            <picture>
              <source srcSet="/logo-icon.webp" type="image/webp" />
              <img
                src="/logo-icon.png"
                alt="DigiSpherix"
                width="80"
                height="80"
                style={{ width: '80px', height: '80px', objectFit: 'contain', display: 'block' }}
              />
            </picture>
          </motion.div>

          {/* Nombre */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #a855f7, #d946ef, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              DigiSpherix
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b5b95', marginTop: '4px', letterSpacing: '0.15em' }}>
              CARGANDO...
            </div>
          </motion.div>

          {/* Barra de progreso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ width: '200px' }}
          >
            <div style={{
              height: '3px', borderRadius: '99px',
              background: 'rgba(124,58,237,0.2)', overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%', borderRadius: '99px',
                  background: 'linear-gradient(90deg, #7c3aed, #d946ef)',
                  width: `${progress}%`,
                  transition: 'width 0.05s linear',
                  boxShadow: '0 0 10px rgba(217,70,239,0.6)',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

