/* Por qué Unical · A (favorita fija «Ventana que se abre») + B–E mejoras de la A · Ronda 5 sistema sx */
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




  /* =====================================================================
     Ronda 5 «Coherencia» · B–E: mejoras de la A. Un único efecto de scroll suave por versión
     (scrub corto mientras la foto cruza la pantalla, sin pin). Estado natural = abierto,
     así que con reduced-motion o sin JS todo se lee completo.
     ===================================================================== */
  const ioEase = p => p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2; // power1.inOut, sin depender de gsap al cargar
  const opening = (root, ux, frame) => {
    if (ux.reduce) return;
    const fig = ux.$(".man-o__fig", root), img = ux.$(".man-o__fig > img", root);
    const [t1, h2] = ux.$$(".man-o__h", root), h1 = [ux.$(".sx-kicker", root), t1]; // el kicker viaja con la primera mitad
    const st = { p: 0 };
    const draw = () => {
      const e = ioEase(st.p), w = fig.offsetWidth, h = fig.offsetHeight;
      frame({ e, w, h, fig, h1, h2 });
      img.style.transform = `scale(${(1.12 - .12 * e).toFixed(4)})`;
    };
    gsap.to(st, { p: 1, ease: "none", onUpdate: draw, scrollTrigger: { trigger: fig, start: "top 95%", end: "center 45%", scrub: .8, onRefresh: draw } });
    draw();
    return () => {
      [fig, img, ...h1, h2, ...ux.$$(".man-d__door", root)].forEach(el => { el.style.clipPath = ""; el.style.transform = ""; });
    };
  };
  const ty = (el, y) => [].concat(el).forEach(n => { n.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`; });

  /* ---------- B · Ventana central: un rectángulo crece desde el centro y empuja las dos mitades ---------- */
  register("manifesto", "B", (root, ux) => opening(root, ux, ({ e, w, h, fig, h1, h2 }) => {
    const t = h * .36 * (1 - e), l = w * .38 * (1 - e);
    fig.style.clipPath = `inset(${t.toFixed(1)}px ${l.toFixed(1)}px ${t.toFixed(1)}px ${l.toFixed(1)}px round 10px)`;
    ty(h1, t); ty(h2, -t);
  }));

  /* ---------- C · Cortina lateral: corre de izquierda a derecha y trae consigo la segunda mitad ---------- */
  register("manifesto", "C", (root, ux) => opening(root, ux, ({ e, w, fig, h2 }) => {
    const r = .7 * (1 - e);
    fig.style.clipPath = `inset(0px ${(r * 100).toFixed(2)}% 0px 0px round 10px)`;
    h2.style.transform = `translate3d(${(-r * w * .3).toFixed(1)}px,0,0)`;
  }));

  /* ---------- D · Dos hojas: las hojas se separan como una puerta; el titular se abre con ellas ---------- */
  register("manifesto", "D", (root, ux) => opening(root, ux, ({ e, h1, h2 }) => {
    const [l, r] = ux.$$(".man-d__door", root);
    l.style.transform = `translate3d(${(-101 * e).toFixed(2)}%,0,0)`;
    r.style.transform = `translate3d(${(101 * e).toFixed(2)}%,0,0)`;
    const y = 14 * (1 - e);
    ty(h1, y); ty(h2, -y);
  }));

  /* ---------- E · Máscara redonda: un círculo se expande desde el centro hasta llenar el marco ---------- */
  register("manifesto", "E", (root, ux) => opening(root, ux, ({ e, w, h, fig, h1, h2 }) => {
    const R = 13 + e * 64, ref = Math.hypot(w, h) / Math.SQRT2, t = Math.max(0, h / 2 - R / 100 * ref);
    fig.style.clipPath = `circle(${R.toFixed(2)}% at 50% 50%)`;
    ty(h1, t); ty(h2, -t);
  }));
})();
