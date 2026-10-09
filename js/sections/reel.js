/* 03 · Showreel — 5 versiones */
(() => {
  const { register } = UX;

  /* A · Expansión con scroll (adaptado de «Scroll media expansion hero», 21st.dev) */
  register("reel", "A", (root, ux) => {
    const frame = ux.$(".reel-a__frame", root);
    if (ux.reduce) return;
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .8, invalidateOnRefresh: true } })
      .fromTo(frame, { width: () => Math.min(300, innerWidth * .6), height: () => Math.min(400, innerHeight * .55), borderRadius: 20 },
        { width: () => innerWidth, height: () => innerHeight, borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
      .to(ux.$(".reel-a__w--l", root), { xPercent: -140, ease: "power2.in", duration: .8 }, 0)
      .to(ux.$(".reel-a__w--r", root), { xPercent: 140, ease: "power2.in", duration: .8 }, 0)
      .to(ux.$(".reel-a__hl", root), { x: () => -innerWidth * .5, autoAlpha: 0, duration: .6 }, 0)
      .to(ux.$(".reel-a__hr", root), { x: () => innerWidth * .5, autoAlpha: 0, duration: .6 }, 0)
      .to(ux.$(".reel-a__bg", root), { autoAlpha: 0, duration: .8 }, 0)
      .to(ux.$(".reel-a__veil", root), { opacity: 0, duration: .6 }, .4)
      .to({}, { duration: .35 });
  });

  /* B · Monitor en perspectiva que se endereza */
  register("reel", "B", (root, ux) => {
    const tv = ux.$(".reel-b__tv", root);
    if (ux.reduce) { gsap.set(tv, { rotateX: 0, scale: 1 }); return; }
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .8 } })
      .fromTo(tv, { rotateX: 38, scale: .82, y: 40 }, { rotateX: 0, scale: 1, y: 0, ease: "power2.out", duration: 1 }, 0)
      .fromTo(ux.$(".reel-b__head", root), { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: "power1.in", duration: .7 }, .2)
      .fromTo(ux.$(".reel-b__glare", root), { xPercent: -30 }, { xPercent: 30, ease: "none", duration: 1 }, 0)
      .fromTo(ux.$(".reel-b__floor", root), { opacity: .2 }, { opacity: 1, duration: 1 }, 0)
      .to({}, { duration: .3 });
    // Inclinación sutil con el ratón
    if (!ux.fine) return;
    const rx = gsap.quickTo(ux.$(".reel-b__screen", root), "rotateY", { duration: .8, ease: "power3" });
    const onMove = e => rx(((e.clientX / innerWidth) - .5) * 6);
    addEventListener("pointermove", onMove);
    return () => removeEventListener("pointermove", onMove);
  });

  /* C · Cinemascope: las barras se abren y pasan los créditos */
  register("reel", "C", (root, ux) => {
    const credits = ux.$$(".reel-c__credits p", root);
    const bars = ux.$$(".reel-c__bar", root);
    if (ux.reduce) { gsap.set(credits[0], { opacity: 1 }); return; }
    // Banda final: 2.39:1 en escritorio, más alta en móvil
    const ratio = () => (innerWidth < 700 ? 1.2 : 2.39);
    const finalScale = () => Math.max(0, (innerHeight - innerWidth / ratio()) / 2) / (innerHeight / 2);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
    tl.fromTo(bars, { scaleY: .86 }, { scaleY: () => finalScale(), ease: "power3.inOut", duration: 1 }, 0)
      .fromTo(ux.$(".reel-c__screen video", root), { scale: 1.25 }, { scale: 1, ease: "none", duration: 1 + credits.length * .5 }, 0)
      .fromTo(ux.$(".reel-c__top", root), { y: 30 }, { y: 0, duration: .8 }, 0);
    credits.forEach((c, i) => {
      const at = 1 + i * .5;
      tl.fromTo(c, { opacity: 0, y: 24, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .2 }, at)
        .to(c, { opacity: 0, y: -24, filter: "blur(8px)", duration: .2 }, at + .32);
    });
    tl.to({}, { duration: .2 });
  });

  /* D · Puzzle: 9 piezas desordenadas que se recomponen */
  register("reel", "D", (root, ux) => {
    const cells = ux.$$(".reel-d__cell", root), grid = ux.$(".reel-d__grid", root);
    const video = ux.$(".reel-d__video", root), play = ux.$(".reel-play", root);
    if (ux.reduce) { gsap.set(video, { opacity: 1 }); gsap.set(play, { opacity: 1 }); return; }
    const rnd = gsap.utils.random;
    const seeds = cells.map((c, i) => ({ x: rnd(-260, 260) + (i % 3 - 1) * 80, y: rnd(-160, 160) + (Math.floor(i / 3) - 1) * 50, r: rnd(-24, 24), s: rnd(.7, .95) }));
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .8 } })
      .fromTo(cells, { x: i => seeds[i].x, y: i => seeds[i].y, rotate: i => seeds[i].r, scale: i => seeds[i].s },
        { x: 0, y: 0, rotate: 0, scale: 1, ease: "power3.out", duration: 1, stagger: { each: .04, from: "random" } }, 0)
      .fromTo(grid, { "--gap": "14px", "--rad": "12px" }, { "--gap": "0px", "--rad": "0px", duration: .4 }, .85)
      .to(video, { opacity: 1, duration: .25 }, 1.25)
      .to(play, { opacity: 1, duration: .2 }, 1.3)
      .fromTo(ux.$(".reel-d__head", root), { y: 0 }, { y: -20, duration: 1.5, ease: "none" }, 0)
      .to({}, { duration: .3 });
  });

  /* E · Bola de vídeo que sigue al cursor sobre el titular */
  register("reel", "E", (root, ux) => {
    const stage = ux.$(".reel-e__stage", root), ball = ux.$(".reel-e__ball", root);
    const rows = ux.$$(".reel-e__row", root);
    const onKey = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ux.openReel(); } };
    stage.addEventListener("keydown", onKey);
    if (ux.reduce) return () => stage.removeEventListener("keydown", onKey);
    gsap.fromTo(rows, { xPercent: i => (i % 2 ? 12 : -12) }, { xPercent: i => (i % 2 ? -6 : 6), ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    if (!ux.fine || innerWidth <= 860) return () => stage.removeEventListener("keydown", onKey);
    const r0 = stage.getBoundingClientRect();
    gsap.set(ball, { x: r0.width * .62, y: r0.height * .52, xPercent: -50, yPercent: -50, scale: 1 });
    const xTo = gsap.quickTo(ball, "x", { duration: .7, ease: "power3" }), yTo = gsap.quickTo(ball, "y", { duration: .7, ease: "power3" });
    const sTo = gsap.quickTo(ball, "scale", { duration: .5, ease: "power3" });
    const move = e => { const r = stage.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top); };
    const enter = () => sTo(1.12), leave = () => sTo(1);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerenter", enter);
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("keydown", onKey);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointerleave", leave);
    };
  });
})();
