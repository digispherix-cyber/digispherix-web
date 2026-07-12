'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { MessageSquare, Palette, Code2, Rocket, Check } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: <MessageSquare size={32} />,
    title: 'Consulta',
    subtitle: 'Escuchamos tu idea',
    desc: 'Nos sentamos contigo, en persona o por videollamada, para entender a fondo tu negocio, tus objetivos y tu presupuesto. Analizamos a tu competencia y a tu cliente ideal para proponerte la solución que de verdad te conviene. Todo sin compromiso y sin costo: primero nos aseguramos de que seamos el equipo correcto para ti.',
    color: '#7c3aed',
    details: [
      'Reunión inicial sin costo ni compromiso',
      'Análisis de tu competencia y público objetivo',
      'Cotización detallada y clara, sin sorpresas',
    ],
    tags: ['Reunión inicial', 'Propuesta', 'Cotización'],
  },
  {
    num: '02',
    icon: <Palette size={32} />,
    title: 'Diseño',
    subtitle: 'Damos forma visual',
    desc: 'Diseñamos la imagen visual completa de tu proyecto —colores, tipografías y estructura de cada pantalla— y te la mostramos antes de programar una sola línea. Ajustamos juntos hasta que quede exactamente como la imaginas. Todo pensado para verse increíble tanto en celular como en computadora, y siempre alineado con la identidad de tu marca.',
    color: '#d946ef',
    details: [
      'Diseño 100% responsivo: móvil y escritorio',
      'Prototipo navegable para que lo apruebes',
      'Rondas de ajustes incluidas hasta que te encante',
    ],
    tags: ['UI/UX', 'Prototipo', 'Revisión'],
  },
  {
    num: '03',
    icon: <Code2 size={32} />,
    title: 'Desarrollo',
    subtitle: 'Construimos tu visión',
    desc: 'Convertimos el diseño en un producto real usando las últimas tecnologías. Escribimos código limpio, rápido y seguro, optimizado para cargar en segundos y para posicionarse en Google. Te entregamos avances en cada etapa para que veas el progreso y des tu visto bueno antes de continuar.',
    color: '#a855f7',
    details: [
      'Código optimizado para velocidad y SEO',
      'Avances y revisiones contigo en cada etapa',
      'Pruebas de calidad antes de publicar',
    ],
    tags: ['React / Kotlin', 'API REST', 'Testing'],
  },
  {
    num: '04',
    icon: <Rocket size={32} />,
    title: 'Lanzamiento',
    subtitle: 'Salimos al mundo',
    desc: 'Publicamos tu proyecto y lo dejamos funcionando 24/7 con hosting, certificado SSL y respaldos automáticos. Te capacitamos para que sepas administrarlo con confianza y te acompañamos con soporte durante los primeros 30 días. Tu negocio, listo para recibir clientes desde el primer momento.',
    color: '#7c3aed',
    details: [
      'Hosting, certificado SSL y respaldos incluidos',
      'Capacitación para que lo administres tú mismo',
      'Soporte gratis durante los primeros 30 días',
    ],
    tags: ['Deploy', 'Soporte 30 días', 'Capacitación'],
  },
]

function CardContent({ step, large = false }) {
  return (
    <div style={{
      borderRadius: '20px',
      padding: large ? '48px 52px' : '26px',
      background: 'linear-gradient(135deg, rgba(17,13,48,0.95), rgba(12,9,35,0.9))',
      border: `1px solid ${step.color}44`,
      boxShadow: `0 0 60px ${step.color}18`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: large ? '26px' : '18px' }}>
        <div style={{
          width: large ? '76px' : '58px', height: large ? '76px' : '58px',
          borderRadius: '16px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${step.color}22`, color: step.color,
        }}>
          {step.icon}
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: step.color, fontWeight: 700, letterSpacing: '0.12em', marginBottom: '4px' }}>
            PASO {step.num}
          </div>
          <h3 style={{ fontSize: large ? '2rem' : '1.35rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>{step.title}</h3>
          <p style={{ fontSize: large ? '1rem' : '0.85rem', color: step.color, marginTop: '4px' }}>{step.subtitle}</p>
        </div>
      </div>
      <p style={{ fontSize: large ? '1.12rem' : '0.92rem', color: '#c4b5fd', lineHeight: 1.75, marginBottom: large ? '26px' : '18px' }}>
        {step.desc}
      </p>
      {step.details && (
        <ul style={{ listStyle: 'none', margin: large ? '0 0 30px' : '0 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: large ? '13px' : '10px' }}>
          {step.details.map((d) => (
            <li key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', color: '#e9e2ff', fontSize: large ? '1.02rem' : '0.85rem', lineHeight: 1.5 }}>
              <span style={{
                width: large ? '22px' : '19px', height: large ? '22px' : '19px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${step.color}25`, color: step.color,
              }}>
                <Check size={large ? 13 : 12} strokeWidth={3} />
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {step.tags.map(t => (
          <span key={t} style={{
            fontSize: large ? '0.85rem' : '0.75rem',
            padding: large ? '7px 16px' : '5px 12px',
            borderRadius: '999px', fontWeight: 500,
            background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}33`,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* Mobile: tarjetas apiladas, sin sticky */
function ProcessMobile() {
  return (
    <div style={{ padding: '80px 0 60px', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #7c3aed, #d946ef, transparent)',
      }} />
      <div className="ds-container">
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', color: '#d946ef', textTransform: 'uppercase', marginBottom: '12px' }}>
          Cómo trabajamos
        </p>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: '14px' }}>
          Nuestro<br /><span className="gradient-text">Proceso</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9d8fc2', lineHeight: 1.7, marginBottom: '32px' }}>
          De la idea al lanzamiento en 4 pasos claros. Contigo en cada etapa para que el resultado supere tus expectativas.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <CardContent step={step} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Desktop: sticky scroll effect */
function StepCard({ step, progress, rangeStart, rangeEnd }) {
  const opacity = useTransform(progress, [rangeStart, rangeStart + 0.08, rangeEnd - 0.08, rangeEnd], [0, 1, 1, 0])
  const y       = useTransform(progress, [rangeStart, rangeStart + 0.08], [50, 0])
  const scale   = useTransform(progress, [rangeStart, rangeStart + 0.08], [0.95, 1])

  return (
    <motion.div style={{ opacity, y, scale, position: 'absolute', width: '100%' }}>
      <CardContent step={step} large />
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

function ProcessDesktop() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progressBarH = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={ref} style={{ minHeight: '380vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
        background: 'transparent',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #7c3aed, #d946ef, transparent)',
        }} />
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '15%', left: '-8%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed, transparent)', opacity: 0.08, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, #d946ef, transparent)', opacity: 0.08, filter: 'blur(80px)' }} />
        </div>
        <div className="ds-container" style={{ width: '100%' }}>
          <div className="process-grid">
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', color: '#d946ef', textTransform: 'uppercase', marginBottom: '14px' }}>
                Cómo trabajamos
              </p>
              <h2 className="process-title" style={{ fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: '18px' }}>
                Nuestro<br /><span className="gradient-text">Proceso</span>
              </h2>
              <p className="process-desc" style={{ color: '#9d8fc2', lineHeight: 1.75, marginBottom: '32px' }}>
                De la idea al lanzamiento en 4 pasos claros. Contigo en cada etapa para que el resultado supere tus expectativas.
              </p>
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

export default function Process() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile ? <ProcessMobile /> : <ProcessDesktop />
}

