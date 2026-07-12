import { ChevronDown } from 'lucide-react'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../lib/adsense'

// Renderiza la sección "¿Cómo funciona?" + preguntas frecuentes de cada
// herramienta, más el schema FAQPage (JSON-LD) para SEO / resultados
// enriquecidos en Google. Usa <details> nativo: accesible y sin JS.
export default function ToolContent({ howItWorks = [], faqs = [], accent = '#7c3aed' }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div style={{ maxWidth: '760px', margin: '64px auto 0' }}>
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* ¿Cómo funciona? */}
      {howItWorks.length > 0 && (
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '32px' }}>
            ¿Cómo funciona?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {howItWorks.map((step, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(17,13,48,0.7)', border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${accent}22`, border: `1px solid ${accent}44`, color: accent, fontWeight: 800, fontSize: '1.1rem',
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ color: '#c4b5fd', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Espacio AdSense. Se activa al poner AD_SLOTS.toolInline en src/lib/adsense.js */}
      <AdSlot slot={AD_SLOTS.toolInline} />

      {/* Preguntas frecuentes */}
      {faqs.length > 0 && (
        <section>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '32px' }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((f, i) => (
              <details
                key={i}
                className="tool-faq"
                style={{ background: 'rgba(17,13,48,0.7)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', overflow: 'hidden' }}
              >
                <summary
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                    padding: '18px 20px', cursor: 'pointer', color: 'white', fontWeight: 600, fontSize: '0.95rem', listStyle: 'none',
                  }}
                >
                  {f.q}
                  <ChevronDown size={18} className="tool-faq-chevron" style={{ color: accent, flexShrink: 0 }} />
                </summary>
                <p style={{ padding: '0 20px 20px', color: '#9d8fc2', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
