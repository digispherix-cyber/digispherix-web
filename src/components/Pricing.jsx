'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, MessageCircle } from 'lucide-react'

const categories = ['Web', 'Android', 'Marketing', 'Odoo', 'Soporte']

const plans = {
  Web: [
    {
      name: 'Landing Page',
      price: '$5,000',
      period: 'pago único',
      desc: 'Página de aterrizaje para campañas o lanzamientos.',
      features: ['Diseño responsivo', 'Formulario de contacto', 'SEO básico', 'Entrega en 5 días'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'Starter Kit',
      price: '$9,000',
      period: 'pago único',
      renewal: '+ $3,500/año renovación',
      desc: 'Ideal para nuevas empresas o pequeños negocios.',
      features: ['Hasta 5 páginas', 'Dominio y hosting incluido', 'SSL gratis', 'Correos corporativos', 'SEO básico'],
      cta: 'Cotizar',
      highlight: true,
    },
    {
      name: 'Enterprise Engine',
      desde: true,
      price: '$18,000',
      period: 'pago único',
      renewal: '+ $3,500/año renovación',
      desc: 'Más funcionalidad para empresas en crecimiento.',
      features: ['Páginas ilimitadas', 'Blog / Noticias', 'Integración Google Analytics', 'Google Workspace', 'Mantenimiento mensual'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'E-Commerce',
      desde: true,
      price: '$30,000',
      period: 'pago único',
      renewal: '+ $3,500/año renovación',
      desc: 'Tienda en línea completa para vender productos.',
      features: ['Tienda en línea', 'Pasarela de pago', 'Gestión de inventario', 'Carrito de compras', 'Panel de administración'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'Web App',
      desde: true,
      price: '$35,000',
      period: 'pago único',
      desc: 'Aplicación web a la medida para automatizar procesos de tu negocio.',
      features: ['Login y gestión de usuarios', 'Base de datos en la nube', 'Panel de administración', 'Diseño responsivo', 'Integración con APIs', 'Soporte 60 días'],
      cta: 'Cotizar',
      highlight: false,
    },
  ],
  Android: [
    {
      name: 'Basic Builder',
      desde: true,
      price: '$25,000',
      period: 'pago único',
      desc: 'App funcional con características básicas para startups.',
      features: ['Hasta 5 pantallas', 'Diseño UI personalizado', 'API REST básica', 'Publicación en Play Store', 'Soporte 30 días'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'Advanced Architect',
      desde: true,
      price: '$45,000',
      period: 'pago único',
      desc: 'App compleja con base de datos y funciones avanzadas.',
      features: ['Pantallas ilimitadas', 'Base de datos en nube', 'Autenticación de usuarios', 'Notificaciones push', 'Panel de administración', 'Soporte 60 días'],
      cta: 'Cotizar',
      highlight: true,
    },
    {
      name: 'Custom Creator',
      price: 'Personalizado',
      period: 'consultar',
      desc: 'Desarrollo de alta complejidad con requisitos específicos.',
      features: ['Arquitectura a medida', 'Integraciones avanzadas', 'Múltiples módulos', 'Soporte extendido', 'Consultoría incluida'],
      cta: 'Contactar ventas',
      highlight: false,
    },
  ],
  Marketing: [
    {
      name: 'Social Starter',
      price: '$5,000',
      period: 'por mes',
      desc: 'Presencia activa en redes sociales para pequeñas empresas.',
      features: ['2 redes sociales', '12 publicaciones/mes', 'Diseño de contenido', 'Reporte mensual'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'Digital Influencer',
      price: '$8,000',
      period: 'por mes',
      desc: 'Amplía tu alcance con contenido dinámico y campañas.',
      features: ['4 redes sociales', '20 publicaciones/mes', 'Stories y Reels', 'Campañas de ads', 'Community manager'],
      cta: 'Cotizar',
      highlight: true,
    },
    {
      name: 'Marketing Maven',
      price: '$15,000',
      period: 'por mes',
      desc: 'Estrategia integral de marketing digital y social media.',
      features: ['Todas las plataformas', 'Contenido ilimitado', 'SEO + Ads + Email', 'Estrategia de marca', 'Reportes semanales', 'Soporte prioritario'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'SEO Starter',
      price: '$6,000',
      period: 'pago único',
      desc: 'Optimización inicial para mejorar tu posición en buscadores.',
      features: ['Investigación de palabras clave', 'Optimización de metadatos', 'SEO técnico básico', 'Reporte de posición inicial'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'SEO Pro',
      price: '$10,000',
      period: 'por mes',
      desc: 'Optimización avanzada y estrategia de contenido continua.',
      features: ['Todo lo de SEO Starter', 'Optimización de contenido existente', 'Construcción de enlaces internos', 'Estrategia de contenido mensual', 'Reportes de posicionamiento'],
      cta: 'Cotizar',
      highlight: false,
    },
  ],
  Odoo: [
    {
      name: 'Odoo Esencial',
      price: '$35,000',
      period: 'pago único',
      desc: 'La base para organizar tu negocio desde el primer día.',
      features: ['CRM (Gestión de Clientes)', 'Ventas (Cotizaciones y Pedidos)', 'Facturación', 'Implementación incluida', 'Capacitación inicial'],
      cta: 'Cotizar',
      highlight: false,
    },
    {
      name: 'Odoo Comercial',
      desde: true,
      price: '$75,000',
      period: 'pago único',
      desc: 'Control total sobre tus ventas, inventario y compras.',
      features: ['Todo lo de Odoo Esencial', 'Gestión de Inventario', 'Compras', 'Visión 360° de tu operación', 'Soporte incluido'],
      cta: 'Cotizar',
      highlight: true,
    },
    {
      name: 'Solución Integral Odoo',
      price: 'Personalizado',
      period: 'consultar',
      desc: 'Sistema de gestión empresarial totalmente a la medida.',
      features: ['Contabilidad', 'Proyectos', 'Fabricación', 'Recursos Humanos', 'Sitio Web / E-commerce', 'Módulos personalizables'],
      cta: 'Contactar ventas',
      highlight: false,
    },
  ],
  Soporte: [
    {
      name: 'Soporte Técnico',
      price: '$9,000',
      period: 'por año',
      desc: 'Mantenimiento continuo y soporte para tu sitio web.',
      features: ['Gestión de hosting', 'Actualizaciones de seguridad', 'Backups automáticos', 'Monitoreo de uptime', 'Bug fixing', 'SSL activo'],
      cta: 'Cotizar',
      highlight: true,
    },
  ],
}

function PlanCard({ plan, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const waMsg = encodeURIComponent(`Hola DigiSpherix! Me interesa el plan *${plan.name}* (${plan.price} ${plan.period}). ¿Podrían darme más información?`)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-2xl flex flex-col relative ${plan.highlight ? 'shimmer-card' : ''}`}
      style={{
        padding: '40px 36px 36px',
        background: plan.highlight
          ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(217,70,239,0.1))'
          : 'rgba(17,13,48,0.8)',
        border: plan.highlight
          ? '1px solid rgba(217,70,239,0.5)'
          : '1px solid rgba(124,58,237,0.2)',
      }}
    >
      {plan.highlight && (
        <div
          style={{
            position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
            padding: '4px 16px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
            background: 'linear-gradient(135deg, #7c3aed, #d946ef)', color: 'white',
            whiteSpace: 'nowrap',
          }}
        >
          Más Popular
        </div>
      )}

      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '6px', marginTop: plan.highlight ? '8px' : '0' }}>{plan.name}</h3>
      <p style={{ fontSize: '0.85rem', color: '#c4b5fd', marginBottom: '18px', lineHeight: 1.5 }}>{plan.desc}</p>

      <div style={{ marginBottom: '20px' }}>
        {plan.desde && (
          <div style={{ fontSize: '0.72rem', color: '#9d8fc2', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Desde</div>
        )}
        <span
          className="gradient-text"
          style={{ fontSize: plan.price.startsWith('$') ? '1.75rem' : '1.2rem', fontWeight: 900 }}
        >
          {plan.price}
        </span>
        <span style={{ color: '#9d8fc2', fontSize: '0.8rem', marginLeft: '8px' }}>MXN / {plan.period}</span>
        {plan.renewal && (
          <div style={{ fontSize: '0.72rem', color: '#7c6f9c', marginTop: '4px' }}>{plan.renewal}</div>
        )}
      </div>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', flex: 1 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#ddd6fe' }}>
            <Check size={15} style={{ color: '#e879f9', flexShrink: 0, marginTop: '2px' }} />
            {f}
          </li>
        ))}
      </ul>

      <a
        href={`https://wa.me/523320318435?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className={plan.highlight ? 'btn-primary justify-center' : 'btn-secondary justify-center'}
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        <MessageCircle size={16} />
        {plan.cta}
      </a>
    </motion.div>
  )
}

const gridColsByCount = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
}

// Cap width and center the grid for the low-count tabs (Tailwind max-w utilities
// aren't generated in this setup, so we use inline styles here).
const gridMaxWidthByCount = {
  1: '360px',
  2: '760px',
}

export default function Pricing() {
  const [activeTab, setActiveTab] = useState('Web')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const activePlans = plans[activeTab]
  const gridCols = gridColsByCount[activePlans.length] || 'sm:grid-cols-2 lg:grid-cols-4'
  const gridMaxWidth = gridMaxWidthByCount[activePlans.length]

  return (
    <section id="precios" className="ds-section relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #d946ef, transparent)' }}
      />

      <div className="ds-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#d946ef' }}>
            Planes y Precios
          </p>
          <h2 className="section-title gradient-text">Elige tu Plan</h2>
          <p className="section-subtitle">
            Precios transparentes en MXN. Sin costos ocultos. Todos los planes
            incluyen soporte y atención personalizada.
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px', padding: '0 16px' }}>
          <div
            style={{
              display: 'flex', gap: '4px', padding: '6px',
              borderRadius: '999px',
              background: 'rgba(17,13,48,0.8)',
              border: '1px solid rgba(124,58,237,0.3)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              maxWidth: '100%',
              paddingRight: '8px',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  ...(activeTab === cat
                    ? { background: 'linear-gradient(135deg, #7c3aed, #d946ef)', color: 'white' }
                    : { background: 'transparent', color: '#9d8fc2' }),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-1 ${gridCols} gap-6`}
          style={{ paddingTop: '16px', maxWidth: gridMaxWidth, marginInline: gridMaxWidth ? 'auto' : undefined }}
        >
          {activePlans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', color: '#a78bfa', fontSize: '0.875rem', marginTop: '48px' }}
        >
          ¿Necesitas algo diferente?{' '}
          <a href="#contacto" className="text-pink-400 hover:underline font-medium">
            Cotización personalizada sin compromiso
          </a>
        </motion.p>
      </div>
    </section>
  )
}

