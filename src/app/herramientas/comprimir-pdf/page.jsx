import ToolShell from '../../../components/tools/ToolShell'
import PdfCompressor from '../../../components/tools/PdfCompressor'
import { getTool } from '../../../lib/tools'

const tool = getTool('comprimir-pdf')

export const metadata = {
  title: 'Comprimir PDF Gratis – DigiSpherix',
  description:
    'Reduce el peso de tus archivos PDF gratis para enviarlos más fácil por correo o WhatsApp. Elige el nivel de compresión. Todo en tu navegador, sin subir archivos.',
  openGraph: {
    title: 'Comprimir PDF Gratis – DigiSpherix',
    description: 'Baja el tamaño de tus PDF de forma privada, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/comprimir-pdf',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfCompressor />
    </ToolShell>
  )
}
