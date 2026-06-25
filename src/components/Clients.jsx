import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const clients = [
  { name: 'Gambvel',             logo: '/logo-gambvel.png' },
  { name: 'Termocontroles',      logo: '/logo-termocontroles.png' },
  { name: 'Sollem',              logo: '/logo-sollem.png' },
  { name: 'Hospital San Vicente',logo: '/logo-sanvicente.png' },
  { name: 'Catering Sollem',     logo: '/logo-catering-sollem.png' },
  { name: 'Holistic Sollem',     logo: '/logo-holistic-sollem.png' },
  { name: 'Sollem & Tea',        logo: '/logo-sollem-and-tea.png' },
  { name: 'Rincón Sollem',       logo: '/logo-rincon-sollem.png' },
]

export default function Clients() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ padding: '48px 0', borderTop: '1px solid rgba(124,58,237,0.12)', borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(12,9,35,0.6)' }}>
      <div className="ds-container">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b5fa0', marginBottom: '32px' }}
        >
          Empresas que confían en nosotros
        </motion.p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px 64px' }}>
          {clients.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ opacity: 1, scale: 1.08 }}
              style={{ opacity: 0.5, filter: 'grayscale(100%) brightness(1.8)', transition: 'filter 0.3s, opacity 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0%) brightness(1)'; e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%) brightness(1.8)'; e.currentTarget.style.opacity = '0.5' }}
            >
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                style={{ height: '48px', width: 'auto', maxWidth: '140px', objectFit: 'contain' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
