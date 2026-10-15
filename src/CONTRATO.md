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

## Ronda «Futurista» (2026-10-09) — manda sobre lo anterior
Petición: «manteniendo ya las que he seleccionado antes que sean fijas, dame 5 nuevas versiones de todo. Inspírate en nuevas webs tecnológicas, quiero que sea futurista todo». Solo landing (index).

**Por sección:** la favorita pasa a ser **A** (fija, idéntica visualmente; renombra sus clases `xxx-b__` → `xxx-a__`, su `register("sec","A")` y `data-v="A"`) y se **borran** las demás versiones antiguas (HTML, CSS y JS). Quita `data-default` de la `<section>` (A es la de por defecto). Luego **B–F = 5 versiones nuevas futuristas**, distintas entre sí en layout e interacción. No repetir ideas ya dadas (mira `git log -p` del fichero si dudas).

| sección | favorita actual → A |
|---|---|
| hero | B «Lexus en letras» (SIN LÍMITES con vídeo hero-coche.mp4; NO tocar su aspecto: letras sin solape, tilde propia `.hero-b__i`, filete 2px) |
| manifesto (id porque, «Por qué Unical») | B |
| reel | E «Cursor vídeo» |
| services | A |
| work (id proyectos) | C «Filtros por sector» |
| process | A |
| numbers | A |
| sectors | A |
| clients | A |
| contact | A (contacto también sale en los hubs: no rompas nada allí) |

**Dirección futurista** (referencias: Apple Vision Pro, Tesla, Linear, Vercel, Nothing, Teenage Engineering, Lusion, Active Theory, Igloo Inc, Spline): HUD/FUI con líneas de 1px y marcadores de esquina, rejillas en perspectiva, escáner/láser, partículas y campos de puntos en `<canvas>` 2D (o WebGL crudo, sin librerías nuevas), cristal esmerilado (`backdrop-filter`), bordes con brillo que siguen al ratón (spotlight), texto que se «decodifica», glitch sutil, holograma/iridiscencia, terminal/CLI, bento con glow, 3D CSS (`perspective`), ruido/grano, scanlines tenues, mono JetBrains para datos.
- **Paleta de marca, futurista:** fondos `--u-night #10101D` / casi negro; acento `--u-blue #99C4E4` como «neón» (glow con `box-shadow`/`text-shadow`), `--u-blue-strong #2E6CA0`; como mucho un toque iridiscente. Nada de verde Matrix ni magenta. Texto ≥ AA.
- Tipografía gruesa igual (Poppins 700–900, `.big`, `.acc`).
- Contenido y datos reales de la v29 (los mismos textos que la favorita de esa sección): +25 años, +3.000 proyectos, +40 sectores, 3M · Avery, tel 937 50 23 04, WhatsApp 34663512014, nico@unical.es.
- Rendimiento: canvas con `requestAnimationFrame` que se **pausa fuera de pantalla** (IntersectionObserver) y se limpia en el cleanup; DPR máx. 2; máximo 1 pin por versión; sin pin en móvil si molesta.
- Cada versión debe verse bien a 1440×860 y 390×844, sin errores de consola, con `prefers-reduced-motion`.

**Pruebas sin saturar la memoria del equipo:** servidor ya activo en http://localhost:8765 (no lo arranques ni lo pares). Lanza `tools/shot.mjs` de uno en uno (nunca en paralelo), pocas capturas por versión. No hagas commit ni push. No toques ficheros de otras secciones ni el núcleo.

## Ronda «Impacto sin tecnología» (2026-10-09) — manda sobre lo anterior
Petición: «Has hecho cosas muy interesantes, pero puede que sea demasiado futurista y tecnológico para mi sector. Me interesa hacer cosas así de impactantes pero no tan tecnológicas, dame otras 5 versiones diferentes».

- **No borres nada.** A (favorita) y B–F (futuristas) se quedan tal cual. Añade **5 versiones nuevas G, H, I, J, K** por sección (`data-v="G"`… con `hidden`, clases `xxx-g__`, `register("sec","G")`).
- **Prohibido en esta ronda:** HUD, terminal/consola, escáner/láser, partículas, radar, holograma, glitch, scanlines, neón/glow, rejillas en perspectiva tipo Tron, texto que se «decodifica», cristal esmerilado como recurso principal, mono como protagonista.
- **Dirección:** impacto de agencia premium pero **humano, físico y editorial**, ligado a un taller de impresión y rotulación: fotografía grande a sangre y vídeo real como protagonistas, tipografía gigante editorial (Poppins 800–900, composición tipo revista/cartel), collage y recortes, papel, tinta, vinilo, lona, cartón pluma, maquetas, montaje en obra, luz natural, sombras suaves, movimiento cinematográfico con scroll (reveals de máscara, parallax de capas, zoom de foto, cortinas, apilados, marquesinas tipográficas, galerías horizontales), cursor con foto, hover con imagen. Referencias: Pentagram, Collins, Locomotive, Studio Dumbar, Aesop, Apple (fotografía de producto), revistas como Kinfolk/Wallpaper, carteles suizos.
- Fondos: puedes usar claros (`--u-paper #F4F6FA`, blanco, crema muy suave) además de navy/night; alterna con criterio. Acento azul de marca.
- **No repitas ideas ya dadas** en rondas anteriores (revisa `git log -p` de tus ficheros: polaroids, vinilos que se despegan, muestrario Pantone, rollo de lona, persianas, split-flap, sellos, cinta transportadora, línea de metro, expediente, plotter, dominó, sobre, tarjeta 3D, orden de trabajo, etc.).
- Mismo contenido/datos reales de la favorita A. Rendimiento, accesibilidad, 1440/390 y reduced-motion como siempre.
- Pruebas: servidor en http://localhost:8765 ya activo (no lo arranques/pares; si se cae, usa uno propio en otro puerto 88xx y ciérralo al acabar). Capturas de una en una. Sin commit.

