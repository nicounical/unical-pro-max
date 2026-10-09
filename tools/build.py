"""Monta index.html a partir de src/shell.html y los fragmentos de src/sections/.

Uso: python tools/build.py
Cada sección NN-nombre.html puede tener css/sections/nombre.css y js/sections/nombre.js.
"""
import pathlib, re, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
V = time.strftime("%Y%m%d%H%M%S")

shell = (ROOT / "src/shell.html").read_text(encoding="utf-8")
frags, css, js = [], [], []
for f in sorted((ROOT / "src/sections").glob("*.html")):
    name = re.sub(r"^\d+-", "", f.stem)
    frags.append(f"<!-- ===== {f.name} ===== -->\n" + f.read_text(encoding="utf-8").strip())
    if (ROOT / f"css/sections/{name}.css").exists():
        css.append(f'<link rel="stylesheet" href="css/sections/{name}.css?v={V}">')
    if (ROOT / f"js/sections/{name}.js").exists():
        js.append(f'<script src="js/sections/{name}.js?v={V}"></script>')

out = (shell.replace("{{SECTIONS}}", "\n\n".join(frags))
            .replace("{{SECTION_CSS}}", "\n".join(css))
            .replace("{{SECTION_JS}}", "\n".join(js))
            .replace("{{V}}", V))
(ROOT / "index.html").write_text(out, encoding="utf-8")
print(f"index.html: {len(frags)} secciones, {len(css)} css, {len(js)} js")
