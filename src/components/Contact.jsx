'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { MessageCircle, Mail, Phone, Send, MapPin } from 'lucide-react'

const contacts = [
  {
    icon: <MessageCircle size={22} />,
    label: 'WhatsApp',
    value: '+52 332 031 8435',
    href: 'https://wa.me/523320318435',
    color: '#25D366',
  },
  {
    icon: <Mail size={22} />,
    label: 'Ventas',
    value: 'ventas@digispherix.com.mx',
    href: 'mailto:ventas@digispherix.com.mx',
    color: '#7c3aed',
  },
  {
    icon: <Mail size={22} />,
    label: 'Información',
    value: 'info@digispherix.com.mx',
    href: 'mailto:info@digispherix.com.mx',
    color: '#d946ef',
  },
  {
    icon: <Mail size={22} />,
    label: 'Soporte',
    value: 'soporte@digispherix.com.mx',
    href: 'mailto:soporte@digispherix.com.mx',
    color: '#a855f7',
  },
  {
    icon: <MapPin size={22} />,
    label: 'Ubicación',
    value: 'México',
    href: null,
    color: '#f97316',
  },
]

const services = [
  'Sitio Web',
  'App Android',
  'Marketing Digital',
  'SEO / Publicidad',
  'Odoo ERP',
  'Soporte Técnico',
  'Otro',
]

const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 20px',
  borderRadius: '12px',
  background: 'rgba(17,13,48,0.8)',
  border: '1px solid rgba(124,58,237,0.2)',
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '0.875rem',
  color: 'white',
  background: 'rgba(12,9,35,0.8)',
  border: '1px solid rgba(124,58,237,0.3)',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  color: '#c4b5fd',
  marginBottom: '8px',
  fontWeight: 500,
}

export default function Contact() {
  const ref = useRef(null)
  const formRef = useRef(null)
  const inView = useInView(ref, { once: true })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '', _trap: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const sanitize = (str) => (str || '').replace(/[<>'"\\]/g, '').trim()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Read from DOM to capture both typed and autofilled values
    const fd = new FormData(formRef.current)
    if (fd.get('_trap')) return

    const name    = sanitize(fd.get('name'))
    const email   = sanitize(fd.get('email'))
    const phone   = sanitize(fd.get('phone'))
    const service = sanitize(fd.get('service'))
    const message = sanitize(fd.get('message'))

    if (!name || !email || !message) {
      setError('Por favor completa Nombre, Correo y Mensaje.')
      return
    }

    const msg = `Hola DigiSpherix! 👋\n\n*Nombre:* ${name}\n*Email:* ${email}\n*Teléfono:* ${phone || 'No indicado'}\n*Servicio de interés:* ${service || 'No especificado'}\n\n*Mensaje:*\n${message}`
    window.open(`https://wa.me/523320318435?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  return (
    <section id="contacto" className="ds-section relative" style={{ background: 'rgba(17,13,48,0.4)' }}>
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
            Hablemos
          </p>
          <h2 className="section-title gradient-text">Contacto</h2>
          <p className="section-subtitle">
            ¿Listo para llevar tu negocio al siguiente nivel? Cuéntanos tu proyecto
            y te respondemos en menos de 24 horas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '48px', alignItems: 'start' }}>
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
              ¿Tienes un proyecto en mente?
            </h3>
            <p style={{ color: '#c4b5fd', marginBottom: '32px', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Estamos aquí para ayudarte. Desde una landing page hasta una app Android completa,
              trabajamos contigo desde la planeación hasta el lanzamiento.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{ ...cardStyle, textDecoration: 'none', transition: 'transform 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${c.color}20`, color: c.color,
                      }}>
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9d8fc2', marginBottom: '4px' }}>{c.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{c.value}</div>
                      </div>
                    </a>
                  ) : (
                    <div style={cardStyle}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${c.color}20`, color: c.color,
                      }}>
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#9d8fc2', marginBottom: '4px' }}>{c.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{c.value}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              borderRadius: '16px',
              padding: '40px 36px',
              background: 'rgba(17,13,48,0.8)',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>¡Mensaje enviado!</h3>
                <p style={{ color: '#c4b5fd', fontSize: '0.875rem' }}>Te redirigimos a WhatsApp. Te respondemos pronto.</p>
                <button onClick={() => setSent(false)} className="btn-secondary" style={{ marginTop: '24px' }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Honeypot — invisible para humanos, bots lo llenan */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="_trap"
                    value={form._trap}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                {/* Nombre + Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
                  <div>
                    <label htmlFor="name" style={labelStyle}>Nombre *</label>
                    <input
                      id="name" name="name" value={form.name} onChange={handleChange}
                      placeholder="Tu nombre" style={inputStyle} autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" style={labelStyle}>Teléfono</label>
                    <input
                      id="phone" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="Tu teléfono" style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" style={labelStyle}>Correo electrónico *</label>
                  <input
                    id="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="tu@correo.com" style={inputStyle} autoComplete="email"
                  />
                </div>

                {/* Servicio */}
                <div>
                  <label htmlFor="service" style={labelStyle}>Servicio de interés</label>
                  <select
                    id="service" name="service" value={form.service} onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" style={labelStyle}>Mensaje *</label>
                  <textarea
                    id="message" name="message" rows={4} value={form.message} onChange={handleChange}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: '0.85rem', color: '#f87171', textAlign: 'center', marginTop: '-8px' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary justify-center"
                  style={{ padding: '14px', fontSize: '1rem' }}
                >
                  <Send size={17} />
                  Enviar por WhatsApp
                </button>

                <p style={{ fontSize: '0.75rem', textAlign: 'center', color: '#7c6f9c' }}>
                  Al enviar serás redirigido a WhatsApp para finalizar el contacto.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

