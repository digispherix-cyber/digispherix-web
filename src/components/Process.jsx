import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Palette, Code2, Rocket } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: <MessageSquare size={32} />,
    title: 'Consulta',
    subtitle: 'Escuchamos tu idea',
    desc: 'Platicamos sobre tu proyecto, objetivos y presupuesto. Sin compromiso. Entendemos qué necesitas y cómo podemos ayudarte a lograrlo.',
    color: '#7c3aed',
    tags: ['Reunión inicial', 'Propuesta', 'Cotización'],
  },
  {
    num: '02',
    icon: <Palette size={32} />,
    title: 'Diseño',
    subtitle: 'Damos forma visual',
    desc: 'Creamos el diseño visual de tu proyecto para que lo apruebes antes de desarrollar. Responsivo, moderno y alineado con tu marca.',
    color: '#d946ef',
    tags: ['UI/UX', 'Prototipo', 'Revisión'],
  },
  {
    num: '03',
    icon: <Code2 size={32} />,
    title: 'Desarrollo',
    subtitle: 'Construimos tu visión',
    desc: 'Programamos tu proyecto con las últimas tecnologías. Código limpio, rápido y seguro. Entregamos avances en cada etapa para tu revisión.',
    color: '#a855f7',
    tags: ['React / Kotlin', 'API REST', 'Testing'],
  },
  {
    num: '04',
    icon: <Rocket size={32} />,
    title: 'Lanzamiento',
    subtitle: 'Salimos al mundo',
    desc: 'Publicamos tu proyecto y te damos soporte durante los primeros 30 días. Tu negocio disponible 24/7 con hosting, SSL y respaldo incluido.',
    color: '#7c3aed',
    tags: ['Deploy', 'Soporte 30 días', 'Capacitación'],
  },
]

/* ---------- sub-components with their own hook calls ---------- */

function StepCard({ step, progress, rangeStart, rangeEnd }) {
  const opacity = useTransform(progress, [rangeStart, rangeStart + 0.08, rangeEnd - 0.08, rangeEnd], [0, 1, 1, 0])
  const y       = useTransform(progress, [rangeStart, rangeStart + 0.08], [50, 0])
  const scale   = useTransform(progress, [rangeStart, rangeStart + 0.08], [0.95, 1])

  return (
    <motion.div style={{ opacity, y, scale, position: 'absolute', width: '100%' }}>
      <div style={{
        borderRadius: '20px', padding: 'clamp(20px, 4vw, 40px) clamp(18px, 4vw, 44px)',
        background: 'linear-gradient(135deg, rgba(17,13,48,0.95), rgba(12,9,35,0.9))',
        border: `1px solid ${step.color}44`,
        boxShadow: `0 0 60px ${step.color}18`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${step.color}22`, color: step.color,
          }}>
            {step.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: step.color, fontWeight: 700, letterSpacing: '0.12em', marginBottom: '4px' }}>
              PASO {step.num}
            </div>
            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>{step.title}</h3>
            <p style={{ fontSize: '0.85rem', color: step.color, marginTop: '3px' }}>{step.subtitle}</p>
          </div>
        </div>

        <p style={{ fontSize: '1rem', color: '#c4b5fd', lineHeight: 1.75, marginBottom: '28px' }}>
          {step.desc}
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {step.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.8rem', padding: '6px 14px', borderRadius: '999px', fontWeight: 500,
              background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}33`,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function StepLabel({ step, index, total, progress }) {
  const rangeStart = index / total
  const rangeEnd   = (index + 1) / total
  const opacity = useTransform(progress, [rangeStart, rangeStart + 0.06, rangeEnd - 0.06, rangeEnd], [0.3, 1, 1, 0.3])
  const x       = useTransform(progress, [rangeStart, rangeStart + 0.06], [-6, 0])

  return (
    <motion.div style={{ opacity, x, paddingBottom: index < total - 1 ? '28px' : 0 }}>
      <div style={{ fontSize: '0.65rem', color: step.color, fontWeight: 700, letterSpacing: '0.1em' }}>
        {step.num}
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{step.title}</div>
    </motion.div>
  )
}

/* ---------- main component ---------- */

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progressBarH = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={ref} style={{ minHeight: '380vh', position: 'relative' }}>
      <div className="process-sticky" style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
        background: 'transparent',
      }}>
        {/* Top divider */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #7c3aed, #d946ef, transparent)',
        }} />

        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '15%', left: '-8%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed, transparent)', opacity: 0.08, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, #d946ef, transparent)', opacity: 0.08, filter: 'blur(80px)' }} />
        </div>

        <div className="ds-container" style={{ width: '100%' }}>
          <div className="process-grid">

            {/* LEFT */}
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', color: '#d946ef', textTransform: 'uppercase', marginBottom: '14px' }}>
                Cómo trabajamos
              </p>
              <h2 className="process-title" style={{ fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: '18px' }}>
                Nuestro<br />
                <span className="gradient-text">Proceso</span>
              </h2>
              <p className="process-desc" style={{ color: '#9d8fc2', lineHeight: 1.75, marginBottom: '32px' }}>
                De la idea al lanzamiento en 4 pasos claros. Contigo en cada etapa para que el resultado supere tus expectativas.
              </p>

              {/* Timeline */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ position: 'relative', width: '2px', background: 'rgba(124,58,237,0.2)', borderRadius: '2px', flexShrink: 0 }}>
                  <motion.div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%',
                    height: progressBarH,
                    background: 'linear-gradient(180deg, #7c3aed, #d946ef)',
                    borderRadius: '2px',
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {steps.map((s, i) => (
                    <StepLabel key={s.num} step={s} index={i} total={steps.length} progress={scrollYProgress} />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — stacked cards */}
            <div className="process-cards">
              {steps.map((step, i) => (
                <StepCard
                  key={step.num}
                  step={step}
                  progress={scrollYProgress}
                  rangeStart={i / steps.length}
                  rangeEnd={(i + 1) / steps.length}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
