'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Globe, Smartphone, Megaphone, Database, LifeBuoy, Search } from 'lucide-react'

const services = [
  {
    icon: <Globe size={28} />,
    title: 'Diseño y Desarrollo Web',
    desc: 'Sitios web modernos, rápidos y responsivos. Desde landing pages hasta e-commerce completos con todo lo necesario para vender en línea.',
    tags: ['React', 'WordPress', 'E-Commerce', 'SEO'],
    color: '#7c3aed',
  },
  {
    icon: <Smartphone size={28} />,
    title: 'Apps Android',
    desc: 'Aplicaciones nativas para Android desarrolladas a medida. Desde apps básicas hasta soluciones empresariales complejas con base de datos.',
    tags: ['Kotlin', 'Firebase', 'API REST', 'Play Store'],
    color: '#d946ef',
  },
  {
    icon: <Megaphone size={28} />,
    title: 'Marketing Digital',
    desc: 'Estrategias de marketing digital y community manager para ampliar tu presencia en redes sociales y conectar con tu audiencia.',
    tags: ['Social Media', 'Contenido', 'Campañas', 'Branding'],
    color: '#a855f7',
  },
  {
    icon: <Search size={28} />,
    title: 'SEO & Publicidad Digital',
    desc: 'Optimización para motores de búsqueda y campañas PPC para generar tráfico real y clientes potenciales a tu negocio.',
    tags: ['Google Ads', 'SEO', 'Analytics', 'Conversión'],
    color: '#7c3aed',
  },
  {
    icon: <Database size={28} />,
    title: 'Soluciones Odoo ERP',
    desc: 'Implementación del sistema empresarial Odoo para gestionar CRM, ventas, inventario, facturación y más desde un solo lugar.',
    tags: ['CRM', 'Inventario', 'Facturación', 'Reportes'],
    color: '#d946ef',
  },
  {
    icon: <LifeBuoy size={28} />,
    title: 'Soporte y Mantenimiento',
    desc: 'Mantenimiento continuo de tu sitio web, gestión de hosting en SiteGround, actualizaciones de seguridad y soporte técnico.',
    tags: ['SiteGround', 'SSL', 'Backups', 'Monitoreo'],
    color: '#a855f7',
  },
]

function ServiceCard({ s, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.2 } }}
      className="gradient-border rounded-2xl cursor-default group"
      style={{
        padding: '30px 28px 28px',
        background: 'linear-gradient(135deg, rgba(17,13,48,0.9), rgba(12,9,35,0.9))',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ duration: 0.2 }}
        style={{
          width: '56px', height: '56px', borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '22px',
          background: `${s.color}22`, color: s.color,
        }}
      >
        {s.icon}
      </motion.div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>{s.title}</h3>
      <p style={{ color: '#c4b5fd', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '22px' }}>{s.desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {s.tags.map((t) => (
          <span
            key={t}
            style={{
              fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px', fontWeight: 500,
              background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}33`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef(null)
  const sectionRef = useRef(null)
  const inView = useInView(ref, { once: true })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const blobY1 = useTransform(scrollYProgress, [0, 1], ['-40px', '80px'])
  const blobY2 = useTransform(scrollYProgress, [0, 1], ['60px', '-60px'])

  return (
    <section id="servicios" ref={sectionRef} className="ds-section relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #d946ef, transparent)' }}
      />

      {/* Parallax background blobs */}
      <motion.div
        style={{ y: blobY1 }}
        className="absolute -top-20 -right-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        aria-hidden
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      </motion.div>
      <motion.div
        style={{ y: blobY2 }}
        className="absolute -bottom-20 -left-40 w-[450px] h-[450px] rounded-full opacity-10 blur-3xl pointer-events-none"
        aria-hidden
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, #d946ef, transparent)' }} />
      </motion.div>

      <div className="ds-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#d946ef' }}>
            Lo que hacemos
          </p>
          <h2 className="section-title gradient-text">Nuestros Servicios</h2>
          <p className="section-subtitle">
            Soluciones digitales completas para llevar tu negocio al siguiente nivel.
            Desde la idea hasta el producto final.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <ServiceCard key={s.title} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

