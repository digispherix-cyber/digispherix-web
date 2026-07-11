import ToolShell from '../../../components/tools/ToolShell'
import ImageCompressor from '../../../components/tools/ImageCompressor'
import { getTool } from '../../../lib/tools'

const tool = getTool('comprimir-imagen')

export const metadata = {
  title: 'Comprimir Imagen Online Gratis – DigiSpherix',
  description:
    'Reduce el peso de tus imágenes JPG, PNG y WebP gratis, sin perder calidad. Ideal para que tu web cargue más rápido. Todo en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Comprimir Imagen Online Gratis – DigiSpherix',
    description: 'Baja el peso de tus fotos de forma privada, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/comprimir-imagen',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageCompressor />
    </ToolShell>
  )
}
