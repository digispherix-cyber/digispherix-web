import ToolShell from '../../../components/tools/ToolShell'
import QrGenerator from '../../../components/tools/QrGenerator'
import { getTool } from '../../../lib/tools'

const tool = getTool('generador-qr')

export const metadata = {
  title: 'Generador de Códigos QR Gratis – DigiSpherix',
  description:
    'Crea códigos QR gratis para tu web, WhatsApp, redes sociales o menú digital. Personaliza colores y tamaño, y descárgalos en alta calidad. Sin marcas de agua.',
  openGraph: {
    title: 'Generador de Códigos QR Gratis – DigiSpherix',
    description: 'Genera códigos QR personalizados en tu navegador, gratis y sin marcas de agua.',
    url: 'https://digispherix.com.mx/herramientas/generador-qr',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <QrGenerator />
    </ToolShell>
  )
}
