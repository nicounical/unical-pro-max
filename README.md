# Unical Pro Max — web paralela (prueba)

Versión experimental de la web de [Unical Graphic](https://www.unical.es), hecha para probar las skills **ui-ux-pro-max** y **unical-ui** y el MCP de **21st.dev**. No es la web definitiva y las páginas llevan `noindex`.

Es una web estática (HTML, CSS y JavaScript), sin dependencias ni compilación.

## Opciones por sección
Cada sección de la portada tiene **3 opciones (A, B, C)** que se cambian en directo con el selector de arriba a la derecha de cada sección. La combinación elegida queda en la URL, por ejemplo:

```
?hero=B&servicios=C&proyectos=C
```

El botón **Opciones** (abajo a la izquierda) resume la combinación, copia el enlace y permite ver la página sin los selectores.

| Sección | A | B | C |
|---|---|---|---|
| Portada | Cinemático (foto a sangre, titular que cambia) | Abanico de proyectos | Linterna (el cursor descubre la foto) |
| Clientes | Marquesina doble | Rejilla con brillo | Contador + logos que rotan |
| Servicios | Bento | Lista + imagen que sigue al cursor | Scroll horizontal fijado |
| Por qué Unical | Cifras animadas | Tarjetas apiladas | Acordeón + imagen |
| Proyectos | Masonry con filtros | Carrusel arrastrable | Destacado con lista |
| Proceso | Línea temporal | Paneles | Historias con progreso |
| Opiniones | Cita grande | Muro en movimiento | Valoración + tarjetas |
| Contacto | Banda + formulario | Presupuesto por pasos | Texto gigante + botón magnético |

## Estructura
- `index.html` — la landing
- `css/estilos.css` — estilos (tokens de marca de Unical en `:root`)
- `js/datos.js` — textos, servicios, proyectos y opiniones
- `js/sitio.js` — selector de opciones y animaciones
- `assets/img/` — imágenes optimizadas (WebP) sacadas de la web actual

## Verla en local
```
python -m http.server 8765
```
y abre http://localhost:8765

## Pendiente
- Los formularios abren el correo del visitante (aún no envían directamente).
- Las opiniones son las mismas que aparecen en la web actual.
