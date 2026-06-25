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
import { ArrowRight, Code2, Smartphone, TrendingUp, Globe, Database, Award, Shield, Layers } from 'lucide-react'

const floatingBadges = [
  { icon: <Code2 size={15} />,      label: 'Sitios Web',           right: '8%',  top: '24%', depth: 0.04 },
  { icon: <Smartphone size={15} />, label: 'Apps Android',         right: '6%',  top: '46%', depth: 0.06 },
  { icon: <Globe size={15} />,      label: 'Google Workspace',     right: '9%',  top: '66%', depth: 0.03 },
  { icon: <TrendingUp size={15} />, label: 'Marketing Digital',    left: '5%',   top: '28%', depth: 0.05 },
  { icon: <Database size={15} />,   label: 'Odoo ERP',             left: '4%',   top: '50%', depth: 0.07 },
  { icon: <Layers size={15} />,     label: 'Soluciones Digitales', left: '5%',   top: '68%', depth: 0.04 },
  { icon: <Shield size={15} />,     label: 'Soporte 24/7',         right: '8%',  top: '82%', depth: 0.06 },
  { icon: <Award size={15} />,      label: '100% Satisfechos',     left: '6%',   top: '84%', depth: 0.05 },
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
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '999px',
          background: 'rgba(17,13,48,0.85)',
          border: '1px solid rgba(124,58,237,0.5)',
          color: '#e879f9',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(124,58,237,0.2)',
          fontSize: '0.85rem', fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {b.icon}
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: '100px', paddingBottom: '80px' }}
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

      {/* Layer 3 — fastest + grid */}
      <motion.div style={{ y: yBlob3 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/2 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
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
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', color: '#e879f9',
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
            fontSize: '1.1rem', color: '#ddd6fe', maxWidth: '640px',
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
          style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}
        >
          {[
            { to: 50,  suffix: '+',  label: 'Proyectos Entregados' },
            { to: 5,   suffix: '+',  label: 'Años de Experiencia'  },
            { to: 100, suffix: '%',  label: 'Clientes Satisfechos' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: '80px' }}>
              <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, display: 'block', minWidth: '80px', textAlign: 'center' }}>
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div style={{ color: '#9d8fc2', fontSize: '0.75rem', marginTop: '6px' }}>{s.label}</div>
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

