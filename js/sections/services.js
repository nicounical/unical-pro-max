/* Servicios · A «Pantalla dividida» (elegida en la ronda 11; antes D) · contenido de la home v29 */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Pantalla dividida (antes D): índice que avanza con el scroll + escenario fijo con cortina de tinta ---------- */
  register("services", "A", (root, ux) => {
    const items = $$(".services-d__item", root), slides = $$(".services-d__slide", root);
    const ink = $(".services-d__ink", root), bigIn = $(".services-d__big-in", root), dest = $(".services-d__dest", root), ticks = $$(".services-d__ticks li", root);
    const names = items.map(it => $("h3", it).textContent);
    const desktop = matchMedia("(min-width: 901px)").matches;
    let cur = -1, tl = null;
    const show = (i, dir = 1) => {
      if (i === cur) return;
      const prevI = cur; cur = i;
      items.forEach((it, k) => it.classList.toggle("is-on", k === i));
      ticks.forEach((t, k) => t.classList.toggle("is-on", k === i));
      if (!desktop) return;
      if (tl) tl.progress(1).kill();
      const nw = slides[i], old = prevI >= 0 ? slides[prevI] : null, img = $("img", nw);
      const label = String(i + 1).padStart(2, "0");
      if (ux.reduce || prevI < 0) {
        slides.forEach((s, k) => { s.classList.toggle("is-on", k === i); gsap.set(s, { clearProps: "clipPath,zIndex" }); });
        bigIn.textContent = label; dest.textContent = names[i]; return;
      }
      const from = dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", to = dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";
      tl = gsap.timeline({ defaults: { overwrite: "auto" } })
        .fromTo(ink, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: .42, ease: "power3.in" })
        .to(old ? $("img", old) : {}, { scale: 1.06, duration: .42, ease: "power2.in" }, 0)
        .to(bigIn, { yPercent: -105 * dir, duration: .3, ease: "power2.in" }, 0)
        .add(() => {
          slides.forEach((s, k) => s.classList.toggle("is-on", k === i));
          if (old) gsap.set($("img", old), { clearProps: "transform" });
          bigIn.textContent = label; dest.textContent = names[i];
        })
        .fromTo(img, { scale: 1.28, yPercent: 6 * dir }, { scale: 1, yPercent: 0, duration: 1.5, ease: "expo.out" })
        .fromTo(ink, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: to, duration: .75, ease: "expo.inOut" }, "<")
        .fromTo(bigIn, { yPercent: 105 * dir }, { yPercent: 0, duration: .9, ease: "expo.out" }, "<.15")
        .fromTo(dest, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .5, ease: "power2.out" }, "<.1");
    };
    items.forEach((it, i) => ScrollTrigger.create({ trigger: it, start: "top 58%", end: "bottom 58%", onToggle: (s) => { if (s.isActive) show(i, s.direction); } }));
    show(0);
    if (!ux.reduce) {
      gsap.from($(".services-d__title", root), { yPercent: 30, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
      if (desktop) gsap.from($(".services-d__frame", root), { clipPath: "inset(12% 8% 12% 8%)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: root, start: "top 65%" } });
      else $$(".services-d__mfig", root).forEach(f => gsap.from(f, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 85%" } }));
    }
    return () => { if (tl) tl.kill(); };
  });
})();
