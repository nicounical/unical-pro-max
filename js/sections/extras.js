/* Variantes extra (L) por sección — animaciones ligeras con GSAP. */
(() => {
  const { register } = UX;

  const introIn = (ux, els, opts = {}) => {
    if (!els.length) return;
    if (ux.reduce) { gsap.set(els, { autoAlpha: 1, y: 0, x: 0 }); return; }
    gsap.set(els, { autoAlpha: 0, y: opts.y ?? 32 });
    ux.onIntro(() => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: opts.stagger ?? .07, ease: "expo.out", delay: opts.delay ?? .2 }));
  };

  /* ---------- Portada L · Cartel editorial ---------- */
  register("hero", "L", (root, ux) => {
    const top = ux.$(".hero-ed__top", root), bot = ux.$(".hero-ed__bot", root);
    const big = ux.$(".hero-ed__big", root), bar = ux.$(".hero-ed__big i", root);
    const em = ux.$(".hero-ed__big em", root);
    const meta = ux.$$(".hero-ed__meta > *", root);
    if (ux.reduce) return;
    const chars = ux.splitChars(big);
    gsap.set(chars, { yPercent: 110, autoAlpha: 0 });
    gsap.set(em, { autoAlpha: 0, y: 30 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
    gsap.set(meta, { autoAlpha: 0, y: 20 });
    gsap.set([top, bot], { autoAlpha: 0 });
    ux.onIntro(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to([top, bot], { autoAlpha: 1, duration: .9 }, .1)
        .to(chars, { yPercent: 0, autoAlpha: 1, duration: 1.1, stagger: .018 }, .25)
        .to(bar, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, .9)
        .to(em, { autoAlpha: 1, y: 0, duration: 1 }, 1.1)
        .to(meta, { autoAlpha: 1, y: 0, duration: 1, stagger: .08 }, 1.2);
    });
    gsap.to([top, bot, meta[meta.length - 1]], { yPercent: -20, autoAlpha: .3, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  });

  /* ---------- Servicios L · Tipográfico sin fotos ---------- */
  register("services", "L", (root, ux) => {
    const rows = ux.$$(".services-l__list > li", root);
    const head = ux.$$(".services-l__head > *", root);
    introIn(ux, head);
    if (ux.reduce) return;
    rows.forEach((r, i) => gsap.from(r, {
      autoAlpha: 0, y: 24, duration: .9, ease: "expo.out",
      scrollTrigger: { trigger: r, start: "top 92%", once: true }
    }));
  });

  /* ---------- Reel L · Trío suizo ---------- */
  register("reel", "L", (root, ux) => {
    const bands = ux.$$(".reel-l__band", root);
    const discs = ux.$$(".reel-l__disc video", root);
    discs.forEach(v => { v.muted = true; v.preload = "auto"; });
    const play = () => discs.forEach(v => v.play().catch(() => {}));
    const offs = [];
    offs.push(() => discs.forEach(v => v.pause()));
    // Open modal on click
    ux.$$(".reel-l__disc", root).forEach(d => {
      const h = () => ux.openReel();
      d.addEventListener("click", h);
      offs.push(() => d.removeEventListener("click", h));
    });
    if (ux.reduce) { play(); return () => offs.forEach(f => f()); }
    bands.forEach((band, i) => {
      const t = ux.$(".reel-l__t", band);
      const d = ux.$(".reel-l__disc", band);
      const meta = ux.$(".reel-l__meta", band);
      if (t) gsap.from(t, { x: i % 2 ? 60 : -60, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: band, start: "top 85%", once: true } });
      if (d) gsap.from(d, { clipPath: "circle(0% at 50% 50%)", duration: 1.3, ease: "expo.out", delay: .2, scrollTrigger: { trigger: band, start: "top 85%", once: true } });
      if (meta) gsap.from(meta, { autoAlpha: 0, y: 20, duration: .9, ease: "expo.out", delay: .4, scrollTrigger: { trigger: band, start: "top 85%", once: true } });
    });
    ux.onIntro(play);
    return () => offs.forEach(f => f());
  });

  /* ---------- Proyectos L · Revista editorial ---------- */
  register("work", "L", (root, ux) => {
    const head = ux.$$(".work-l__head > *", root);
    const cards = ux.$$(".work-l__card", root);
    introIn(ux, head);
    if (ux.reduce) return;
    cards.forEach((c, i) => gsap.from(c, {
      autoAlpha: 0, y: 50, duration: 1, ease: "expo.out", delay: (i % 3) * .08,
      scrollTrigger: { trigger: c, start: "top 90%", once: true }
    }));
    cards.forEach(c => {
      const img = ux.$("img", c);
      if (img) gsap.to(img, { yPercent: -6, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  /* ---------- Proceso L · Construcción de stand (showcase) ---------- */
  register("process", "L", (root, ux) => {
    const steps = ux.$$(".process-l__steps li", root);
    const paths = ux.$$(".process-l__svg .pathed", root);
    const panels = ux.$$(".process-l__svg .panel", root);
    const panelFills = ux.$$(".process-l__svg .panel-fill", root);
    const photo = ux.$(".process-l__photo", root);
    const final = ux.$(".process-l__final", root);
    const cap = ux.$(".process-l__cap b", root);
    const capName = ux.$(".process-l__cap span", root);
    const titles = ["Presupuesto", "Diseño", "Producción", "Instalación"];

    if (ux.reduce) {
      steps.forEach(s => s.classList.add("on"));
      gsap.set([paths, panels, panelFills], { opacity: 1, strokeDashoffset: 0 });
      gsap.set([photo, final], { opacity: 1 });
      return;
    }

    gsap.set(paths, { strokeDashoffset: 1 });
    gsap.set(panels, { opacity: 0 });
    gsap.set(panelFills, { opacity: 0 });
    gsap.set(photo, { opacity: 0, clipPath: "inset(0 100% 0 0)" });
    gsap.set(final, { opacity: 0 });

    const updateStep = idx => {
      steps.forEach((s, i) => s.classList.toggle("on", i <= idx));
      if (cap) cap.textContent = String(idx + 1).padStart(2, "0");
      if (capName) capName.textContent = titles[idx];
    };
    updateStep(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ux.$(".process-l__wrap", root),
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6
      }
    });
    // Phase 1 (0 → .25): Structure — posts + beams
    tl.to(paths, { strokeDashoffset: 0, duration: 1, stagger: .08, ease: "power2.out" }, 0)
      .call(() => updateStep(0), null, 0)
    // Phase 2 (.25 → .5): Panels fade in
      .call(() => updateStep(1), null, 1)
      .to(panels, { opacity: 1, duration: .5, stagger: .1 }, 1)
    // Phase 3 (.5 → .75): Graphics applied — photo reveals wiping right
      .call(() => updateStep(2), null, 2)
      .to(panelFills, { opacity: 1, duration: .4 }, 2)
      .to(photo, { opacity: 1, clipPath: "inset(0 0 0 0)", duration: 1, ease: "expo.inOut" }, 2.1)
    // Phase 4 (.75 → 1): Final stand photo takes over
      .call(() => updateStep(3), null, 3)
      .to(final, { opacity: 1, duration: 1, ease: "power2.out" }, 3);
  });

  /* ---------- Cifras / Por qué elegirnos L · Carteles tipográficos ---------- */
  register("numbers", "L", (root, ux) => {
    const head = ux.$$(".num-l__head > *", root);
    const cards = ux.$$(".num-l__card", root);
    introIn(ux, head);
    if (ux.reduce) return;
    cards.forEach((c, i) => gsap.from(c, {
      autoAlpha: 0, y: 40, duration: 1, ease: "expo.out", delay: (i % 3) * .08,
      scrollTrigger: { trigger: c, start: "top 92%", once: true }
    }));
  });

  /* ---------- Sectores L · Lista editorial ---------- */
  register("sectors", "L", (root, ux) => {
    const head = ux.$$(".sectors-l__head > *", root);
    const rows = ux.$$(".sectors-l__list > li", root);
    introIn(ux, head);
    if (ux.reduce) return;
    rows.forEach(r => gsap.from(r, {
      autoAlpha: 0, y: 30, duration: .9, ease: "expo.out",
      scrollTrigger: { trigger: r, start: "top 92%", once: true }
    }));
  });

  /* ---------- Manifesto L · Índice (K) con nuevo fondo ---------- */
  register("manifesto", "L", (root, ux) => {
    const letters = ux.$$(".man-l__letter", root);
    const panel = ux.$(".man-l__panel", root);
    const big = ux.$(".man-l__big", root);
    const title = ux.$(".man-l__panel .m-t", root);
    const body = ux.$(".man-l__panel .m-b", root);
    const kicker = ux.$(".man-l__panel .m-k", root);
    const head = ux.$$(".man-l__head > *", root);
    const items = [
      { l: "A", k: "Experiencia", t: "25 <em>años</em> en el mercado.", b: "Más de 25 años dando soluciones de impresión digital, rotulación y producción visual a empresas de todos los tamaños." },
      { l: "C", k: "Compromiso", t: "Entregas <em>sin excusas</em>.", b: "Cumplir los plazos no es una promesa de marketing — es parte del trabajo. Si no llegamos, no cobramos." },
      { l: "D", k: "Diseño", t: "Del boceto <em>al montaje</em>.", b: "Nuestro equipo creativo convierte el briefing en originales listos para producir, sin intermediarios." },
      { l: "I", k: "Instalación", t: "Montamos en <em>toda España</em>.", b: "Red propia de instaladores experimentados. Base en Barcelona, llegada a cualquier punto." },
      { l: "P", k: "Producción propia", t: "<em>Fabricamos</em>, no reventamos.", b: "Instalaciones de 1.800 m² equipadas con tecnología de última generación — calidad y plazos bajo nuestro control." },
      { l: "T", k: "Tecnología", t: "Vinilo <em>3M · Avery</em>.", b: "Trabajamos con los mejores materiales del mercado para que cada acabado dure lo que tiene que durar." }
    ];
    let active = 0;

    const render = i => {
      const o = items[i];
      kicker.innerHTML = `(${o.k})`;
      title.innerHTML = o.t;
      body.textContent = o.b;
      big.textContent = o.l;
      letters.forEach((el, k) => el.classList.toggle("on", k === letters.findIndex(x => x.textContent === o.l)));
    };
    render(0);

    letters.forEach(el => {
      el.addEventListener("click", () => {
        const i = items.findIndex(x => x.l === el.textContent);
        if (i >= 0 && i !== active) {
          active = i;
          if (ux.reduce) { render(i); return; }
          gsap.to([title, body, kicker], { autoAlpha: 0, y: -14, duration: .3, ease: "power2.in", onComplete: () => { render(i); gsap.fromTo([title, body, kicker], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .05, ease: "power2.out" }); } });
          gsap.fromTo(big, { autoAlpha: 0, scale: .7, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .7, ease: "back.out(1.4)" });
        }
      });
    });

    introIn(ux, head);
    if (ux.reduce) return;
    gsap.from(letters, { autoAlpha: 0, y: 30, duration: .8, stagger: .02, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 80%", once: true } });
    gsap.from([kicker, title, body, big], { autoAlpha: 0, y: 20, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: panel, start: "top 85%", once: true } });
  });

  /* ---------- Clientes L · Marquesinas duales (CSS puro, nada que hacer) ---------- */
  register("clients", "L", (root, ux) => {
    const head = ux.$$(".cli-l__head > *", root);
    introIn(ux, head);
  });

  /* ---------- Contacto L · Tipografía gigante ---------- */
  register("contact", "L", (root, ux) => {
    const head = ux.$$(".contact-l__head > *", root);
    const info = ux.$$(".contact-l__info > *", root);
    const form = ux.$(".contact-l__form", root);
    introIn(ux, head);
    introIn(ux, info, { delay: .4, stagger: .1 });
    if (ux.reduce) return;
    gsap.from(form, { autoAlpha: 0, y: 40, duration: 1.1, ease: "expo.out", delay: .5, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
})();
