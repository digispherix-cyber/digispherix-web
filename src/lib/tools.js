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
  {
    slug: 'paleta-colores',
    name: 'Paleta de Colores',
    tagline: 'Elige colores y genera paletas',
    description:
      'Elige un color y obtén sus códigos HEX, RGB y HSL, además de una paleta de tonos y colores armónicos lista para copiar.',
    icon: 'Palette',
    accent: '#d946ef',
    ready: true,
    privacyNote: 'todo se genera en tu navegador',
    howItWorks: [
      'Elige un color con el selector o pega un código HEX.',
      'Copia sus valores en HEX, RGB o HSL con un clic.',
      'Usa la paleta de tonos y armónicos que se genera automáticamente.',
    ],
    faqs: [
      { q: '¿Qué son HEX, RGB y HSL?', a: 'Son tres formas de escribir un color. HEX (#RRGGBB) se usa en la web, RGB en pantallas y HSL es útil para ajustar tono, saturación y brillo.' },
      { q: '¿Qué es una paleta armónica?', a: 'Es un conjunto de colores que combinan bien entre sí (análogos, complementarios y variaciones de tono) para diseñar con buen gusto.' },
      { q: '¿Para qué me sirve esta herramienta?', a: 'Para elegir los colores de tu marca, tu web o tus publicaciones, y obtener los códigos exactos para usarlos.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis y sin registros.' },
    ],
  },
  {
    slug: 'base64',
    name: 'Codificador / Decodificador',
    tagline: 'Base64, Hexadecimal, Binario y Decimal',
    description:
      'Convierte entre Texto, Base64, Hexadecimal, Binario y Decimal en cualquier dirección: texto a Base64, Base64 a hexadecimal, etc. Útil para desarrolladores y para transportar datos.',
    icon: 'Binary',
    accent: '#0891b2',
    ready: true,
    privacyNote: 'todo se procesa en tu navegador',
    howItWorks: [
      'Elige el formato de origen y el de destino (Texto, Base64, Hexadecimal, Binario o Decimal).',
      'Pega tu contenido; la conversión aparece al instante.',
      'Copia el resultado con un clic, o pulsa Invertir para hacer la conversión contraria.',
    ],
    faqs: [
      { q: '¿Qué formatos puedo convertir?', a: 'Texto, Base64, Hexadecimal, Binario y Decimal. Puedes convertir de cualquiera a cualquiera: texto a Base64, Base64 a hexadecimal, binario a texto, etc.' },
      { q: '¿Qué es Base64?', a: 'Es una forma de representar datos usando solo letras, números y algunos símbolos, muy usada para transportar información en la web y el correo.' },
      { q: '¿Para qué sirve el hexadecimal o el binario?', a: 'Se usan mucho en programación y electrónica para representar datos byte por byte. Aquí puedes ver cómo se ve tu texto en esos formatos.' },
      { q: '¿Esto cifra o protege mi información?', a: 'No. Codificar (Base64, hex, etc.) no es cifrado: cualquiera puede revertirlo. No sirve para proteger datos sensibles.' },
      { q: '¿Funciona con acentos y emojis?', a: 'Sí. Maneja correctamente caracteres en español (acentos, ñ) y emojis gracias a la codificación UTF-8.' },
      { q: '¿Se suben mis datos a internet?', a: 'No. Todo se procesa en tu navegador; tu texto no sale de tu dispositivo.' },
    ],
  },
  {
    slug: 'contador-palabras',
    name: 'Contador de Palabras',
    tagline: 'Palabras, caracteres y más',
    description:
      'Cuenta palabras, caracteres, párrafos y el tiempo de lectura de cualquier texto, en tiempo real mientras escribes.',
    icon: 'Type',
    accent: '#7c3aed',
    ready: true,
    privacyNote: 'todo se cuenta en tu navegador',
    howItWorks: [
      'Escribe o pega tu texto en el cuadro.',
      'Verás al instante palabras, caracteres, párrafos y tiempo de lectura.',
      'Úsalo para respetar límites de redes sociales, ensayos o descripciones.',
    ],
    faqs: [
      { q: '¿Cuenta caracteres con y sin espacios?', a: 'Sí, te muestra ambos: el total de caracteres y también cuántos hay sin contar los espacios.' },
      { q: '¿Cómo calcula el tiempo de lectura?', a: 'Estima el tiempo con base en un promedio de lectura de unas 200 palabras por minuto.' },
      { q: '¿Sirve para límites de Twitter/X o Instagram?', a: 'Sí. Te ayuda a no pasarte de los límites de caracteres de redes sociales, títulos SEO o descripciones.' },
      { q: '¿Se guarda o se sube mi texto?', a: 'No. Todo se cuenta en tu navegador; tu texto nunca se sube ni se guarda.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis.' },
    ],
  },
  {
    slug: 'firma-correo',
    name: 'Firma de Correo',
    tagline: 'Firma profesional para Gmail y Outlook',
    description:
      'Crea una firma de correo profesional con tus datos, logo y redes sociales. Cópiala y pégala directo en Gmail, Outlook o el correo que uses.',
    icon: 'Signature',
    accent: '#2563eb',
    ready: true,
    privacyNote: 'todo se genera en tu navegador',
    howItWorks: [
      'Llena tus datos: nombre, puesto, empresa, teléfono, correo y redes.',
      'Mira la vista previa en vivo y ajústala a tu gusto.',
      'Copia la firma y pégala en la configuración de tu correo.',
    ],
    faqs: [
      { q: '¿Sirve para Gmail y Outlook?', a: 'Sí. La firma se copia con formato y puedes pegarla en la sección de firma de Gmail, Outlook y la mayoría de los correos.' },
      { q: '¿Puedo agregar mi logo?', a: 'Sí, puedes subir el logo de tu negocio y aparecerá en la firma junto a tus datos.' },
      { q: '¿Cómo la pego en Gmail?', a: 'Copia la firma con el botón, entra a Configuración de Gmail, busca la sección Firma y pégala ahí con Ctrl+V.' },
      { q: '¿Se suben mis datos a internet?', a: 'No. La firma se arma en tu navegador; tus datos no se envían ni se guardan en ningún servidor.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis y sin registro.' },
    ],
  },
  {
    slug: 'mayusculas-minusculas',
    name: 'Mayúsculas y Minúsculas',
    tagline: 'Convierte texto entre mayúsculas, minúsculas y más',
    description:
      'Convierte cualquier texto a MAYÚSCULAS, minúsculas, Tipo Título o tipo oración con un clic. Ideal para títulos, publicaciones y corregir textos.',
    icon: 'CaseSensitive',
    accent: '#7c3aed',
    ready: true,
    privacyNote: 'todo se convierte en tu navegador',
    howItWorks: [
      'Escribe o pega tu texto en el cuadro.',
      'Elige el formato: MAYÚSCULAS, minúsculas, Tipo Título o tipo oración.',
      'Copia el resultado con un clic.',
    ],
    faqs: [
      { q: '¿Qué formatos puedo aplicar?', a: 'MAYÚSCULAS, minúsculas, Tipo Título (primera letra de cada palabra), tipo oración (primera letra del texto) y alternado.' },
      { q: '¿Respeta los acentos y la ñ?', a: 'Sí. Convierte correctamente caracteres en español, incluyendo acentos y la ñ.' },
      { q: '¿Sirve para títulos y publicaciones?', a: 'Claro. Es muy útil para dar formato a títulos, encabezados y publicaciones de redes sociales rápidamente.' },
      { q: '¿Se guarda mi texto?', a: 'No. Todo se procesa en tu navegador; tu texto no se sube ni se guarda.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis.' },
    ],
  },
  {
    slug: 'sorteo-ganador',
    name: 'Sorteos',
    tagline: 'Elige un ganador al azar para tus dinámicas',
    description:
      'Sortea un ganador (o varios) de forma justa y aleatoria a partir de una lista de participantes. Perfecto para rifas y concursos en redes sociales.',
    icon: 'Trophy',
    accent: '#d946ef',
    ready: true,
    privacyNote: 'el sorteo ocurre en tu navegador',
    howItWorks: [
      'Pega la lista de participantes, uno por línea (nombres o usuarios).',
      'Elige cuántos ganadores quieres y si quitas duplicados.',
      'Pulsa Sortear y se elige al ganador al azar de forma justa.',
    ],
    faqs: [
      { q: '¿El sorteo es realmente aleatorio?', a: 'Sí. Usamos el generador de números aleatorios seguro del navegador (crypto), que no se puede predecir ni manipular.' },
      { q: '¿Puedo elegir más de un ganador?', a: 'Sí. Puedes indicar cuántos ganadores quieres y se eligen sin repetir.' },
      { q: '¿Sirve para rifas de Instagram o Facebook?', a: 'Claro. Copia los nombres o usuarios de los participantes, pégalos y realiza el sorteo. Puedes copiar el resultado para publicarlo.' },
      { q: '¿Se guardan los participantes?', a: 'No. Todo ocurre en tu navegador; la lista no se sube ni se guarda en ningún lado.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis y sin registro.' },
    ],
  },
  {
    slug: 'grabador-pantalla',
    name: 'Grabador de Pantalla',
    tagline: 'Graba tu pantalla y micrófono, sin instalar nada',
    description:
      'Graba tu pantalla completa, una ventana o una pestaña, con audio del micrófono o del sistema, y descarga el video. Ideal para tutoriales, demos y presentaciones.',
    icon: 'MonitorPlay',
    accent: '#0891b2',
    ready: true,
    privacyNote: 'la grabación se queda en tu navegador',
    howItWorks: [
      'Elige si quieres incluir tu micrófono o el audio del sistema.',
      'Pulsa Grabar y selecciona la pantalla, ventana o pestaña a capturar.',
      'Al terminar, revisa el video y descárgalo. Nada se sube a internet.',
    ],
    faqs: [
      { q: '¿Necesito instalar algo?', a: 'No. Funciona directo en tu navegador (Chrome, Edge o Firefox de escritorio), sin instalar programas ni extensiones.' },
      { q: '¿Puedo grabar con mi voz?', a: 'Sí. Puedes activar el micrófono para narrar mientras grabas, y también capturar el audio del sistema.' },
      { q: '¿En qué formato se descarga?', a: 'El video se descarga en formato WebM, compatible con la mayoría de reproductores y editores.' },
      { q: '¿La grabación se sube a algún servidor?', a: 'No. Todo ocurre en tu navegador y el video se queda en tu dispositivo; no se sube a ningún lado.' },
      { q: '¿Funciona en el celular?', a: 'La grabación de pantalla del navegador está pensada para computadora. En celular es mejor usar el grabador de pantalla propio del sistema.' },
      { q: '¿Es gratis?', a: 'Sí, totalmente gratis y sin registro.' },
    ],
  },
]

export function getTool(slug) {
  return tools.find((t) => t.slug === slug)
}
