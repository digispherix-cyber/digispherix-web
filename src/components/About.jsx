'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Code2, Smartphone, TrendingUp, Award } from 'lucide-react'
import Image from 'next/image'

const certifications = [
  {
    name: 'Google Ads Search Certified',
    badge: '/badge-google-ads-search.png',
    url: 'https://skillshop.credential.net/83126914-0b0a-4653-93df-db2d45a8db82',
  },
  {
    name: 'Google Ads Display Certified',
    badge: '/badge-google-ads-display.png',
    url: 'https://skillshop.credential.net/7134a508-013f-4dd6-b768-cc826ff2ad96',
  },
  {
    name: 'Google Analytics Certified',
    badge: '/badge-google-analytics.png',
    url: 'https://skillshop.credential.net/78775cf8-8a42-47a7-8383-52f96f84fb57',
  },
]

const skills = [
  { label: 'React & Vite', pct: 90 },
  { label: 'Android / Kotlin', pct: 85 },
  { label: 'WordPress / Divi', pct: 95 },
  { label: 'Marketing Digital', pct: 80 },
  { label: 'Odoo ERP', pct: 75 },
  { label: 'SEO & Google Ads', pct: 82 },
]

const highlights = [
  { icon: <Code2 size={20} />, label: 'Desarrollo Web', sub: 'React · WordPress · PHP' },
  { icon: <Smartphone size={20} />, label: 'Apps Android', sub: 'Kotlin · Firebase · APIs' },
  { icon: <TrendingUp size={20} />, label: 'Marketing Digital', sub: 'SEO · Ads · Social Media' },
  { icon: <Award size={20} />, label: 'Odoo ERP', sub: 'CRM · Ventas · Inventario' },
]

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const blobY     = useTransform(scrollYProgress, [0, 1], ['-60px', '60px'])
  const skillsY   = useTransform(scrollYProgress, [0, 1], ['30px', '-30px'])
  const textY     = useTransform(scrollYProgress, [0, 1], ['-20px', '20px'])

  return (
    <section ref={ref} id="nosotros" className="ds-section relative overflow-hidden">
      {/* Parallax background blob */}
      <motion.div
        style={{ y: blobY, background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        className="absolute -left-40 top-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ y: blobY, background: 'radial-gradient(circle, #d946ef, transparent)' }}
        className="absolute -right-40 bottom-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
      />

      <div className="ds-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#d946ef' }}>
              Quién soy
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Agencia de Diseño Web
              <br />
              <span className="gradient-text">en Guadalajara</span>
            </h2>
            <p className="text-purple-300 leading-relaxed mb-6 text-lg">
              Somos una agencia de diseño web y desarrollo de apps Android con sede en Guadalajara,
              México. Con más de 5 años de experiencia, hemos ayudado a empresas mexicanas
              a construir su presencia digital desde cero.
            </p>
            <p className="text-purple-400 leading-relaxed mb-8">
              Combinamos diseño atractivo, código limpio y estrategias de marketing digital
              para que cada proyecto no solo se vea bien, sino que también genere resultados
              reales para tu negocio.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '32px' }}>
              {highlights.map((h) => (
                <div
                  key={h.label}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '16px 18px', borderRadius: '12px',
                    background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)'
                  }}
                >
                  <div style={{ color: '#e879f9', marginTop: '2px', flexShrink: 0 }}>{h.icon}</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }}>{h.label}</div>
                    <div style={{ color: '#9d8fc2', fontSize: '0.75rem', marginTop: '4px' }}>{h.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — skills */}
          <motion.div
            style={{ y: skillsY }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div
              style={{
                borderRadius: '16px', padding: '36px 32px 32px',
                background: 'rgba(17,13,48,0.8)', border: '1px solid rgba(124,58,237,0.3)'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '28px' }}>Stack & Habilidades</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {skills.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-200 font-medium">{s.label}</span>
                      <span style={{ color: '#d946ef' }}>{s.pct}%</span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(124,58,237,0.2)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #7c3aed, #d946ef)' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Certificaciones Google */}
              <div style={{ marginTop: '28px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9d8fc2', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                  Certificaciones Google
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {certifications.map((cert) => (
                    <a
                      key={cert.name}
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={cert.name}
                      style={{
                        display: 'block', borderRadius: '10px', overflow: 'hidden',
                        transition: 'transform 0.2s, opacity 0.2s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Image
                        src={cert.badge}
                        alt={cert.name}
                        width={110}
                        height={110}
                        style={{ display: 'block', width: 'clamp(80px, 10vw, 110px)', height: 'auto' }}
                        sizes="110px"
                      />
                    </a>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: '28px', padding: '22px 20px', borderRadius: '12px', textAlign: 'center',
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(217,70,239,0.3)'
                }}
              >
                <p style={{ fontSize: '0.875rem', color: '#c4b5fd', marginBottom: '14px' }}>¿Listo para trabajar juntos?</p>
                <a href="#contacto" className="btn-primary inline-flex text-sm px-6 py-2.5">
                  Hablemos de tu proyecto
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

