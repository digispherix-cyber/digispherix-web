import ToolShell from '../../../components/tools/ToolShell'
import OcrTool from '../../../components/tools/OcrTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('extraer-texto')

export const metadata = {
  title: 'Extraer Texto de Imagen o PDF (OCR) Gratis – DigiSpherix',
  description:
    'Convierte fotos de documentos o PDF escaneados en texto que puedes copiar y editar. Reconocimiento en español (OCR), gratis y directo en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Extraer Texto de Imagen o PDF (OCR) Gratis – DigiSpherix',
    description: 'Saca el texto de imágenes y PDF de forma privada, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/extraer-texto',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <OcrTool />
    </ToolShell>
  )
}
