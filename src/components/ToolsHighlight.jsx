'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  Maximize2, Repeat, KeyRound, QrCode, FileImage, FileArchive,
  ImageDown, FileStack, ScanText, Palette, Binary, Type,
  Wrench, ArrowRight, ShieldCheck,
} from 'lucide-react'
import { tools } from '../lib/tools'

const icons = { Maximize2, Repeat, KeyRound, QrCode, FileImage, FileArchive, ImageDown, FileStack, ScanText, Palette, Binary, Type }

// Herramientas destacadas en la home (teaser). El resto vive en /herramientas.
const FEATURED = ['generador-qr', 'comprimir-imagen', 'comprimir-pdf', 'generador-contrasena', 'convertir-imagen', 'imagen-a-pdf']

const featuredTools = FEATURED
  .map((slug) => tools.find((t) => t.slug === slug && t.ready && !t.hidden))
  .filter(Boolean)

function ToolCard({ tool }) {
  const Icon = icons[tool.icon] || Wrench
  return (
    <Link
      href={`/herramientas/${tool.slug}`}
      style={{ textDecoration: 'none', flexShrink: 0, width: 'clamp(260px, 78vw, 460px)', scrollSnapAlign: 'center' }}
    >
      <article
        className="tool-card"
        style={{
          position: 'relative', height: '100%', minHeight: 'clamp(240px, 40vh, 340px)',
          display: 'flex', flexDirection: 'column',
          background: 'rgba(17,13,48,0.8)', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '20px', padding: 'clamp(28px, 3vw, 40px)', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${tool.accent}, ${tool.accent}55)` }} />
        <div
          style={{
            width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${tool.accent}20`, border: `1px solid ${tool.accent}40`, marginBottom: '20px',
          }}
        >
          <Icon size={28} style={{ color: tool.accent }} />
        </div>
        <h3 style={{ fontSize: 'clamp(1.2rem, 1.6vw, 1.5rem)', fontWeight: 800, color: 'white', marginBottom: '10px' }}>{tool.name}</h3>
        <p style={{ color: '#9d8fc2', fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', lineHeight: 1.6, flexGrow: 1, marginBottom: '20px' }}>
          {tool.tagline || tool.description}
        </p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e879f9', fontSize: '0.9rem', fontWeight: 600 }}>
          Usar gratis <ArrowRight size={16} />
        </span>
      </article>
    </Link>
  )
}

function Header() {
  return (
    <div className="ds-container">
      <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#d946ef' }}>
        Gratis para ti
      </p>
      <h2 className="section-title gradient-text">Herramientas gratis</h2>
      <p className="section-subtitle">
        Utilidades rápidas para tu día a día: imágenes, PDF, códigos QR y más.
        Funcionan en tu navegador — tus archivos nunca se suben a internet.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', borderRadius: '99px', background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399', fontSize: '0.82rem', fontWeight: 600 }}>
          <ShieldCheck size={15} /> 100% gratis · sin registro · privado
        </span>
      </div>
    </div>
  )
}

function Cta() {
  return (
    <div className="ds-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <Link href="/herramientas" className="btn-primary" style={{ display: 'inline-flex' }}>
        Ver todas las herramientas gratis <ArrowRight size={16} />
      </Link>
    </div>
  )
}

export default function ToolsHighlight() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0) // px de recorrido horizontal
  const [pin, setPin] = useState(false)        // true = efecto pin (escritorio)

  useEffect(() => {
    const calc = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      if (!isDesktop || reduce || !trackRef.current) {
        setPin(false); setDistance(0); return
      }
      const d = trackRef.current.scrollWidth - window.innerWidth + 80
      setDistance(Math.max(0, d))
      setPin(d > 0)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  return (
    <section
      id="herramientas-gratis"
      ref={sectionRef}
      className="relative"
      style={pin ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #d946ef, transparent)' }}
      />

      <div
        style={{
          position: pin ? 'sticky' : 'static',
          top: 0,
          height: pin ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingBlock: pin ? '0' : 'clamp(64px, 9vw, 110px)',
        }}
      >
        <Header />

        {/* Pista de tarjetas */}
        <motion.div
          ref={trackRef}
          style={{
            x: pin ? x : 0,
            display: 'flex',
            gap: '24px',
            paddingInline: 'clamp(16px, 5vw, 64px)',
            marginTop: '40px',
            overflowX: pin ? 'visible' : 'auto',
            scrollSnapType: pin ? undefined : 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {featuredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </motion.div>

        {/* Pista para deslizar (solo cuando NO hay pin: móvil / reduced-motion) */}
        {!pin && (
          <p style={{ textAlign: 'center', color: '#6b5fa0', fontSize: '0.8rem', marginTop: '14px' }}>
            Desliza para ver más →
          </p>
        )}

        <Cta />
      </div>
    </section>
  )
}
