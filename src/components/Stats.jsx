import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { value: 50,  suffix: '+', label: 'Proyectos entregados', color: '#7c3aed' },
  { value: 30,  suffix: '+', label: 'Clientes satisfechos',  color: '#d946ef' },
  { value: 5,   suffix: '',  label: 'Años de experiencia',   color: '#a855f7' },
  { value: 98,  suffix: '%', label: 'Tasa de satisfacción',  color: '#ec4899' },
]

function Counter({ value, suffix, color, active }) {
  const [display, setDisplay] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!active || hasRun.current) return
    hasRun.current = true
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [active, value])

  return (
    <span style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color, lineHeight: 1 }}>
      {display}{suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '80px 0', background: 'rgba(17,13,48,0.5)' }}>
      <div className="ds-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px', marginBottom: '4px',
                background: `${s.color}18`, border: `1px solid ${s.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: s.color, opacity: 0.8 }} />
              </div>
              <Counter value={s.value} suffix={s.suffix} color={s.color} active={inView} />
              <p style={{ fontSize: '0.85rem', color: '#9d8fc2', fontWeight: 500, margin: 0 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
