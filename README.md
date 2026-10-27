# Lleno de Tizne — portafolio

Sitio estático (HTML + CSS + JS, sin librerías). Estética brutalista: escala de grises, cero curvas, grano y hollín.

## Estructura

```
index.html                   Landing: Inicio, Sobre mí, Archivo, Galería, Proyectos, Contacto
css/tizne.css                Todos los estilos (colores, fuentes, texturas)
js/tizne.js                  Menú móvil, pestañas y filtros del Archivo, pop-ups, formulario
textos/plantilla-texto.html  Plantilla para cada texto nuevo
textos/*.html                Páginas de cada texto del Archivo
img/                         Fotos de la Galería, favicon y og.jpg (vista previa al compartir)
404.html                     Página de error con la misma estética
```

## Cómo agregar un texto

1. Duplica `textos/plantilla-texto.html` (ej. `textos/mi-cuento.html`) y escribe tu texto.
2. En `index.html`, dentro de `.archive-list`, copia un bloque `<article class="archive-item">`,
   cambia `data-category` (`poesia`, `cronica`, `nota`, `ensayo`), el título, el enlace y el fragmento.
3. Las pestañas *Bloque I, II, III…* se crean solas. Para cambiar cuántos textos caben en cada
   pestaña, edita `TEXTOS_POR_BLOQUE` al inicio de `js/tizne.js`.

## Cómo poner fotos en la Galería

Copia la foto a `img/` y reemplaza el `<div class="gallery-placeholder-text">` por
`<img src="img/tu-foto.jpg" alt="Descripción">`. Todas las imágenes se muestran en escala de grises.

## Fuentes

- Títulos: **Rubik Dirt** (palo seco, bold, raspada)
- Cuerpo: **EB Garamond**
- Menús, botones y metadatos: **Courier New**

Se cambian en `css/tizne.css`, en las variables `--font-titulos`, `--font-cuerpo` y `--font-mono`.

## Vista previa al compartir

`img/og.jpg` es la imagen que aparece cuando mandas el link por WhatsApp o redes. Las etiquetas
`og:url` y `og:image` en `index.html` apuntan a `https://uiuaaxyz.github.io/llndtzn/`; si usas
otro dominio, cámbialas ahí (y la línea `<base href="/llndtzn/">` de `404.html` por `/`).

## Publicar

Al ser estático, se publica directo con GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / root*.
Para probar en local, abre `index.html` en el navegador.
