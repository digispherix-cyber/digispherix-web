import ToolShell from '../../../components/tools/ToolShell'
import EmailSignatureTool from '../../../components/tools/EmailSignatureTool'
import { getTool } from '../../../lib/tools'

const tool = getTool('firma-correo')

export const metadata = {
  title: 'Generador de Firma de Correo Gratis – DigiSpherix',
  description:
    'Crea una firma de correo profesional con tus datos, logo y colores. Cópiala y pégala en Gmail u Outlook. Gratis y en tu navegador, sin registro.',
  openGraph: {
    title: 'Generador de Firma de Correo Gratis – DigiSpherix',
    description: 'Firma de correo profesional lista para Gmail y Outlook, en segundos.',
    url: 'https://digispherix.com.mx/herramientas/firma-correo',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <EmailSignatureTool />
    </ToolShell>
  )
}
