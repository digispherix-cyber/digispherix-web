import ToolShell from '../../../components/tools/ToolShell'
import WordCounter from '../../../components/tools/WordCounter'
import { getTool } from '../../../lib/tools'

const tool = getTool('contador-palabras')

export const metadata = {
  title: 'Contador de Palabras y Caracteres Online Gratis – DigiSpherix',
  description:
    'Cuenta palabras, caracteres (con y sin espacios), párrafos y el tiempo de lectura de tu texto en tiempo real. Gratis, ideal para redes sociales y SEO.',
  openGraph: {
    title: 'Contador de Palabras y Caracteres – DigiSpherix',
    description: 'Cuenta palabras, caracteres y tiempo de lectura al instante en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/contador-palabras',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WordCounter />
    </ToolShell>
  )
}
