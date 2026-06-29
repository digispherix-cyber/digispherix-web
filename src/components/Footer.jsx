'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { easterEggTrigger } from './EasterEggGame'

const navLinks = {
  Servicios: [
    { label: 'Diseño Web',        hash: '#servicios' },
    { label: 'Apps Android',      hash: '#servicios' },
    { label: 'Marketing Digital', hash: '#servicios' },
    { label: 'Odoo ERP',          hash: '#servicios' },
    { label: 'Soporte Técnico',   hash: '#servicios' },
  ],
  Empresa: [
    { label: 'Portafolio', hash: '#portafolio' },
    { label: 'Precios',    hash: '#precios' },
    { label: 'Contacto',   hash: '#contacto' },
  ],
}

export default function Footer() {
  const [tapCount, setTapCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const links = Object.fromEntries(
    Object.entries(navLinks).map(([section, items]) => [
      section,
      items.map(item => ({ label: item.label, href: isHome ? item.hash : `/${item.hash}` })),
    ])
  )

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
      <style>{`
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; text-align: center; }
          .footer-social { flex-wrap: wrap; justify-content: center; }
          .footer-grid p { max-width: 100% !important; }
          .footer-grid picture { display: flex; justify-content: center; }
        }
      `}</style>
      <div className="ds-container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <picture>
                <source srcSet="/logo-horizontal.webp" type="image/webp" />
                <img
                  src="/logo-horizontal.png"
                  alt="DigiSpherix"
                  className="object-contain"
                  style={{ height: '48px', width: 'auto', cursor: 'pointer', userSelect: 'none' }}
                  onClick={handleLogoTap}
                  title="🎮"
                />
              </picture>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9d8fc2', lineHeight: 2, maxWidth: '280px', marginBottom: '24px' }}>
              Transformamos ideas en experiencias digitales. Desarrollo web, apps Android
              y marketing digital para empresas en México.
            </p>
            <div className="footer-social flex gap-3" style={{ flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/523320318435"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contáctanos por WhatsApp"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:info@digispherix.com.mx"
                aria-label="Envíanos un correo electrónico"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#a855f7', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <Mail size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591141545596"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Facebook"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(24,119,242,0.15)', color: '#1877F2', border: '1px solid rgba(24,119,242,0.3)' }}
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href="https://www.instagram.com/digispherix/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(225,48,108,0.15)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.3)' }}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/digispherix/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en LinkedIn"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(10,102,194,0.15)', color: '#0A66C2', border: '1px solid rgba(10,102,194,0.3)' }}
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@digispherix"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en TikTok"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <TikTokIcon size={18} />
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
          <p style={{ fontSize: '0.75rem', color: '#9d8fc2' }}>
            © {new Date().getFullYear()} DigiSpherix. Todos los derechos reservados.
          </p>
          {typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches ? (
            <p style={{ fontSize: '0.65rem', color: '#6b5fa0', marginTop: '6px', userSelect: 'none' }}>
              🎮 Psst... toca el logo 5 veces
            </p>
          ) : (
            <p
              style={{ fontSize: '0.65rem', color: '#6b5fa0', marginTop: '6px', cursor: 'default', userSelect: 'none' }}
              onMouseEnter={e => e.target.style.color = '#7c3aed'}
              onMouseLeave={e => e.target.style.color = '#3d2f6e'}
              title="↑↑↓↓←→←→BA"
            >
              🎮 Psst... ¿conoces el código Konami?
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}

