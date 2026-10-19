# -*- coding: utf-8 -*-
"""Pasa los diseños elegidos de unical-pro-max a la landing de unicales-preview.
   Genera src/pages/static/landing/{content.es,content.ca,content.en}.html, styles.css y landing.js.
   El pie (footer) y el botón flotante de WhatsApp se copian sin tocar del contenido actual."""
import re, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from i18n import T

PM = pathlib.Path(r"C:/Users/Nico/Desktop/repos-test/unical-pro-max")
UP = pathlib.Path(r"C:/Users/Nico/unicales-preview")
LAND = UP / "src/pages/static/landing"
HERE = pathlib.Path(__file__).parent
ASSET = "/images/landing/v2/"

rd = lambda p: pathlib.Path(p).read_text(encoding="utf-8")

# ---------------------------------------------------------------- HTML
EXTRA = {
    "es": dict(hud_vinyl="Vinilo 3M · Avery", why_sp=" ", n2v="+3.000"),
    "ca": dict(hud_vinyl="Vinil 3M · Avery", why_sp="", n2v="+3.000"),
    "en": dict(hud_vinyl="Vinyl 3M · Avery", why_sp=" ", n2v="+3,000"),
}
PROJECTS = [  # slug, imagen (las mismas que la landing actual)
    ("pharma-congreso-cardiometabolico", "pharma-congreso-cardiometabolico"),
    ("laliga-twentynines-interiorismo", "laliga-twentynines-interiorismo"),
    ("mcdonalds-decoracion-interior-murales", "mcdonalds-decoracion-interior"),
    ("freixenet-solare-mallorca", "freixenet-solare-mallorca"),
    ("venca-popup-store", "venca-popup-store"),
    ("lexus-electrico", "lexus-electrico"),
    ("la-vermuteria-rotulo-fachada", "la-vermuteria-rotulo-fachada"),
    ("tibidabo-cubos-publicidad-exterior", "tibidabo-cubos-publicidad-exterior"),
]
SVC_IMG = [("impresion.jpg", 1600, 1200), ("rotulacion.jpg", 1600, 1200), ("stands.jpg", 1448, 1086),
           ("eventos.jpg", 1600, 1068), ("letras-corporeas.jpg", 1600, 1068), ("retail.jpg", 1448, 1086)]

def clients_html():
    s = rd(PM / "src/sections/08-clients.html")
    lis = re.findall(r'^\s*<li class="clients-mk.*?</li>$', s, re.M)
    return "\n".join("          " + l.strip().replace("assets/", ASSET) for l in lis)

# Formulario: mismos textos, campos y opciones que la página Contacto (src/i18n/translations.ts)
SVC_KEYS = ["impresion-digital-gran-formato", "rotulacion-vehiculos", "car-wrapping", "stands-para-ferias", "impresion-eventos", "plv-retail",
            "senaletica-corporativa", "vinilos-decorativos", "publicidad-exterior", "laminas-solares", "renovacion-hoteles-restaurantes"]
TL_KEYS = [("urgente-48h", "urgent"), ("1-semana", "oneWeek"), ("2-4-semanas", "twoToFourWeeks"), ("1-3-meses", "oneToThreeMonths"), ("sin-fecha", "noDate")]

def site_tr():
    """{lang: (contactPage, servicesTitles)} leyendo translations.ts (bloques en orden es, ca, en)."""
    src = rd(UP / "src/i18n/translations.ts")
    kv = re.compile(r'(?:"([^"]+)"|(\w+)):\s*(["\'`])((?:\\.|(?!\3).)*)\3')
    def block(start):
        i = src.index("{", start) + 1; d, k = 1, i
        while d: d += {"{": 1, "}": -1}.get(src[k], 0); k += 1
        return {(m.group(1) or m.group(2)): m.group(4).replace("\\'", "'").replace('\\"', '"') for m in kv.finditer(src[i:k - 1])}
    cps = [m.start() for m in re.finditer(r"\bcontactPage:\s*\{", src)]
    sts = [m.start() for m in re.finditer(r"\bservicesTitles:\s*\{", src)]
    assert len(cps) == 3 and len(sts) == 3, (cps, sts)
    return {l: (block(c), block(t)) for l, c, t in zip(("es", "ca", "en"), cps, sts)}

