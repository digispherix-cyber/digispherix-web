import ToolShell from '../../../components/tools/ToolShell'
import ScreenRecorderTool from '../../../components/tools/ScreenRecorderTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('grabador-pantalla')

export const metadata = {
  title: 'Grabador de Pantalla Online Gratis – DigiSpherix',
  description:
    'Graba tu pantalla y micrófono directo en el navegador, sin instalar nada, y descarga el video. Ideal para tutoriales, demos y presentaciones. Gratis y privado.',
  alternates: { canonical: 'https://digispherix.com.mx/herramientas/grabador-pantalla' },
  openGraph: {
    title: 'Grabador de Pantalla Online Gratis – DigiSpherix',
    description: 'Graba tu pantalla con audio y descarga el video, sin instalar nada.',
    url: 'https://digispherix.com.mx/herramientas/grabador-pantalla',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ScreenRecorderTool />
    </ToolShell>
  )
}