## Ronda «Selección 3» (2026-10-12) — manda sobre lo anterior
El usuario ha elegido. Por sección: las que **se quedan** pasan a ser las primeras letras (A, y B en la portada), idénticas visualmente (renombra clases `xxx-k__`→`xxx-a__`, `register`, `data-v`); **todas las demás se borran** (HTML, CSS y JS; quedan en git). Después, **5 versiones nuevas** con las letras siguientes. Sin `data-default` (la A es la de por defecto).

| sección | se queda | nuevas (5) — petición literal resumida |
|---|---|---|
| hero | A «Lexus en letras» → A; B «HUD escáner» → B | C–G: «versiones parecidas a la A y la B y otras nuevas» → 2 variaciones de A (vídeo dentro de tipografía), 2 de B (revelado/escaneo del vídeo, pero más elegante), 1 nueva |
| services | F «Circuito» → A | B–F: «otras versiones que **no tengan fotos** y alguna inspirada en la F pero **no futurista**» → todas sin fotos; 1–2 con el concepto de la F (centro Unical que reparte a los servicios: esquema/diagrama/plano de taller, impreso, no neón) |
| reel | J «Subtítulos» → A | B–F: «versiones mejoradas de la J» → vídeo a sangre fijo con frases gigantes, pero mejor: tipografía, ritmo, transiciones, sonido-opción, contador, cierre con CTA… 5 enfoques distintos |
| work | A «Filtros por sector» (favorita antigua, se queda como respaldo) | B–F: «no me ha gustado ninguno» → 5 totalmente nuevas, distintas de todo lo dado antes (revisa git log) |
| process | D «Holograma 3D» → A | B–F: «5 versiones inspiradas en la D que sean **de profesional**» → mismo concepto (un stand/proyecto que se construye por fases con el scroll: presupuesto→diseño→producción→instalación) pero con estética profesional/arquitectónica, no holograma: plano técnico, render, maqueta, montaje real, isometría limpia… |
| numbers | A «Odómetro» | B–F: 5 nuevas (no futuristas, nada repetido) |
| sectors | E «Túnel warp» → A | B–F: «inspiradas en esta y otras nuevas **no tan futuristas, sin fotos**» → 2 con la idea de viaje/túnel de la E más sobria, 3 nuevas tipográficas/gráficas, todas sin fotos |
| manifesto | K «Ventana que se abre» → A **cambiando su foto de fondo** por otra potente del repo (no la lona «Start your impossible») | B–F: inspiradas en la K (titular que se parte y abre una foto/escena a pantalla completa con los 4 pilares), cada una con otra foto |
| clients | A «Muro de estadio» (respaldo) | B–F: «nuevas del todo» → nada parecido a lo dado (revisa git log) |
| contact | sin cambios: NO tocar | — |

Estilo general de esta ronda: impacto de agencia premium, **profesional y sobrio**, ni HUD/neón/partículas/terminal. Tipografía gruesa, colores de marca. Datos v29. Calidad, 1440/390, reduced‑motion, sin errores. Servidor http://localhost:8765 activo (si falla, uno propio en 88xx y ciérralo). Capturas de una en una. Sin commit.

## Ronda «Selección 4 · Master prompt» (2026-10-13) — manda sobre lo anterior
Brief del usuario: nivel agencia internacional (Awwwards / Locomotive / Resn como **nivel de ejecución**, no estética a copiar). Usa la skill **ui-ux-pro-max** (invócala con la herramienta Skill antes de diseñar y aplica sus reglas). **Prohibido**: variantes que solo cambian colores/bordes/posiciones, plantillas SaaS, título centrado + subtítulo + 3 tarjetas, iconos genéricos como recurso principal, tarjetas repetidas, efectos decorativos sin intención, scroll hijacking. Cada variante = dirección creativa defendible y claramente distinta. Mismo lenguaje global: Poppins 700–900 (`.big`, `.acc`), Inter, paleta de marca (`--u-night`, `--u-blue #99C4E4`, `--u-blue-strong #2E6CA0`, `--u-paper`), retícula de 12 columnas, ritmo editorial, alternar claro/oscuro con criterio. Nada futurista (HUD, neón, partículas, terminal) salvo en las versiones conservadas.

