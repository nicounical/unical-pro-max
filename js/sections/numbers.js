/* 05 · Cifras — 5 versiones */
(() => {
  const { register } = UX;

  /* A · Recorrido horizontal con números gigantes */
  register("numbers", "A", (root, ux) => {
    const track = ux.$(".num-a__track", root), bar = ux.$(".num-a__progress", root);
    if (ux.reduce) return;
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const setH = () => { root.style.height = dist() + innerHeight + "px"; };
    setH();
    ScrollTrigger.addEventListener("refreshInit", setH);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true, onUpdate: s => bar.style.setProperty("--p", s.progress) }
    });
    ux.$$("[data-count]", root).forEach(el => ux.counter(el, { containerAnimation: tween, trigger: el, start: "left 88%" }));
    ux.$$(".num-a__clip", root).forEach(c => gsap.from(c, { yPercent: 18, rotate: 4, ease: "none", scrollTrigger: { trigger: c, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
    return () => { ScrollTrigger.removeEventListener("refreshInit", setH); root.style.height = ""; };
  });

  /* B · Rejilla 2×2 con gráficos que se rellenan */
  register("numbers", "B", (root, ux) => {
    const dots = ux.$(".num-b__dots", root);
    if (!dots.children.length) dots.innerHTML = "<i></i>".repeat(100);
    const bar = ux.$(".num-b__bar", root), plan = ux.$$(".num-b__plan i", root), ring = ux.$(".num-b__ring", root);
    if (ux.reduce) {
      bar.style.setProperty("--p", bar.style.getPropertyValue("--to"));
      ux.$$("i", dots).forEach(d => d.classList.add("on")); ring.style.setProperty("--o", 0); return;
    }
    gsap.fromTo(bar, { "--p": 0 }, { "--p": +bar.style.getPropertyValue("--to"), duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 90%", once: true } });
    ScrollTrigger.create({ trigger: dots, start: "top 90%", once: true, onEnter: () => ux.$$("i", dots).forEach((d, i) => gsap.delayedCall(i * .018, () => d.classList.add("on"))) });
    gsap.from(plan, { scale: 0, duration: .9, stagger: .12, ease: "back.out(1.6)", scrollTrigger: { trigger: plan[0], start: "top 90%", once: true } });
    gsap.fromTo(ring, { "--o": 1 }, { "--o": 0, duration: 2, ease: "power3.out", scrollTrigger: { trigger: ring, start: "top 90%", once: true } });
  });

  /* C · Odómetro: dígitos en columnas que ruedan */
  register("numbers", "C", (root, ux) => {
    const odos = ux.$$(".num-c__odo", root);
    odos.forEach(o => {
      if (o.dataset.built) return;
      const txt = ux.fmt(+o.dataset.odo);
      o.innerHTML = [...txt].map(ch => /\d/.test(ch)
        ? `<span class="num-c__digit" aria-hidden="true"><span class="num-c__strip" data-d="${ch}">${Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join("")}</span></span>`
        : `<span class="num-c__sep" aria-hidden="true">${ch}</span>`).join("") + `<span class="num-c__suf" aria-hidden="true">${o.dataset.suffix || ""}</span>`;
      o.dataset.built = "1";
    });
    const strips = ux.$$(".num-c__strip", root);
    const target = s => -((10 + +s.dataset.d) / 20) * 100;
    if (ux.reduce) { strips.forEach(s => gsap.set(s, { yPercent: target(s) })); return; }
    gsap.set(strips, { yPercent: 0 });
    odos.forEach(o => {
      const ss = ux.$$(".num-c__strip", o);
      gsap.to(ss, { yPercent: i => target(ss[i]), duration: 2.4, ease: "power4.inOut", stagger: { each: .12, from: "end" }, scrollTrigger: { trigger: o, start: "top 85%", once: true } });
    });
    gsap.fromTo(ux.$(".num-c__bg", root), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* D · Una cifra por pantalla: el contorno se rellena con el scroll */
  register("numbers", "D", (root, ux) => {
    const slides = ux.$$(".num-d__slide", root);
    if (ux.reduce) return;
    slides.forEach(sl => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sl, start: "top top", end: "bottom bottom", scrub: .6 } });
      tl.fromTo(ux.$(".num-d__f", sl), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 }, 0)
        .fromTo(ux.$(".num-d__img", sl), { scale: 1.2 }, { scale: 1, ease: "none", duration: 1 }, 0)
        .fromTo(ux.$(".num-d__big", sl), { scale: .9 }, { scale: 1, ease: "none", duration: 1 }, 0);
      gsap.from(ux.$(".num-d__txt", sl).children, { y: 30, opacity: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: sl, start: "top 40%" } });
    });
  });

  /* E · Baraja: las cartas se reparten en abanico */
  register("numbers", "E", (root, ux) => {
    const cards = ux.$$(".num-e__card", root);
    if (ux.reduce || innerWidth <= 760) return;
    const mid = (cards.length - 1) / 2;
    const spread = () => Math.min(innerWidth * .2, 290);
    gsap.set(cards, { x: 0, y: 40, rotate: i => (i - mid) * 3, scale: .9 });
    gsap.to(cards, {
      x: i => (i - mid) * spread(), y: i => Math.abs(i - mid) * 26, rotate: i => (i - mid) * 7, scale: 1,
      duration: 1.4, ease: "expo.out", stagger: .07,
      scrollTrigger: { trigger: ux.$(".num-e__deck", root), start: "top 75%", once: true }
    });
    const enter = e => gsap.to(e.currentTarget, { y: "-=36", rotate: 0, zIndex: 5, duration: .5, ease: "power3.out", overwrite: "auto" });
    const leave = e => { const i = cards.indexOf(e.currentTarget); gsap.to(e.currentTarget, { y: Math.abs(i - mid) * 26, rotate: (i - mid) * 7, zIndex: 1, duration: .6, ease: "power3.out", overwrite: "auto" }); };
    cards.forEach(c => { c.addEventListener("pointerenter", enter); c.addEventListener("pointerleave", leave); });
    return () => cards.forEach(c => { c.removeEventListener("pointerenter", enter); c.removeEventListener("pointerleave", leave); });
  });
})();
