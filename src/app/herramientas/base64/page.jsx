import ToolShell from '../../../components/tools/ToolShell'
import Base64Tool from '../../../components/tools/Base64Tool'
import { getTool } from '../../../lib/tools'

const tool = getTool('base64')

export const metadata = {
  title: 'Codificar y Decodificar Base64 Online Gratis – DigiSpherix',
  description:
    'Convierte texto a Base64 y de Base64 a texto al instante, con soporte de acentos y emojis. Gratis y directo en tu navegador, sin subir nada.',
  openGraph: {
    title: 'Codificar y Decodificar Base64 Online – DigiSpherix',
    description: 'Convierte texto a Base64 y viceversa de forma privada en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/base64',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <Base64Tool />
    </ToolShell>
  )
}
