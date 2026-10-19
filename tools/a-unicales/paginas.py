# -*- coding: utf-8 -*-
"""Unifica las páginas de Impresión, Rotulación y Eventos (áreas y servicios) con el diseño de la landing.
   - Pie: el de la landing (y su botón flotante de WhatsApp).
   - Formulario final: el de la landing (mismos campos y mismo envío que Contacto), con el titular propio de cada página.
   - Fichas de proyecto: las de la landing (foto a sangre, «NN · tipo», cliente, «Ver proyecto →»).
   - Estilos: src/pages/static/shared/sistema.css = reglas de la landing (pie, formulario, fichas) + sistema.css.
   Se puede volver a lanzar: reconoce lo que ya está convertido. Lanzar después de gen.py (usa la landing generada)."""
import re, sys, pathlib, html as H
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from gen import form_html, pick_rules, rd, UP
import proceso, fichas

ST = UP / "src/pages/static"
HERE = pathlib.Path(__file__).parent
PAGES = sorted(p.parent for p in ST.glob("*/*/content.es.html") if p.parts[-3] != "landing")
LANGS = ("es", "ca", "en")
BG = "/images/landing/v2/video/hero-coche.webp"

def strip(s): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()

def landing_foot(lang):
    s = rd(ST / "landing" / f"content.{lang}.html")
    return s[s.index("<!-- ========== FOOTER"):].rstrip() + "\n"

def cta_section(old, lang):
    """Formulario de la landing con el titular y la entradilla que ya tenía la página."""
    eb = re.search(r'class="(?:[^"]*eyebrow[^"]*|sx-kicker)"[^>]*>(.*?)</', old, re.S)
    h2 = re.search(r"<h2[^>]*>(.*?)</h2>", old, re.S)
    after = old[h2.end():] if h2 else old
    lead = next((strip(m.group(1)) for m in re.finditer(r'<p(?![^>]*(?:eyebrow|kicker))[^>]*>(.*?)</p>', after, re.S) if len(strip(m.group(1))) > 40), "")
    title = re.sub(r"\s+", " ", h2.group(1)).strip() if h2 else ""
    form = form_html(lang).replace('<form class="contact-a__form" id="ctaForm"', '<form class="contact-a__form" id="ctaForm" data-site-form', 1)
    assert "data-site-form" in form
    return (f'<!-- ux-cta: formulario de presupuesto, el mismo de la landing -->\n'
            f'<section class="opt-sec ux-cta" id="cta">\n  <div class="contact-a contact-a--still" data-theme="dark">\n'
            f'    <img class="contact-a__vid" src="{BG}" alt="" aria-hidden="true" loading="lazy" decoding="async">\n'
            f'    <div class="contact-a__shade" aria-hidden="true"></div>\n    <div class="contact-a__in">\n'
            f'      <header class="contact-a__head"><p class="sx-kicker">{strip(eb.group(1)) if eb else ""}</p><h2 class="contact-a__title">{title}</h2>'
            f'<p class="contact-a__lead">{H.escape(lead, quote=False)}</p></header>\n{form}\n    </div>\n  </div>\n</section>\n<!-- /ux-cta -->\n')

def cards(s):
    n = [0]
    def one(m):
        a_open, inner = m.group(1), m.group(2)
        if "work-g__t" in inner: return m.group(0)
        n[0] += 1
        img = re.search(r"<img[^>]*>", inner).group(0)
        h3 = strip((re.search(r"<h3[^>]*>(.*?)</h3>", inner, re.S) or [None, ""])[1])
        p = strip((re.search(r"<p[^>]*>(.*?)</p>", inner, re.S) or [None, ""])[1])
        ar = (re.search(r'<span class="ar">(.*?)</span>', inner, re.S) or [None, "Ver proyecto &rarr;"])[1]
        if p: client, kind = h3, p
        else: client, _, kind = h3.partition(" – ")
        meta = f"{n[0]:02d} · {kind}" if kind else f"{n[0]:02d}"
        a_open = a_open.replace('class="p4-c"', 'class="p4-c work-g__a"')
        return (f'{a_open}{img}<span class="work-g__t"><span class="sx-meta">{H.escape(meta, quote=False)}</span>'
                f'<h3 class="work-g__h">{H.escape(client, quote=False)}</h3><span class="work-g__ar">{ar}</span></span></a>')
    return re.sub(r'(<a class="p4-c"[^>]*>)(.*?)</a>', one, s, flags=re.S)

