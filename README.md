# Unical Pro Max — web paralela (prueba)

Versión experimental de la web de [Unical Graphic](https://www.unical.es). No es la definitiva y las páginas llevan `noindex`.

- **`index.html`** — versión 3: narrativa con vídeo y animación, con **5 versiones (A–E) de cada sección**. Se cambian con el selector flotante de abajo; la combinación queda en la URL (p. ej. `?hero=B&services=D`).
- **`opciones.html`** — versión 1 (3 opciones por sección).

## Cómo está montada
- `src/shell.html` + `src/sections/NN-*.html` → `python tools/build.py` genera `index.html`.
- `css/core.css` y `js/core.js`: base común (tipografía gruesa Poppins 700–800, cabecera, precarga, cursor, scroll suave, selector de versiones). Ver `src/CONTRATO.md`.
- `css/sections/*.css` y `js/sections/*.js`: cada sección con sus 5 versiones.
- `src/ref/`: la versión 2 (referencia).
- `tools/shot.mjs`: capturas con Chrome headless para revisar versiones.

Librerías por CDN: GSAP 3.12.5 + ScrollTrigger y Lenis 1.1.13.

## Cómo se ha hecho
- **ui-ux-pro-max** (`--design-system`, variance 10 · motion 10 · density 2): patrón *Scroll-Triggered Storytelling* (capítulos con indicador de progreso, CTA final), tipografía editorial de acento y presets GSAP de pin, scrub y parallax. Adaptado a los colores de marca de Unical.
- **21st.dev (MCP)**:
  - Componente *Scroll media expansion hero* → sección **Showreel** (el vídeo crece a pantalla completa con el scroll).
  - Componente *Services Stack* → sección **Servicios** (paneles apilados, foto de fondo con grano y un dibujo de línea por servicio sincronizado con sus chips).
  - Proyecto de vídeo «Unical Graphic — Showreel» creado en 21st Video con nuestras fotos y clips. La exportación a MP4 requiere plan de pago, así que el showreel de la web se ha montado con ffmpeg a partir del mismo material.
- **unical-ui**: logo, colores y voz de marca.

## Secciones
1. Precarga con contador y telón
2. Portada con vídeo real (Lexus, car wrapping) y titular letra a letra
3. Manifiesto: las palabras se iluminan con el scroll, con fotos y vídeo dentro del texto
4. Showreel que se expande
5. Servicios en paneles apilados con ilustración animada
6. Cifras en recorrido horizontal con clips verticales
7. Proyectos: índice con vídeo/foto que sigue al cursor + galería con profundidad
8. Proceso: el trazo ondulado del logo se dibuja con el scroll
9. Clientes: marquesina que reacciona a la velocidad del scroll
10. Opiniones, contacto con vídeo de fondo y pie con el logo gigante

Respeta `prefers-reduced-motion`: sin animaciones, todo el contenido queda visible.

## Vídeos (`assets/video/`)
Recortados y comprimidos con ffmpeg (sin audio, H.264, `faststart`). `showreel.mp4` dura 25 s y pesa 2,9 MB.

## Verla en local
```
python -m http.server 8765
```
y abre http://localhost:8765

## Pendiente
- Los formularios abren el correo del visitante (aún no envían directamente).
- Las opiniones son las mismas que aparecen en la web actual.
