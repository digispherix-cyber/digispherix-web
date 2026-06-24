import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    name: 'Gambvel',
    url: 'https://gambvel.com.mx',
    category: 'E-Commerce Industrial',
    desc: 'Tienda en línea para distribuidora de equipo de automatización y control industrial con catálogo de productos.',
    color: '#e67e00',
    image: '/gambvel.png',
  },
  {
    name: 'Termocontroles',
    url: 'https://termocontroles.com.mx',
    category: 'Sitio Industrial',
    desc: 'Plataforma web para empresa de control de temperatura con tienda en línea y catálogo de productos industriales.',
    color: '#2563eb',
    image: '/termocontroles.png',
  },
  {
    name: 'San Vicente Hospital',
    url: 'https://sanvicentehospital.com.mx',
    category: 'Salud',
    desc: 'Sitio web institucional para hospital médico-quirúrgico con información de especialidades y servicios médicos 24/7.',
    color: '#dc2626',
    image: '/sanvicente.png',
  },
  {
    name: 'Corporativo Sollem',
    url: 'https://corporativosollem.com',
    category: 'Corporativo',
    desc: 'Diseño web profesional para corporativo empresarial con identidad visual moderna y presencia digital estratégica.',
    color: '#16a34a',
    image: '/sollem.png',
  },
]

function ProjectCard({ p, index }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-60px' })

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  const springRotX = useSpring(rotX, { stiffness: 200, damping: 20 })
  const springRotY = useSpring(rotY, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotX.set(((e.clientY - cy) / (rect.height / 2)) * -10)
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 12)
    glowX.set(((e.clientX - rect.left) / rect.width) * 100)
    glowY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  const handleMouseLeave = () => {
    rotX.set(0)
    rotY.set(0)
    glowX.set(50)
    glowY.set(50)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotX,
        rotateY: springRotY,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        height: '100%',
      }}
      className="cursor-pointer"
    >
      <motion.div
        style={{
          background: 'rgba(17,13,48,0.88)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        whileHover={{ boxShadow: `0 20px 60px ${p.color}35` }}
        transition={{ duration: 0.3 }}
      >
        {/* Spotlight glow */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', borderRadius: '16px',
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${p.color}20 0%, transparent 65%)`,
          }}
        />

        {/* Browser chrome */}
        <div style={{
          background: '#1a1630', padding: '7px 10px',
          display: 'flex', alignItems: 'center', gap: '5px',
          borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: '4px',
            padding: '2px 8px', fontSize: '7px', color: '#9d8fc2', marginLeft: '4px',
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {p.url.replace('https://', '')}
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ height: '180px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          <motion.img
            src={p.image}
            alt={`Screenshot de ${p.name}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top',
              display: 'block',
            }}
          />

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'rgba(10,7,28,0.82)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '999px',
                fontWeight: 600, fontSize: '0.875rem',
                background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                color: 'white', textDecoration: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Visitar Sitio <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>

        {/* Card body */}
        <div style={{ padding: '18px 20px 22px', position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
            background: `${p.color}18`, color: p.color, display: 'inline-block',
          }}>
            {p.category}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginTop: '10px', marginBottom: '6px' }}>{p.name}</h3>
          <p style={{ fontSize: '0.82rem', color: '#c4b5fd', lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="portafolio" className="ds-section relative" style={{ background: 'rgba(17,13,48,0.4)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #d946ef, #7c3aed, transparent)' }}
      />

      <div className="ds-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#d946ef' }}>
            Nuestro trabajo
          </p>
          <h2 className="section-title gradient-text">Portafolio</h2>
          <p className="section-subtitle">
            Proyectos reales desarrollados para clientes que confían en DigiSpherix
            para su presencia digital.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1200px', alignItems: 'stretch' }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.name} p={p} index={i} />
          ))}
        </div>

        {/* Más proyectos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '48px',
            padding: '28px 32px',
            borderRadius: '16px',
            background: 'rgba(124,58,237,0.07)',
            border: '1px solid rgba(124,58,237,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>+20</div>
              <div style={{ fontSize: '0.75rem', color: '#9d8fc2', marginTop: '4px' }}>sitios entregados</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(124,58,237,0.3)' }} />
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                Estos son solo algunos de nuestros proyectos
              </p>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem' }}>
                Hemos trabajado con empresas de industria, salud, comercio y servicios en toda México.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/523320318435?text=Hola%20DigiSpherix!%20Me%20gustar%C3%ADa%20ver%20m%C3%A1s%20ejemplos%20de%20su%20portafolio."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Ver más proyectos
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <p style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '20px' }}>¿Quieres un sitio así para tu negocio?</p>
          <a href="#contacto" className="btn-primary">
            Platiquemos tu Proyecto
          </a>
        </motion.div>
      </div>
    </section>
  )
}
