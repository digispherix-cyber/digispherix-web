import ToolShell from '../../../components/tools/ToolShell'
import VideoTrimmerTool from '../../../components/tools/VideoTrimmerTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('recortar-video')

export const metadata = {
  title: 'Recortar Video Online Gratis – DigiSpherix',
  description:
    'Recorta un tramo de tu video o extrae su audio directo en el navegador, sin instalar nada y sin subir el archivo a internet. Gratis, rápido y privado.',
  openGraph: {
    title: 'Recortar Video Online Gratis – DigiSpherix',
    description: 'Corta tu video o extrae su audio en el navegador, sin subir nada.',
    url: 'https://digispherix.com.mx/herramientas/recortar-video',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VideoTrimmerTool />
    </ToolShell>
  )
}
