// Metadata central de las herramientas gratuitas de DigiSpherix.
// Se usa en el hub (/herramientas) y en cada página individual.
// Todas las herramientas corren 100% en el navegador (client-side):
// los archivos nunca se suben a un servidor.

export const tools = [
  {
    slug: 'redimensionar-imagen',
    name: 'Redimensionar Imagen',
    tagline: 'Cambia el tamaño de tus imágenes',
    description:
      'Ajusta el ancho y alto de tus fotos en segundos, directo desde tu navegador. Sin marcas de agua y sin subir nada a internet.',
    icon: 'Maximize2',
    accent: '#7c3aed',
    ready: true,
  },
  {
    slug: 'convertir-imagen',
    name: 'Convertir Imagen',
    tagline: 'JPG, PNG y WebP',
    description:
      'Convierte tus imágenes entre JPG, PNG y WebP gratis. Ideal para optimizar el peso de las fotos de tu web.',
    icon: 'Repeat',
    accent: '#d946ef',
    ready: true,
  },
  {
    slug: 'generador-contrasena',
    name: 'Generador de Contraseñas',
    tagline: 'Contraseñas seguras al instante',
    description:
      'Crea contraseñas fuertes y aleatorias con la longitud y los caracteres que elijas. Se generan en tu dispositivo, nunca se guardan.',
    icon: 'KeyRound',
    accent: '#059669',
    ready: true,
  },
  {
    slug: 'generador-qr',
    name: 'Generador de QR',
    tagline: 'Crea códigos QR gratis',
    description:
      'Genera códigos QR para tu web, WhatsApp, redes sociales o menú digital. Descárgalos en alta calidad.',
    icon: 'QrCode',
    accent: '#2563eb',
    ready: false,
  },
  {
    slug: 'imagen-a-pdf',
    name: 'Imagen a PDF',
    tagline: 'Une tus imágenes en un PDF',
    description:
      'Convierte una o varias imágenes en un solo archivo PDF, listo para compartir o imprimir.',
    icon: 'FileImage',
    accent: '#d97706',
    ready: false,
  },
  {
    slug: 'comprimir-pdf',
    name: 'Comprimir PDF',
    tagline: 'Reduce el peso de tus PDF',
    description:
      'Baja el tamaño de tus archivos PDF para enviarlos más fácil por correo o WhatsApp.',
    icon: 'FileArchive',
    accent: '#e11d48',
    ready: false,
  },
]

export function getTool(slug) {
  return tools.find((t) => t.slug === slug)
}
