import { getAllPosts } from '../../lib/blog'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Rss } from 'lucide-react'

export const metadata = {
  title: 'Blog – DigiSpherix | Diseño Web, Apps Android y Marketing Digital en México',
  description: 'Guías y artículos sobre diseño web, apps Android y marketing digital para hacer crecer tu negocio en México.',
  openGraph: {
    title: 'Blog – DigiSpherix',
    description: 'Guías y artículos sobre diseño web y marketing digital en México.',
    url: 'https://digispherix.com.mx/blog',
  },
}

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

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <main style={{ background: '#0c0923', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ paddingTop: '140px', paddingBottom: '60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,70,239,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div className="ds-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '99px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#e879f9', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
            <Rss size={14} /> Blog
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '20px' }}>
            Ideas, guías y{' '}
            <span className="gradient-text">recursos digitales</span>
          </h1>
          <p style={{ color: '#9d8fc2', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
            CSS, JavaScript, Linux, redes, diseño web, apps y todo lo que necesitas saber sobre tecnología.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Articles ── */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="ds-container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b5fa0' }}>
              <p style={{ fontSize: '1.1rem' }}>Próximamente los primeros artículos.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

              {/* Featured */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="blog-card blog-card-featured">
                    <div className="blog-card-bar" style={{ background: `linear-gradient(90deg, ${color(featured.category)}, ${color(featured.category)}55)` }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      <span className="blog-badge" style={{ background: `${color(featured.category)}20`, color: color(featured.category), border: `1px solid ${color(featured.category)}40` }}>
                        {featured.category}
                      </span>
                      <span className="blog-badge" style={{ background: 'rgba(217,70,239,0.12)', color: '#d946ef', border: '1px solid rgba(217,70,239,0.3)' }}>
                        DESTACADO
                      </span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 900, color: 'white', lineHeight: 1.25, marginBottom: '16px', maxWidth: '720px' }}>
                      {featured.title}
                    </h2>
                    <p style={{ color: '#9d8fc2', lineHeight: 1.75, fontSize: '1rem', marginBottom: '28px', maxWidth: '700px' }}>
                      {featured.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '20px', color: '#6b5fa0', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} />{fmt(featured.date)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} />{featured.readTime} de lectura</span>
                      </div>
                      <span className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 22px' }}>
                        Leer artículo <ArrowRight size={15} />
                      </span>
                    </div>
                  </article>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {rest.map(post => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <article className="blog-card blog-card-grid">
                        <div className="blog-card-bar" style={{ background: `linear-gradient(90deg, ${color(post.category)}, ${color(post.category)}55)` }} />
                        <span className="blog-badge" style={{ background: `${color(post.category)}20`, color: color(post.category), border: `1px solid ${color(post.category)}40`, alignSelf: 'flex-start', marginBottom: '14px' }}>
                          {post.category}
                        </span>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', lineHeight: 1.35, marginBottom: '10px', flexGrow: 1 }}>
                          {post.title}
                        </h2>
                        <p className="blog-excerpt-clamp" style={{ color: '#9d8fc2', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '20px' }}>
                          {post.excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                          <div style={{ display: 'flex', gap: '12px', color: '#6b5fa0', fontSize: '0.78rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} />{fmt(post.date)}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{post.readTime}</span>
                          </div>
                          <ArrowRight size={16} style={{ color: '#d946ef' }} />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </section>
    </main>
  )
}
