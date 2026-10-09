"""Monta las páginas a partir de src/shell.html y los fragmentos de src/sections/.

Uso: python tools/build.py
src/pages.json define cada página: fichero de salida, título, descripción y la lista
ordenada de fragmentos (nombre del fichero sin .html). Cada fragmento NN-nombre.html
puede tener css/sections/nombre.css y js/sections/nombre.js.
"""
import json, pathlib, re, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
V = time.strftime("%Y%m%d%H%M%S")
shell = (ROOT / "src/shell.html").read_text(encoding="utf-8")
pages = json.loads((ROOT / "src/pages.json").read_text(encoding="utf-8"))

for page in pages:
    frags, css, js = [], [], []
    for stem in page["sections"]:
        f = ROOT / "src/sections" / f"{stem}.html"
        name = re.sub(r"^\d+-", "", stem)
        frags.append(f"<!-- ===== {f.name} ===== -->\n" + f.read_text(encoding="utf-8").strip())
        if (ROOT / f"css/sections/{name}.css").exists():
            css.append(f'<link rel="stylesheet" href="css/sections/{name}.css?v={V}">')
        if (ROOT / f"js/sections/{name}.js").exists():
            js.append(f'<script src="js/sections/{name}.js?v={V}"></script>')
    home = "" if page["file"] == "index.html" else "index.html"
    out = shell
    for key in ("rotulacion", "impresion", "eventos", "inicio"):
        out = out.replace("{{CUR_" + key.upper() + "}}", ' aria-current="page"' if page.get("nav") == key else "")
    out = (out.replace("{{SECTIONS}}", "\n\n".join(frags))
              .replace("{{SECTION_CSS}}", "\n".join(css))
              .replace("{{SECTION_JS}}", "\n".join(js))
              .replace("{{TITLE}}", page["title"])
              .replace("{{DESC}}", page["description"])
              .replace("{{HOME}}", home)
              .replace("{{V}}", V))
    (ROOT / page["file"]).write_text(out, encoding="utf-8")
    print(f"{page['file']}: {len(frags)} fragmentos, {len(css)} css, {len(js)} js")
