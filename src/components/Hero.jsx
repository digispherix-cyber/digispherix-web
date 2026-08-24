'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, animate } from 'framer-motion'
import { useRef, useEffect } from 'react'

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.floor(v))

  useEffect(() => {
    if (inView) animate(count, to, { duration: 2, ease: 'easeOut' })
  }, [inView, count, to])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}
import { ArrowRight, Code2, Smartphone, TrendingUp, Globe, Server, Award, Shield, Layers } from 'lucide-react'

// Acomodo simétrico: 4 pares parejos (misma altura izquierda-derecha,
// mismo margen de orilla y misma profundidad de parallax por par).
// Cada badge tiene su color de categoría (para el ícono, el borde y el glow).
const floatingBadges = [
  { icon: <Code2 size={15} />,      label: 'Sitios Web',           right: '7%', top: '26%', depth: 0.05, color: '#7c3aed' },
  { icon: <TrendingUp size={15} />, label: 'Marketing Digital',    left: '7%',  top: '26%', depth: 0.05, color: '#ec4899' },
  { icon: <Smartphone size={15} />, label: 'Apps Android',         right: '7%', top: '44%', depth: 0.06, color: '#22c55e' },
  { icon: <Server size={15} />,     label: 'Soluciones TI',        left: '7%',  top: '44%', depth: 0.06, color: '#0ea5e9' },
  { icon: <Globe size={15} />,      label: 'Google Workspace',     right: '7%', top: '62%', depth: 0.04, color: '#f59e0b' },
  { icon: <Layers size={15} />,     label: 'Soluciones Digitales', left: '7%',  top: '62%', depth: 0.04, color: '#a855f7' },
  { icon: <Shield size={15} />,     label: 'Soporte 24/7',         right: '7%', top: '80%', depth: 0.05, color: '#06b6d4' },
  { icon: <Award size={15} />,      label: '100% Satisfechos',     left: '7%',  top: '80%', depth: 0.05, color: '#f43f5e' },
]

function MouseBadge({ b, index, mouseX, mouseY }) {
  const x = useTransform(mouseX, (v) => v * b.depth * (b.left ? -1 : 1))
  const y = useTransform(mouseY, (v) => v * b.depth)
  const springX = useSpring(x, { stiffness: 60, damping: 20 })
  const springY = useSpring(y, { stiffness: 60, damping: 20 })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{
        opacity: 1, scale: 1,
        y: [0, -(6 + index * 1.5), 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.8 + index * 0.15 },
        scale:   { duration: 0.5, delay: 0.8 + index * 0.15, type: 'spring' },
        y: { duration: 3.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 + index * 0.2 },
      }}
      className="absolute hidden lg:block cursor-default select-none"
      style={{
        x: springX,
        y: springY,
        right: b.right,
        left: b.left,
        top: b.top,
      }}
      whileHover={{ scale: 1.12, transition: { duration: 0.15 } }}
    >
      {/* inner styled wrapper to avoid style conflict */}
      <div
        className="hero-badge"
        style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '7px 16px 7px 8px', borderRadius: '999px',
          background: 'var(--dropdown-bg)',
          border: `1px solid ${b.color}55`,
          color: 'var(--text-strong)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: `0 6px 22px -6px ${b.color}66`,
          fontSize: '0.85rem', fontWeight: 600,
          whiteSpace: 'nowrap',
          ['--bc']: b.color,
        }}
      >
        {/* Conector tipo constelación hacia el centro */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [b.right ? 'right' : 'left']: '100%',
            width: '30px', height: '1px',
            background: `linear-gradient(${b.right ? 'to left' : 'to right'}, ${b.color}, transparent)`,
          }}
        >
          <span style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            [b.right ? 'left' : 'right']: 0,
            width: '5px', height: '5px', borderRadius: '50%',
            background: b.color, boxShadow: `0 0 6px ${b.color}`,
          }} />
        </span>

        {/* Ícono en círculo de color */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
          background: `${b.color}22`, border: `1px solid ${b.color}55`, color: b.color,
        }}>
          {b.icon}
        </span>
        {b.label}
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity   = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const yBlob1    = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const yBlob2    = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])
  const yBlob3    = useTransform(scrollYProgress, [0, 1], ['0%', '85%'])
  const yContent  = useTransform(scrollYProgress, [0, 1], ['0px', '60px'])
  const scaleBg   = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  // Mouse tracking for badge parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mouseX.set(e.clientX - cx)
      mouseY.set(e.clientY - cy)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-x-clip"
      style={{ paddingTop: '100px', paddingBottom: '80px', color: 'var(--text)' }}
    >
      {/* Layer 1 — slowest */}
      <motion.div style={{ y: yBlob1, scale: scaleBg }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      </motion.div>

      {/* Layer 2 — medium */}
      <motion.div style={{ y: yBlob2 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d946ef, transparent)' }} />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
      </motion.div>

      {/* Layer 3 — fastest (sin cuadrícula, para empatar con las demás secciones) */}
      <motion.div style={{ y: yBlob3 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/2 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ opacity, y: yContent, maxWidth: '860px', margin: '0 auto', padding: '0 40px' }}
        className="relative z-10 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
        >
          <img src="/logo-square.png" alt="DigiSpherix" className="object-contain drop-shadow-2xl"
            style={{ width: '164px', height: '164px' }} />
        </motion.div>

        {/* Tagline pill */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 500,
            background: 'var(--bg-card-alt)', border: '1px solid var(--border)', color: 'var(--accent-2)',
            marginBottom: '28px',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          Transformamos ideas en experiencias digitales
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black leading-tight"
          style={{ marginBottom: '28px' }}
        >
          Diseño Web &{' '}
          <span className="gradient-text">Apps Android</span>
          <br />
          que impulsan tu negocio
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: '1.1rem', color: 'var(--text)', maxWidth: '640px',
            margin: '0 auto', lineHeight: 1.7, textAlign: 'center',
          }}
        >
          Creamos sitios web modernos, aplicaciones Android y estrategias de marketing digital
          que conectan tu marca con el mundo. Basados en México, trabajando global.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ marginTop: '40px', marginBottom: '64px' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#contacto" className="btn-primary text-base px-8 py-4">
            Iniciar Proyecto <ArrowRight size={18} />
          </a>
          <a href="#portafolio" className="btn-secondary text-base px-8 py-4">
            Ver Portafolio
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 5vw, 32px)' }}
        >
          {[
            { to: 50,  suffix: '+',  label: 'Proyectos Entregados' },
            { to: 5,   suffix: '+',  label: 'Años de Experiencia'  },
            { to: 100, suffix: '%',  label: 'Clientes Satisfechos' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: '70px' }}>
              <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, display: 'block', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Mouse-reactive floating badges */}
      {floatingBadges.map((b, i) => (
        <MouseBadge key={b.label} b={b} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </section>
  )
}

