/* ===== 10 · Contacto — A «Botón sobre vídeo» (única desde la ronda 8; antes H). También se usa en los hubs. ===== */
(() => {
  const { register, $ } = UX;

  /* ---------- A · Botón sobre vídeo (antes H): todo visible desde el principio, sin entrada; solo el imán suave del botón ---------- */
  // Formulario directo: validación nativa + aviso de enviado.
  // TODO endpoint: al conectar el envío real, quitar el preventDefault y mandar los datos (FormData) al servicio.
  const formFor = root => {
    const f = $(".contact-a__form", root);
    if (!f) return () => {};
    const ok = $(".contact-a__ok", f), send = $("button[type=submit]", f);
    const mark = () => f.querySelectorAll("input,select,textarea").forEach(el => el.setAttribute("aria-invalid", String(!el.checkValidity())));
    const submit = e => {
      e.preventDefault();
      if (!f.checkValidity()) { mark(); f.reportValidity(); return; }
      mark(); ok.hidden = false; send.disabled = true; send.firstChild.textContent = "Enviado ";
    };
    const fix = e => { if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", String(!e.target.checkValidity())); };
    f.addEventListener("submit", submit); f.addEventListener("input", fix); f.addEventListener("change", fix);
    return () => { f.removeEventListener("submit", submit); f.removeEventListener("input", fix); f.removeEventListener("change", fix); };
  };

  register("contact", "A", (root, ux) => {
    const btn = $(".contact-a__btn", root), core = $(".contact-a__core", root);
    const offForm = formFor(root);
    if (ux.reduce || !ux.fine) return offForm;
    const xTo = gsap.quickTo(btn, "x", { duration: .9, ease: "elastic.out(1,.45)" }), yTo = gsap.quickTo(btn, "y", { duration: .9, ease: "elastic.out(1,.45)" });
    const move = e => {
      const r = core.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * .9) { xTo(dx * .3); yTo(dy * .3); } else { xTo(0); yTo(0); }
    };
    const leave = () => { xTo(0); yTo(0); };
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave);
    return () => { offForm(); root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); };
  });
})();
