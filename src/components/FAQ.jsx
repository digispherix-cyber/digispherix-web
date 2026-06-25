import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: '¿Cuánto tiempo tarda en estar listo mi sitio web?',
    a: 'Depende del plan. Una Landing Page la entregamos en 5 días hábiles. Un Starter Kit tarda entre 2 y 3 semanas. Proyectos más complejos como E-Commerce o apps Android pueden tomar de 4 a 8 semanas. Siempre te damos una fecha exacta antes de iniciar.',
    color: '#7c3aed',
  },
  {
    q: '¿Qué incluye el dominio y hosting?',
    a: 'En los planes Starter Kit, Enterprise Engine y E-Commerce incluimos dominio (.com.mx o .com) y hosting por 1 año. A partir del segundo año la renovación es de $3,500 MXN anuales, que cubre dominio, hosting, SSL y backups automáticos.',
    color: '#d946ef',
  },
  {
    q: '¿Puedo hacer cambios después de entregar el sitio?',
    a: 'Sí. Durante los primeros 30 días hacemos ajustes sin costo. Después, cualquier cambio menor lo resolvemos en menos de 24 horas a través de nuestro plan de Soporte Técnico ($9,000/año) o por cotización individual si prefieres.',
    color: '#a855f7',
  },
  {
    q: '¿El sitio se ve bien en celular?',
    a: 'Todos nuestros sitios son 100% responsivos — se adaptan perfectamente a móviles, tablets y computadoras. Además los probamos en múltiples dispositivos antes de la entrega para garantizar que todo funcione correctamente.',
    color: '#7c3aed',
  },
  {
    q: '¿Necesito tener el contenido (textos e imágenes) listo?',
    a: 'No es obligatorio desde el inicio. Te ayudamos a definir la estructura y podemos usar contenido provisional mientras recopilas el tuyo. Sin embargo, entre más información nos des al inicio, más rápido avanzamos y mejor queda el resultado.',
    color: '#d946ef',
  },
  {
    q: '¿Cómo es el proceso de pago?',
    a: 'Trabajamos con 50% al iniciar el proyecto y 50% al momento de la entrega final. Aceptamos transferencia bancaria, tarjeta de crédito/débito y PayPal. Para proyectos grandes podemos acordar un esquema de pagos parciales.',
    color: '#a855f7',
  },
  {
    q: '¿Pueden hacer mi app para iOS también?',
    a: 'Por el momento nos especializamos en apps Android nativas. Sin embargo, si tu proyecto lo requiere podemos desarrollar una Progressive Web App (PWA) que funciona en iOS y Android sin necesidad de descargar nada desde la App Store.',
    color: '#7c3aed',
  },
  {
    q: '¿Qué pasa si no me gusta el diseño?',
    a: 'Antes de programar cualquier línea de código, te presentamos el diseño visual completo para tu aprobación. Incluimos hasta 2 rondas de revisiones sin costo. Tu aprobación del diseño es requisito para iniciar el desarrollo.',
    color: '#d946ef',
  },
]

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        borderRadius: '14px',
        border: `1px solid ${isOpen ? item.color + '50' : 'rgba(124,58,237,0.2)'}`,
        background: isOpen ? `${item.color}08` : 'rgba(17,13,48,0.6)',
        overflow: 'hidden',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px',
          padding: '22px 28px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isOpen ? 'white' : '#ddd6fe', lineHeight: 1.4 }}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isOpen ? `${item.color}25` : 'rgba(124,58,237,0.15)',
            color: isOpen ? item.color : '#a78bfa',
          }}
        >
          <Plus size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 28px 24px' }}>
              <div style={{ width: '100%', height: '1px', background: `${item.color}25`, marginBottom: '16px' }} />
              <p style={{ color: '#c4b5fd', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [openIndex, setOpenIndex] = useState(0)

  const half = Math.ceil(faqs.length / 2)
  const left = faqs.slice(0, half)
  const right = faqs.slice(half)

  return (
    <section id="faq" className="ds-section relative" style={{ background: 'rgba(12,9,35,0.3)' }}>
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
            Preguntas frecuentes
          </p>
          <h2 className="section-title gradient-text">FAQ</h2>
          <p className="section-subtitle">
            Resolvemos las dudas más comunes antes de que inicies tu proyecto con nosotros.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {left.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {right.map((item, i) => (
              <FAQItem
                key={i + half}
                item={item}
                index={i + half}
                isOpen={openIndex === i + half}
                onToggle={() => setOpenIndex(openIndex === i + half ? null : i + half)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '60px' }}
        >
          <p style={{ color: '#9d8fc2', marginBottom: '20px', fontSize: '0.95rem' }}>
            ¿Tienes una pregunta que no está aquí?
          </p>
          <a
            href="https://wa.me/523320318435?text=Hola%20DigiSpherix!%20Tengo%20una%20pregunta%20sobre%20sus%20servicios."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Pregúntanos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
