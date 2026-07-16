import Link from 'next/link'
import Particles from '../../components/Particles'
import { ArrowRight, Rocket, Target, HeartHandshake, Globe, Smartphone, Megaphone, Database, Compass, Check } from 'lucide-react'

export const metadata = {
  title: 'Nosotros - DigiSpherix | Agencia Digital en Guadalajara',
  description:
    'Conoce a DigiSpherix: agencia digital en Guadalajara especializada en sitios web, apps Android, marketing digital y soluciones Odoo para empresas y emprendedores en México.',
  alternates: { canonical: 'https://www.digispherix.com.mx/nosotros' },
  openGraph: {
    title: 'Nosotros - DigiSpherix',
    description: 'Agencia digital en Guadalajara. Sitios web, apps, marketing y Odoo para tu negocio.',
    url: 'https://www.digispherix.com.mx/nosotros',
  },
}

const valores = [
  { icon: Target, title: 'Resultados, no solo entregables', desc: 'No hacemos sitios bonitos que nadie ve. Cada proyecto se piensa para que trabaje por tu negocio: atraer clientes, vender y ahorrarte tiempo.' },
  { icon: HeartHandshake, title: 'Acompañamiento real', desc: 'Estamos contigo en cada etapa, del primer boceto al lanzamiento y después. Hablas directo con quien hace tu proyecto, no con un call center.' },
  { icon: Rocket, title: 'Tecnología actual', desc: 'Usamos las mismas herramientas que las grandes empresas para que tu proyecto sea rápido, seguro y fácil de crecer con el tiempo.' },
]

const servicios = [
  { icon: Globe, title: 'Sitios web y tiendas en línea', desc: 'Desde una landing page hasta un e-commerce completo, listos para vender.' },
  { icon: Smartphone, title: 'Apps para Android', desc: 'Aplicaciones a la medida para llevar tu negocio al celular de tus clientes.' },
  { icon: Megaphone, title: 'Marketing digital', desc: 'Redes sociales, campañas de anuncios y SEO para que te encuentren y te compren.' },
  { icon: Database, title: 'Soluciones Odoo ERP', desc: 'Ordena ventas, inventario y facturación de tu empresa en un solo sistema.' },
]

