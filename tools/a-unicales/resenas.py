# -*- coding: utf-8 -*-
"""Reseñas de Google de las páginas de Impresión, Rotulación y Eventos.

   SOLO reseñas reales, copiadas tal cual de la ficha de Google de Unical Graphic (nombre como aparece en Google,
   estrellas y texto en su idioma original). Las 100 tarjetas de maqueta que había se han quitado: publicar
   reseñas inventadas es publicidad engañosa.

   Mientras REVIEWS esté vacío, cada página muestra un acceso directo a las reseñas de la ficha de Google.
   Para añadirlas: rellenar REVIEWS y volver a lanzar paginas.py."""
import re, html as H

MAPS = "https://www.google.com/maps/search/?api=1&query=Unical+Graphic+Passatge+la+Carola+2+Cabrera+de+Mar"

# Ejemplo de formato: {"name": "Nombre Apellido", "stars": 5, "text": "Texto literal de la reseña", "when": "hace 2 meses"}
REVIEWS = []

UI = {
    "es": dict(empty="Más de 3.000 proyectos entregados desde 1994. Lo que opinan nuestros clientes está en nuestra ficha de Google, sin filtros.",
               btn="Leer las reseñas en Google", src="Reseña de Google"),
    "ca": dict(empty="Més de 3.000 projectes lliurats des del 1994. El que en pensen els nostres clients és a la nostra fitxa de Google, sense filtres.",
               btn="Llegir les ressenyes a Google", src="Ressenya de Google"),
    "en": dict(empty="Over 3,000 projects delivered since 1994. What our clients think is on our Google profile, unfiltered.",
               btn="Read the reviews on Google", src="Google review"),
}
STAR = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>'

def _initials(n):
    p = [w for w in re.split(r"\s+", n.strip()) if w]
    return (p[0][0] + (p[-1][0] if len(p) > 1 else "")).upper() if p else "·"

def body(lang):
    u = UI[lang]; e = lambda x: H.escape(x, quote=True)
    if not REVIEWS:
        return (f'\n    <div class="rv-empty"><p>{e(u["empty"])}</p>'
                f'<a class="btn" href="{MAPS}" target="_blank" rel="noopener">{e(u["btn"])} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>\n  ')
    cards = "".join(
        f'\n        <div class="rv-card{" active" if k == 0 else ""}" data-idx="{k}" data-full="{e(r["text"])}">'
        f'<div class="rv-card-top"><div class="rv-card-avatar" style="background:#2E6CA0">{e(_initials(r["name"]))}</div>'
        f'<div class="rv-card-info"><div class="rv-card-name">{e(r["name"])}</div><div class="rv-card-source">{e(u["src"])}{" · " + e(r["when"]) if r.get("when") else ""}</div></div></div>'
        f'<div class="rv-card-stars" aria-label="{r["stars"]}/5">{STAR * int(r["stars"])}</div>'
        f'<p class="rv-card-text">"{e(r["text"][:140] + ("…" if len(r["text"]) > 140 else ""))}"</p></div>'
        for k, r in enumerate(REVIEWS))
    return f'\n    <div class="rv-cards-wrap"><div class="rv-cards" id="rvCards">{cards}</div></div>\n  '

def apply(s, lang):
    """Sustituye lo que hay debajo de la cabecera de la sección de reseñas (.rv-header) por las reseñas reales."""
    m = re.search(r'<section class="rv-section[^"]*"[^>]*>', s)
    if not m: return s
    end = s.index("</section>", m.end())
    sec = s[m.end():end]
    h = sec.find('<div class="rv-header">')
    if h < 0: return s
    # final de .rv-header (contando divs)
    d, i = 0, h
    for t in re.finditer(r"<(/?)div\b[^>]*>", sec[h:]):
        d += -1 if t.group(1) else 1
        if d == 0: i = h + t.end(); break
    wrap_close = sec.rfind("</div>")          # cierra .u-wrap
    new = sec[:i] + body(lang) + sec[wrap_close:]
    # el botón de la cabecera ya no promete «★★★★★»: solo lleva a la ficha
    new = new.replace("★★★★★ &nbsp;", "")
    if not REVIEWS:   # sin reseñas reales el botón grande ya lleva a la ficha: fuera el de la cabecera, que repetía lo mismo
        new = re.sub(r'\s*<a [^>]*class="rv-google-btn"[^>]*>.*?</a>', "", new, flags=re.S)
    return s[:m.end()] + new + s[end:]
