/* Portada · A y B (favoritas fijas) + C–G (ronda «Selección 3») */
(() => {
  const { register } = UX;

  /* ---------- A · Lexus en letras (favorita fija) ---------- */
  register("hero", "A", (root, ux) => {
    const layers = ux.$$(".hero-a__knock, .hero-a__stroke", root), stroke = ux.$(".hero-a__stroke", root);
    const words = ux.$$(".hero-a__word", root), img = ux.$(".hero-a__img", root);
    const copy = ux.$$(".hero-a__kicker, .hero-a__h1, .hero-a__ctas", root);
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
      const mx = gsap.quickTo(ux.$(".hero-a__media", root), "x", { duration: 1.2, ease: "power3" });
      const my = gsap.quickTo(ux.$(".hero-a__media", root), "y", { duration: 1.2, ease: "power3" });
      const move = e => { mx((e.clientX / innerWidth - .5) * -26); my((e.clientY / innerHeight - .5) * -18); };
      addEventListener("pointermove", move, { passive: true });
      off = () => removeEventListener("pointermove", move);
    }
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6 } })
      .to(layers, { scale: 28, ease: "power2.in", duration: 1 }, 0)
      .to(stroke, { autoAlpha: 0, duration: .2 }, .25)
      .to(layers, { autoAlpha: 0, duration: .15 }, .85)
      .to(ux.$(".hero-a__hint", root), { autoAlpha: 0, duration: .2 }, 0)
      .to(copy, { y: -20, ease: "none", duration: 1 }, 0);
    return () => { off && off(); breathe.kill(); };
  });


  /* Bucle rAF que solo corre mientras la portada está en pantalla */
  const visibleLoop = (root, frame) => {
    let raf = 0, on = false;
    const tick = t => { frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  };
  const fitCanvas = (cv, dprMax = 2) => {
    const d = Math.min(devicePixelRatio || 1, dprMax), r = cv.getBoundingClientRect();
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    return { w: r.width, h: r.height, d };
  };
  const introIn = (ux, els) => {
    if (ux.reduce) return;
    gsap.set(els, { autoAlpha: 0, y: 34 });
    ux.onIntro(() => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .08, ease: "expo.out", delay: .2 }));
  };

  /* ---------- B · HUD escáner ---------- */
  register("hero", "B", (root, ux) => {
    const vids = ux.$$("video", root), pct = ux.$(".hero-hud__pct", root);
    const offs = [];
    vids.forEach(v => { v.preload = "auto"; v.muted = true; });
    const play = () => { vids[0].currentTime = vids[1].currentTime = 0; vids.forEach(v => v.play().catch(() => {})); };
    // Mantiene los dos vídeos alineados
    const sync = setInterval(() => { if (Math.abs(vids[0].currentTime - vids[1].currentTime) > .12) vids[1].currentTime = vids[0].currentTime; }, 1000);
    offs.push(() => { clearInterval(sync); vids.forEach(v => v.pause()); });
    introIn(ux, ux.$$(".hero-hud__kicker, .hero-hud__h1, .hero-hud__sub, .hero-hud .hero-ctas, .hero-hud__data", root));
    if (ux.reduce) { root.style.setProperty("--scan", "100%"); pct.textContent = "100%"; play(); return () => offs.forEach(f => f()); }
    const s = { scan: 0, l: 0 };
    const paint = () => { root.style.setProperty("--scan", s.scan + "%"); root.style.setProperty("--l", s.l + "%"); pct.textContent = String(Math.round(s.scan)).padStart(3, "0") + "%"; };
    paint();
    ux.onIntro(() => {
      play();
      gsap.timeline({ onUpdate: paint })
        .to(s, { scan: 100, l: 100, duration: 3.2, ease: "power2.inOut", delay: .3 })
        .to(s, { l: 0, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true, onUpdate: paint });
    });
    // Retícula que sigue al ratón (o patrulla sola en táctil)
    const rt = { x: 62, y: 46 };
    const rp = () => { root.style.setProperty("--rx", rt.x + "%"); root.style.setProperty("--ry", rt.y + "%"); };
    if (ux.fine) {
      const xt = gsap.quickTo(rt, "x", { duration: .9, ease: "power3", onUpdate: rp }), yt = gsap.quickTo(rt, "y", { duration: .9, ease: "power3", onUpdate: rp });
      const mv = e => { const r = root.getBoundingClientRect(); xt((e.clientX - r.left) / r.width * 100); yt((e.clientY - r.top) / r.height * 100); };
      root.addEventListener("pointermove", mv); offs.push(() => root.removeEventListener("pointermove", mv));
    } else {
      gsap.to(rt, { keyframes: [{ x: 30, y: 38 }, { x: 70, y: 30 }, { x: 55, y: 50 }, { x: 62, y: 40 }], duration: 12, repeat: -1, ease: "sine.inOut", onUpdate: rp });
    }
    gsap.to(ux.$(".hero-hud__copy", root), { yPercent: -18, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(ux.$(".hero-hud__media", root), { scale: 1.12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });


  /* =====================================================================
     Ronda «Selección 3» · C–G
     ===================================================================== */
  // Vídeos de una versión: arrancan juntos, siguen sincronizados y se pausan fuera de pantalla
  const heroVideos = (root, ux) => {
    const vids = ux.$$("video", root);
    vids.forEach(v => { v.preload = "auto"; v.muted = true; });
    const play = (restart) => vids.forEach(v => { if (restart) v.currentTime = 0; v.play().catch(() => {}); });
    const sync = vids.length > 1 ? setInterval(() => vids.slice(1).forEach(v => { if (Math.abs(v.currentTime - vids[0].currentTime) > .12) v.currentTime = vids[0].currentTime; }), 1000) : 0;
    const io = new IntersectionObserver(([e]) => e.isIntersecting ? play() : vids.forEach(v => v.pause()));
    io.observe(root);
    return { vids, play, stop() { clearInterval(sync); io.disconnect(); vids.forEach(v => v.pause()); } };
  };

  /* ---------- C · Titular en papel ---------- */
  register("hero", "C", (root, ux) => {
    const V = heroVideos(root, ux);
    const word = ux.$(".hero-pap__word", root), sheet = ux.$(".hero-pap__sheet", root);
    const copy = ux.$$(".hero-pap__copy > *, .hero-pap__top", root);
    if (ux.reduce) { V.play(true); return () => V.stop(); }
    gsap.set(word, { yPercent: 18, autoAlpha: 0, scale: 1.06 });
    gsap.set(copy, { y: 26, autoAlpha: 0 });
    ux.onIntro(() => {
      V.play(true);
      gsap.timeline()
        .to(word, { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" }, .1)
        .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, .5);
    });
    // Con el scroll el papel se disuelve y el vídeo pasa de estar dentro de las letras a llenar la pantalla
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6 } })
      .to(word, { scale: 1.18, ease: "none", duration: 1 }, 0)
      .to(sheet, { backgroundColor: "#000000", ease: "power1.in", duration: .7 }, .25)
      .to(ux.$(".hero-pap__top", root), { autoAlpha: 0, duration: .2 }, .2);
    return () => V.stop();
  });

  /* ---------- D · Marquesina en vídeo ---------- */
  register("hero", "D", (root, ux) => {
    const V = heroVideos(root, ux);
    const tracks = ux.$$(".hero-mq__track", root), rows = ux.$$(".hero-mq__row", root);
    const copy = ux.$$(".hero-mq__copy > *", root);
    if (ux.reduce) { V.play(true); return () => V.stop(); }
    const loops = [
      gsap.fromTo(tracks[0], { xPercent: 0 }, { xPercent: -50, duration: 26, ease: "none", repeat: -1 }),
      gsap.fromTo(tracks[1], { xPercent: -50 }, { xPercent: 0, duration: 30, ease: "none", repeat: -1 })
    ];
    gsap.set(rows, { yPercent: 100, autoAlpha: 0 });
    gsap.set(copy, { y: 26, autoAlpha: 0 });
    ux.onIntro(() => {
      V.play(true);
      gsap.timeline()
        .to(rows, { yPercent: 0, autoAlpha: 1, duration: 1.4, stagger: .12, ease: "expo.out" }, .1)
        .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, .5);
    });
    // La velocidad del scroll acelera las cintas
    const boost = { v: 1 };
    ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom top", onUpdate: s => {
      gsap.to(boost, { v: 1 + Math.min(Math.abs(s.getVelocity()) / 250, 6), duration: .2, overwrite: true, onUpdate: () => loops.forEach(l => l.timeScale(boost.v)) });
      gsap.to(boost, { v: 1, duration: 1.2, delay: .2, ease: "power2.out", onUpdate: () => loops.forEach(l => l.timeScale(boost.v)) });
    } });
    gsap.to(ux.$(".hero-mq__media", root), { yPercent: 10, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => { V.stop(); loops.forEach(l => l.kill()); };
  });

  /* ---------- E · Antes / después ---------- */
  register("hero", "E", (root, ux) => {
    const V = heroVideos(root, ux);
    const range = ux.$(".hero-ba__range", root), copy = ux.$$(".hero-ba__copy > *, .hero-ba__tag", root);
    const s = { x: 50 };
    const paint = () => { root.style.setProperty("--x", s.x + "%"); range.value = Math.round(s.x); };
    let sway;
    const stopSway = () => { sway && sway.kill(); sway = null; };
    const onInput = () => { stopSway(); s.x = +range.value; paint(); };
    range.addEventListener("input", onInput);
    range.addEventListener("pointerdown", stopSway);
    const off = () => { range.removeEventListener("input", onInput); range.removeEventListener("pointerdown", stopSway); };
    if (ux.reduce) { paint(); V.play(true); return () => { off(); V.stop(); }; }
    s.x = 100; paint();
    gsap.set(copy, { y: 26, autoAlpha: 0 });
    ux.onIntro(() => {
      V.play(true);
      // El vinilo «se aplica» de derecha a izquierda y luego el tirador se mece hasta que el usuario lo toca
      gsap.timeline({ onUpdate: paint })
        .to(s, { x: 48, duration: 2.2, ease: "power3.inOut", delay: .3, onUpdate: paint })
        .add(() => { sway = gsap.to(s, { x: 58, duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true, onUpdate: paint }); });
      gsap.to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out", delay: .6 });
    });
    return () => { off(); stopSway(); V.stop(); };
  });

  /* ---------- F · Foco de luz ---------- */
  register("hero", "F", (root, ux) => {
    const V = heroVideos(root, ux);
    const copy = ux.$$(".hero-spot__copy > *, .hero-spot__cap", root);
    const s = { x: 62, y: 44, r: 0, grow: 0 };
    const base = () => Math.max(170, Math.min(innerWidth, innerHeight) * .34);
    const paint = () => {
      root.style.setProperty("--sx", s.x + "%"); root.style.setProperty("--sy", s.y + "%");
      root.style.setProperty("--r", (s.r * base() + s.grow * Math.hypot(innerWidth, innerHeight) * 1.2) + "px");
    };
    if (ux.reduce) { s.r = 1; s.grow = 1; paint(); V.play(true); return () => V.stop(); }
    paint();
    gsap.set(copy, { y: 26, autoAlpha: 0 });
    const offs = [];
    ux.onIntro(() => {
      V.play(true);
      gsap.to(s, { r: 1, duration: 2.2, ease: "expo.out", delay: .2, onUpdate: paint });
      gsap.to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out", delay: .5 });
    });
    if (ux.fine) {
      const xt = gsap.quickTo(s, "x", { duration: 1.1, ease: "power3", onUpdate: paint }), yt = gsap.quickTo(s, "y", { duration: 1.1, ease: "power3", onUpdate: paint });
      const mv = e => { xt(e.clientX / innerWidth * 100); yt(e.clientY / innerHeight * 100); };
      addEventListener("pointermove", mv, { passive: true }); offs.push(() => removeEventListener("pointermove", mv));
    } else {
      gsap.to(s, { keyframes: [{ x: 40, y: 40 }, { x: 70, y: 34 }, { x: 58, y: 50 }, { x: 62, y: 44 }], duration: 14, repeat: -1, ease: "sine.inOut", onUpdate: paint });
    }
    addEventListener("resize", paint); offs.push(() => removeEventListener("resize", paint));
    // Al bajar, el foco se abre hasta iluminar todo el coche
    gsap.to(s, { grow: 1, ease: "power2.in", onUpdate: paint, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .5 } });
    return () => { offs.forEach(f => f()); V.stop(); };
  });

  /* ---------- G · Tríptico ---------- */
  register("hero", "G", (root, ux) => {
    const V = heroVideos(root, ux);
    const panels = ux.$$(".hero-tri__p", root), copy = ux.$$(".hero-tri__head > *, .hero-tri__foot > *", root);
    if (ux.reduce) { V.play(true); return () => V.stop(); }
    gsap.set(panels, { yPercent: 108, rotation: i => [-2.5, 1.5, -1.2][i], transformOrigin: "50% 0%" });
    gsap.set(copy, { y: 26, autoAlpha: 0 });
    ux.onIntro(() => {
      V.play(true);
      // Los paneles «se cuelgan» uno a uno y encajan formando la imagen completa
      gsap.timeline()
        .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, 0)
        .to(panels, { yPercent: 0, duration: 1.3, stagger: .14, ease: "expo.out" }, .2)
        .to(panels, { rotation: 0, duration: 1.1, stagger: .14, ease: "elastic.out(1,.55)" }, .9);
    });
    panels.forEach((p, i) => gsap.to(p, { y: [-30, 30, -70][i], ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } }));
    return () => V.stop();
  });
})();
