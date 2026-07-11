import ToolShell from '../../../components/tools/ToolShell'
import ImageConverter from '../../../components/tools/ImageConverter'
import { getTool } from '../../../lib/tools'

const tool = getTool('convertir-imagen')

export const metadata = {
  title: 'Convertir Imagen JPG, PNG y WebP Gratis – DigiSpherix',
  description:
    'Convierte tus imágenes entre JPG, PNG y WebP gratis. Ajusta la calidad y optimiza el peso de tus fotos. Todo en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Convertir Imagen JPG, PNG y WebP – DigiSpherix',
    description: 'Convierte y optimiza imágenes de forma privada en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/convertir-imagen',
  },
}

export default function Page() {
  return (
    <ToolShell name={tool.name} tagline={tool.description} accent={tool.accent}>
      <ImageConverter />
    </ToolShell>
  )
}
