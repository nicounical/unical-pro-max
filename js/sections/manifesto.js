/* Manifiesto · 5 versiones */
(() => {
  const { register } = UX;

  /* ---------- A · Palabras que se iluminan ---------- */
  register("manifesto", "A", (root, ux) => {
    const text = ux.$(".man-a__text", root);
    const words = ux.splitWords(text);
    if (ux.reduce) { gsap.set(words, { opacity: 1 }); return; }
    gsap.fromTo(words, { opacity: .14 }, { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 45%", scrub: true } });
    gsap.from(ux.$$(".man-pill", root), { width: 0, duration: 1.1, ease: "expo.out", stagger: .12, scrollTrigger: { trigger: text, start: "top 75%" } });
  });

  /* ---------- B · Marquesina gigante ---------- */
  register("manifesto", "B", (root, ux) => {
    const [t1, t2] = ux.$$(".man-b__track", root);
    if (ux.reduce) return;
    const st = { trigger: root, start: "top bottom", end: "bottom top", scrub: .5 };
    gsap.fromTo(t1, { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: st });
    gsap.fromTo(t2, { xPercent: -40 }, { xPercent: -5, ease: "none", scrollTrigger: { ...st } });
    gsap.from(ux.$$(".man-b__img", root), { scale: 0, rotate: -12, duration: 1.2, stagger: .08, ease: "back.out(1.8)", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- C · Tres frases fijas ---------- */
  register("manifesto", "C", (root, ux) => {
    const ph = ux.$$(".man-c__ph", root), figs = ux.$$(".man-c__fig", root), dots = ux.$$(".man-c__dots i", root);
    const heads = ph.map(p => ux.splitChars(ux.$(".man-c__h", p)));
    let cur = 0;
    const set = i => {
      if (i === cur) return;
      const prev = cur; cur = i;
      dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
      if (ux.reduce) return;
      gsap.to(heads[prev], { yPercent: -110, opacity: 0, duration: .45, stagger: .015, ease: "power3.in", overwrite: true });
      gsap.to(ux.$("p", ph[prev]), { opacity: 0, y: -20, duration: .3, overwrite: true, onComplete: () => ph[prev].classList.remove("is-on") });
      ph[i].classList.add("is-on");
      gsap.fromTo(heads[i], { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, stagger: .025, ease: "expo.out", delay: .25, overwrite: true });
      gsap.fromTo(ux.$("p", ph[i]), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, delay: .5, overwrite: true });
      const dir = i > prev ? 1 : -1;
      figs[i].classList.add("is-on");
      gsap.fromTo(figs[i], { clipPath: dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)", zIndex: 2 }, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.inOut", overwrite: true,
        onComplete: () => { figs.forEach((f, j) => { if (j !== i) f.classList.remove("is-on"); }); gsap.set(figs[i], { zIndex: 1 }); } });
      gsap.fromTo(ux.$("img,video", figs[i]), { scale: 1.3 }, { scale: 1, duration: 1.4, ease: "expo.out" });
    };
    // Estado inicial
    ph.forEach((p, j) => p.classList.toggle("is-on", j === 0));
    figs.forEach((f, j) => { f.classList.toggle("is-on", j === 0); f.style.clipPath = ""; });
    if (ux.reduce) return;
    gsap.set(heads.flat(), { yPercent: 0, opacity: 1 });
    ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom bottom", onUpdate: s => set(Math.min(2, Math.floor(s.progress * 3))) });
    gsap.from(heads[0], { yPercent: 110, opacity: 0, duration: 1, stagger: .03, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
  });

  /* ---------- D · Tres pilares ---------- */
  register("manifesto", "D", (root, ux) => {
    const paths = ux.$$(".man-d__ico path, .man-d__ico circle", root);
    if (ux.reduce) return;
    paths.forEach(p => { p.setAttribute("pathLength", 1); p.style.strokeDasharray = "1 1"; });
    ux.$$(".man-d__col", root).forEach(col => {
      gsap.fromTo(ux.$$("path,circle", col), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: .2, ease: "power2.inOut", scrollTrigger: { trigger: col, start: "top 85%" } });
    });
    const title = ux.$(".man-d__title", root);
    gsap.from(ux.splitWords(title), { yPercent: 80, opacity: 0, duration: 1.1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: title, start: "top 85%" } });
  });

  /* ---------- E · Decodificación ---------- */
  register("manifesto", "E", (root, ux) => {
    const els = ux.$$("[data-scramble]", root);
    const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_*+";
    els.forEach(el => { if (!el.dataset.final) el.dataset.final = el.textContent; el.textContent = el.dataset.final; });
    if (ux.reduce) return;
    const scramble = (el, delay) => {
      const fin = el.dataset.final, o = { p: 0 };
      el.style.minHeight = el.offsetHeight + "px";
      gsap.to(o, { p: 1, duration: Math.min(2.2, .6 + fin.length * .012), delay, ease: "power1.inOut",
        onStart: () => (el.style.opacity = 1),
        onUpdate: () => {
          const n = Math.floor(o.p * fin.length);
          let s = fin.slice(0, n);
          for (let i = n; i < Math.min(fin.length, n + 14); i++) s += fin[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          el.textContent = s;
        },
        onComplete: () => { el.textContent = fin; el.style.minHeight = ""; } });
    };
    gsap.set(els, { opacity: 0 });
    ScrollTrigger.create({ trigger: root, start: "top 70%", once: true, onEnter: () => els.forEach((el, i) => scramble(el, i * .25)) });
    gsap.from(ux.$(".man-e__vid", root), { clipPath: "inset(0 0 100% 0 round 20px)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: root, start: "top 70%" } });
  });
})();