export default function NosotrosPage() {
  return (
    <main style={{ background: '#0c0923', minHeight: '100vh', paddingTop: '120px', paddingBottom: '90px', position: 'relative', overflow: 'hidden' }}>
      <Particles />

      <div style={{ position: 'absolute', top: '5%', left: '15%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.16), transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,70,239,0.12), transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ width: '85%', maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <p style={{ textAlign: 'center', color: '#d946ef', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Quiénes somos
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, textAlign: 'center', marginBottom: '22px' }}>
          Somos <span className="gradient-text">DigiSpherix</span>
        </h1>
        <p style={{ color: '#c4b5fd', fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
          Una agencia digital en Guadalajara que ayuda a negocios y emprendedores de todo México
          a tener una presencia en internet que de verdad genere clientes.
        </p>

        {/* Historia */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white', marginBottom: '28px' }}>Nuestra historia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p style={{ color: '#9d8fc2', fontSize: '1rem', lineHeight: 1.9, marginBottom: '16px' }}>
                DigiSpherix nació de una idea simple: muchos negocios excelentes se quedan invisibles en internet
                por no tener quién les construya las herramientas correctas. Un buen producto o servicio no basta
                si tus clientes no te encuentran, o si al encontrarte tu sitio carga lento, se ve mal en el celular
                o no invita a contactarte.
              </p>
              <p style={{ color: '#9d8fc2', fontSize: '1rem', lineHeight: 1.9, marginBottom: '16px' }}>
                Por eso combinamos diseño, desarrollo y marketing en un solo lugar. No solo entregamos un sitio o
                una app y desaparecemos: te acompañamos para que esa inversión se traduzca en más visibilidad,
                más contactos y más ventas.
              </p>
              <p style={{ color: '#9d8fc2', fontSize: '1rem', lineHeight: 1.9 }}>
                Hoy ayudamos a clientes de distintos giros con sitios web, aplicaciones, estrategias de redes
                sociales, posicionamiento en Google y sistemas de gestión. Y para regresar algo a la comunidad,
                publicamos artículos y herramientas gratuitas, pensadas para que cualquier persona pueda usarlas
                sin costo.
              </p>
            </div>
            <div>
              <img
                src="/equipo.jpg"
                alt="Desarrollo de software y programación en DigiSpherix"
                width="1200"
                height="800"
                loading="lazy"
                style={{ width: '100%', height: 'auto', borderRadius: '18px', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 20px 50px rgba(124,58,237,0.18)', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* Qué hacemos */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white', marginBottom: '28px' }}>Qué hacemos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {servicios.map((s) => (
              <div key={s.title} style={{ background: 'rgba(17,13,48,0.75)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', padding: '26px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,58,237,0.18)', color: '#c084fc', marginBottom: '16px' }}>
                  <s.icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#9d8fc2', fontSize: '0.9rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Misión, Visión y Valores */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white', marginBottom: '28px' }}>Misión, visión y valores</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
            <div style={{ background: 'rgba(17,13,48,0.75)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,58,237,0.18)', color: '#c084fc', marginBottom: '16px' }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Misión</h3>
              <p style={{ color: '#9d8fc2', fontSize: '0.95rem', lineHeight: 1.75 }}>
                Ayudar a negocios y emprendedores de México a crecer con herramientas digitales bien hechas,
                que les traigan más clientes y les faciliten el día a día.
              </p>
            </div>
            <div style={{ background: 'rgba(17,13,48,0.75)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(217,70,239,0.18)', color: '#e879f9', marginBottom: '16px' }}>
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Visión</h3>
              <p style={{ color: '#9d8fc2', fontSize: '0.95rem', lineHeight: 1.75 }}>
                Ser la agencia digital de confianza para las pequeñas y medianas empresas de México,
                reconocida por hacer bien las cosas y por tratar cada proyecto como si fuera nuestro.
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(17,13,48,0.6)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '18px' }}>Nuestros valores</h3>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', listStyle: 'none', padding: 0 }}>
              {[
                ['Honestidad', 'Te decimos lo que necesitas, no lo que más nos conviene vender.'],
                ['Compromiso', 'Tu proyecto lo tratamos como propio, de principio a fin.'],
                ['Calidad', 'Entregamos trabajo del que nos sentimos orgullosos.'],
                ['Cercanía', 'Hablas directo con quien hace tu proyecto, sin intermediarios.'],
              ].map(([titulo, texto]) => (
                <li key={titulo} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(217,70,239,0.2)', color: '#e879f9' }}>
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span style={{ color: '#9d8fc2', fontSize: '0.92rem', lineHeight: 1.55 }}>
                    <span style={{ color: 'white', fontWeight: 700 }}>{titulo}.</span> {texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Valores */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white', marginBottom: '28px' }}>Por qué elegirnos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {valores.map((v) => (
              <div key={v.title} style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', background: 'rgba(17,13,48,0.6)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(217,70,239,0.15))', color: '#e879f9' }}>
                  <v.icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{v.title}</h3>
                  <p style={{ color: '#9d8fc2', fontSize: '0.95rem', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(217,70,239,0.08))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '44px 32px' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>🚀</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>¿Trabajamos juntos?</h2>
          <p style={{ color: '#c4b5fd', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.7 }}>
            Cuéntanos tu idea y te decimos cómo llevarla a internet. La cotización es gratis y sin compromiso.
          </p>
          <Link href="/#contacto" className="btn-primary" style={{ display: 'inline-flex' }}>
            Cotizar mi proyecto <ArrowRight size={16} />
          </Link>
        </section>

      </div>
    </main>
  )
}
