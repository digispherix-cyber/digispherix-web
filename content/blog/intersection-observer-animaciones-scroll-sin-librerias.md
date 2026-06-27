---
title: "Intersection Observer API — Animaciones al scroll sin librerías ni jQuery"
date: "2026-06-27"
category: "JavaScript"
excerpt: "¿Sigues usando librerías pesadas para animar elementos al hacer scroll? La Intersection Observer API lleva años en todos los navegadores y hace lo mismo de forma nativa, más rápida y sin dependencias."
readTime: "7 min"
image: "/blog/intersection-observer-cover.jpg"
tags: ["JavaScript", "Performance", "Animaciones", "Frontend"]
---

![Intersection Observer API — Animaciones al scroll sin librerías](/blog/intersection-observer-cover.jpg)

Uno de los efectos más comunes en sitios web modernos es que los elementos aparezcan con una animación cuando el usuario hace scroll y llegan a la pantalla. Durante años, esto se resolvía con librerías como **AOS**, **ScrollReveal** o incluso jQuery — añadiendo kilobytes de código solo para detectar si un elemento es visible.

Hay una forma mejor, nativa y gratuita: la **Intersection Observer API**.

## ¿Qué es Intersection Observer?

Es una API de JavaScript que permite detectar de forma eficiente cuándo un elemento **entra o sale del viewport** (la parte visible de la pantalla), o de cualquier otro contenedor. El navegador hace el trabajo pesado — tú solo defines qué hacer cuando ocurre.

![Cómo funciona Intersection Observer — el elemento entra al viewport](/blog/intersection-observer-como-funciona.jpg)

Antes de esta API, la alternativa era escuchar el evento `scroll` y calcular manualmente la posición de cada elemento con `getBoundingClientRect()` en cada frame. Esto es **costoso para el rendimiento** porque bloquea el hilo principal del navegador.

Intersection Observer, en cambio, trabaja de forma asíncrona y no afecta el rendimiento del scroll.

## Sintaxis básica

```js
const observer = new IntersectionObserver(callback, options)
observer.observe(elemento)
```

El `callback` se ejecuta cada vez que el elemento observado cambia su estado de visibilidad. Las `options` permiten configurar el comportamiento.

## Tu primera animación al scroll en 10 líneas

![Código de Intersection Observer en acción](/blog/intersection-observer-codigo.jpg)

Primero el CSS — defines el estado inicial (invisible) y el estado final (visible):

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Luego el JavaScript — observas todos los elementos con esa clase:

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      observer.unobserve(entry.target) // deja de observar una vez visible
    }
  })
}, {
  threshold: 0.2 // se activa cuando el 20% del elemento es visible
})

document.querySelectorAll('.animate-on-scroll')
  .forEach(el => observer.observe(el))
```

Y en el HTML, solo agregas la clase a los elementos que quieres animar:

```html
<div class="animate-on-scroll">
  <h2>Este título aparece al hacer scroll</h2>
</div>

<p class="animate-on-scroll">Este párrafo también.</p>
```

Eso es todo. Sin librerías, sin dependencias, sin configuraciones complejas.

## Las opciones que debes conocer

El segundo parámetro de `IntersectionObserver` acepta tres opciones:

### threshold
Define qué porcentaje del elemento debe ser visible para activar el callback.

```js
// Se activa cuando el elemento es completamente visible
{ threshold: 1.0 }

// Se activa en cuanto aparece el primer pixel
{ threshold: 0 }

// Se activa en múltiples puntos (0%, 50% y 100%)
{ threshold: [0, 0.5, 1.0] }
```

### rootMargin
Funciona como `margin` pero para el área de detección. Permite activar el callback antes o después de que el elemento entre al viewport real.

```js
// Se activa 100px ANTES de que el elemento llegue a la pantalla
{ rootMargin: '0px 0px -100px 0px' }
```

Esto es útil para pre-cargar contenido o iniciar animaciones un poco antes de que el usuario llegue al elemento.

### root
Por defecto el "viewport" es la ventana del navegador. Con `root` puedes cambiarlo a cualquier contenedor con scroll:

```js
{
  root: document.querySelector('.mi-contenedor-con-scroll')
}
```

## Casos de uso más allá de las animaciones

Intersection Observer no es solo para efectos visuales. Hay usos mucho más prácticos:

### Lazy loading de imágenes

```js
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // carga la imagen real
      imgObserver.unobserve(img)
    }
  })
})

document.querySelectorAll('img[data-src]')
  .forEach(img => imgObserver.observe(img))
```

```html
<!-- La imagen no carga hasta que el usuario llega a ella -->
<img data-src="/imagen-pesada.jpg" src="/placeholder.jpg" alt="Producto" />
```

### Marcar artículo como leído

```js
const articleObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    marcarComoLeido()  // analytics, progreso, etc.
    articleObserver.disconnect()
  }
}, { threshold: 0.9 })

articleObserver.observe(document.querySelector('.article-end'))
```

### Infinite scroll sin librerías

```js
const sentinel = document.querySelector('#sentinel')

const scrollObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    cargarMasContenido()
  }
})

scrollObserver.observe(sentinel)
```

## Comparación con el enfoque antiguo

| | `scroll` + `getBoundingClientRect()` | Intersection Observer |
|---|---|---|
| Rendimiento | ❌ Bloquea el hilo principal | ✅ Asíncrono |
| Código necesario | ❌ 30-50 líneas | ✅ 10-15 líneas |
| Librerías externas | A veces necesarias | ✅ Nativo del navegador |
| Soporte | ✅ Universal | ✅ +96% de navegadores |

## Soporte de navegadores

Intersection Observer está disponible en todos los navegadores modernos desde hace varios años:

- ✅ Chrome 58+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Edge 16+

Con más del 96% de cobertura global, puedes usarlo sin ningún polyfill.

## Consejos de rendimiento

- **Siempre llama a `unobserve()`** cuando ya no necesites seguir observando un elemento — especialmente en animaciones que solo ocurren una vez.
- **Agrupa observaciones**: un solo `IntersectionObserver` puede observar múltiples elementos, es más eficiente que crear uno por cada elemento.
- **Evita callbacks pesados**: el callback debe ser rápido. Si necesitas hacer algo costoso, usa `requestAnimationFrame`.

```js
// ✅ Correcto — un observer para todos los elementos
const observer = new IntersectionObserver(callback)
elementos.forEach(el => observer.observe(el))

// ❌ Evitar — un observer por elemento
elementos.forEach(el => {
  new IntersectionObserver(callback).observe(el)
})
```

## Conclusión

La Intersection Observer API es una de esas herramientas que, una vez que la usas, te preguntas cómo viviste sin ella. Detecta visibilidad de forma eficiente, el código es limpio y legible, y elimina la necesidad de librerías externas para la mayoría de los casos de scroll.

Si tu sitio web todavía usa `scroll` + `getBoundingClientRect()` o depende de AOS y ScrollReveal solo para animar elementos, considera migrar a esta API nativa — tu sitio cargará más rápido y el código será más mantenible.

¿Quieres implementar animaciones al scroll u otras funcionalidades modernas en tu sitio web? En DigiSpherix construimos sitios rápidos con las mejores prácticas actuales. [Contáctanos](/#contacto) y cuéntanos tu proyecto.
