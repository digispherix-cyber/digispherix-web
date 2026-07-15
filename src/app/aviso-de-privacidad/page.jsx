import Particles from '../../components/Particles'

export const metadata = {
  title: 'Aviso de Privacidad - DigiSpherix',
  description: 'Aviso de Privacidad de DigiSpherix. Cómo recabamos, usamos y protegemos tus datos personales conforme a la ley mexicana.',
  alternates: { canonical: 'https://www.digispherix.com.mx/aviso-de-privacidad' },
  robots: { index: true, follow: true },
}

const h2 = { fontSize: '1.35rem', fontWeight: 800, color: 'white', marginTop: '40px', marginBottom: '14px' }
const p = { color: '#9d8fc2', fontSize: '0.98rem', lineHeight: 1.85, marginBottom: '14px' }
const li = { color: '#9d8fc2', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '8px' }
const strong = { color: '#c4b5fd', fontWeight: 700 }
const a = { color: '#e879f9', textDecoration: 'none' }

export default function AvisoPrivacidadPage() {
  return (
    <main style={{ background: '#0c0923', minHeight: '100vh', paddingTop: '120px', paddingBottom: '90px', position: 'relative', overflow: 'hidden' }}>
      <Particles />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '10px' }}>
          Aviso de <span className="gradient-text">Privacidad</span>
        </h1>
        <p style={{ color: '#6b5fa0', fontSize: '0.85rem', marginBottom: '32px' }}>Última actualización: 15 de julio de 2026</p>

        <p style={p}>
          En DigiSpherix valoramos y protegemos tu información. Este Aviso de Privacidad explica qué datos
          recabamos, con qué fines y cuáles son tus derechos, conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP) de México.
        </p>

        <h2 style={h2}>1. Responsable de tus datos</h2>
        <p style={p}>
          El responsable del tratamiento de tus datos personales es <span style={strong}>DigiSpherix</span>,
          marca operada por Luis Eduardo Hernández Pavón, con domicilio en Guadalajara, Jalisco, México.
          Para cualquier tema relacionado con tu privacidad puedes contactarnos en{' '}
          <a style={a} href="mailto:info@digispherix.com.mx">info@digispherix.com.mx</a>.
        </p>

        <h2 style={h2}>2. Datos que recabamos</h2>
        <p style={p}>Podemos recabar los siguientes datos, según cómo interactúes con nosotros:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '14px' }}>
          <li style={li}><span style={strong}>De contacto:</span> nombre, correo electrónico, teléfono o WhatsApp cuando nos escribes o solicitas una cotización.</li>
          <li style={li}><span style={strong}>Del proyecto:</span> información que compartes sobre tu negocio para poder cotizar o realizar un servicio.</li>
          <li style={li}><span style={strong}>De navegación:</span> datos técnicos como tu dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia, recopilados de forma automática mediante cookies.</li>
        </ul>
        <p style={p}>
          Las herramientas gratuitas de nuestro sitio (imágenes, PDF, códigos QR y demás) procesan tus archivos
          directamente en tu navegador. <span style={strong}>No subimos ni almacenamos esos archivos en ningún servidor.</span>
        </p>

        <h2 style={h2}>3. Para qué usamos tus datos</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '14px' }}>
          <li style={li}>Responder tus mensajes y solicitudes de cotización.</li>
          <li style={li}>Brindarte los servicios que contrates y darles seguimiento.</li>
          <li style={li}>Enviarte información sobre tu proyecto o, si lo autorizas, novedades y promociones.</li>
          <li style={li}>Mejorar nuestro sitio, entender su uso y medir el desempeño de nuestro contenido.</li>
        </ul>

        <h2 style={h2}>4. Cookies y tecnologías de terceros</h2>
        <p style={p}>
          Nuestro sitio utiliza cookies y tecnologías similares para funcionar correctamente, analizar el
          tráfico y, en su caso, mostrar publicidad. En particular usamos:
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '14px' }}>
          <li style={li}><span style={strong}>Google Analytics:</span> para entender de forma anónima cómo se usa el sitio y mejorarlo.</li>
          <li style={li}><span style={strong}>Google AdSense:</span> proveedores externos, incluido Google, pueden usar cookies para mostrar anuncios basados en tus visitas previas a este u otros sitios web. El uso de cookies de publicidad permite a Google y a sus socios ofrecer anuncios más relevantes.</li>
        </ul>
        <p style={p}>
          Puedes desactivar la publicidad personalizada de Google en la página de{' '}
          <a style={a} href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Configuración de anuncios de Google</a>,
          o gestionar las cookies de terceros desde{' '}
          <a style={a} href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
          También puedes bloquear o eliminar las cookies desde la configuración de tu navegador.
        </p>

        <h2 style={h2}>5. Transferencia de datos</h2>
        <p style={p}>
          No vendemos ni rentamos tus datos personales. Solo los compartimos con proveedores que nos ayudan a
          operar (por ejemplo, servicios de hosting, analítica o publicidad como los mencionados), quienes
          únicamente los tratan conforme a este aviso y a sus propias políticas.
        </p>

        <h2 style={h2}>6. Tus derechos ARCO</h2>
        <p style={p}>
          Tienes derecho a Acceder a tus datos, Rectificarlos si son inexactos, Cancelarlos cuando consideres
          que no se requieren, y Oponerte a su uso para fines específicos. Para ejercer cualquiera de estos
          derechos, o para revocar tu consentimiento, escríbenos a{' '}
          <a style={a} href="mailto:info@digispherix.com.mx">info@digispherix.com.mx</a> indicando tu solicitud.
          Te responderemos en un plazo razonable.
        </p>

        <h2 style={h2}>7. Cambios a este aviso</h2>
        <p style={p}>
          Podemos actualizar este Aviso de Privacidad cuando sea necesario. Publicaremos la versión vigente en
          esta misma página, con su fecha de última actualización. Te recomendamos revisarla de vez en cuando.
        </p>

        <h2 style={h2}>8. Contacto</h2>
        <p style={p}>
          Si tienes dudas sobre este aviso o sobre el manejo de tus datos, contáctanos en{' '}
          <a style={a} href="mailto:info@digispherix.com.mx">info@digispherix.com.mx</a> o por WhatsApp al{' '}
          <a style={a} href="https://wa.me/523320318435" target="_blank" rel="noopener noreferrer">33 2031 8435</a>.
        </p>

      </div>
    </main>
  )
}