# Enlace a la política dentro del texto legal y campo trampa antispam (invisible; ver src/lib/sendContact.ts)
PRIV = {"es": "política de privacidad", "ca": "política de privacitat", "en": "privacy policy"}
HP = {"es": "No rellenes este campo", "ca": "No omplis aquest camp", "en": "Leave this field empty"}
def form_html(lang):
    import html
    c, st = site_tr()[lang]; e = lambda x: html.escape(x, quote=True)
    svc = "".join(f'<option value="{k}">{e(st[k])}</option>' for k in SVC_KEYS)
    tl = "".join(f'<option value="{v}">{e(c[k])}</option>' for v, k in TL_KEYS)
    return f'''      <form class="contact-a__form" id="ctaForm" novalidate aria-labelledby="contact-a-ft" data-sending="{e(c["sending"])}" data-error="{e(c["submitError"])}">
        <p class="contact-a__ft" id="contact-a-ft">{e(c["formTitle"])}</p>
        <div class="contact-a__grid">
          <label><span>{e(c["name"])}</span><input type="text" name="name" autocomplete="name" required placeholder="{e(c["namePlaceholder"])}"></label>
          <label><span>{e(c["company"])}</span><input type="text" name="company" autocomplete="organization" placeholder="{e(c["companyPlaceholder"])}"></label>
          <label><span>{e(c["email"])}</span><input type="email" name="email" autocomplete="email" required placeholder="{e(c["emailPlaceholder"])}"></label>
          <label><span>{e(c["phone"])}</span><input type="tel" name="phone" autocomplete="tel" placeholder="{e(c["phonePlaceholder"])}"></label>
          <label><span>{e(c["serviceInterest"])}</span><select name="service_interest"><option value="">{e(c["serviceInterestPlaceholder"])}</option>{svc}</select></label>
          <label><span>{e(c["timeline"])}</span><select name="timeline"><option value="">{e(c["timelinePlaceholder"])}</option>{tl}</select></label>
          <label class="contact-a__full"><span>{e(c["estimatedScope"])}</span><input type="text" name="estimated_scope" placeholder="{e(c["estimatedScopePlaceholder"])}"></label>
          <label class="contact-a__full"><span>{e(c["message"])}</span><textarea name="message" rows="4" required placeholder="{e(c["messagePlaceholder"])}"></textarea></label>
          <label class="contact-a__hp" aria-hidden="true"><span>{HP[lang]}</span><input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        </div>
        <p class="contact-a__note">{e(c["privacy"]).replace(PRIV[lang], f'<a href="/{lang}/politica-privacidad">{PRIV[lang]}</a>')}</p>
        <div class="contact-a__send">
          <button type="submit" class="btn">{e(c["send"])} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
        </div>
        <p class="contact-a__ok" role="alert" hidden></p>
      </form>'''

def build_html(lang):
    t = dict(T[lang]); t.update(EXTRA[lang])
    svc, slides = [], []
    for i, (img, w, h) in enumerate(SVC_IMG, 1):
        src = f"/images/landing/{img}"
        svc.append(f'          <li class="services-d__item" data-i="{i-1}"><figure class="services-d__mfig"><img src="{src}" alt="{t[f"s{i}_alt"]}" width="{w}" height="{h}" loading="lazy"></figure>'
                   f'<span class="services-d__n mono">{i:02d} · {t[f"s{i}_sub"]}</span><h3>{t[f"s{i}_h"]}</h3><p>{t[f"s{i}_p"]}</p>'
                   f'<a href="{t[f"u_s{i}"]}">{t["see_service"]} <span aria-hidden="true">→</span></a></li>')
        slides.append(f'          <div class="services-d__slide{" is-on" if i == 1 else ""}"><img src="{src}" alt="" width="{w}" height="{h}" loading="lazy"></div>')
    projs = []
    for i, (slug, img) in enumerate(PROJECTS, 1):
        title = t[f"p{i}"]; client, _, kind = title.partition(" – ")
        projs.append(f'      <li><a class="work-g__a" href="{t["u_proj"]}{slug}"><img src="/images/projects/{img}/cover-min.jpg" alt="{title} — Unical Graphic" loading="lazy" decoding="async">'
                     f'<span class="work-g__t"><span class="sx-meta">{i:02d} · {kind}</span><span class="work-g__h">{client}</span><span class="work-g__ar">{t["see_project"]} →</span></span></a></li>')
    belt = "".join(f'<span class="num-a__it"><b>{v}</b><i>{t[k]}</i></span>' for v, k in (("+32", "n1"), (t["n2v"], "n2"), ("+40", "n3"), ("3M · Avery", "n4")))
    secs = "\n".join(f'        <li class="sec-a__it rv"><span class="sx-meta">{i:02d}</span><h3 class="sx-h3">{t[f"se{i}"]}</h3><p>{t[f"se{i}p"]}</p></li>' for i in range(1, 9))
    s = rd(HERE / "template.html")
    s = s.replace('<b>Vinilo 3M · Avery</b>', f'<b>{t["hud_vinyl"]}</b>')
    s = (s.replace("[[SERVICES]]", "\n".join(svc)).replace("[[SLIDES]]", "\n".join(slides)).replace("[[PROJECTS]]", "\n".join(projs))
          .replace("[[BELT]]", belt).replace("[[SECTORS]]", secs).replace("[[CLIENTS]]", clients_html()).replace("[[FORM]]", form_html(lang)))
    s = re.sub(r"\[\[(\w+)\]\]", lambda m: m.group(0) if m.group(1) == "NUMBERS_ORIG" else t[m.group(1)], s)
    old = rd(HERE / "orig" / f"content.{lang}.html")
    # Por qué elegirnos: se queda la sección que ya tenía la landing (sellos), tal cual
    nums = old[old.index("<!-- ========== NUMBERS"):old.index("<!-- ========== SECTORS")].rstrip()
    s = s.replace("[[NUMBERS_ORIG]]", nums)
    foot = old[old.index("<!-- ========== FOOTER"):]          # pie y WhatsApp flotante, intactos
    return s + foot

