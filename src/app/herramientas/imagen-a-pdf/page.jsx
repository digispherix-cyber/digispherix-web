import ToolShell from '../../../components/tools/ToolShell'
import ImageToPdf from '../../../components/tools/ImageToPdf'
import { getTool } from '../../../lib/tools'

const tool = getTool('imagen-a-pdf')

export const metadata = {
  title: 'Convertir Imagen a PDF Gratis – DigiSpherix',
  description:
    'Une una o varias imágenes JPG o PNG en un solo archivo PDF, gratis y sin marcas de agua. Ideal para digitalizar documentos. Todo en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Convertir Imagen a PDF Gratis – DigiSpherix',
    description: 'Combina tus imágenes en un PDF de forma privada, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/imagen-a-pdf',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToPdf />
    </ToolShell>
  )
}
