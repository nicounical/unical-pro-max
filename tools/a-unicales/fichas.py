# -*- coding: utf-8 -*-
"""Fichas de proyecto de las páginas de área y de servicio: SIEMPRE proyectos reales del portfolio, con su enlace,
   su portada (cover-min) y su título en cada idioma. Nada de tarjetas genéricas que llevan a /proyectos.
   - Página de servicio: solo proyectos de esa subcategoría (en Stands, solo stands).
   - Página de área: proyectos de las subcategorías de esa área.
   Se respetan las fichas que ya apuntaban a un proyecto válido y se completa con los que tienen más fotos."""
import re, os, html as H
from gen import rd, UP

AREAS = {
 "impresion": ["impresion-gran-formato", "impresion-sobre-rigidos", "plv-y-displays", "publicidad-exterior", "vinilos-y-decoracion"],
 "rotulacion": ["rotulacion-comercial", "rotulos-luminosos", "letras-corporeas", "senaletica-corporativa", "rotulacion-vehiculos", "rotulacion-flotas"],
 "eventos": ["stands-para-ferias", "eventos-corporativos", "eventos-deportivos", "lanzamientos-inauguraciones", "pop-up-retail-efimero", "photocalls-press-walls"],
}
# Lo que Nico ha pedido fuera de una página concreta
EXCLUDE = {"stands-para-ferias": re.compile(r"movistar|venca|mostrador")}
SEG = {"es": "proyecto", "ca": "projecte", "en": "project"}
N_CARDS = 8
_DATA = None

def data():
    global _DATA
    if _DATA: return _DATA
    src = rd(UP / "src/data/projects.ts").split("export const proyectosSinFotos")[0]
    tr = rd(UP / "src/data/translations/project-translations.ts")
    ca_i, en_i = tr.index("\n  ca: {"), tr.index("\n  en: {")
    T = re.compile(r'title: "((?:[^"\\]|\\.)*)"')
    def title(slug, lang, es):
        if lang == "es": return es
        a, z = (ca_i, en_i) if lang == "ca" else (en_i, len(tr))
        i = tr.find(f'\n    "{slug}": {{', a, z)
        return T.search(tr, i, i + 3000).group(1) if i >= 0 else es
    out = {}
    for b in re.split(r"(?m)^(?=[ \t]*\{\n[ \t]*slug: )", src)[1:]:
        slug = re.search(r'slug: "([^"]+)"', b).group(1)
        img = re.search(r'image: "([^"]+)"', b).group(1)
        if not img.startswith("/images/projects/") or not os.path.exists(str(UP / "public") + img): continue
        mini = img.replace("cover.jpg", "cover-min.jpg")
        es = T.search(b).group(1)
        out[slug] = dict(subs=re.findall(r'"([\w-]+)"', re.search(r"subcategories: \[([^\]]*)\]", b).group(1)),
                         secondary="secondary: true" in b, photos=len(re.findall(r"\{\s*src:", b)), mini=mini,
                         title={l: title(slug, l, es).replace('\\"', '"') for l in ("es", "ca", "en")})
    _DATA = out
    return out

def pool(page, area):
    D = data()
    if page == "hub":
        ok = lambda p: any(s in AREAS[area] for s in p["subs"])
    elif page == "stands-para-ferias":
        ok = lambda p: p["subs"][:1] == ["stands-para-ferias"]          # solo stands de verdad
    else:
        ok = lambda p: page in p["subs"]
    ex = EXCLUDE.get(page)
    return [s for s, p in D.items() if ok(p) and not (ex and ex.search(s))]

def card(slug, k, lang, ar):
    p = data()[slug]; t = p["title"][lang]
    client, _, kind = t.partition(" – ")
    meta = f"{k:02d} · {kind}" if kind else f"{k:02d}"
    e = lambda x: H.escape(x, quote=True)
    return (f'<a class="p4-c work-g__a" href="/{lang}/{SEG[lang]}/{slug}"><img src="{p["mini"]}" alt="{e(t)} — Unical Graphic" loading="lazy" decoding="async">'
            f'<span class="work-g__t"><span class="sx-meta">{e(meta)}</span><h3 class="work-g__h">{e(client)}</h3><span class="work-g__ar">{ar}</span></span></a>')

def _div_end(s, a):
    d = 0
    for m in re.finditer(r"<(/?)div\b[^>]*>", s[a:]):
        d += -1 if m.group(1) else 1
        if d == 0: return a + m.end()
    raise ValueError

def apply(s, area, page, lang, chosen=None):
    """Reescribe la rejilla .p4 de la página. `chosen` (lista de slugs) permite usar la misma selección en los 3 idiomas."""
    m = re.search(r'<div class="p4"[^>]*>', s)
    if not m: return s, chosen
    a, b = m.end(), _div_end(s, m.start()) - len("</div>")
    inner = s[a:b]
    ar = (re.search(r'<span class="(?:work-g__ar|ar)">(.*?)</span>', inner, re.S) or [None, "Ver proyecto &rarr;"])[1]
    if chosen is None:
        cand = pool(page, area); D = data()
        keep = [h.split("/")[-1] for h in re.findall(r'<a class="p4-c[^"]*" href="(/\w\w/(?:proyecto|projecte|project)/[\w-]+)"', inner)]
        keep = [x for x in keep if x in cand]
        rest = sorted((x for x in cand if x not in keep), key=lambda x: (D[x]["secondary"], -D[x]["photos"], x))
        allc = keep + rest
        chosen = allc[:N_CARDS if len(allc) >= N_CARDS else min(4, len(allc))]   # filas completas de 4
    new = "\n      " + "\n      ".join(card(x, k + 1, lang, ar) for k, x in enumerate(chosen)) + "\n    "
    return s[:a] + new + s[b:], chosen