# ---------------------------------------------------------------- CSS
ROOT = ".static-page-root"
DROP = re.compile(r"^\.(loader|cursor|progress|hd|mnav|dock|board|ft|skip)\b|^html\.|^\.no-gsap|^\.lenis|^body\.no-dock")

def scope_sel(sel):
    out = []
    for part in split_top(sel, ","):
        p = part.strip()
        if not p: continue
        if DROP.search(p): continue
        if p in (":root", "html", "body"): out.append(ROOT); continue
        p = re.sub(r"^(:root|html|body)\b", ROOT, p)
        if p.startswith(ROOT): out.append(p)
        else: out.append(f"{ROOT} {p}")
    return ",".join(out)

def split_top(s, ch):
    parts, depth, cur = [], 0, ""
    for c in s:
        if c in "([": depth += 1
        elif c in ")]": depth -= 1
        if c == ch and depth == 0: parts.append(cur); cur = ""
        else: cur += c
    parts.append(cur); return parts

def scope_css(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0: break
        head = css[i:j].strip()
        # bloque que cierra
        depth, k = 1, j + 1
        while depth and k < n:
            if css[k] == "{": depth += 1
            elif css[k] == "}": depth -= 1
            k += 1
        body = css[j + 1:k - 1]
        if head.startswith("@media") or head.startswith("@supports"):
            inner = scope_css(body)
            if inner.strip(): out.append(f"{head}{{{inner}}}")
        elif head.startswith("@"):
            out.append(f"{head}{{{body}}}")
        else:
            sel = scope_sel(head)
            if sel: out.append(f"{sel}{{{body.strip()}}}")
        i = k
    return "\n".join(out)

def pick_rules(css, rx):
    """Reglas (con su @media/@supports) cuyo selector casa con rx; para conservar secciones antiguas tal cual."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0: break
        head = css[i:j].strip(); depth, k = 1, j + 1
        while depth and k < n:
            depth += {"{": 1, "}": -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]
        if head.startswith("@media") or head.startswith("@supports"):
            inner = pick_rules(body, rx)
            if inner.strip(): out.append(f"{head}{{{inner}}}")
        elif not head.startswith("@") and rx.search(head):
            out.append(f"{head}{{{body.strip()}}}")
        i = k
    return "\n".join(out)

def build_css():
    old = rd(HERE / "orig" / "styles.css")
    lines = old.split("\n")
    base = "\n".join(lines[0:92])                       # tokens, reset y utilidades de la landing actual
    a = old.index("/* ============================================================\n   FOOTER")
    b = old.index("/* ============================================================\n   RESPONSIVE")
    foot = old[a:b]
    foot += ("@media (max-width: 900px) { .static-page-root .footer-grid { grid-template-columns: 1fr 1fr; } }\n"
             "@media (max-width: 700px) { .static-page-root .footer-grid { grid-template-columns: 1fr; } }\n")
    nums = pick_rules(old, re.compile(r"\.section-numbers|\.nm-intro|\.sg(?![a-z])|\.sg-"))
    core = rd(PM / "css/core.css")
    secs = ["hero", "services", "reel", "work", "stands-process", "sectors", "manifesto", "clients", "contact"]
    parts = [f"/* ---------- {s} ---------- */\n" + scope_css(rd(PM / f"css/sections/{s}.css")) for s in secs]
    pm = scope_css(core) + "\n" + "\n".join(parts)
    pm = pm.replace("url(../../assets/", f"url({ASSET}").replace("../../assets/", ASSET)
    extra = rd(HERE / "extra.css")
    return ("/* ============================================================\n"
            "   Landing · diseños «Pro Max» (generado desde unical-pro-max; ver extra.css para los ajustes propios)\n"
            "   ============================================================ */\n"
            + base + "\n\n/* ---------- Pie (sin cambios) ---------- */\n" + foot
            + "\n\n/* ---------- Por qué elegirnos: la sección de sellos de siempre (sin cambios) ---------- */\n" + nums + "\n\n/* ---------- Pro Max ---------- */\n" + pm + "\n\n/* ---------- Ajustes de integración ---------- */\n" + extra)

# ---------------------------------------------------------------- JS
TAPE = {"es": "Diseño · Producción · Montaje", "ca": "Disseny · Producció · Muntatge", "en": "Design · Production · Installation"}   # cinta del stand 3D
I18N_JS = {k: {kk: T[k][kk] for kk in ("play", "pause", "pause_anim", "resume_anim", "sent", "f1", "f2", "f3", "f4")} for k in T}
for _k in I18N_JS: I18N_JS[_k]["tape"] = TAPE[_k]

def build_js():
    import json
    secs = ["hero", "services", "reel", "stands-process", "sectors", "manifesto", "clients", "contact"]
    body = []
    for s in secs:
        code = rd(PM / f"js/sections/{s}.js").replace('"assets/', f'"{ASSET}').replace("'assets/", f"'{ASSET}")
        body.append(f"/* ======== {s}.js ======== */\n" + code)
    js = "\n".join(body)
    # textos de interfaz que vivían en el JS
    js = js.replace('`<span>${on ? "Pausar" : "Reproducir"}</span>`', '`<span>${on ? UX.t("pause") : UX.t("play")}</span>`')
    js = js.replace('b.textContent = on ? "Reanudar animación" : "Pausar animación";', 'b.textContent = on ? UX.t("resume_anim") : UX.t("pause_anim");')
    js = js.replace('send.firstChild.textContent = "Enviado ";', 'send.firstChild.textContent = UX.t("sent") + " ";')
    js = js.replace('const NAMES = ["Presupuesto", "Diseño", "Producción", "Instalación"];', 'const NAMES = ["f1", "f2", "f3", "f4"].map(k => UX.t(k));')
    # Formulario: envío real (mismo que la página Contacto, lo pone index.tsx) y sin el botón de WhatsApp
    js = js.replace('mark(); ok.hidden = false; send.disabled = true; send.firstChild.textContent = UX.t("sent") + " ";', 'mark(); UX.submit(f, send, ok);')
    js = js.replace('if (ux.reduce || !ux.fine) return offForm;', 'if (!btn || !core || ux.reduce || !ux.fine) return offForm;')
    for needle in ('UX.t("pause")', 'UX.submit(f, send, ok)', '!btn || !core', 'map(k => UX.t(k))'):
        assert needle in js, needle
    shell = rd(HERE / "shell.js")
    return shell.replace("/*I18N*/", json.dumps(I18N_JS, ensure_ascii=False)).replace("/*SECTIONS*/", js.replace('"Diseño · Producción · Montaje"', "(I18N[LANG] || I18N.es).tape"))

if __name__ == "__main__":
    for lang in ("es", "ca", "en"):
        html = build_html(lang)
        assert "[[" not in html, re.findall(r"\[\[\w+\]\]", html)
        # sin notas internas visibles desde el navegador (solo la marca del pie, que usa paginas.py)
        html = re.sub(r"<!--(?! =+ FOOTER).*?-->\n?", "", html, flags=re.S)
        (LAND / f"content.{lang}.html").write_text(html, encoding="utf-8")
    (LAND / "styles.css").write_text(build_css(), encoding="utf-8")
    (LAND / "landing.js").write_text(build_js(), encoding="utf-8")
    print("ok")