| sección | se queda | nuevas |
|---|---|---|
| hero | A y B **sin tocar** (la favorita es la **B «HUD escáner»** → `data-default="B"`) | ninguna; mejora del vídeo `hero-coche` (lo hace el coordinador) |
| services | A «Circuito» | B–F (5): reinterpretaciones del concepto de A con experiencia muy distinta: índice editorial interactivo · retícula arquitectónica · tipografía cinética · narrativa horizontal (con navegación accesible, sin bloquear) · split premium. Sin repetir tarjetas |
| reel | — (se borran todas) | A–E (5) **totalmente nuevas**: el vídeo **nunca bloquea el scroll**, pin solo si se abandona con scroll normal (≤150vh), sonido apagado al inicio, pausa/play y silencio accesibles, sin interferir en móvil. Direcciones: ventana editorial que crece · tira de fotogramas · film minimal con UI casi invisible · lienzo flotante que cambia de escala/posición mientras se navega · Director's cut con capítulos y navegación libre |
| work | — (se borran todas) | A–E (5) sistemas de portfolio, **mínimo 8 proyectos reales visibles** por variante (fotos de `assets/img/proyectos` y `assets/img/hubs/**`; no inventar trabajos): retícula editorial asimétrica · modular premium · portfolio de arquitectura ultra limpio · muro interactivo con foco/zoom · índice curado por categorías. Etiquetas discretas, hover premium |
| process | — («Holograma 3D» se **mueve** a `src/sections/stands-process.html` + `css|js/sections/stands-process.*` con `data-sec="stands-process"`, sin incluirlo en ninguna página: queda reservado para la futura página de stands) | A–E (5) nuevas, **sin timeline, sin círculos numerados, sin 5 tarjetas iguales**: Idea → Asesoramiento → Diseño → Producción → Instalación → Resultado. Direcciones: de la idea a la realidad · el viaje de producción · del plano a la realidad · behind the craft · un proceso continuo (el propio layout se transforma) |
| numbers («Por qué elegirnos») | A «Odómetro» | B–E (4): manifiesto editorial tipográfico · argumentos en composición modular (no tarjetas) · contrastes tipográficos y mensajes contundentes · capacidades en lenguaje gráfico técnico (impreso, no HUD). Razones **comerciales/operativas**. Sin cifras nuevas |
| sectors | A «Túnel warp» **+ arreglar el solape de «Pharma» con el texto final** de raíz (stacking, alturas, ScrollTrigger end, pin spacing, resize), en 1440/1024/768/390 | B–E (4) **sin fotografías**: universo tipográfico · matriz interactiva · índice cinético · sistema geométrico (un símbolo vectorial por sector) |
| manifesto («Por qué Unical») | A «Ventana que se abre» | B–E (4): **identidad, filosofía, visión** (no razones comerciales, no métricas, no iconos): manifiesto de marca · narrativa editorial · composición tipográfica de gran impacto · transformación de ideas en espacios físicos |
| clients | — (se borran todas) | A–E (5) **minimalistas, compactas, sin protagonismo**: línea de logos monocromos · retícula compacta · ticker muy sutil · banda editorial · bloque de confianza integrado en la transición a la siguiente sección. Sin titulares gigantes, sin fondos llamativos, alto ≤ ~45vh en escritorio |
| contact | A «Botón gigante» y B «Consola HUD» **sin tocar** | C–E (3) (se borran C–K): statement editorial con CTA muy visible · lienzo de contacto interactivo con vías de contacto · split premium mensaje + formulario funcional (`data-form`, validación, estados error/éxito). Contacto también sale en los hubs |

Reglas de ejecución: borra lo que no se queda (HTML, CSS y JS; queda en git); renombra lo conservado solo si cambia de letra. Contenido y datos reales (v29). Probar a 1440×860, 1024×768 y 390×844 (y 320 si hay riesgo), sin scroll horizontal, sin errores de consola, `prefers-reduced-motion` con estado final legible. Máx. 1 pin por versión. Capturas con `tools/shot.mjs`, pocas y **nunca en paralelo**, en tu carpeta del scratchpad. No toques el núcleo ni ficheros de otras secciones. Sin commit.

## Ronda 5 «Coherencia» (2026-10-13 tarde) — manda sobre lo anterior
Petición literal del usuario (resumen): portada con el vídeo nuevo; reel con el vídeo nuevo, deja la A y dame alternativas **sencillas**; proyectos **opciones sencillas, cuadrículas**; cómo trabajamos **más sencillo, que no ocupe mucho**; cifras **sin vídeos de fondo ni movimientos, que ocupe poco**; sectores deja la A y dame alternativas mejoradas; por qué Unical me gusta la A, dame mejoras; contacto alternativas **con el CTA ya puesto** y mejores. **«Quiero que todos los cambios tengan sentido y vayan de la mano: que no queden diseños de una forma en una sección y de otra en otra.»**

