import ToolShell from '../../../components/tools/ToolShell'
import CaseConverterTool from '../../../components/tools/CaseConverterTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('mayusculas-minusculas')

export const metadata = {
  title: 'Convertir a Mayúsculas y Minúsculas Online Gratis – DigiSpherix',
  description:
    'Convierte texto a MAYÚSCULAS, minúsculas, Tipo Título o tipo oración con un clic. Respeta acentos y ñ. Gratis y en tu navegador, sin subir nada.',
  openGraph: {
    title: 'Convertir Mayúsculas y Minúsculas – DigiSpherix',
    description: 'Cambia el formato de tu texto al instante, de forma privada en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/mayusculas-minusculas',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CaseConverterTool />
    </ToolShell>
  )
}
