'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Logo3DCanvas = dynamic(() => import('./Logo3DCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '420px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#9d8fc2', fontSize: '0.9rem',
    }}>
      Cargando logo 3D...
    </div>
  ),
})

const colors = [
  { hex: '#df5cf8', label: 'Fucsia',  desc: 'Energía y creatividad' },
  { hex: '#f8b4fd', label: 'Rosa',    desc: 'Innovación y delicadeza' },
  { hex: '#6e1dc0', label: 'Morado',  desc: 'Confianza y tecnología' },
]

export default function Logo3DSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="identidad"
      ref={ref}
      style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(110,29,192,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'center',
        }}>

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500,
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)',
              color: '#e879f9', marginBottom: '24px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#df5cf8', display: 'inline-block' }} />
              Nuestra Identidad Visual
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900,
              lineHeight: 1.2, marginBottom: '20px', color: '#fff',
            }}>
              Un logo construido{' '}
              <span style={{
                background: 'linear-gradient(135deg, #df5cf8, #6e1dc0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                para el futuro digital
              </span>
            </h2>

            <p style={{
              color: '#ddd6fe', lineHeight: 1.8, fontSize: '1rem', marginBottom: '36px',
            }}>
              Cada elemento de nuestro logo tiene un significado: el círculo representa
              la esfera digital global, el código interno refleja nuestra esencia
              tecnológica, y los colores comunican energía, creatividad y confianza.
            </p>

            {/* Color swatches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {colors.map((c) => (
                <div key={c.hex} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: c.hex, flexShrink: 0,
                    boxShadow: `0 0 20px ${c.hex}60`,
                  }} />
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                      {c.label} <span style={{ color: '#9d8fc2', fontWeight: 400, fontSize: '0.8rem' }}>{c.hex}</span>
                    </div>
                    <div style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — 3D canvas */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              borderRadius: '24px',
              background: 'rgba(17,13,48,0.6)',
              border: '1px solid rgba(124,58,237,0.25)',
              padding: '20px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 48px rgba(110,29,192,0.2)',
            }}
          >
            <Logo3DCanvas />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
