/* Por qué Unical · A (favorita fija) + B–F inspiradas en ella */
(() => {
  const { register } = UX;
  const isDesk = () => matchMedia("(min-width: 861px)").matches;

  /* ---------- A · Ventana que se abre (favorita fija; antes K) ---------- */
  register("manifesto", "A", (root, ux) => {
    if (ux.reduce || !isDesk()) { root.classList.add("man-win--static"); return () => root.classList.remove("man-win--static"); }
    const win = ux.$(".man-win__window", root), img = ux.$("img", win);
    const [l, r] = ux.$$(".man-win__half", root), over = ux.$(".man-win__over", root);
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .7 } })
      .to(l, { yPercent: -160, autoAlpha: 0, ease: "power2.in", duration: .5 }, .05)
      .to(r, { yPercent: 160, autoAlpha: 0, ease: "power2.in", duration: .5 }, .05)
      .to(win, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: .6 }, 0)
      .to(img, { scale: 1, ease: "none", duration: .8 }, 0)
      .to(ux.$(".man-win__shade", root), { opacity: 1, duration: .25 }, .5)
      .to(over, { autoAlpha: 1, duration: .2 }, .58)
      .from(ux.$$(".man-win__label, .man-win__grid li, .man-win__foot", root), { y: 40, autoAlpha: 0, stagger: .04, duration: .25 }, .6);
  });

  /* ---------- B–F · misma idea (el titular se aparta y se abre una escena con los 4 pilares) ---------- */
  // Montaje común: fija la sección, ejecuta la apertura propia (open) y al final muestra los pilares.
  const opener = (v, open) => register("manifesto", v, (root, ux) => {
    if (ux.reduce || !isDesk()) { root.classList.add("man-op--static"); return () => root.classList.remove("man-op--static"); }
    const [l, r] = ux.$$(".man-op__half", root), over = ux.$(".man-op__over", root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .7 } });
    open(tl, root, ux, l, r);
    tl.to(ux.$$(".man-op__shade", root), { opacity: 1, duration: .25 }, .5)
      .to(over, { autoAlpha: 1, duration: .2 }, .58)
      .from(ux.$$(".man-op__label, .man-op__grid li, .man-op__foot", root), { y: 40, autoAlpha: 0, stagger: .04, duration: .25 }, .6);
  });
  const img = (root, ux) => ux.$(".man-op__window img", root);

  /* B · Diafragma: las dos líneas se acercan a cámara y se desvanecen; el círculo se abre */
  opener("B", (tl, root, ux, l, r) => {
    tl.to([l, r], { scale: 2.6, autoAlpha: 0, ease: "power2.in", duration: .45, stagger: .03 }, .04)
      .to(ux.$(".man-op__window", root), { clipPath: "circle(75% at 50% 50%)", ease: "power2.inOut", duration: .6 }, 0)
      .to(img(root, ux), { scale: 1, ease: "none", duration: .8 }, 0);
  });

  /* C · Rendija: la línea de foto se ensancha y empuja el titular a los lados */
  opener("C", (tl, root, ux, l, r) => {
    tl.to(l, { xPercent: -130, autoAlpha: 0, ease: "power2.in", duration: .5 }, .06)
      .to(r, { xPercent: 130, autoAlpha: 0, ease: "power2.in", duration: .5 }, .06)
      .to(ux.$(".man-op__window", root), { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power3.inOut", duration: .6 }, 0)
      .to(img(root, ux), { scale: 1, ease: "none", duration: .8 }, 0);
  });

  /* D · Recorte de papel: la pieza se suelta por una esquina y cae; el hueco crece */
  opener("D", (tl, root, ux, l, r) => {
    const piece = ux.$(".man-op__piece", root);
    tl.to(piece, { rotate: 14, boxShadow: "0 30px 60px rgba(16,16,29,.25)", ease: "power1.inOut", duration: .12 }, 0)
      .to(piece, { rotate: 38, y: "75vh", x: "8vw", ease: "power2.in", duration: .3 }, .12)
      .to(l, { yPercent: -160, autoAlpha: 0, ease: "power2.in", duration: .45 }, .2)
      .to(r, { yPercent: 160, autoAlpha: 0, ease: "power2.in", duration: .45 }, .2)
      .to(ux.$(".man-op__window", root), { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: .45 }, .24)
      .to(img(root, ux), { scale: 1, ease: "none", duration: .7 }, .1);
  });

  /* E · Cuatro ventanas: cada columna se estira hasta tocarse y forman una sola foto */
  opener("E", (tl, root, ux, l, r) => {
    const full = ["inset(0% 75% 0% 0% round 0px)", "inset(0% 50% 0% 25% round 0px)", "inset(0% 25% 0% 50% round 0px)", "inset(0% 0% 0% 75% round 0px)"];
    ux.$$(".man-op__col", root).forEach((c, i) => tl.to(c, { clipPath: full[i], ease: "power2.inOut", duration: .5 }, .06 + i * .04));
    tl.to([l, r], { yPercent: -120, autoAlpha: 0, ease: "power2.in", duration: .4, stagger: .04 }, .1);
  });

  /* F · Lámina: la foto impresa se endereza, pierde el margen blanco y ocupa toda la pantalla */
  opener("F", (tl, root, ux, l, r) => {
    tl.to(l, { xPercent: -40, yPercent: -60, autoAlpha: 0, ease: "power2.in", duration: .4 }, .12)
      .to(r, { xPercent: 40, yPercent: 60, autoAlpha: 0, ease: "power2.in", duration: .4 }, .12)
      .to(ux.$(".man-op__window", root), { x: 0, y: 0, rotate: 0, scale: 1, borderWidth: 0, boxShadow: "0 0 0 rgba(16,16,29,0)", ease: "power2.inOut", duration: .6 }, 0);
  });
})();
