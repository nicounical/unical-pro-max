# Contrato para las secciones (5 versiones A–E por sección)

Proyecto: `C:\Users\Nico\Desktop\repos-test\unical-pro-max`. Web estática, GSAP 3.12.5 + ScrollTrigger + Lenis ya cargados.
Referencia de la versión 2 (diseño actual que el usuario aprobó como "mejor"): `src/ref/v2-index.html`, `src/ref/v2-pro.css`, `src/ref/v2-pro.js`.
Núcleo compartido (NO editar; si necesitas algo del núcleo, dilo en tu informe): `css/core.css`, `js/core.js`, `src/shell.html`, `tools/build.py`.

## Petición del usuario
- "Dame 5 versiones de cada una de las secciones" → cada sección tiene versiones A, B, C, D y E, **claramente distintas** en layout y animación (no solo colores). Nivel agencia premium (10–20 k€): vídeo, movimiento, detalles cuidados.
- "La tipografía me gusta algo un poco más grueso" → titulares Poppins 700–800 (`var(--w-head)`, `var(--w-display)`, clase `.big`), texto Inter 500. **Nada de serif fina.** Para palabras destacadas usa `<span class="acc">…</span>` (cursiva gruesa en azul).
- La versión **A** de cada sección = el diseño de la v2 actual adaptado a la tipografía gruesa. B–E = alternativas nuevas.

## Ficheros que escribe cada sección (solo estos)
- `src/sections/NN-nombre.html` — el fragmento
- `css/sections/nombre.css` — estilos, **todos prefijados** con la sección y versión, p. ej. `.hero-b__title`. Nada de selectores globales (ni `body`, ni `h2` sueltos).
- `js/sections/nombre.js` — animaciones

| NN | nombre | id | data-sec | data-label |
|----|--------|----|----------|-----------|
| 01 | hero | top | hero | Portada |
| 02 | manifesto | manifiesto | manifesto | Manifiesto |
| 03 | reel | showreel | reel | Showreel |
| 04 | services | servicios | services | Servicios |
| 05 | numbers | cifras | numbers | Cifras |
| 06 | work | proyectos | work | Proyectos |
| 07 | process | proceso | process | Proceso |
| 08 | clients | clientes | clients | Clientes |
| 09 | quotes | opiniones | quotes | Opiniones |
| 10 | contact | contacto | contact | Contacto |

## Estructura del fragmento
```html
<section class="opt-sec" id="servicios" data-sec="services" data-label="Servicios">
  <div class="variant services-a" data-v="A" data-name="Paneles apilados" data-theme="dark"> … </div>
  <div class="variant services-b" data-v="B" data-name="Nombre corto" data-theme="light" hidden> … </div>
  … C, D, E (todas con hidden salvo A)
</section>
```
- `data-default="B"` en la `<section>` elige la versión que se ve por defecto (si falta, A). La portada usa B (elegida por el usuario), con el vídeo del Lexus `assets/video/hero-coche.mp4` (de unicales-preview/public/images/landing, en bucle ida y vuelta) y filete blanco en las letras.
- `data-name`: 1–3 palabras en español que describan la versión (se ve en el selector).
- `data-theme="dark"|"light"` en cada versión según su fondo (la cabecera cambia el logo con esto). Cada versión pinta su propio fondo.
- No pongas selector de versiones: lo genera el núcleo (dock inferior).
- El selector flotante ocupa ~70 px abajo: no pongas CTAs críticos pegados al borde inferior en pantallas fijas.

## JS: registro de cada versión
```js
(() => {
  const { register } = UX;
  register("services", "A", (root, ux) => {
    // Todo lo creado aquí (gsap/ScrollTrigger) se revierte solo al cambiar de versión (gsap.context(root)).
    // Si creas listeners en window/document o timers, devuelve una función de limpieza.
    if (ux.reduce) { /* estado final legible, sin pin ni scrub */ return; }
    ...
    return () => { /* quitar listeners, clearInterval… */ };
  });
})();
```
Utilidades: `ux.splitChars(el)`, `ux.splitWords(el)`, `ux.counter(el, stOpts)`, `ux.fmt(n)` (5.000), `ux.onIntro(cb)` (solo la portada: anima la entrada después de la precarga), `ux.lenis`, `ux.fine` (ratón), `ux.openReel()` (abre el showreel). Cualquier elemento con `data-reel` abre el showreel al hacer clic.
Automático: `.rv` (entrada al hacer scroll), `[data-count="5000"]` (contador; usa `data-count-manual` si lo animas tú), `<video data-autoplay muted loop playsinline preload="none">` (play/pause según visibilidad), `[data-magnetic]`, `[data-cursor="Ver"]` (cursor con texto).
Formularios: `<form data-form novalidate>` con `.field` y `[required]` ya se validan y abren el correo; un elemento `[data-ok] hidden` se muestra al enviar.
Clases compartidas útiles: `.big`, `.label`, `.lead`, `.mono`, `.acc`, `.wrap`, `.btn`, `.btn--dark`, `.line`.

