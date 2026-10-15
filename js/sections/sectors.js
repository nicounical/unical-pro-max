/* 11 · Sectores — A «Cuatro columnas» (la elegida) + Ronda 11: B–F nuevas.
   B y D: sector activo que avanza solo (pausa al pasar o enfocar) y se elige con ratón, foco o clic.
   C: cintas en CSS. E y F: solo hover/foco en CSS. */
(() => {
  const { register } = UX;

  ["A", "C", "E", "F"].forEach(v => register("sectors", v, () => {}));

  // Sector activo: actualiza el pie (nº · nombre + texto); avanza cada 3,2 s mientras se ve
  const picker = (root, ux, btnSel, capSel, txSel, dataSel) => {
    const btns = ux.$$(btnSel, root), txt = ux.$$(dataSel, root).map(li => li.textContent);
    const names = btns.map(b => b.lastChild.textContent.trim());
    const cap = ux.$(capSel, root), meta = ux.$(".sx-meta", cap), tx = ux.$(txSel, cap);
    let cur = -1, hold = false, vis = false, t = 0;
    const set = i => {
      if (i === cur) return;
      cur = i;
      btns.forEach((b, k) => b.setAttribute("aria-pressed", k === i ? "true" : "false"));
      meta.textContent = `${String(i + 1).padStart(2, "0")} · ${names[i]}`; tx.textContent = txt[i];
      cap.classList.remove("is-swap"); void cap.offsetWidth; cap.classList.add("is-swap");
    };
    set(0);
    const on = e => { const b = e.target.closest && e.target.closest(btnSel); if (b && root.contains(b)) set(btns.indexOf(b)); };
    const enter = () => { hold = true; }, leave = () => { hold = false; };
    root.addEventListener("pointerover", on); root.addEventListener("focusin", on); root.addEventListener("click", on);
    root.addEventListener("pointerenter", enter); root.addEventListener("pointerleave", leave);
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; }, { threshold: .3 });
    io.observe(root);
    if (!ux.reduce) t = setInterval(() => { if (vis && !hold && !root.contains(document.activeElement)) set((cur + 1) % btns.length); }, 3200);
    return () => {
      clearInterval(t); io.disconnect();
      root.removeEventListener("pointerover", on); root.removeEventListener("focusin", on); root.removeEventListener("click", on);
      root.removeEventListener("pointerenter", enter); root.removeEventListener("pointerleave", leave);
    };
  };

  /* ---------- B · Lista tipográfica ---------- */
  register("sectors", "B", (root, ux) => picker(root, ux, ".sec-b2__w", ".sec-b2__cap", ".sec-b2__tx", ".sec-b2__data li"));

  /* ---------- D · Etiquetas ---------- */
  register("sectors", "D", (root, ux) => picker(root, ux, ".sec-d2__chip", ".sec-d2__cap", ".sec-d2__tx", ".sec-d2__data li"));
})();
