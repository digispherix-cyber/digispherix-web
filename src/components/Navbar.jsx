import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Precios', href: '#precios' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-xl bg-[#0c0923]/80 border-b border-purple-900/30' : ''
        }`}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/">
            <img src="/logo-horizontal.png" alt="DigiSpherix" className="nav-logo" style={{ width: 'auto', objectFit: 'contain' }} />
          </a>

          <ul className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-purple-200 hover:text-pink-400 transition-colors font-medium"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a href="#contacto" className="btn-primary nav-cta-desktop text-sm">
            Cotizar Proyecto
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-purple-300 hover:text-pink-400 transition-colors"
            style={{ position: 'relative', zIndex: 60 }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Overlay fuera del nav para que position:fixed funcione correctamente */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(10,7,28,0.98)',
              backdropFilter: 'blur(20px)',
              zIndex: 55,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: '20px', right: '24px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#e9d5ff', padding: '8px',
              }}
            >
              <X size={28} />
            </button>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e9d5ff', textDecoration: 'none' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: '16px' }}>
                <a href="#contacto" onClick={() => setOpen(false)} className="btn-primary">
                  Cotizar Proyecto
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
