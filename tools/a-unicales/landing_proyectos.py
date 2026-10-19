# -*- coding: utf-8 -*-
"""Proyectos de la landing elegidos por Nico (2026-10-19), en este orden.
   Título, tipo y portada (cover-min) salen de los datos reales (projects.ts y sus traducciones)."""
import html as H
import fichas

SLUGS = ["ambulancias-tomas-rotulacion-flota", "busan-metropolitan-city-pabellon-institucional", "five-guys",
         "pharma-congreso-cardiometabolico", "pharma-estructura-escenica", "pharma-stand-presentacion-producto",
         "kenzo-expositor-perfumeria", "pharma-escenografia-puente"]
SEG = {"es": "proyecto", "ca": "projecte", "en": "project"}
SEE = {"es": "Ver proyecto", "ca": "Veure projecte", "en": "View project"}

def items(lang):
    D = fichas.data()
    assert all(s in D for s in SLUGS), [s for s in SLUGS if s not in D]
    e = lambda x: H.escape(x, quote=True)
    out = []
    for i, slug in enumerate(SLUGS, 1):
        p = D[slug]; title = p["title"][lang]
        client, _, kind = title.partition(" – ")
        out.append(f'      <li><a class="work-g__a" href="/{lang}/{SEG[lang]}/{slug}"><img src="{p["mini"]}" alt="{e(title)} — Unical Graphic" loading="lazy" decoding="async">'
                   f'<span class="work-g__t"><span class="sx-meta">{i:02d}{" · " + e(kind) if kind else ""}</span><span class="work-g__h">{e(client)}</span><span class="work-g__ar">{SEE[lang]} →</span></span></a></li>')
    return "\n".join(out)
