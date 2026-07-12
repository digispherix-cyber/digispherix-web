// Configuración de anuncios Google AdSense.
//
// Con "Anuncios automáticos" activados, Google ya coloca anuncios solo.
// Estos bloques son ESPACIOS MANUALES para controlar la ubicación en
// puntos concretos (dentro del artículo, dentro de la herramienta).
//
// Para activarlos: en AdSense → Anuncios → "Por unidad de anuncio" crea
// un bloque de "Display", copia su número de slot (data-ad-slot) y pégalo
// aquí. Mientras el valor esté vacío (''), el espacio NO muestra nada y
// no afecta el sitio.
export const ADSENSE_CLIENT = 'ca-pub-7425317474892420'

export const AD_SLOTS = {
  blogInArticle: '', // bloque dentro de los artículos del blog
  toolInline: '',    // bloque dentro de las páginas de herramientas
}