### Vídeos nuevos (ya instalados por el coordinador)
- Portada: `assets/video/hero-coche.mp4|.webm` (1080p, de un máster 4K), `hero-coche-1440.webm`, `hero-coche-m.mp4|.webm` (1:1 para móvil), pósters `.webp/.jpg`.
- Reel: `assets/video/showreel.mp4` (1080p, 40 s, **sin audio**: no pongas botón de sonido), `showreel-720.mp4` (móvil), póster `showreel.webp/.jpg`. Es una pieza de marca con sus propios rótulos y cierre («Solicita tu presupuesto»): el diseño alrededor debe ser sobrio, no competir con el vídeo.

### SISTEMA «sx» — obligatorio en TODA versión nueva (clases en `css/core.css`, al final)
- Contenedor: `<div class="variant xxx-b sx sx--paper" …><div class="sx-in"> … </div></div>` (`sx--s` = sección compacta). Fondos permitidos: `sx--night`, `sx--navy`, `sx--paper`, `sx--white`, `sx--blue` (azul de marca profundo). Nada de degradados, texturas, grano, fotos o vídeos de fondo salvo donde la versión conservada ya los tenga.
- **Cabecera única** en todas las secciones (misma estructura, mismo tamaño):
  ```html
  <header class="sx-head">
    <p class="sx-kicker"><b>04</b> Proyectos</p>
    <h2 class="sx-title">Titular de la sección con <span class="acc">acento</span>.</h2>
    <p class="sx-lead">Entradilla de una o dos frases.</p>
  </header>
  ```
  Numeración fija: 01 Portada · 02 Servicios · 03 Showreel · 04 Proyectos · 05 Cómo trabajamos · 06 Por qué elegirnos (cifras) · 07 Sectores · 08 Por qué Unical · 09 Clientes · 10 Contacto. `sx-head--solo` si no hay entradilla. Puedes omitir la cabecera solo si el concepto lo exige (p. ej. contacto statement), pero entonces respeta `--sx-title`/kicker.
- Retícula: `sx-grid` (12 col; 6 en ≤900px), separación `--sx-gap`. Fotos/vídeos dentro de `.sx-media` (radio único `--sx-r` 10px, zoom 1.04 al hover). Títulos de pieza `.sx-h3`, metadatos `.sx-meta`, enlaces `.sx-link`, botones `.btn` / `.btn--dark` (los del núcleo). Filetes `.sx-rule` o bordes de 1px con `currentColor` al 16 %.
- Tipografía: solo Poppins 700/800 para titulares (ya en `.sx-title`/`.sx-h3`) e Inter 500 para texto; mono solo en `sx-kicker`/`sx-meta`. Nada de contornos (`-webkit-text-stroke`), ni tipografía gigante a sangre, salvo en versiones conservadas.
- **Movimiento** (vocabulario único): entrada con `.rv` (la del núcleo) y, como mucho, un realce de hover. **Sin pin, sin scrub, sin parallax, sin marquesinas ni autoplay de carruseles** en las versiones nuevas (excepciones: el propio vídeo). En «cifras» **ningún** movimiento (ni contadores).
- Ritmo de fondos de la landing por defecto (A de cada sección): portada night → servicios night → reel paper → proyectos night/white → proceso paper → cifras blue o white → sectores night → por qué Unical paper → clientes white → contacto night. Cada versión nueva usa el fondo indicado para su sección en la tabla de abajo, para que cualquier combinación quede bien.
- Alturas: secciones compactas ≤ ~70vh en escritorio (proceso, cifras, clientes); ninguna versión nueva > ~140vh salvo proyectos.

| sección | se queda | nuevas | fondo de las nuevas |
|---|---|---|---|
| hero | A «Lexus en letras», B «HUD escáner» (vídeo nuevo) | C = B **sin la línea azul que barre ni el marcador/retícula**; D = portada directa con el vídeo detrás (titular, entradilla, CTAs). Se borran C–G antiguas. *Lo hace el coordinador.* | night |
| reel | A «Ventana editorial» (con el vídeo nuevo, sin botón de sonido) | B–E (4) **sencillas**: el vídeo es el protagonista, marco limpio, play/pausa accesible | B–C paper, D–E night |
| work | — (se borran) | A–E (5) **cuadrículas sencillas** de agencia (mín. 8 proyectos reales): 3 col uniforme con pie debajo · 4 col compacta · 2 grandes + 6 pequeñas · cuadrícula con filtros simples (botones) · lista + cuadrícula (conmutador). Sin efectos más allá del zoom de `.sx-media` | night o white |
| process | — (se borran; la de stands ya está aparte) | A–D (4) **compactas** (≤ 70vh escritorio), las 6 fases Idea · Asesoramiento · Diseño · Producción · Instalación · Resultado: fila de 6 columnas con filetes · dos columnas texto + lista numerada · tira con una foto real por fase (pequeña) · tabla/acordeón accesible | paper |
| numbers («Por qué elegirnos») | — (se borran) | A–D (4) **sin vídeo, sin movimiento, compactas** (≤ 60vh): banda de 4 cifras con filetes · titular + cifras en columna · cifras + 3M/Avery · frase con datos en línea. Datos v29 | A–B blue, C–D white |
| sectors | A «Túnel warp» | B–E (4) mejoradas, más sobrias y del sistema: lista de 8 sectores en 2–4 columnas con descripción · índice con fila activa (hover/foco) y foto pequeña · retícula de 8 celdas tipográficas · sectores × servicios simplificado. Sin fotos a sangre | night |
| manifesto («Por qué Unical») | A «Ventana que se abre» | B–E (4) **mejoras de la A** (mismo concepto: titular que se abre y deja ver una foto real con los 4 pilares), más sobrias y del sistema; aquí sí se permite un solo efecto de scroll suave por versión | paper |
| contact | A «Botón gigante», B «Consola HUD» | C–F (4) con **el CTA visible desde el primer momento** (sin tener que hacer nada para que aparezca): CTA grande + vías de contacto · split titular / formulario corto ya abierto · tarjeta de contacto + mapa estático · franja de CTA + formulario completo. Datos reales | night |

