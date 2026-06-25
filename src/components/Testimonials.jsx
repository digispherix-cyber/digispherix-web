import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Roberto Hernández',
    role: 'Director General',
    company: 'Gambvel Electric',
    text: 'DigiSpherix transformó nuestra presencia digital por completo. Nuestra tienda en línea incrementó las ventas en un 40% el primer mes. El equipo estuvo disponible en todo momento y entregaron antes del plazo.',
    rating: 5,
    color: '#e67e00',
    initials: 'RH',
  },
  {
    name: 'Dra. Mariana Torres',
    role: 'Directora Médica',
    company: 'San Vicente Hospital',
    text: 'Necesitábamos un sitio serio y confiable para nuestros pacientes. DigiSpherix entendió perfectamente nuestra imagen institucional. El resultado superó todas nuestras expectativas. 100% recomendados.',
    rating: 5,
    color: '#dc2626',
    initials: 'MT',
  },
  {
    name: 'Ing. Carlos Mendoza',
    role: 'Gerente de Operaciones',
    company: 'Termocontroles',
    text: 'Excelente trabajo. Lograron integrar nuestro catálogo industrial completo con una navegación muy intuitiva. El soporte post-entrega es de primera — responden rápido y resuelven cualquier duda.',
    rating: 5,
    color: '#2563eb',
    initials: 'CM',
  },
  {
    name: 'Lic. Patricia Solano',
    role: 'CEO',
    company: 'Corporativo Sollem',
    text: 'Buscábamos una agencia que entendiera el mundo corporativo. DigiSpherix nos dio exactamente lo que necesitábamos: diseño elegante, rápido y que proyecta profesionalismo. Gran inversión.',
    rating: 5,
    color: '#16a34a',
    initials: 'PS',
  },
]

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
        >
          <Star size={16} fill="#f59e0b" color="#f59e0b" />
        </motion.div>
      ))}
    </div>
  )
}

function TestimonialCard({ t, index, isActive, onClick }) {
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springRotX = useSpring(rotX, { stiffness: 200, damping: 20 })
  const springRotY = useSpring(rotY, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotX.set(((e.clientY - cy) / (rect.height / 2)) * -6)
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 8)
  }
  const handleMouseLeave = () => { rotX.set(0); rotY.set(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotX,
        rotateY: springRotY,
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
      }}
      whileHover={{ y: -6 }}
    >
      <div style={{
        borderRadius: '20px',
        padding: '32px',
        background: isActive
          ? `linear-gradient(135deg, ${t.color}18, rgba(17,13,48,0.9))`
          : 'rgba(17,13,48,0.7)',
        border: `1px solid ${isActive ? t.color + '60' : 'rgba(124,58,237,0.2)'}`,
        boxShadow: isActive ? `0 0 40px ${t.color}20` : 'none',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Quote icon */}
        <div style={{ color: t.color, opacity: 0.5 }}>
          <Quote size={28} fill="currentColor" />
        </div>

        {/* Text */}
        <p style={{ color: '#ddd6fe', fontSize: '0.92rem', lineHeight: 1.8, flex: 1, fontStyle: 'italic' }}>
          "{t.text}"
        </p>

        {/* Rating */}
        <StarRating count={t.rating} />

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${t.color}25`, color: t.color,
            fontWeight: 800, fontSize: '1rem',
            border: `2px solid ${t.color}40`,
          }}>
            {t.initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{t.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#9d8fc2' }}>{t.role} · {t.company}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [active, setActive] = useState(0)

  return (
    <section id="testimonios" className="ds-section relative">
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
            Lo que dicen
          </p>
          <h2 className="section-title gradient-text">Clientes Satisfechos</h2>
          <p className="section-subtitle">
            Más de 20 empresas confían en DigiSpherix para su presencia digital.
            Estos son algunos de sus comentarios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1000px' }}>
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              index={i}
              isActive={active === i}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '100%', label: 'Clientes satisfechos' },
            { value: '+20', label: 'Proyectos entregados' },
            { value: '5★', label: 'Calificación promedio' },
            { value: '<24h', label: 'Tiempo de respuesta' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              style={{ textAlign: 'center' }}
            >
              <div className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#9d8fc2', marginTop: '4px' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
