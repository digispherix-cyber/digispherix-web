import ToolShell from '../../../components/tools/ToolShell'
import ColorPalette from '../../../components/tools/ColorPalette'
import { getTool } from '../../../lib/tools'

const tool = getTool('paleta-colores')

export const metadata = {
  title: 'Selector y Paleta de Colores Gratis (HEX, RGB, HSL) – DigiSpherix',
  description:
    'Elige un color y obtén sus códigos HEX, RGB y HSL, más una paleta de tonos y colores armónicos lista para copiar. Gratis y directo en tu navegador.',
  openGraph: {
    title: 'Selector y Paleta de Colores Gratis – DigiSpherix',
    description: 'Genera paletas y copia códigos de color HEX, RGB y HSL en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/paleta-colores',
  },
}

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ColorPalette />
    </ToolShell>
  )
}
