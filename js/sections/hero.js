/* Portada · 5 versiones */
(() => {
  const { register } = UX;

  /* ---------- A · Cinemático ---------- */
  register("hero", "A", (root, ux) => {
    const chars = ux.$$(".hero-a__split", root).flatMap(ux.splitChars);
    const ui = ux.$$(".hero-a__kicker, .hero-a__lead, .hero-round, .hero-a__ticker", root);
    if (ux.reduce) { gsap.set(ux.$(".hero-a__video", root), { scale: 1 }); return; }
    gsap.set(chars, { yPercent: 115 });
    gsap.set(ui, { autoAlpha: 0, y: 24 });
    const intro = gsap.timeline({ paused: true })
      .to(ux.$(".hero-a__video", root), { scale: 1, duration: 2.2, ease: "expo.out" })
      .to(chars, { yPercent: 0, duration: 1.2, stagger: .025, ease: "expo.out" }, "<.1")
      .to(ui, { autoAlpha: 1, y: 0, duration: 1, stagger: .08, ease: "expo.out" }, "<.5");
    ux.onIntro(() => intro.play());
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } })
      .to(ux.$(".hero-a__media", root), { clipPath: "inset(6% 5% 18% 5% round 28px)", ease: "none" }, 0)
      .to(ux.$(".hero-a__video", root), { yPercent: 12, ease: "none" }, 0)
      .to(ux.$(".hero-a__title", root), { yPercent: -35, ease: "none" }, 0)
      .to(ux.$$(".hero-a__foot, .hero-a__kicker", root), { autoAlpha: 0, y: -40, ease: "none" }, 0);
  });

  /* ---------- B · Vídeo en letras ---------- */
  register("hero", "B", (root, ux) => {
    const layers = ux.$$(".hero-b__knock, .hero-b__stroke", root), stroke = ux.$(".hero-b__stroke", root);
    const words = ux.$$(".hero-b__word", root), img = ux.$(".hero-b__img", root);
    const copy = ux.$$(".hero-b__kicker, .hero-b__h1, .hero-b__ctas", root);
    if (ux.reduce) return;
    gsap.set(words, { yPercent: 40, autoAlpha: 0 });
    gsap.set(copy, { y: 30, autoAlpha: 0 });
    // Vídeo del Lexus: arranca desde el principio al terminar la precarga, con un zoom de entrada
    gsap.set(img, { scale: 1.18 });
    const breathe = { kill() {} };
    const intro = gsap.timeline({ paused: true })
      .add(() => { img.currentTime = 0; img.play().catch(() => {}); })
      .to(img, { scale: 1.04, duration: 2.6, ease: "expo.out" }, 0)
      .to(words, { yPercent: 0, autoAlpha: 1, duration: 1.4, stagger: .06, ease: "expo.out" }, .1)
      .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, .6);
    ux.onIntro(() => intro.play());
    // Parallax suave con el ratón
    let off;
    if (ux.fine) {
      const mx = gsap.quickTo(ux.$(".hero-b__media", root), "x", { duration: 1.2, ease: "power3" });
      const my = gsap.quickTo(ux.$(".hero-b__media", root), "y", { duration: 1.2, ease: "power3" });
      const move = e => { mx((e.clientX / innerWidth - .5) * -26); my((e.clientY / innerHeight - .5) * -18); };
      addEventListener("pointermove", move, { passive: true });
      off = () => removeEventListener("pointermove", move);
    }
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6 } })
      .to(layers, { scale: 28, ease: "power2.in", duration: 1 }, 0)
      .to(stroke, { autoAlpha: 0, duration: .2 }, .25)
      .to(layers, { autoAlpha: 0, duration: .15 }, .85)
      .to(ux.$(".hero-b__hint", root), { autoAlpha: 0, duration: .2 }, 0)
      .to(copy, { y: -20, ease: "none", duration: 1 }, 0);
    return () => { off && off(); breathe.kill(); };
  });

  /* ---------- C · Mosaico ---------- */
  register("hero", "C", (root, ux) => {
    const lines = ux.$$(".hero-c__title .line > span", root);
    const rest = ux.$$(".hero-c__copy .label, .hero-c__lead, .hero-c__ctas, .hero-c__stats", root);
    const cols = ux.$$(".hero-c__col", root);
    if (ux.reduce) return;
    gsap.set(lines, { yPercent: 110 });
    gsap.set(rest, { autoAlpha: 0, y: 24 });
    gsap.set(cols, { yPercent: (i) => [30, -30, 40][i], autoAlpha: 0 });
    const intro = gsap.timeline({ paused: true })
      .to(cols, { yPercent: 0, autoAlpha: 1, duration: 1.6, stagger: .1, ease: "expo.out" })
      .to(lines, { yPercent: 0, duration: 1.1, stagger: .1, ease: "expo.out" }, "<.15")
      .to(rest, { autoAlpha: 1, y: 0, duration: .9, stagger: .07, ease: "expo.out" }, "<.4");
    ux.onIntro(() => intro.play());
    cols.forEach(c => gsap.to(c, { yPercent: +c.dataset.speed * 40, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } }));
  });

  /* ---------- D · Lente ---------- */
  register("hero", "D", (root, ux) => {
    const base = ux.$(".hero-d__base", root), color = ux.$(".hero-d__color", root), lens = ux.$(".hero-d__lens", root);
    const rotIn = ux.$(".hero-d__rot-in", root);
    const parts = ux.$$(".hero-d__kicker, .hero-d__title, .hero-d__foot", root);
    const offs = [];
    const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };
    // Vídeo a color sincronizado con el de fondo
    const sync = () => { if (Math.abs(color.currentTime - base.currentTime) > .2) color.currentTime = base.currentTime; };
    on(base, "play", () => { color.preload = "auto"; color.currentTime = base.currentTime; color.play().catch(() => {}); });
    on(base, "pause", () => color.pause());
    const syncT = setInterval(sync, 1500);
    offs.push(() => { clearInterval(syncT); color.pause(); });
    if (ux.reduce) { lens.style.setProperty("--r", "0px"); return () => offs.forEach(f => f()); }

    // Palabra rotatoria
    const n = rotIn.children.length - 1;
    const rot = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= n; i++) rot.to(rotIn, { yPercent: -100 * i / (n + 1), duration: .8, ease: "expo.inOut" }, i * 2);
    rot.set(rotIn, { yPercent: 0 });

    gsap.set(parts, { autoAlpha: 0, y: 30 });
    const intro = gsap.timeline({ paused: true }).to(parts, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .1, ease: "expo.out" });
    ux.onIntro(() => intro.play());

    // Lente que sigue al cursor (o se mueve sola en táctil)
    const st = { x: innerWidth * .68, y: innerHeight * .42, r: 0 };
    const paint = () => { lens.style.setProperty("--x", st.x + "px"); lens.style.setProperty("--y", st.y + "px"); lens.style.setProperty("--r", st.r + "px"); };
    const xTo = gsap.quickTo(st, "x", { duration: .6, ease: "power3", onUpdate: paint });
    const yTo = gsap.quickTo(st, "y", { duration: .6, ease: "power3", onUpdate: paint });
    const radius = () => Math.max(110, Math.min(innerWidth * .15, 230));
    if (ux.fine) {
      on(root, "pointermove", e => { const r = root.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top); });
      on(root, "pointerenter", () => gsap.to(st, { r: radius(), duration: .7, ease: "expo.out", onUpdate: paint }));
      on(root, "pointerleave", () => gsap.to(st, { r: 0, duration: .5, ease: "power2.in", onUpdate: paint }));
    } else {
      gsap.to(st, { r: radius(), duration: 1, delay: 1, onUpdate: paint });
      const w = { t: 0 };
      gsap.to(w, { t: Math.PI * 2, duration: 14, repeat: -1, ease: "none", onUpdate: () => { const r = root.getBoundingClientRect(); st.x = r.width * (.5 + .28 * Math.sin(w.t)); st.y = r.height * (.38 + .14 * Math.sin(w.t * 2)); paint(); } });
    }
    paint();
    gsap.to(ux.$(".hero-d__content", root), { yPercent: -20, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });

  /* ---------- E · Carrusel ---------- */
  register("hero", "E", (root, ux) => {
    const slides = ux.$$(".hero-e__slide", root), count = ux.$(".hero-e__count b", root), bar = ux.$(".hero-e__prog i", root);
    const DUR = 6, ac = new AbortController();
    let cur = 0, busy = false, visible = true;
    slides.forEach((s, i) => { s.classList.toggle("is-on", i === 0); s.classList.remove("is-in"); s.style.clipPath = ""; });
    count.textContent = "01";
    const playMedia = (s, on) => { const v = ux.$("video", s); if (!v) return; if (on) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); };
    playMedia(slides[0], true);
    const progress = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DUR, ease: "none", paused: ux.reduce, onComplete: () => go(1) });
    function go(dir) {
      if (busy) return; busy = true;
      const prev = slides[cur]; cur = (cur + dir + slides.length) % slides.length; const next = slides[cur];
      count.textContent = String(cur + 1).padStart(2, "0");
      next.classList.add("is-in"); playMedia(next, true);
      const from = dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
      const cap = ux.$$("figcaption > *", next);
      const tl = gsap.timeline({ onComplete: () => { prev.classList.remove("is-on"); playMedia(prev, false); next.classList.add("is-on"); next.classList.remove("is-in"); busy = false; if (!ux.reduce && visible) progress.restart(); } });
      if (ux.reduce) { tl.set(next, { clipPath: "inset(0 0 0 0)" }); return; }
      tl.fromTo(next, { clipPath: from }, { clipPath: "inset(0 0 0 0)", duration: 1.15, ease: "expo.inOut" })
        .fromTo(ux.$(":scope > img, :scope > video", next), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0)
        .to(ux.$(":scope > img, :scope > video", prev), { scale: 1.08, xPercent: -6 * dir, duration: 1.15, ease: "expo.inOut" }, 0)
        .fromTo(cap, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, .55)
        .set(ux.$(":scope > img, :scope > video", prev), { scale: 1, xPercent: 0 });
    }
    ux.$$(".hero-e__arrow", root).forEach(b => b.addEventListener("click", () => { progress.pause(); go(+b.dataset.dir); }, { signal: ac.signal }));
    if (!ux.reduce) {
      const first = ux.$$("figcaption > *", slides[0]);
      gsap.set(first, { y: 60, autoAlpha: 0 });
      ux.onIntro(() => gsap.to(first, { y: 0, autoAlpha: 1, duration: 1.1, stagger: .1, ease: "expo.out" }));
      ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onToggle: s => { visible = s.isActive; if (s.isActive) progress.resume(); else progress.pause(); } });
      gsap.to(ux.$(".hero-e__slides", root), { yPercent: 18, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }
    return () => { ac.abort(); progress.kill(); slides.forEach(s => playMedia(s, false)); };
  });
})();
