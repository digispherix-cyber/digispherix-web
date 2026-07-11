import Link from 'next/link'
import { Maximize2, Repeat, KeyRound, QrCode, FileImage, FileArchive, Wrench, ArrowRight, ShieldCheck, ImageDown, FileStack, ScanText, Palette, Binary, Type } from 'lucide-react'
import Particles from '../../components/Particles'
import { tools } from '../../lib/tools'

export const metadata = {
  title: 'Herramientas Web Gratis – DigiSpherix | Imágenes, QR, PDF y más',
  description:
    'Herramientas web gratuitas y seguras: redimensionar imágenes, convertir formatos, generar códigos QR, contraseñas y PDF. Todo funciona en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Herramientas Web Gratis – DigiSpherix',
    description: 'Utilidades gratis que funcionan en tu navegador, sin subir tus archivos a ningún servidor.',
    url: 'https://digispherix.com.mx/herramientas',
  },
}

const icons = { Maximize2, Repeat, KeyRound, QrCode, FileImage, FileArchive, ImageDown, FileStack, ScanText, Palette, Binary, Type }

export default function HerramientasPage() {
  return (
    <main style={{ background: '#0c0923', minHeight: '100vh' }}>
      <Particles />

      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '50px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,70,239,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div className="ds-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '99px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#e879f9', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
            <Wrench size={14} /> Herramientas
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
            Herramientas web{' '}
            <span className="gradient-text">gratis</span>
          </h1>
          <p style={{ color: '#9d8fc2', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.7 }}>
            Utilidades rápidas para el día a día. Funcionan directo en tu navegador,
            así que tus archivos nunca se suben a internet.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', borderRadius: '99px', background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399', fontSize: '0.82rem', fontWeight: 600 }}>
            <ShieldCheck size={15} /> Privado y seguro — sin registros ni subidas
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Grid de herramientas */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="ds-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {tools.filter((tool) => !tool.hidden).map((tool) => {
              const Icon = icons[tool.icon] || Wrench
              const inner = (
                <article
                  className="tool-card"
                  style={{
                    position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
                    background: 'rgba(17,13,48,0.8)', border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: '18px', padding: '28px', overflow: 'hidden',
                    opacity: tool.ready ? 1 : 0.6,
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${tool.accent}, ${tool.accent}55)` }} />
                  <div
                    style={{
                      width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${tool.accent}20`, border: `1px solid ${tool.accent}40`, marginBottom: '18px',
                    }}
                  >
                    <Icon size={24} style={{ color: tool.accent }} />
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>{tool.name}</h2>
                  <p style={{ color: '#9d8fc2', fontSize: '0.875rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '18px' }}>
                    {tool.description}
                  </p>
                  {tool.ready ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e879f9', fontSize: '0.85rem', fontWeight: 600 }}>
                      Usar herramienta <ArrowRight size={15} />
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b5fa0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Próximamente
                    </span>
                  )}
                </article>
              )

              return tool.ready ? (
                <Link key={tool.slug} href={`/herramientas/${tool.slug}`} style={{ textDecoration: 'none' }}>
                  {inner}
                </Link>
              ) : (
                <div key={tool.slug}>{inner}</div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