Pruebas: `python tools/build.py`; `node tools/shot.mjs …` (pocas capturas, de una en una); 1440×860, 1024×768, 390×844; sin errores de consola, sin scroll horizontal, reduced-motion. Mira tus capturas **junto a las de las secciones vecinas** (cabecera, márgenes, tamaños de título deben coincidir). Sin commit.

## Ronda 6 «Impacto + dinamismo» (2026-10-14) — manda sobre lo anterior en estas 3 secciones
Petición literal: «para sectores quiero que añadas 5 opciones más que sean impactantes, usando las skills de ui-ux pro max y los nuevos mcps. En por qué elegirnos, dame algo dinámico que sea dinámico automáticamente, que no tenga que hacer scroll, 5 extras. Y para cómo trabajamos dame 7 ideas nuevas, usando skills nuevas de 21st.dev + ui ux skills para darme algo profesional».

- **No se borra nada.** Se añaden versiones nuevas con `hidden`:
  - sectors (A–E existen) → **F, G, H, I, J** (`sec-f__`…), **impactantes**, fondo night.
  - numbers (A–D existen) → **E, F, G, H, I** (`num-e__`…), **animación automática que arranca sola al entrar en pantalla** (IntersectionObserver), en bucle o con secuencia continua, **sin scrub ni pin ni depender del scroll**. Esto anula el «sin movimiento» de la ronda 5 para estas versiones. Datos v29 (+25 años, +3.000 proyectos, +40 sectores, 1.000 m², 3M · Avery). Compactas (≤ ~70vh). Fondos blue/white/night.
  - process (A–D existen) → **E, F, G, H, I, J, K** (7, `process-e__`…), **profesionales**, fondo paper (o white), compactas-medias (≤ ~100vh). Las 6 fases Idea · Asesoramiento · Diseño · Producción · Instalación · Resultado con los textos de la A.
- Herramientas: invocar la skill **ui-ux-pro-max** y usar el MCP **21st.dev** (`mcp__21st__search`, `mcp__21st__get_inspiration`, `mcp__21st__get_component`) como inspiración de patrones; el resultado se escribe en HTML/CSS/JS vanilla + GSAP (sin React ni librerías nuevas).
- Mantener el sistema «sx» (cabecera `sx-head` con kicker 05/06/07, `sx-title`, colores de marca, Poppins 700–900, Inter). Nada futurista (HUD, neón, partículas, terminal, glitch). Humano, editorial, de taller.
- Animaciones: pausar fuera de pantalla, limpiar en el cleanup, `prefers-reduced-motion` → estado final legible.
- Pruebas: servidor http://localhost:8765 (no pararlo). Capturas con `tools/shot.mjs` **de una en una y en serie con los otros agentes** (lock `mkdir` en el scratchpad), pocas. 1440×860 y 390×844, sin errores, sin scroll horizontal. Sin commit.

## Ronda 6b «Servicios en una pantalla» (2026-10-14)
Petición literal: «de servicios, dame nuevas variantes dinámicas pero que se vean en una sola página todas, diseño atractivo de los diferentes servicios».
- No se borra nada (A «Circuito» y B–F se quedan). Se añaden **G, H, I, J, K** (`services-g__`…, `hidden`).
- **Todos los servicios visibles a la vez en una sola pantalla** (escritorio 1440×860: la variante entera cabe en ~100vh, sin scroll interno, sin pin, sin recorrido horizontal ni pasos ocultos). En móvil puede apilarse, pero compacto.
- **Dinámicas**: animación automática al entrar en pantalla y/o micro-interacciones al pasar el ratón (foto/vídeo que se revela, celdas que se expanden, bucles suaves). Pausar fuera de pantalla, reduced-motion → estático legible.
- Diseño atractivo: se permiten fotos reales (`assets/img/servicios/*.webp`, proyectos, hubs) y vídeo. Sistema sx (kicker «02 Servicios», `sx-title`), marca, Poppins 700–900. Nada futurista.
- Mismos servicios y textos que la A; enlaces a los hubs (rotulacion.html, impresion.html, eventos.html) como en la A.