## Material disponible
- Vídeos (`assets/video/`): `hero-lexus.mp4` (848×480, 14 s, Lexus con wrapping), `showreel.mp4` (1280×720, 25 s, montaje de proyectos), `evento-cirsa.mp4` (848×478, 9,5 s), `v-lexus-1/2/3.mp4` (360×654 verticales, 8 s). Pósters `.jpg` con el mismo nombre.
- Fotos (`assets/img/proyectos/*.webp`): eversense, mcdonalds, tke, janssen, venca, tibau, disney, five-guys, tibidabo, 3cat, cava-pharma, jpujol, lexus, goofretti. `assets/img/servicios/*.webp`: gran-formato, rotulacion-vehiculos, flotas, car-wrapping, stands, plv-retail, vinilos, publicidad-exterior, hoteles, senaletica. `assets/img/hero/lexus-marvel.webp` (1920), `lexus.webp`, `mcdonalds-car.webp`.
- Logos clientes `assets/img/clientes/*.png` (toyota, coca-cola, bankinter, generali, sony-music, monster-energy, philip-morris, mitsubishi-electric, otis, porcelanosa, rituals, wella, los40, rfef, cruz-roja, avoris, catai, csl-vifor, dial, elanco, fibratel, leo-pharma, longi, straumann, ucb). Partners `assets/img/partners/*.svg` (3m, avery-dennison, hp, orafol, mactac, hexis).
- Logo: siempre imagen (`assets/img/logo/logo-unical-light.png` sobre oscuro, `logo-unical.png` sobre claro), nunca texto.
- Datos reales: +25 años, +5.000 proyectos, 1.000 m² de planta, +500 clientes. Tel. 937 50 23 04, WhatsApp 34663512014, nico@unical.es, Passatge la Carola 2, 08349 Cabrera de Mar. Partners 3M & Avery. Proceso: Presupuesto → Diseño → Producción → Instalación. Opiniones: las 4–5 de la v2 (no inventes otras ni cifras nuevas).

## Calidad
- Accesible: un solo `<h1>` en toda la página (solo en la portada; en sus 5 versiones, que nunca se ven a la vez), `alt` en imágenes de contenido, foco visible, contraste AA, vídeos decorativos con `aria-hidden="true"`.
- Responsive real a 390 px y 1440 px. Sin scroll horizontal de página.
- `prefers-reduced-motion`: sin pin/scrub, contenido final visible.
- Rendimiento: vídeos con `preload="none"` + `data-autoplay` (salvo la portada A, que puede ser `preload="auto"`), imágenes `loading="lazy"` salvo portada.

## Probar
1. `python tools/build.py` (regenera `index.html` con todas las secciones; si otro agente lo ejecuta a la vez, vuelve a ejecutarlo).
2. Servidor ya activo en http://localhost:8765.
3. Capturas: `node tools/shot.mjs <carpeta> 1440 860 <prefijo> "#servicios,#servicios+900" "services=C&nointro=1"` (también 390 844). Escribe las capturas en tu carpeta del scratchpad, no en el repo. La herramienta imprime los errores de consola: deben ser "no errors".
4. No hagas commit ni push.

## Web multipágina (estructura de la web en creación del usuario)
La referencia de estructura y textos es la web que el usuario lleva semanas creando: `C:\Users\Nico\Desktop\webunical\Final` (home `Landing-Home/unical-home-FINAL_v29.html`, hubs en `HUBS/`, subpáginas en `SUB_HUBS/` con carpetas `Fotos/`). **Solo lectura: no modifiques nada en webunical.**
- `src/pages.json` define las páginas (index, rotulacion, impresion, eventos) y el orden de fragmentos. `python tools/build.py` las genera todas.
- Menú: Inicio · Rotulación · Impresión · Eventos · Proyectos · Contacto (+ Presupuesto). Enlaces entre páginas: `rotulacion.html`, `impresion.html`, `eventos.html`, `index.html#proyectos`.
- Hubs: fragmentos `src/sections/hub-*.html` (con varias `<section class="opt-sec">` dentro, cada una con al menos 1 versión) + `hub-common` (estilos/JS compartidos de los hubs; el html puede ser solo un comentario).
- Las fotos nuevas que se saquen de webunical se copian optimizadas (WebP, máx. 1600 px, calidad ~74) a `assets/img/hubs/<hub>/`.
- Cifras de la v29: +25 años, +3.000 proyectos, +40 sectores, instaladores certificados 3M & Avery.