def accent(s):
    """Títulos sin palabra destacada: la última palabra (o las dos últimas si la última es muy corta) en azul, como en la landing."""
    def one(m):
        tag, attrs, inner = m.group(1), m.group(2), m.group(3)
        if "<em" in inner or 'class="acc' in inner: return m.group(0)
        k = inner.rfind(">"); head, tail = inner[:k + 1], inner[k + 1:]
        words = tail.rstrip().split(" ")
        if not tail.strip() or not words[-1]: return m.group(0)
        n = 2 if len(re.sub(r"[\W_]", "", words[-1])) <= 3 and len(words) >= 3 else 1
        keep, hl = " ".join(words[:-n]), " ".join(words[-n:])
        return f"<{tag}{attrs}>{head}{keep + ' ' if keep else ''}<em>{hl}</em>{tail[len(tail.rstrip()):]}</{tag}>"
    return re.sub(r"<(h1|h2)([^>]*)>(.*?)</\1>", one, s, flags=re.S)

def page(path, lang, chosen=None):
    f = path / f"content.{lang}.html"; s = rd(f)
    # 1) formulario final
    if "<!-- ux-cta" in s:
        a = s.index("<!-- ux-cta"); b = s.index("<!-- /ux-cta -->") + len("<!-- /ux-cta -->\n")
    elif "<!-- CTA FINAL -->" in s:                                   # páginas de área
        a = s.index("<!-- CTA FINAL -->"); b = s.find("</main>", a)
        if b < 0: b = s.index("<footer", a)
    else:                                                              # páginas de servicio
        a = s.index('<section class="ctap'); b = s.index("</section>", a) + len("</section>")
    s = s[:a] + cta_section(s[a:b], lang) + "\n" + s[b:]
    # 2) pie
    i = s.find("<!-- ========== FOOTER")
    if i < 0: i = s.index('<footer class="site-footer">')
    s = s[:i].rstrip() + "\n\n" + landing_foot(lang)
    # 3) fichas de proyecto
    s = cards(s)
    s, chosen = fichas.apply(s, path.parts[-2], path.parts[-1], lang, chosen)   # fichas = proyectos reales
    s = proceso.apply(s, path.parts[-2], lang)   # «Cómo trabajamos» común
    s = accent(s)
    f.write_text(s, encoding="utf-8")
    return chosen

def index_tsx(path):
    f = path / "index.tsx"; s = rd(f)
    if "sistema.css?raw" not in s:
        s = s.replace('import css from "./styles.css?raw";', 'import css from "./styles.css?raw";\nimport sistema from "../../shared/sistema.css?raw";', 1)
        s = s.replace("css={css}", "css={css + sistema}", 1)
        assert "css + sistema" in s, f
        f.write_text(s, encoding="utf-8")

def sistema_css():
    land = rd(ST / "landing/styles.css")
    picked = pick_rules(land, re.compile(r"\.contact-a|\.work-g|(?<![\w-])footer|\.footer-|\.wa-float|\.btn(?![\w-])|\.sx-kicker|\.sx-meta|\.acc(?![\w-])"))
    out = ("/* Generado por tools/a-unicales/paginas.py: no editar a mano (editar sistema.css del generador). */\n"
           "/* ---------- Copiado de la landing: pie, formulario, fichas de proyecto, botón ---------- */\n" + picked
           + "\n\n" + rd(HERE / "sistema.css") + "\n\n" + rd(HERE / "proceso.css"))
    (ST / "shared").mkdir(exist_ok=True)
    (ST / "shared/sistema.css").write_text(out, encoding="utf-8")

if __name__ == "__main__":
    for p in PAGES:
        chosen = None
        for lang in LANGS: chosen = page(p, lang, chosen)   # misma selección en los 3 idiomas
        index_tsx(p)
    sistema_css()
    print("ok", len(PAGES), "páginas")
