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
    howItWorks: [
      'Elige o arrastra tu imagen (JPG, PNG o WebP).',
      'Escribe el ancho y alto que quieres, o usa un preset (100%, 75%, 50%, 25%). Deja activada la opción "mantener proporción" para no deformarla.',
      'Descarga tu imagen redimensionada. Todo ocurre en tu navegador, sin subir nada.',
    ],
    faqs: [
      { q: '¿Se pierde calidad al redimensionar una imagen?', a: 'Al reducir el tamaño la calidad se conserva muy bien. Al ampliar más allá del tamaño original la imagen puede verse un poco borrosa, como en cualquier editor.' },
      { q: '¿Mis imágenes se suben a algún servidor?', a: 'No. Todo el proceso ocurre dentro de tu navegador; tus archivos nunca salen de tu dispositivo.' },
      { q: '¿Qué formatos de imagen puedo usar?', a: 'Puedes cargar imágenes JPG, PNG y WebP. La imagen redimensionada se descarga en formato PNG.' },
      { q: '¿Tiene marcas de agua o límite de uso?', a: 'No. Es 100% gratis, sin marcas de agua y sin límite de imágenes.' },
      { q: '¿Funciona desde el celular?', a: 'Sí. Puedes elegir una foto de tu galería o tomarla con la cámara directamente desde el navegador de tu teléfono.' },
    ],
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
    howItWorks: [
      'Sube o arrastra la imagen que quieres convertir.',
      'Elige el formato de destino: JPG, PNG o WebP. Ajusta la calidad si quieres reducir el peso.',
      'Descarga tu imagen convertida al instante, sin subir nada a internet.',
    ],
    faqs: [
      { q: '¿Cuál formato de imagen me conviene?', a: 'WebP suele dar el menor peso con buena calidad, ideal para páginas web. JPG es universal para fotos. PNG conserva transparencia y bordes nítidos.' },
      { q: '¿Convertir a JPG quita la transparencia?', a: 'Sí. Como el formato JPG no soporta transparencia, las zonas transparentes se rellenan con blanco. Si necesitas conservar transparencia, usa PNG o WebP.' },
      { q: '¿Se suben mis archivos a internet?', a: 'No. La conversión ocurre 100% en tu navegador; tus imágenes nunca salen de tu dispositivo.' },
      { q: '¿Sirve para bajar el peso de mis imágenes?', a: 'Sí, especialmente convirtiendo a WebP o bajando la calidad en JPG y WebP. Es muy útil para que tu web cargue más rápido y posicione mejor.' },
      { q: '¿Es gratis?', a: 'Totalmente gratis, sin marcas de agua ni registros.' },
    ],
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
    howItWorks: [
      'Elige la longitud de la contraseña con el deslizador.',
      'Selecciona qué incluir: mayúsculas, minúsculas, números y símbolos.',
      'Copia tu contraseña con un clic. Se genera en tu dispositivo y nunca se guarda.',
    ],
    faqs: [
      { q: '¿Qué tan seguras son estas contraseñas?', a: 'Se generan con el generador criptográfico del navegador (Web Crypto), que produce valores verdaderamente aleatorios. Mientras más larga y variada sea, más segura.' },
      { q: '¿Se guardan o se envían mis contraseñas?', a: 'No. Se generan localmente en tu navegador y no se almacenan ni se transmiten a ningún servidor.' },
      { q: '¿Qué longitud de contraseña recomiendan?', a: 'Para la mayoría de cuentas, 16 caracteres o más con todos los tipos de caracteres activados es muy seguro.' },
      { q: '¿Puedo usarla para cualquier cuenta?', a: 'Sí, sirve para correo, redes sociales, banca y más. Te recomendamos usar una contraseña distinta para cada servicio.' },
      { q: '¿Necesito internet para usar el generador?', a: 'Una vez cargada la página, la herramienta funciona aunque pierdas la conexión, porque todo corre en tu propio dispositivo.' },
    ],
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
