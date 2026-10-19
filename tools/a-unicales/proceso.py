# -*- coding: utf-8 -*-
"""«Cómo trabajamos» común a las páginas de área y de servicio: un solo marcado (ux-proc) y 5 diseños (data-v A–E)
   que pinta src/pages/static/shared/proceso.ts. Aquí solo se extraen los textos de cada página y se escribe el marcado."""
import re, html as H
from proceso_data import HUB_STEPS, UI

def strip(s): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()

def _div_end(s, a):
    """Índice justo después del </div> que cierra el <div ...> que empieza en a."""
    d, i = 0, a
    for m in re.finditer(r"<(/?)div\b[^>]*>", s[a:]):
        d += -1 if m.group(1) else 1
        if d == 0: return a + m.end()
    raise ValueError("div sin cerrar")

def locate(s):
    """(inicio, fin, tipo) del bloque de proceso de la página, o None."""
    if "<!-- ux-proc -->" in s:
        a = s.index("<!-- ux-proc -->"); return a, s.index("<!-- /ux-proc -->") + len("<!-- /ux-proc -->"), "ux"
    m = re.search(r'<section class="pr"[^>]*>', s)
    if m: return m.start(), s.index("</section>", m.start()) + len("</section>"), "pr"
    m = re.search(r'<div class="proc"[^>]*>', s)
    if m: return m.start(), _div_end(s, m.start()), "proc"
    return None

def extract(block, kind, area, lang):
    if kind == "ux":
        kicker = strip(re.search(r'class="ux-proc__kicker">(.*?)</p>', block, re.S).group(1))
        title = re.search(r"<h2[^>]*>(.*?)</h2>", block, re.S).group(1).strip()
        steps = [(strip(t), strip(p), strip(g or "")) for t, p, g in
                 re.findall(r'<h3>(.*?)</h3><p>(.*?)</p>(?:<span class="ux-proc__tag">(.*?)</span>)?', block, re.S)]
    elif kind == "pr":
        kicker = strip(re.search(r'class="u-eyebrow"[^>]*>(.*?)</', block, re.S).group(1))
        title = re.search(r"<h2[^>]*>(.*?)</h2>", block, re.S).group(1).strip()
        steps = [(strip(t), strip(p), "") for t, p in re.findall(r'<article class="pr-card[^"]*"[^>]*>.*?<h3>(.*?)</h3>\s*<p>(.*?)</p>', block, re.S)]
    else:
        kicker = strip(re.search(r'class="proc-ey">(.*?)<', block).group(1))
        title = strip(re.search(r'class="proc-h">(.*?)</div>', block, re.S).group(1))
        steps = HUB_STEPS[area][lang]
    assert len(steps) >= 3, (area, kind, steps)
    return kicker, title, steps

def section(kicker, title, steps, lang):
    ui = UI[lang]; e = lambda x: H.escape(x, quote=False)
    lis = "\n".join(
        f'      <li class="ux-proc__step" data-k="{k}"><span class="ux-proc__n" aria-hidden="true">{k + 1:02d}</span>'
        f'<div class="ux-proc__body"><span class="ux-proc__ph">{ui["phase"]} {k + 1:02d}</span><h3>{e(t)}</h3><p>{e(p)}</p>'
        + (f'<span class="ux-proc__tag">{e(g)}</span>' if g else "") + "</div></li>"
        for k, (t, p, g) in enumerate(steps))
    return (f'<!-- ux-proc -->\n<section class="ux-proc" id="proceso" data-v="A" aria-roledescription="carrusel" '
            f'data-pause="{ui["pause"]}" data-play="{ui["play"]}">\n  <div class="ux-proc__in">\n'
            f'    <header class="ux-proc__head"><p class="ux-proc__kicker">{e(kicker)}</p><h2>{title}</h2></header>\n'
            f'    <div class="ux-proc__stage" aria-hidden="true"></div>\n'
            f'    <ol class="ux-proc__steps">\n{lis}\n    </ol>\n'
            f'    <div class="ux-proc__ctl"><button type="button" class="ux-proc__pp" aria-label="{ui["pause"]}"><i></i></button>'
            f'<span class="ux-proc__count"><b>01</b> / {len(steps):02d}</span><span class="ux-proc__bar"><i></i></span></div>\n'
            f'  </div>\n</section>\n<!-- /ux-proc -->')

def apply(s, area, lang):
    loc = locate(s)
    if not loc: return s
    a, b, kind = loc
    k, t, st = extract(s[a:b], kind, area, lang)
    return s[:a] + section(k, t, st, lang) + s[b:]
