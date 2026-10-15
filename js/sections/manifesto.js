/* Por qué Unical · A «Zoom al titular» (elegida en la ronda 11; antes F)
   Pin a pantalla completa con scrub largo: el titular (sólido, «imposible» en azul) crece desde
   «imposible» hasta que entras en la foto; después se oscurece y aparecen los cuatro pilares.
   Móvil y reduced-motion: versión estática (titular, foto y pilares en columna). */
(() => {
  const { register } = UX;
  const isDesk = () => matchMedia("(min-width: 861px)").matches;

  register("manifesto", "A", (root, ux) => {
    if (ux.reduce || !isDesk()) { root.classList.add("man-win--static"); return () => root.classList.remove("man-win--static"); }
    const win = ux.$(".man-win__window", root), img = ux.$("img", win);
    const title = ux.$(".man-win__title", root), acc = ux.$(".acc", root), over = ux.$(".man-win__over", root);
    const origin = () => { const a = acc.getBoundingClientRect(), t = title.getBoundingClientRect(); return `${a.left - t.left + a.width * .5}px ${a.top - t.top + a.height * .55}px`; };
    gsap.set(title, { transformOrigin: origin() });
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1.2, invalidateOnRefresh: true } })
      .to(title, { scale: 38, ease: "power3.in", duration: .55 }, 0)
      .to(win, { opacity: 1, ease: "none", duration: .12 }, .28)
      .to(title, { autoAlpha: 0, ease: "none", duration: .1 }, .32)
      .fromTo(img, { scale: 1.35 }, { scale: 1, ease: "power1.out", duration: .7 }, .1)
      // cierre: oscurecer y aparecer los cuatro pilares
      .to(ux.$(".man-win__shade", root), { opacity: 1, ease: "none", duration: .18 }, .64)
      .to(over, { autoAlpha: 1, duration: .12 }, .7)
      .fromTo(ux.$$(".man-win__label, .man-win__grid li, .man-win__foot", root), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power2.out", stagger: .035, duration: .2 }, .72); // fromTo: con invalidateOnRefresh un from() se quedaría en 0
    return () => gsap.set(title, { clearProps: "transform,transformOrigin,opacity,visibility" });
  });
})();