## Ronda 6c «Rehacer sin genéricos» (2026-10-14) — manda sobre 6
El usuario: las versiones de la ronda 6 (sectors F–J, numbers E–I, process E–K) «me parecen muy genéricas… usa estos conectores para no hacer diseños estándar, hazlos de nuevo».
- **Se borran** esas versiones (HTML, CSS, JS; quedan en el historial de trabajo) y se rehacen con **las mismas letras** (sectors F–J, numbers E–I, process E–K). A–E / A–D anteriores no se tocan.
- **Prohibido (genérico/SaaS):** pestañas con autoplay, bento, steppers/raíles de progreso, coverflow, acordeón de tiras, tarjetas con barras tipo stories, marquesinas de píldoras, diagramas de nodos, tablas comparativas, carruseles con flechas, contadores sueltos en tarjetas, «feature steps».
- **Obligatorio en el proceso de diseño:**
  1. Skill local: `python "C:/Users/Nico/Downloads/ui-ux-pro-max-skill-main/ui-ux-pro-max-skill-main/.claude/skills/ui-ux-pro-max/scripts/search.py" "<consulta>" --design-system` / `--domain style|gsap|landing|typography`, y leer `references/pro-rules.md`.
  2. 21st.dev MCP: `mcp__21st__search` / `get_inspiration` para encontrar componentes con carácter de agencia (image trail, pixel image reveal, text mask, distortion, kinetic type, sticky stacking, 3D, etc.); **mirar sus previews** y **recuperar el código de 1–3 con `mcp__21st__get_component`** para portarlo a vanilla + GSAP con la estética de Unical.
  3. Cada versión = **una idea visual memorable ligada al oficio** (impresión, vinilo, lona, plotter de corte, color CMYK, montaje, vehículos), nivel Awwwards, no una plantilla. Tipografía Poppins 800–900 grande con criterio, fotos/vídeo reales.
- Se mantienen: cabecera sx (kicker 05/06/07), marca, nada de HUD/neón/terminal; numbers = animación automática al entrar, sin depender del scroll; rendimiento, a11y, reduced-motion, 1440/390.

## Ronda 7 «Siete nuevas, línea de las favoritas» (2026-10-14) — manda sobre 6/6b/6c
Usuario: «no me gusta ninguna de las ideas, dame otras nuevas, incluso en vez de 5 haz 7 nuevas cambiando por las que me has hecho que no me gustan nada, y dame nuevas también en la parte de contacto».

Rechazado (no repetir NADA parecido): plantillas SaaS (pestañas, bento, steppers, carruseles, marquesinas, comparativas, diagramas de nodos) **y** metáforas literales de taller (cabezal de impresión, CMYK/registro, plotter, vinilo que se despega, lonas colgadas, trama/cuentahílos, rollo, flexómetro, cuaderno, hoja de contactos, pliego, plano de planta/taller, calle dibujada, rastro de fotos, linterna, caos→orden, prueba/realidad). Resultaron kitsch.

**Dirección = la de sus favoritas**, que son inmersivas y cinematográficas: portada «HUD escáner» (vídeo del Lexus revelado), servicios A «Circuito», sectores A «Túnel warp» (profundidad 3D con scroll), por qué Unical A «Ventana que se abre» (titular que se parte y abre una foto a pantalla completa), contacto A «Botón gigante». Rasgos: **profundidad/3D, escala, vídeo y foto reales a gran tamaño, tipografía Poppins 800–900 enorme, transiciones de máscara, una sola idea fuerte por versión, ejecución impecable** (Awwwards: Locomotive, Active Theory, Lusion, Apple). Elegante, oscuro/premium o claro editorial; azul de marca como acento. Se permite: scroll scrub y 1 pin (≤150vh), canvas/WebGL ligero sin librerías nuevas, 3D CSS, vídeo. Sin neón chillón, sin terminal.

