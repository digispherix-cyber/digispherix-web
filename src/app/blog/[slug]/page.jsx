import { getPost, getAllPosts, getRelatedPosts } from '../../../lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight } from 'lucide-react'
import ReadingProgress from '../../../components/ReadingProgress'

const categoryColor = {
  'Diseño Web':        '#7c3aed',
  'Apps Android':      '#2563eb',
  'Marketing Digital': '#d946ef',
  'SEO':               '#059669',
  'Negocios':          '#d97706',
}
function color(cat) { return categoryColor[cat] || '#6b7280' }
function fmt(d) {
  return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} – Blog DigiSpherix`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://digispherix.com.mx/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      images: post.image
        ? [{ url: `https://digispherix.com.mx${post.image}`, width: 1200, height: 630 }]
        : [{ url: 'https://digispherix.com.mx/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: post.image ? [`https://digispherix.com.mx${post.image}`] : ['/og-image.jpg'],
    },
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, post.category, 3)
  const c = color(post.category)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'DigiSpherix', url: 'https://digispherix.com.mx' },
    publisher: {
      '@type': 'Organization', name: 'DigiSpherix',
      logo: { '@type': 'ImageObject', url: 'https://digispherix.com.mx/logo-square.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://digispherix.com.mx/blog/${slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ReadingProgress />

      <main style={{ background: '#0c0923', minHeight: '100vh', paddingTop: '100px' }}>

        {/* Back */}
        <div className="ds-container" style={{ paddingTop: '40px', paddingBottom: '8px' }}>
          <Link href="/blog" className="blog-back-link">
            <ArrowLeft size={16} /> Volver al blog
          </Link>
        </div>

        {/* Header */}
        <header style={{ padding: '32px 0 48px', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 80px' }} className="blog-article-header">
            <span className="blog-badge" style={{ background: `${c}20`, color: c, border: `1px solid ${c}40`, display: 'inline-block', marginBottom: '20px' }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '20px' }}>
              {post.title}
            </h1>
            <p style={{ color: '#9d8fc2', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              {post.excerpt}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #d946ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                  DS
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>DigiSpherix</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b5fa0' }}>Equipo editorial</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: '#6b5fa0', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} />{fmt(post.date)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} />{post.readTime} de lectura</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article style={{ padding: '60px 0' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 80px' }} className="blog-article-header">

            {/* AdSense slot — habilitar cuando sea aprobado */}
            {/* <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <Tag size={14} style={{ color: '#6b5fa0', flexShrink: 0 }} />
                {post.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '99px', background: 'rgba(124,58,237,0.1)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div style={{ marginTop: '40px', padding: '28px 32px', borderRadius: '16px', background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ color: 'white', fontWeight: 700, marginBottom: '4px' }}>¿Te fue útil este artículo?</div>
                <div style={{ color: '#9d8fc2', fontSize: '0.875rem' }}>Compártelo con alguien que lo necesite</div>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title}\n\nhttps://digispherix.com.mx/blog/${slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '11px 22px', borderRadius: '99px', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', flexShrink: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Compartir en WhatsApp
              </a>
            </div>

            {/* CTA */}
            <div style={{ marginTop: '40px', padding: '40px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(217,70,239,0.08))', border: '1px solid rgba(124,58,237,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>🚀</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
                ¿Tienes un proyecto digital?
              </h3>
              <p style={{ color: '#c4b5fd', marginBottom: '24px', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px' }}>
                Diseñamos sitios web, apps Android y estrategias de marketing digital. Cuéntanos tu idea — cotización gratis en menos de 24 horas.
              </p>
              <Link href="/#contacto" className="btn-primary" style={{ display: 'inline-flex' }}>
                Cotizar gratis <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section style={{ padding: '20px 0 80px', borderTop: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="ds-container">
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '32px' }}>
                Otros artículos
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {related.map(p => {
                  const rc = color(p.category)
                  return (
                    <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                      <article className="blog-card blog-card-related">
                        <div className="blog-card-bar" style={{ background: `linear-gradient(90deg, ${rc}, ${rc}55)` }} />
                        <span className="blog-badge" style={{ background: `${rc}20`, color: rc, border: `1px solid ${rc}40`, alignSelf: 'flex-start', marginBottom: '12px' }}>
                          {p.category}
                        </span>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', lineHeight: 1.35, flexGrow: 1 }}>
                          {p.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b5fa0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} />{p.readTime}
                          </span>
                          <ArrowRight size={14} style={{ color: '#d946ef' }} />
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  )
}
