import ToolShell from '../../../components/tools/ToolShell'
import BackgroundRemover from '../../../components/tools/BackgroundRemover'
import { getTool } from '../../../lib/tools'

const tool = getTool('quitar-fondo')

export const metadata = {
  title: 'Quitar Fondo de Imagen con IA Gratis – DigiSpherix',
  description:
    'Elimina el fondo de tus fotos automáticamente con inteligencia artificial y descárgalas con fondo transparente. Gratis, ideal para fotos de producto. Tus fotos no se suben.',
  openGraph: {
    title: 'Quitar Fondo de Imagen con IA Gratis – DigiSpherix',
    description: 'Quita el fondo de tus imágenes en tu navegador, con IA. Ideal para catálogos y fotos de producto.',
    url: 'https://digispherix.com.mx/herramientas/quitar-fondo',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BackgroundRemover />
    </ToolShell>
  )
}
