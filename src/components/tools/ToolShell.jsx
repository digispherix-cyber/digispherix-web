import Link from 'next/link'
import { ChevronLeft, ShieldCheck, MessageCircle } from 'lucide-react'
import Particles from '../Particles'
import ToolContent from './ToolContent'

// Wrapper compartido para todas las páginas de herramientas.
// Renderiza el encabezado, la nota de privacidad, el contenido interactivo
// (children), el CTA hacia WhatsApp y la sección de contenido (cómo funciona + FAQ).
export default function ToolShell({ tool, children }) {
  const { name, description: tagline, accent = '#7c3aed', howItWorks, faqs, slug } = tool
  const privacyNote = tool.privacyNote || 'tus archivos no salen de tu dispositivo'
  const waMsg = encodeURIComponent(
    `Hola DigiSpherix! Estuve usando sus herramientas gratis y me gustaría cotizar un proyecto.`,
  )

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://digispherix.com.mx' },
      { '@type': 'ListItem', position: 2, name: 'Herramientas', item: 'https://digispherix.com.mx/herramientas' },
      { '@type': 'ListItem', position: 3, name, item: `https://digispherix.com.mx/herramientas/${slug}` },
    ],
  }

  return (
    <main style={{ minHeight: '100vh', color: 'var(--text)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Particles />

      <section style={{ paddingTop: '120px', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', top: '5%', left: '15%', width: '360px', height: '360px', borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}28, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none',
          }}
        />
        <div className="ds-container" style={{ position: 'relative', zIndex: 1 }}>
          <Link
            href="/herramientas"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '24px' }}
          >
            <ChevronLeft size={16} /> Todas las herramientas
          </Link>

          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1.15, marginBottom: '14px' }}>
              {name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 auto' }}>{tagline}</p>

            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '22px',
                padding: '7px 16px', borderRadius: '99px', background: 'rgba(5,150,105,0.12)',
                border: '1px solid rgba(5,150,105,0.3)', color: '#34d399', fontSize: '0.8rem', fontWeight: 600,
              }}
            >
              <ShieldCheck size={15} /> 100% privado - {privacyNote}
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: '24px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div className="ds-container">
          <div
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: 'clamp(20px, 4vw, 40px)', maxWidth: '760px', margin: '0 auto',
            }}
          >
            {children}
          </div>

          {/* CTA final */}
          <div style={{ maxWidth: '760px', margin: '40px auto 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '16px' }}>
              ¿Te sirvió? En <strong style={{ color: 'var(--text-strong)' }}>DigiSpherix</strong> creamos sitios web, apps y
              herramientas a la medida de tu negocio.
            </p>
            <a
              href={`https://wa.me/523320318435?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <MessageCircle size={16} /> Cotiza tu proyecto gratis
            </a>
          </div>

          <ToolContent howItWorks={howItWorks} faqs={faqs} accent={accent} />
        </div>
      </section>
    </main>
  )
}
