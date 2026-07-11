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
    slug: 'comprimir-imagen',
    name: 'Comprimir Imagen',
    tagline: 'Reduce el peso de tus fotos',
    description:
      'Baja el peso de tus imágenes JPG, PNG o WebP sin que se vean mal. Ideal para que tu web cargue más rápido o enviarlas por correo y WhatsApp.',
    icon: 'ImageDown',
    accent: '#0891b2',
    ready: true,
    howItWorks: [
      'Sube o arrastra tu imagen (JPG, PNG o WebP).',
      'Ajusta el nivel de compresión hasta lograr el equilibrio entre peso y calidad que quieras.',
      'Descarga tu imagen más ligera. Todo ocurre en tu navegador, sin subir nada.',
    ],
    faqs: [
      { q: '¿Cuánto puedo reducir el peso de mi imagen?', a: 'Depende de la imagen, pero suele bajar entre 40% y 80% manteniendo buena calidad, sobre todo en fotografías.' },
      { q: '¿Se pierde calidad al comprimir?', a: 'A mayor compresión, un poco menos de nitidez. Puedes elegir el nivel que mejor equilibre peso y calidad para tu caso.' },
      { q: '¿Se suben mis imágenes a internet?', a: 'No. Todo el proceso ocurre dentro de tu navegador; tus archivos no salen de tu dispositivo.' },
      { q: '¿Para qué me sirve comprimir imágenes?', a: 'Para que tu página web cargue más rápido (mejor SEO) y para enviar fotos por correo o WhatsApp sin que pesen tanto.' },
      { q: '¿Es gratis y sin marcas de agua?', a: 'Sí, totalmente gratis y sin marcas de agua.' },
    ],
  },
  {
    slug: 'quitar-fondo',
    name: 'Quitar Fondo',
    tagline: 'Elimina el fondo de tus fotos con IA',
    description:
      'Quita el fondo de cualquier imagen automáticamente y descárgala con fondo transparente. Perfecto para fotos de producto, catálogos y logos.',
    icon: 'Wand2',
    accent: '#7c3aed',
    ready: false,
    privacyNote: 'la IA corre en tu navegador; tus fotos no se suben',
    howItWorks: [
      'Sube o arrastra la imagen a la que quieres quitarle el fondo.',
      'Espera unos segundos mientras la inteligencia artificial detecta el objeto principal.',
      'Descarga tu imagen con el fondo eliminado (PNG transparente).',
    ],
    faqs: [
      { q: '¿Cómo quita el fondo sin subir mi foto?', a: 'Usa un modelo de inteligencia artificial que corre dentro de tu propio navegador. Tu imagen nunca se sube a ningún servidor.' },
      { q: '¿Por qué tarda la primera vez?', a: 'La primera vez descarga el modelo de IA (unos MB) y queda guardado en tu navegador; las siguientes veces es mucho más rápido.' },
      { q: '¿Con qué imágenes funciona mejor?', a: 'Con fotos donde el objeto o la persona se distingue bien del fondo, como fotos de producto o retratos.' },
      { q: '¿Sirve para fotos de producto?', a: 'Sí, es ideal para dejar tus productos con fondo transparente o blanco, listos para tu tienda en línea o catálogo.' },
      { q: '¿Es gratis?', a: 'Sí, gratis y sin marcas de agua.' },
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
    privacyNote: 'se genera en tu dispositivo y nunca se guarda',
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
    ready: true,
    privacyNote: 'se genera en tu dispositivo, sin subir nada',
    howItWorks: [
      'Escribe el texto o enlace que quieres convertir en QR (una URL, tu WhatsApp, redes sociales, etc.).',
      'Personaliza el tamaño y los colores si quieres.',
      'Descarga tu código QR en PNG, listo para imprimir o compartir.',
    ],
    faqs: [
      { q: '¿Para qué sirve un código QR?', a: 'Permite que cualquiera abra tu enlace, tu WhatsApp, tu menú o tus redes con solo escanearlo con la cámara del celular. Ideal para negocios, menús, tarjetas y publicidad.' },
      { q: '¿Los códigos QR que genero caducan?', a: 'No. Son códigos QR estáticos: apuntan directamente a tu enlace o texto y funcionan para siempre, sin depender de ningún servicio.' },
      { q: '¿Puedo ponerle mi logo al código QR?', a: 'Sí. Puedes agregar un logo al centro, una leyenda como "Escanéame" y un borde. El QR usa alta corrección de errores, así que sigue funcionando aunque tenga el logo encima.' },
      { q: '¿Puedo poner mi enlace de WhatsApp?', a: 'Sí. Usa un enlace tipo https://wa.me/52TUNUMERO y al escanear el QR se abrirá un chat contigo directamente.' },
      { q: '¿Se sube mi información a internet?', a: 'No. El código QR se genera dentro de tu navegador; tu texto o enlace nunca sale de tu dispositivo.' },
      { q: '¿Es gratis y sin marcas de agua?', a: 'Sí, totalmente gratis, en alta calidad y sin marcas de agua.' },
    ],
  },
  {
    slug: 'imagen-a-pdf',
    name: 'Imagen a PDF',
    tagline: 'Une tus imágenes en un PDF',
    description:
      'Convierte una o varias imágenes en un solo archivo PDF, listo para compartir o imprimir.',
    icon: 'FileImage',
    accent: '#d97706',
    ready: true,
    howItWorks: [
      'Sube o arrastra una o varias imágenes (JPG o PNG).',
      'Ordénalas como quieras que aparezcan; cada imagen será una página.',
      'Descarga tu PDF con todas las imágenes, listo para compartir o imprimir.',
    ],
    faqs: [
      { q: '¿Puedo unir varias imágenes en un solo PDF?', a: 'Sí. Sube todas las imágenes que necesites y se combinan en un único archivo PDF, una imagen por página.' },
      { q: '¿Qué formatos de imagen acepta?', a: 'Puedes usar imágenes JPG y PNG.' },
      { q: '¿Se suben mis imágenes a internet?', a: 'No. Todo se procesa dentro de tu navegador; tus archivos no salen de tu dispositivo.' },
      { q: '¿Sirve para digitalizar documentos?', a: 'Sí. Toma fotos de tus hojas y conviértelas en un PDF ordenado, ideal para enviar por correo o WhatsApp.' },
      { q: '¿Es gratis y sin marcas de agua?', a: 'Sí, totalmente gratis y sin marcas de agua.' },
    ],
  },
  {
    slug: 'unir-pdf',
    name: 'Unir PDF',
    tagline: 'Combina varios PDF en uno',
    description:
      'Junta varios archivos PDF en un solo documento, en el orden que tú elijas. Rápido y sin subir nada a internet.',
    icon: 'FileStack',
    accent: '#0d9488',
    ready: true,
    howItWorks: [
      'Sube o arrastra los PDF que quieres combinar.',
      'Ordénalos arrastrándolos como quieras que aparezcan.',
      'Descarga tu PDF unificado, listo para compartir o imprimir.',
    ],
    faqs: [
      { q: '¿Cuántos PDF puedo unir?', a: 'Los que necesites. Se combinan en un solo archivo en el orden que definas.' },
      { q: '¿Puedo cambiar el orden de los archivos?', a: 'Sí. Solo arrástralos en la lista para acomodarlos antes de unirlos.' },
      { q: '¿Se suben mis PDF a algún servidor?', a: 'No. Todo se procesa dentro de tu navegador; tus archivos no salen de tu dispositivo.' },
      { q: '¿Se conserva la calidad de los PDF?', a: 'Sí. Unir PDF no recomprime nada: mantiene las páginas tal cual, solo las junta en un archivo.' },
      { q: '¿Es gratis y sin marcas de agua?', a: 'Sí, totalmente gratis y sin marcas de agua.' },
    ],
  },
  {
    slug: 'extraer-texto',
    name: 'Extraer Texto (OCR)',
    tagline: 'Saca el texto de imágenes y PDF',
    description:
      'Convierte fotos de documentos o PDF escaneados en texto que puedes copiar y editar. Reconocimiento en español, directo en tu navegador.',
    icon: 'ScanText',
    accent: '#0891b2',
    ready: true,
    privacyNote: 'el reconocimiento corre en tu navegador; tus archivos no se suben',
    howItWorks: [
      'Sube o arrastra una imagen (foto de un documento) o un PDF escaneado.',
      'Espera unos segundos mientras se reconoce el texto.',
      'Copia el texto extraído y úsalo donde lo necesites.',
    ],
    faqs: [
      { q: '¿Qué es el OCR?', a: 'Es una tecnología que "lee" el texto dentro de una imagen o PDF escaneado y lo convierte en texto que puedes copiar y editar.' },
      { q: '¿Se sube mi documento a internet?', a: 'No. El reconocimiento ocurre 100% dentro de tu navegador; tu archivo no sale de tu dispositivo.' },
      { q: '¿Reconoce texto en español?', a: 'Sí, está optimizado para español, incluyendo acentos y la ñ.' },
      { q: '¿Con qué documentos funciona mejor?', a: 'Con imágenes claras y bien iluminadas, texto legible y buen contraste. Los documentos borrosos o torcidos dan menos precisión.' },
      { q: '¿Es gratis?', a: 'Sí, gratis y sin límite de uso.' },
    ],
  },
  {
    slug: 'comprimir-pdf',
    name: 'Comprimir PDF',
    tagline: 'Reduce el peso de tus PDF',
    description:
      'Baja el tamaño de tus archivos PDF para enviarlos más fácil por correo o WhatsApp.',
    icon: 'FileArchive',
    accent: '#e11d48',
    ready: true,
    howItWorks: [
      'Sube o arrastra tu archivo PDF.',
      'Elige el nivel de compresión según el equilibrio que quieras entre peso y calidad.',
      'Descarga tu PDF más ligero, listo para enviar por correo o WhatsApp.',
    ],
    faqs: [
      { q: '¿Cómo reduce el peso del PDF?', a: 'Vuelve a procesar las páginas del PDF como imágenes optimizadas y las recomprime, bajando el tamaño del archivo manteniendo una buena calidad visual.' },
      { q: '¿Pierde calidad al comprimir?', a: 'A mayor compresión, un poco menos de nitidez. Puedes elegir el nivel que mejor equilibre peso y calidad para tu caso.' },
      { q: '¿Funciona con PDFs de texto?', a: 'Funciona mejor con PDFs con imágenes o escaneados. En documentos de solo texto la reducción puede ser menor, ya que el texto se convierte a imagen optimizada.' },
      { q: '¿Se sube mi PDF a algún servidor?', a: 'No. La compresión ocurre 100% en tu navegador; tu archivo no sale de tu dispositivo.' },
      { q: '¿Hay límite de tamaño?', a: 'Al procesarse en tu dispositivo, los PDF muy grandes pueden tardar más o depender de la memoria de tu equipo. Funciona mejor con archivos de tamaño moderado.' },
    ],
  },
]

export function getTool(slug) {
  return tools.find((t) => t.slug === slug)
}
