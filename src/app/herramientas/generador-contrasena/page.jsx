import ToolShell from '../../../components/tools/ToolShell'
import PasswordGenerator from '../../../components/tools/PasswordGenerator'
import { getTool } from '../../../lib/tools'

const tool = getTool('generador-contrasena')

export const metadata = {
  title: 'Generador de Contraseñas Seguras Gratis – DigiSpherix',
  description:
    'Crea contraseñas fuertes y aleatorias gratis. Elige longitud, mayúsculas, números y símbolos. Se generan en tu navegador y nunca se guardan.',
  openGraph: {
    title: 'Generador de Contraseñas Seguras – DigiSpherix',
    description: 'Contraseñas fuertes generadas de forma privada en tu navegador.',
    url: 'https://digispherix.com.mx/herramientas/generador-contrasena',
  },
}

export default function Page() {
  return (
    <ToolShell name={tool.name} tagline={tool.description} accent={tool.accent}>
      <PasswordGenerator />
    </ToolShell>
  )
}
