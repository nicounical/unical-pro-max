/* ===== 06 · Proyectos — Ronda 8 «Selección 5» =====
   A (Cuatro columnas), B (Mosaico editorial), D (Muro) y F (Recortes): sin JS propio
   (entrada .rv del núcleo y efectos de hover en CSS).
   C · Columnas desfasadas: la columna central se desliza un poco a contracorriente con el scroll.
   E · Pieza destacada: el proyecto grande cambia solo; miniaturas, pausa y foco lo controlan. */
(() => {
  const { register, $, $$ } = UX;

  ["A", "B", "D", "F"].forEach(k => register("work", k, () => {}));

  register("work", "C", (root, ux) => {
    if (ux.reduce || innerWidth < 900) return;
    const mid = $$(".work-c__col", root)[1], cols = $(".work-c__cols", root);
    gsap.fromTo(mid, { y: 60 }, { y: -90, ease: "none", scrollTrigger: { trigger: cols, start: "top bottom", end: "bottom top", scrub: .6 } });
  });

  register("work", "E", (root, ux) => {
    const slides = $$(".work-e__slide", root), thumbs = $$(".work-e__t", root);
    const bar = $(".work-e__bar i", root), pp = $(".work-e__pp", root), stage = $(".work-e__stage", root);
    const DUR = 5, N = slides.length;
    let cur = 0, tween = null, visible = false, hover = false, paused = false;

    const go = i => {
      cur = (i + N) % N;
      slides.forEach((s, j) => {
        const on = j === cur;
        s.classList.toggle("is-on", on);
        on ? (s.removeAttribute("tabindex"), s.removeAttribute("aria-hidden")) : (s.setAttribute("tabindex", "-1"), s.setAttribute("aria-hidden", "true"));
      });
      thumbs.forEach((t, j) => t.setAttribute("aria-pressed", String(j === cur)));
      run();
    };
    const run = () => {
      tween && tween.kill();
      gsap.set(bar, { scaleX: 0 });
      if (ux.reduce) return;
      tween = gsap.to(bar, { scaleX: 1, duration: DUR, ease: "none", onComplete: () => go(cur + 1) });
      sync();
    };
    const sync = () => { if (!tween) return; (visible && !document.hidden && !hover && !paused) ? tween.resume() : tween.pause(); };

    const onThumb = e => go(+e.currentTarget.dataset.i);
    const onEnter = () => { hover = true; sync(); };
    const onLeave = () => { hover = false; sync(); };
    const onFocusIn = () => { hover = true; sync(); };
    const onFocusOut = e => { if (!root.contains(e.relatedTarget)) { hover = false; sync(); } };
    const onPP = () => { paused = !paused; pp.setAttribute("aria-pressed", String(paused)); pp.textContent = paused ? "Reproducir" : "Pausar"; sync(); };

    thumbs.forEach(t => t.addEventListener("click", onThumb));
    const wrap = $(".work-e__wrap", root);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("focusin", onFocusIn);
    wrap.addEventListener("focusout", onFocusOut);
    pp.addEventListener("click", onPP);
    if (ux.reduce) pp.hidden = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); });
    io.observe(stage);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    go(0);
    return () => {
      tween && tween.kill(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      thumbs.forEach(t => t.removeEventListener("click", onThumb));
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("focusin", onFocusIn);
      wrap.removeEventListener("focusout", onFocusOut);
      pp.removeEventListener("click", onPP);
    };
  });
})();
