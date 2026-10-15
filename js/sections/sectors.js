/* 11 · Sectores — Ronda 8 «Selección 5»
   A (antes B «Cuatro columnas») + B–F sencillas del sistema sx.
   Solo .rv del núcleo y realces de hover/foco; E y F cambian el texto del sector activo. */
(() => {
  const { register } = UX;

  ["A", "B", "C", "D"].forEach(v => register("sectors", v, () => {}));

  // Selector de sector activo (ratón, foco o clic) que actualiza un texto
  const picker = (root, ux, btnSel, render) => {
    const btns = ux.$$(btnSel, root);
    let cur = 0;
    const set = i => {
      if (i === cur) return;
      cur = i;
      btns.forEach((b, k) => b.setAttribute("aria-pressed", k === i ? "true" : "false"));
      render(i);
    };
    const on = e => { const b = e.target.closest && e.target.closest(btnSel); if (b && root.contains(b)) set(+b.dataset.i); };
    root.addEventListener("pointerover", on); root.addEventListener("focusin", on); root.addEventListener("click", on);
    return () => { root.removeEventListener("pointerover", on); root.removeEventListener("focusin", on); root.removeEventListener("click", on); };
  };

  /* ---------- E · Frase continua ---------- */
  register("sectors", "E", (root, ux) => {
    const txt = ux.$$(".sec-e__data li", root).map(li => li.textContent), names = ux.$$(".sec-e__w", root).map(b => b.textContent);
    const meta = ux.$(".sec-e__cap .sx-meta", root), tx = ux.$(".sec-e__tx", root);
    return picker(root, ux, ".sec-e__w", i => {
      meta.textContent = `${String(i + 1).padStart(2, "0")} · ${names[i]}`;
      tx.textContent = txt[i];
    });
  });

  /* ---------- F · Índice y detalle ---------- */
  register("sectors", "F", (root, ux) => {
    const txt = ux.$$(".sec-f__data li", root).map(li => li.textContent);
    const names = ux.$$(".sec-f__b", root).map(b => b.lastChild.textContent.trim());
    const card = ux.$(".sec-f__card", root), n = ux.$(".sec-f__n", card), t = ux.$(".sec-f__t", card), p = ux.$(".sec-f__tx", card);
    return picker(root, ux, ".sec-f__b", i => {
      n.textContent = String(i + 1).padStart(2, "0"); t.textContent = names[i]; p.textContent = txt[i];
      card.classList.remove("is-swap"); void card.offsetWidth; card.classList.add("is-swap");
    });
  });
})();
