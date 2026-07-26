import ToolShell from '../../../components/tools/ToolShell'
import VideoConverterTool from '../../../components/tools/VideoConverterTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('convertir-video')

export const metadata = {
  title: 'Convertir Video Online Gratis (MP4, MOV, MKV, TS, WebM) – DigiSpherix',
  description:
    'Convierte tus videos entre MP4, MOV, MKV, TS y WebM directo en el navegador, sin instalar nada y sin subir el archivo a internet. Gratis, rápido y privado.',
  openGraph: {
    title: 'Convertir Video Online Gratis – DigiSpherix',
    description: 'Convierte tu video a MP4, MOV, MKV, TS o WebM en el navegador, sin subir nada.',
    url: 'https://digispherix.com.mx/herramientas/convertir-video',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <VideoConverterTool />
    </ToolShell>
  )
}
