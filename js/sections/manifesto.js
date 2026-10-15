/* Por qué Unical · A (favorita fija «Ventana que se abre») + B–E mejoras de la A · Ronda 5 sistema sx + F–H misma familia que la A (Ronda 11) */
(() => {
  const { register } = UX;
  const isDesk = () => matchMedia("(min-width: 861px)").matches;

  /* ---------- Familia «ventana» (A, F, G, H): pin a pantalla completa, scrub largo y suave ---------- */
  const winVariant = build => (root, ux) => {
    if (ux.reduce || !isDesk()) { root.classList.add("man-win--static"); return () => root.classList.remove("man-win--static"); }
    const pin = ux.$(".man-win__pin", root), win = ux.$(".man-win__window", root), img = ux.$("img", win);
    const [l, r] = ux.$$(".man-win__half", root), over = ux.$(".man-win__over", root);
    const W = () => pin.clientWidth, H = () => pin.clientHeight;
    const box = (t, rt, b, lt, rad) => `inset(${t}px ${rt}px ${b}px ${lt}px round ${rad}px)`;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1.2, invalidateOnRefresh: true } });
    const undo = build({ root, ux, pin, win, img, l, r, W, H, box, tl });
    // cierre común: oscurecer, aparecer los cuatro pilares
    tl.to(ux.$(".man-win__shade", root), { opacity: 1, ease: "none", duration: .18 }, .64)
      .to(over, { autoAlpha: 1, duration: .12 }, .7)
      .fromTo(ux.$$(".man-win__label, .man-win__grid li, .man-win__foot", root), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power2.out", stagger: .035, duration: .2 }, .72); // fromTo: con invalidateOnRefresh un from() se quedaría en 0
    return undo;
  };
  const halvesOut = (tl, l, r, H, at, dur = .3) => tl
    .to(l, { y: () => -H() * .62, autoAlpha: 0, ease: "power2.in", duration: dur }, at)
    .to(r, { y: () => H() * .62, autoAlpha: 0, ease: "power2.in", duration: dur }, at);

  /* A · Ventana que se abre: el titular se lee entero; entre sus dos líneas se abre una franja
     panorámica con la foto (las líneas van pegadas a sus bordes) y la franja crece a pantalla completa */
  register("manifesto", "A", winVariant(({ win, img, l, r, W, H, box, tl }) => {
    const band = () => Math.min(H() * .22, 230);
    tl.fromTo(win, { clipPath: () => box(H() / 2, W() / 2, H() / 2, W() / 2, 14) },
                   { clipPath: () => box(H() / 2 - band(), W() * .07, H() / 2 - band(), W() * .07, 14), ease: "power3.inOut", duration: .34 }, 0)
      .to(l, { y: () => -band() - 8, ease: "power3.inOut", duration: .34 }, 0)
      .to(r, { y: () => band() + 8, ease: "power3.inOut", duration: .34 }, 0)
      .to(win, { clipPath: () => box(0, 0, 0, 0, 0), ease: "power2.inOut", duration: .3 }, .4)
      .fromTo(img, { scale: 1.28 }, { scale: 1, ease: "none", duration: .75 }, 0);
    halvesOut(tl, l, r, H, .4);
  }));

  /* F · Zoom al titular: la foto rellena las letras; el titular crece hasta que entras en la imagen */
  register("manifesto", "F", winVariant(({ root, ux, win, img, tl }) => {
    const title = ux.$(".man-win__title", root), acc = ux.$(".acc", root);
    const origin = () => { const a = acc.getBoundingClientRect(), t = title.getBoundingClientRect(); return `${a.left - t.left + a.width * .5}px ${a.top - t.top + a.height * .55}px`; };
    gsap.set(title, { transformOrigin: origin() });
    tl.to(title, { scale: 26, ease: "power3.in", duration: .55 }, 0)
      .to(win, { opacity: 1, ease: "none", duration: .12 }, .28)
      .to(title, { autoAlpha: 0, ease: "none", duration: .1 }, .32)
      .fromTo(img, { scale: 1.35 }, { scale: 1, ease: "power1.out", duration: .7 }, .1);
    return () => gsap.set(title, { clearProps: "transform,transformOrigin,opacity,visibility" });
  }));

  /* G · Persiana: siete lamas verticales se abren desde el centro hacia fuera */
  register("manifesto", "G", winVariant(({ pin, img, l, r, H, tl }) => {
    const N = 7, wrap = document.createElement("div"); wrap.className = "man-win__strips"; wrap.setAttribute("aria-hidden", "true");
    const strips = Array.from({ length: N }, (_, i) => {
      const s = document.createElement("div"), im = new Image();
      s.className = "man-win__strip"; s.style.left = `${i * 100 / N}%`; s.style.width = `${100 / N + .08}%`;
      im.src = img.currentSrc || img.src; im.alt = ""; im.style.width = `${N * 100}%`; im.style.left = `${-i * 100}%`;
      s.append(im); wrap.append(s); return s;
    });
    pin.insertBefore(wrap, pin.querySelector(".man-win__window"));
    tl.to(strips, { clipPath: "inset(0% 0 0% 0)", ease: "power3.inOut", duration: .32, stagger: { each: .035, from: "center" } }, 0)
      .fromTo(wrap.querySelectorAll("img"), { scale: 1.2 }, { scale: 1, ease: "none", duration: .75 }, 0)
      .to(l, { y: () => -H() * .2, ease: "power2.inOut", duration: .3 }, 0)
      .to(r, { y: () => H() * .2, ease: "power2.inOut", duration: .3 }, 0);
    halvesOut(tl, l, r, H, .3, .26);
    return () => wrap.remove();
  }));

  /* H · Desde la palabra: la ventana nace exactamente sobre «imposible» y crece hasta llenar la pantalla */
  register("manifesto", "H", winVariant(({ root, ux, pin, win, img, l, r, W, H, box, tl }) => {
    const acc = ux.$(".acc", root);
    const word = () => { // caja de la palabra en el pin, sin el desplazamiento que ya lleve la línea
      const a = acc.getBoundingClientRect(), p = pin.getBoundingClientRect(), dy = gsap.getProperty(l, "y") || 0, pad = 6;
      return box(a.top - p.top - dy - pad, p.right - a.right - pad, p.bottom - a.bottom + dy - pad, a.left - p.left - pad, 12);
    };
    tl.fromTo(win, { clipPath: word, opacity: 0 }, { opacity: 1, ease: "none", duration: .08 }, 0)
      .to(acc, { color: "rgba(0,0,0,0)", ease: "none", duration: .08 }, 0)
      .to(win, { clipPath: () => box(0, 0, 0, 0, 0), ease: "power3.inOut", duration: .5 }, .08)
      .fromTo(img, { scale: 1.5 }, { scale: 1, ease: "power2.out", duration: .7 }, 0);
    halvesOut(tl, l, r, H, .14, .34);
    return () => gsap.set(acc, { clearProps: "color" });
  }));




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
