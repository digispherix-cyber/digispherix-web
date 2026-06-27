---
title: "CSS :has() — El selector que cambió el desarrollo web para siempre"
date: "2026-06-27"
category: "CSS"
excerpt: "Durante décadas, CSS careció de un selector padre. En 2023 llegó :has() a todos los navegadores y redefinió lo que es posible hacer con CSS puro, sin una sola línea de JavaScript."
readTime: "8 min"
image: "/blog/has-selector-css.jpg"
tags: ["CSS", "Frontend", "Desarrollo Web", "Novedades"]
---

![CSS :has() — El selector padre que CSS nunca tuvo](/blog/has-selector-css.jpg)

Durante más de 20 años, los desarrolladores web vivieron con una limitación frustrante: CSS no podía seleccionar un elemento basado en lo que contenía. Si querías cambiar el estilo de un `<div>` cuando uno de sus hijos tenía cierta clase, necesitabas JavaScript obligatoriamente.

Eso cambió con **CSS `:has()`** — el selector que la comunidad esperó dos décadas y que finalmente llegó con soporte completo en todos los navegadores modernos.

## ¿Qué es :has() y por qué es tan importante?

`:has()` es una pseudo-clase CSS que permite seleccionar un elemento **en función de sus descendientes o elementos siguientes**. En palabras simples: por fin puedes seleccionar al padre basándote en sus hijos.

La sintaxis es directa:

```css
/* Selecciona cualquier div que contenga un párrafo */
div:has(p) {
  background: #f0f0f0;
}

/* Selecciona un label que contenga un input con focus */
label:has(input:focus) {
  color: purple;
  font-weight: bold;
}
```

Antes de `:has()`, el segundo ejemplo requería JavaScript: escuchar el evento `focus`, recorrer el DOM hasta encontrar el `label` padre y agregarle una clase manualmente. Ahora son dos líneas de CSS.

## Soporte en navegadores

Una de las mejores noticias es que `:has()` ya tiene soporte completo en todos los navegadores modernos desde finales de 2023.

![Soporte de :has() en navegadores según caniuse.com](/blog/has-soporte-navegadores.jpg)

- ✅ Chrome 105+
- ✅ Edge 105+
- ✅ Safari 15.4+
- ✅ Firefox 121+

Con más del 95% de cobertura global, puedes usarlo en producción hoy mismo sin preocupaciones.

## Ejemplos prácticos que van a cambiar tu forma de escribir CSS

### 1. Formularios que reaccionan a sus propios campos

El caso de uso más común y poderoso. Antes necesitabas JS para validar visualmente un formulario completo.

```css
/* El formulario completo se vuelve rojo si algún input es inválido */
.form:has(input:invalid) {
  border: 2px solid #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

/* El botón de enviar se desactiva visualmente si hay errores */
.form:has(input:invalid) .btn-submit {
  opacity: 0.5;
  pointer-events: none;
}
```

### 2. Tarjetas que se adaptan a su contenido

¿Alguna vez necesitaste que una tarjeta tuviera un diseño diferente si tenía imagen o no?

```css
/* Tarjeta sin imagen: texto centrado */
.card {
  text-align: center;
  padding: 32px;
}

/* Tarjeta CON imagen: layout horizontal */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
  text-align: left;
  padding: 0;
}
```

### 3. Navegación activa sin JavaScript

```css
/* Resalta el ítem del menú que contiene el enlace activo */
.nav-item:has(a.active) {
  background: rgba(124, 58, 237, 0.15);
  border-radius: 8px;
}
```

### 4. Modo oscuro basado en preferencia del sistema dentro de un componente

```css
/* Ajusta colores dentro de una card según el tema del sistema */
.card:has(+ .dark-mode-toggle:checked) {
  background: #1a1a2e;
  color: white;
}
```

## El ejemplo que más impresiona: selector combinado

![Ejemplo de código usando :has() en un caso real](/blog/has-ejemplo-codigo.jpg)

Una de las combinaciones más poderosas es usar `:has()` junto con `:not()`:

```css
/* Selecciona secciones que NO tienen un título h2 */
section:not(:has(h2)) {
  padding-top: 0;
}

/* Selecciona párrafos que van justo después de una imagen */
p:has(+ img) {
  margin-bottom: 0;
}
```

## ¿Afecta el rendimiento?

Esta fue la razón principal por la que los navegadores tardaron tanto en implementarlo. Evaluar `:has()` puede ser costoso porque requiere que el navegador revise los descendientes de cada elemento mientras construye el árbol de estilos.

En la práctica, el impacto es mínimo para la mayoría de los casos de uso. Las recomendaciones son:

- **Evita** selectores demasiado genéricos como `*:has(div)` — aplícalos siempre a clases o elementos específicos
- **Úsalo con moderación** en listas muy largas (miles de elementos)
- Para los casos normales de UI: úsalo sin miedo, el impacto es insignificante

## ¿Necesito un fallback para navegadores antiguos?

Para Internet Explorer y versiones muy antiguas de Firefox (pre-121), `:has()` no existe. Si tu audiencia lo requiere, puedes detectar el soporte así:

```css
/* Estilos base para todos */
.card { text-align: center; }

/* Solo para navegadores que soporten :has() */
@supports selector(:has(*)) {
  .card:has(img) {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

La directiva `@supports selector()` verifica soporte antes de aplicar los estilos — el fallback perfecto y limpio.

## Conclusión

`:has()` no es solo un selector más. Es un cambio de paradigma que elimina cientos de líneas de JavaScript innecesario, hace el código más legible y acerca a CSS al nivel de expresividad que los desarrolladores siempre necesitaron.

Si todavía no lo estás usando en tus proyectos, este es el momento. La compatibilidad es excelente, la sintaxis es intuitiva y los beneficios son inmediatos.

¿Quieres que implementemos algo con `:has()` en tu próximo proyecto web? En DigiSpherix usamos las últimas tecnologías para construir sitios modernos, rápidos y fáciles de mantener. [Contáctanos](//#contacto) y hablamos.
