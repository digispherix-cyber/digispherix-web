import ToolShell from '../../../components/tools/ToolShell'
import RaffleTool from '../../../components/tools/RaffleTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('sorteo-ganador')

export const metadata = {
  title: 'Sorteo y Ganador al Azar Gratis – DigiSpherix',
  description:
    'Elige un ganador al azar de forma justa a partir de tu lista de participantes. Ideal para rifas y concursos de Instagram y Facebook. Gratis y en tu navegador.',
  alternates: { canonical: 'https://digispherix.com.mx/herramientas/sorteo-ganador' },
  openGraph: {
    title: 'Sorteo y Ganador al Azar Gratis – DigiSpherix',
    description: 'Elige ganadores al azar para tus dinámicas y concursos en redes.',
    url: 'https://digispherix.com.mx/herramientas/sorteo-ganador',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RaffleTool />
    </ToolShell>
  )
}
