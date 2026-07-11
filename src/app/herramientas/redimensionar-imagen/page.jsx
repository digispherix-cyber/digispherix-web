import ToolShell from '../../../components/tools/ToolShell'
import ImageResizer from '../../../components/tools/ImageResizer'
import { getTool } from '../../../lib/tools'

const tool = getTool('redimensionar-imagen')

export const metadata = {
  title: 'Redimensionar Imagen Online Gratis – DigiSpherix',
  description:
    'Cambia el tamaño de tus imágenes gratis y sin marcas de agua. Ajusta ancho y alto manteniendo la proporción. Funciona en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Redimensionar Imagen Online Gratis – DigiSpherix',
    description: 'Cambia el tamaño de tus fotos de forma privada, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/redimensionar-imagen',
  },
}

export default function Page() {
  return (
    <ToolShell name={tool.name} tagline={tool.description} accent={tool.accent}>
      <ImageResizer />
    </ToolShell>
  )
}