Reparto de técnicas (para que no se repitan entre secciones):
- **services** (borrar G–K; nuevas **G–M**): todos los servicios en una pantalla de escritorio; dinámico. Técnicas: vídeo/foto que se abre desde el nombre, profundidad 3D de planos, expansión a pantalla completa, perspectiva de órbita, revelado por máscara tipográfica, galería en Z, cubo/prisma 3D.
- **sectors** (borrar F–J; nuevas **F–L**): impactantes, primas del túnel: viaje en Z con fotos, zoom infinito entre sectores, esfera/cilindro 3D de sectores, cortinas de máscara, letras gigantes que atraviesas, split-screen cinematográfico, scroll horizontal pinned con parallax de profundidad.
- **numbers** (borrar E–I; nuevas **E–K**): automáticas al entrar, SIN depender del scroll; compactas (≤ ~80vh). Técnicas: cifras gigantes con vídeo dentro, cifra que crece en 3D, transiciones de máscara entre datos en bucle, conteo con desenfoque de movimiento, cifras sobre foto que hace ken-burns, cifras que «vuelan» en profundidad, split-flap NO (ya dado).
- **process** (borrar E–K; nuevas **E–K**): profesional. Técnicas: capítulos con vídeo/foto a sangre y scrub, pila de planos en Z que avanzan, cámara que viaja por una escena, revelado de foto por fases con máscaras, sticky split cinematográfico, 3D card deck con profundidad real, número de fase gigante como ventana a la foto.
- **contact** (A–F se quedan; nuevas **G–M**): CTA visible desde el inicio, datos reales (937 50 23 04, WhatsApp 34663512014, nico@unical.es, Passatge la Carola 2, 08349 Cabrera de Mar). Técnicas: titular gigante con vídeo dentro y CTA, botón magnético enorme sobre vídeo, ventana que se abre al formulario, cierre cinematográfico a pantalla completa, foto del equipo/taller a sangre con CTA, tipografía que llena la pantalla con «Hablemos», formulario elegante con fondo de vídeo. Formularios con `data-form`. Contacto sale también en hubs: no romper.

Proceso: skill local (`search.py --design-system`, `--domain gsap|style|landing`, `references/pro-rules.md`) y 21st.dev (`search`/`get_inspiration`, mirar previews, `get_component` de 1–3 piezas de calidad para portar a vanilla + GSAP). Sistema sx: cabecera con kicker numerado (02/07/06/05/10) salvo cuando el concepto inmersivo lo impida (entonces respeta `--sx-title`/kicker). 1440×860 y 390×844 sin scroll horizontal ni errores, reduced-motion, limpieza, rendimiento (pausa fuera de pantalla).

## Ronda 8 «Selección 5» (2026-10-14 tarde) — manda sobre todo lo anterior
Copia de seguridad del estado previo (sin commit): `C:\Users\Nico\Desktop\repos-test\unical-pro-max-copia-2026-10-14-ronda7` (src, css, js, index.html). Solo lectura.
Regla de siempre: lo que **se queda** pasa a las primeras letras (A, B, C…) y se renombra (clases `xxx-m__`→`xxx-e__`, `register`, `data-v`), **idéntico visualmente**; lo demás se borra (HTML, CSS, JS). Sin `data-default` salvo que se indique. Lo nuevo va detrás. Sistema sx, marca, 1440×860 / 390×844 sin scroll horizontal ni errores, reduced-motion, limpieza, capturas en serie con el lock. Nada de patrones SaaS genéricos ni metáforas kitsch de taller (rondas 6/6c rechazadas).

| sección | se queda (→ nueva letra) | nuevas |
|---|---|---|
| hero | C «HUD sin láser» → **A** (única) | — |
| services | A→A, B→B, E→C, F→D, M «Mosaico de vídeo»→**E** con **otro fondo** (la idea gusta, el fondo no: cambia el vídeo/fondo detrás de las 6 ventanas por otro tratamiento de la marca) | **F, G**: 2 variaciones basadas en la M (mismo concepto: un fondo continuo detrás de 6 ventanas/servicios que giran en 3D para mostrar su foto y texto), con otros fondos/ritmos/composiciones |
| reel | A «Ventana editorial» (única) | — |
| work | B «Cuatro columnas» → **A** | **B–F** (5): cuadrículas **sin filtros**, de diseños distintos entre sí y distintos de A (p. ej. masonry, cuadrícula con una pieza grande que rota, retícula asimétrica 7/5, columnas con desfase vertical, cuadrícula de recortes cuadrados con pie al hover…). Mín. 8 proyectos reales |
| process | A «Seis columnas» → **A** | **B–F** (5): **versiones de la A** (misma estructura de 6 fases en columnas/filetes y textos) pero **dinámicas con movimiento automático de fases**: la fase activa avanza sola (resaltado, línea de progreso, número, texto que se despliega…), en bucle, pausa fuera de pantalla y al hover/foco, botón de pausa |
| numbers | — (se borran todas) | **A–E** (5): **sin fotos ni vídeo**; tipográficas/gráficas, dinámicas automáticas al entrar (sin scroll), compactas; datos v29 |
| sectors | B «Cuatro columnas» → **A** | **B–F** (5): **sencillas**, del sistema sx (listas, retículas, tipografía), con algo de movimiento suave como mucho |
| manifesto | sin cambios de versiones | En la A «Ventana que se abre» (y en B–E si usan foto de fondo) poner de foto de fondo `assets/img/hubs/eucerin-stand.webp` (stand Eucerin, 1672×941). Alt: «Stand de Eucerin con iluminación y expositores de producto» |
| clients | E «Puente a contacto» → **A** (única) | La lista de logos **más larga** (todos los de `assets/img/clientes`, y si hay más logos de clientes en `C:\Users\Nico\Desktop\webunical\Final` —solo lectura— cópialos optimizados) en **una sola línea infinita que se repite en bucle** (marquesina continua sin saltos, pausa al hover y con reduced-motion) |
| contact | H «Botón sobre vídeo» → **A** (única) | El CTA debe verse **ya directamente** al llegar (sin animación de entrada que lo oculte ni retraso). El vídeo de fondo se cambiará más adelante: deja el actual con la ruta en un único sitio fácil de cambiar (comentario `<!-- VIDEO FONDO CONTACTO -->`). Contacto también va en los hubs |

