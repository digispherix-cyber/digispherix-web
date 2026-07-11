import ToolShell from '../../../components/tools/ToolShell'
import PdfMerger from '../../../components/tools/PdfMerger'
import { getTool } from '../../../lib/tools'

const tool = getTool('unir-pdf')

export const metadata = {
  title: 'Unir PDF Online Gratis – DigiSpherix',
  description:
    'Combina varios archivos PDF en uno solo gratis, en el orden que quieras. Sin marcas de agua y sin subir tus archivos a internet. Todo en tu navegador.',
  openGraph: {
    title: 'Unir PDF Online Gratis – DigiSpherix',
    description: 'Junta tus PDF en un solo documento de forma privada, directo en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/unir-pdf',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PdfMerger />
    </ToolShell>
  )
}
