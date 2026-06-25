import { motion } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'
import { useState } from 'react'
import { easterEggTrigger } from './EasterEggGame'

const links = {
  Servicios: [
    { label: 'Diseño Web', href: '#servicios' },
    { label: 'Apps Android', href: '#servicios' },
    { label: 'Marketing Digital', href: '#servicios' },
    { label: 'Odoo ERP', href: '#servicios' },
    { label: 'Soporte Técnico', href: '#servicios' },
  ],
  Empresa: [
    { label: 'Portafolio', href: '#portafolio' },
    { label: 'Precios', href: '#precios' },
    { label: 'Contacto', href: '#contacto' },
  ],
}

export default function Footer() {
  const [tapCount, setTapCount] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const handleLogoTap = () => {
    const next = tapCount + 1
    setTapCount(next)
    if (next >= 5) {
      setTapCount(0)
      if (easterEggTrigger.open) easterEggTrigger.open()
    }
  }

  return (
    <footer className="relative px-6" style={{ borderTop: '1px solid rgba(124,58,237,0.2)', paddingTop: '72px', paddingBottom: '40px' }}>
      <div className="ds-container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/logo-icon.png"
                alt="DigiSpherix"
                className="h-10 w-10 object-contain"
                onClick={handleLogoTap}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="🎮"
              />
              <span className="text-xl font-bold">
                <span style={{ color: '#6b21a8' }}>Digi</span>
                <span style={{ color: '#e879f9' }}>Spherix</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9d8fc2', lineHeight: 2, maxWidth: '280px', marginBottom: '24px' }}>
              Transformamos ideas en experiencias digitales. Desarrollo web, apps Android
              y marketing digital para empresas en México.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/523320318435"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:info@digispherix.com.mx"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#a855f7', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px', fontSize: '0.95rem' }}>{section}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{ fontSize: '0.875rem', color: '#9d8fc2', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#e879f9'}
                      onMouseLeave={e => e.target.style.color = '#9d8fc2'}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{ borderTop: '1px solid rgba(124,58,237,0.2)', paddingTop: '24px', textAlign: 'center' }}
        >
          <p style={{ fontSize: '0.75rem', color: '#6b5fa0' }}>
            © {new Date().getFullYear()} DigiSpherix. Todos los derechos reservados.
          </p>
          <p
            style={{ fontSize: '0.65rem', color: '#3d2f6e', marginTop: '6px', cursor: 'default', userSelect: 'none' }}
            onMouseEnter={e => e.target.style.color = '#7c3aed'}
            onMouseLeave={e => e.target.style.color = '#3d2f6e'}
            title="↑↑↓↓←→←→BA"
          >
            🎮 Psst... ¿conoces el código Konami?
          </p>
        </div>
      </div>
    </footer>
  )
}
