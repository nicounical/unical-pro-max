/* ===== 10 · Contacto — A «Botón sobre vídeo» (única desde la ronda 8; antes H). También se usa en los hubs. ===== */
(() => {
  const { register, $ } = UX;

  /* ---------- A · Botón sobre vídeo (antes H): todo visible desde el principio, sin entrada; solo el imán suave del botón ---------- */
  register("contact", "A", (root, ux) => {
    const btn = $(".contact-a__btn", root), core = $(".contact-a__core", root);
    if (ux.reduce || !ux.fine) return;
    const xTo = gsap.quickTo(btn, "x", { duration: .9, ease: "elastic.out(1,.45)" }), yTo = gsap.quickTo(btn, "y", { duration: .9, ease: "elastic.out(1,.45)" });
    const move = e => {
      const r = core.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * .9) { xTo(dx * .3); yTo(dy * .3); } else { xTo(0); yTo(0); }
    };
    const leave = () => { xTo(0); yTo(0); };
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave);
    return () => { root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); };
  });
})();
