import ToolShell from '../../../components/tools/ToolShell'
import SubtitleGeneratorTool from '../../../components/tools/SubtitleGeneratorTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('subtitulos-video')

export const metadata = {
  title: 'Generador de Subtítulos con IA para Video – DigiSpherix',
  description:
    'Genera subtítulos automáticos con IA para tus videos, dales estilo y descarga el video con los subtítulos incrustados. Gratis, en tu navegador, sin subir nada. Ideal para Reels y TikTok.',
  alternates: { canonical: 'https://digispherix.com.mx/herramientas/subtitulos-video' },
  openGraph: {
    title: 'Generador de Subtítulos con IA para Video – DigiSpherix',
    description: 'Subtítulos automáticos con estilo para tus videos, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/subtitulos-video',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SubtitleGeneratorTool />
    </ToolShell>
  )
}