## Ronda 9 «Proyectos» (2026-10-15)
Petición: «dame 5 opciones nuevas para proyectos. Que sean diferentes, alguna más minimalista».
- No se borra nada: work A–F se quedan. Nuevas **G, H, I, J, K** (`work-g__`…, hidden).
- Distintas entre sí y de A–F (Cuatro columnas, Mosaico editorial, Columnas desfasadas, Muro, Pieza destacada, Recortes) y de rondas anteriores (git log -p). Al menos **2 minimalistas** (mucho blanco, tipografía y foto justas, cero adornos). Ninguna con filtros. Mín. 8 proyectos reales.
- Nada de patrones SaaS genéricos ni metáforas kitsch. Sistema sx (kicker «04 Proyectos»), fondos night/white/paper.

## Ronda 9b «Proyectos: cuadrículas de fotos» (2026-10-15) — manda sobre 9
Usuario: «no me gusta ninguna… repítelas todas, dame vistas de cuadrículas, algunas de solo las fotos sin mucho margen y que solo salga el texto al pasar el ratón por encima; otras que sea una cuadrícula perfecta sin ningún [hueco], como lo que hay en unicales-preview».
- Borrar G–K de la ronda 9 y rehacer **G–K** (5). A–F intactas.
- **Todas son cuadrículas de solo fotos**; el texto (cliente/trabajo) **solo aparece al pasar el ratón o con el foco** (en táctil: visible discreto abajo, o al tocar).
- Referencia de unicales-preview (`C:\Users\Nico\unicales-preview\src\pages\static\landing\styles.css`, clases `.p4`, `.p4-c`, `.p4-b`): rejilla de 4 columnas a todo el ancho, `gap:3px`, celdas 4:3, foto `object-fit:cover` con zoom suave al hover, degradado oscuro desde abajo y título Poppins 800 + «Ver proyecto →» al hover; 2 columnas en móvil.
- Reparto: 2–3 versiones **«cuadrícula perfecta» sin huecos** (gap 0 o 1–3px, todas las celdas iguales, a sangre o casi) y 2–3 versiones de **fotos con muy poco margen** (gap pequeño, contenidas en el ancho de la sección). Varía columnas (3/4/5/6), proporción (1:1, 4:3, 3:2, 16:9) y tipo de revelado del texto (degradado, velo de color de marca, texto centrado, pie que sube). Nada más: sin filtros, sin cabeceras raras, sin efectos extra.
- Cabecera sx «04 Proyectos» encima y enlace «Ver todos los proyectos». Mín. 8 fotos (múltiplos de la columna para que la rejilla quede completa: 8, 9, 10, 12…). Proyectos reales del repo.

## Ronda 10 «Stands: holograma mejorado» (2026-10-15)
Petición: «quiero que me hagas versiones mejoradas de esto [Holograma 3D de `stands.html`], para las 4 fases».
- `stands-process`: A «Holograma 3D» se queda **intacta**. Nuevas **B–F** (5) = versiones **mejoradas** del mismo concepto: un stand que se construye en 3D con el scroll a través de las **4 fases** Presupuesto (puntos/plano) → Diseño (malla/render) → Producción (sólido, gráfica impresa aplicada) → Instalación (montado, iluminado, terminado).
- Aquí **sí** se permite la estética futurista/técnica (le gustó así), pero con más calidad: geometría de stand real (suelo técnico, pared trasera con gráfica, mostrador, tótem/lightbox, logo UNICAL, focos), cámara que gira/acerca, materiales que pasan de alámbrico a sólido con gráfica, luz y sombras, transición clara entre fases, indicador de fase/porcentaje, textos de cada fase sincronizados. Variar enfoque entre versiones (p. ej. plano técnico 2D→3D, explosión de piezas que se ensamblan, cámara orbital, sección/corte arquitectónico, foto real que sustituye al render al final).
- Canvas 2D/WebGL crudo (sin librerías nuevas). 1 pin por versión (≤ ~300vh), pausa fuera de pantalla, DPR ≤ 2, reduced-motion → stand terminado + 4 fases en lista. 1440×860 y 390×844.

## Ronda 11 · Por qué Unical (2026-10-15)
- A «Ventana que se abre»: fuera el «cuadradito» inicial. El titular se lee entero; al hacer scroll se abre entre sus dos líneas una franja panorámica con la foto (las líneas van pegadas a sus bordes) que crece a pantalla completa. Scrub 1.2, eases suaves.
- Nuevas de la misma familia (pin a pantalla completa, mismo cierre con los 4 pilares): F «Zoom al titular» (foto dentro de las letras y zoom a través de «imposible»), G «Persiana» (7 lamas desde el centro), H «Desde la palabra» (la ventana nace sobre «imposible»).
