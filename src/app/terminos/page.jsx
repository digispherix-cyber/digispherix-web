import Particles from '../../components/Particles'

export const metadata = {
  title: 'Términos y Condiciones - DigiSpherix',
  description: 'Términos y Condiciones de uso del sitio web y las herramientas de DigiSpherix.',
  alternates: { canonical: 'https://www.digispherix.com.mx/terminos' },
  robots: { index: true, follow: true },
}

const h2 = { fontSize: '1.35rem', fontWeight: 800, color: 'white', marginTop: '40px', marginBottom: '14px' }
const p = { color: '#9d8fc2', fontSize: '0.98rem', lineHeight: 1.85, marginBottom: '14px' }
const li = { color: '#9d8fc2', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '8px' }
const strong = { color: '#c4b5fd', fontWeight: 700 }
const a = { color: '#e879f9', textDecoration: 'none' }

export default function TerminosPage() {
  return (
    <main style={{ background: '#0c0923', minHeight: '100vh', paddingTop: '120px', paddingBottom: '90px', position: 'relative', overflow: 'hidden' }}>
      <Particles />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '10px' }}>
          Términos y <span className="gradient-text">Condiciones</span>
        </h1>
        <p style={{ color: '#6b5fa0', fontSize: '0.85rem', marginBottom: '32px' }}>Última actualización: 15 de julio de 2026</p>

        <p style={p}>
          Estos Términos y Condiciones regulan el uso del sitio web de DigiSpherix (digispherix.com.mx) y de
          las herramientas y contenidos que ofrecemos en él. Al navegar o usar este sitio aceptas estos
          términos. Si no estás de acuerdo, te pedimos no utilizarlo.
        </p>

        <h2 style={h2}>1. Sobre DigiSpherix</h2>
        <p style={p}>
          DigiSpherix es una marca operada por Luis Eduardo Hernández Pavón, con domicilio en Guadalajara,
          Jalisco, México, dedicada al diseño y desarrollo de sitios web, aplicaciones, marketing digital y
          soluciones de gestión empresarial.
        </p>

        <h2 style={h2}>2. Uso del sitio</h2>
        <p style={p}>
          Puedes usar este sitio con fines lícitos y personales. Te comprometes a no utilizarlo para actividades
          ilegales, a no intentar dañar su funcionamiento, ni a acceder de forma no autorizada a sus sistemas o
          a los de terceros.
        </p>

        <h2 style={h2}>3. Herramientas gratuitas</h2>
        <p style={p}>
          El sitio ofrece herramientas gratuitas (edición de imágenes, PDF, generación de códigos QR,
          contraseñas y otras). Estas herramientas procesan la información <span style={strong}>directamente en tu
          navegador</span>, por lo que tus archivos no se suben a nuestros servidores. Se ofrecen tal cual, sin
          garantía de ningún tipo. Eres responsable del uso que les des y de contar con respaldos de tus
          archivos. DigiSpherix no se hace responsable por pérdida de datos o resultados obtenidos con ellas.
        </p>

        <h2 style={h2}>4. Propiedad intelectual</h2>
        <p style={p}>
          El diseño, los textos, el logotipo, el código y demás contenidos de este sitio son propiedad de
          DigiSpherix, salvo que se indique lo contrario. No está permitido copiarlos, reproducirlos ni usarlos
          con fines comerciales sin nuestra autorización por escrito.
        </p>

        <h2 style={h2}>5. Servicios y cotizaciones</h2>
        <p style={p}>
          La información sobre servicios y precios publicada en el sitio es de carácter informativo y puede
          cambiar sin previo aviso. Ninguna cotización o publicación constituye un contrato: los términos,
          alcances y precios definitivos de cada proyecto se acuerdan por escrito de forma directa con el
          cliente antes de iniciar cualquier trabajo.
        </p>

        <h2 style={h2}>6. Enlaces y contenido de terceros</h2>
        <p style={p}>
          Este sitio puede contener enlaces a páginas de terceros y mostrar anuncios de plataformas como Google.
          No controlamos ni respondemos por el contenido, las políticas o las prácticas de esos sitios y
          servicios externos. Te recomendamos revisar sus propios términos y avisos de privacidad.
        </p>

        <h2 style={h2}>7. Limitación de responsabilidad</h2>
        <p style={p}>
          El sitio y sus contenidos se ofrecen tal cual. Hacemos nuestro mejor esfuerzo para que la información
          sea correcta y el sitio funcione bien, pero no garantizamos que esté libre de errores o
          interrupciones. En la medida que la ley lo permita, DigiSpherix no será responsable por daños
          derivados del uso o la imposibilidad de uso del sitio.
        </p>

        <h2 style={h2}>8. Cambios a estos términos</h2>
        <p style={p}>
          Podemos modificar estos Términos y Condiciones en cualquier momento. La versión vigente será siempre
          la publicada en esta página, con su fecha de última actualización.
        </p>

        <h2 style={h2}>9. Ley aplicable</h2>
        <p style={p}>
          Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se
          resolverá ante los tribunales competentes de Guadalajara, Jalisco.
        </p>

        <h2 style={h2}>10. Contacto</h2>
        <p style={p}>
          Para cualquier duda sobre estos términos, escríbenos a{' '}
          <a style={a} href="mailto:info@digispherix.com.mx">info@digispherix.com.mx</a> o por WhatsApp al{' '}
          <a style={a} href="https://wa.me/523320318435" target="_blank" rel="noopener noreferrer">33 2031 8435</a>.
        </p>

      </div>
    </main>
  )
}
