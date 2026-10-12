/* 05 · Cifras («Por qué elegirnos») — A favorita (odómetro) + 5 nuevas · Selección 3 */
(() => {
  const { register } = UX;

  /* A · Odómetro: dígitos en columnas que ruedan */
  register("numbers", "A", (root, ux) => {
    const odos = ux.$$(".num-a__odo", root);
    odos.forEach(o => {
      if (o.dataset.built) return;
      const txt = ux.fmt(+o.dataset.odo);
      o.innerHTML = [...txt].map(ch => /\d/.test(ch)
        ? `<span class="num-a__digit" aria-hidden="true"><span class="num-a__strip" data-d="${ch}">${Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join("")}</span></span>`
        : `<span class="num-a__sep" aria-hidden="true">${ch}</span>`).join("") + `<span class="num-a__suf" aria-hidden="true">${o.dataset.suffix || ""}</span>`;
      o.dataset.built = "1";
    });
    const strips = ux.$$(".num-a__strip", root);
    const target = s => -((10 + +s.dataset.d) / 20) * 100;
    if (ux.reduce) { strips.forEach(s => gsap.set(s, { yPercent: target(s) })); return; }
    gsap.set(strips, { yPercent: 0 });
    odos.forEach(o => {
      const ss = ux.$$(".num-a__strip", o);
      gsap.to(ss, { yPercent: i => target(ss[i]), duration: 2.4, ease: "power4.inOut", stagger: { each: .12, from: "end" }, scrollTrigger: { trigger: o, start: "top 85%", once: true } });
    });
    gsap.fromTo(ux.$(".num-a__bg", root), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Bucle rAF que solo corre mientras el elemento está en pantalla */
  const whileVisible = (el, frame) => {
    let raf = 0, on = false;
    const tick = t => { raf = 0; if (!on) return; frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); });
    io.observe(el);
    return () => { on = false; io.disconnect(); cancelAnimationFrame(raf); };
  };


  /* B · Metro de taller: la cinta se despliega con el scroll y cada marca aparece al llegar */
  register("numbers", "B", (root, ux) => {
    const tape = ux.$(".num-b__tape", root), marks = ux.$$(".num-b__mark", root);
    if (ux.reduce) { tape.style.setProperty("--p", 1); return; }
    const at = marks.map(m => parseFloat(m.style.getPropertyValue("--at")) / 100);
    const shown = marks.map(() => false);
    const set = p => {
      const q = .06 + p * .94;
      tape.style.setProperty("--p", q);
      marks.forEach((m, i) => { const v = q > at[i]; if (v !== shown[i]) { shown[i] = v; gsap.to(m, { opacity: v ? 1 : 0, duration: .35, overwrite: true }); } });
    };
    gsap.set(marks, { opacity: 0 });
    const mm = gsap.matchMedia();
    mm.add({ wide: "(min-width:861px)", narrow: "(max-width:860px)" }, c => {
      ScrollTrigger.create({
        trigger: ux.$(".num-b__stage", root), start: c.conditions.wide ? "top 85%" : "top 75%", end: c.conditions.wide ? "top 20%" : "bottom 75%", scrub: true,
        onUpdate: s => set(s.progress)
      });
      set(0);
    });
    return () => mm.revert();
  });

  /* C · Letras corpóreas: se levantan del suelo como letras instaladas y les pasa un reflejo */
  register("numbers", "C", (root, ux) => {
    const ns = ux.$$(".num-c__n", root), ls = ux.$$(".num-c__l", root);
    if (ux.reduce) return;
    ns.forEach((n, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: n, start: "top 88%", once: true } });
      tl.fromTo(n, { rotateX: -88, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 1.3, ease: "back.out(1.15)", delay: (i % 2) * .15 })
        .fromTo(n, { "--sx": "150%" }, { "--sx": "-60%", duration: 1.4, ease: "power2.inOut" }, "-=.4")
        .from(ls[i], { opacity: 0, y: 14, duration: .6 }, "-=1.2");
    });
    // reflejo que vuelve a pasar con el ratón
    if (!ux.fine) return;
    const on = e => gsap.fromTo(e.currentTarget, { "--sx": "150%" }, { "--sx": "-60%", duration: 1, ease: "power2.inOut", overwrite: true });
    ns.forEach(n => n.addEventListener("mouseenter", on));
    return () => ns.forEach(n => n.removeEventListener("mouseenter", on));
  });

  /* D · Taco de calendario: se arranca una hoja por año, de 2001 a 2026 */
  register("numbers", "D", (root, ux) => {
    const box = ux.$(".num-d__pages", root), yrs = ux.$(".num-d__yrs", root);
    const FIRST = 2001, LAST = 2026, N = LAST - FIRST;
    if (!box.children.length) {
      box.innerHTML = Array.from({ length: N + 1 }, (_, i) => {
        const y = FIRST + i, now = y === LAST;
        return `<div class="num-d__page${now ? " num-d__page--now" : ""}" style="z-index:${N + 2 - i}"><header><span>Unical Graphic</span><b>${now ? "Hoy" : "Año " + String(i + 1).padStart(2, "0")}</b></header><strong>${y}</strong><small>${now ? "+25 años · +3.000 proyectos" : "Cabrera de Mar · Barcelona"}</small></div>`;
      }).join("");
    }
    const pages = [...box.children];
    const render = k => {
      pages.forEach((p, i) => {
        const t = gsap.utils.clamp(0, 1, k - i);
        if (i > k + 4) { p.style.visibility = "hidden"; return; }
        p.style.visibility = t >= 1 ? "hidden" : "visible";
        p.style.transform = `translateY(${-t * 60}px) rotateX(${t * 105}deg)`;
        p.style.opacity = 1 - Math.max(0, t - .45) / .55;
      });
      yrs.textContent = Math.min(25, Math.round(k));
    };
    if (ux.reduce) { render(N); return; }
    render(0);
    const mm = gsap.matchMedia(), o = { k: 0 };
    mm.add("(min-width:861px)", () => {
      ScrollTrigger.create({ trigger: ux.$(".num-d__track", root), start: "top top", end: "bottom bottom", scrub: .4, onUpdate: s => render(s.progress * N) });
    });
    mm.add("(max-width:860px)", () => {
      o.k = 0; render(0);
      gsap.to(o, { k: N, duration: 3.2, ease: "power2.inOut", onUpdate: () => render(o.k), scrollTrigger: { trigger: ux.$(".num-d__cal", root), start: "top 70%", once: true } });
    });
    return () => mm.revert();
  });

  /* E · Frase que se lee: las palabras se encienden al ritmo del scroll */
  register("numbers", "E", (root, ux) => {
    const p = ux.$(".num-e__text", root);
    if (!p.dataset.split) {
      const wrap = node => {
        [...node.childNodes].forEach(n => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(t => {
              if (!t) return;
              if (/^\s+$/.test(t)) frag.append(t);
              else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.append(s); }
            });
            n.replaceWith(frag);
          } else if (n.classList && n.classList.contains("acc")) wrap(n);
        });
      };
      wrap(p);
      p.dataset.split = "1";
    }
    const units = ux.$$(".w, .num-e__chip", p).filter(u => !u.closest(".num-e__chip") || u.classList.contains("num-e__chip"));
    const set = k => units.forEach((u, i) => u.classList.toggle("on", i < k));
    if (ux.reduce) { set(units.length); return; }
    set(0);
    ScrollTrigger.create({ trigger: p, start: "top 78%", end: "bottom 52%", scrub: true, onUpdate: s => set(Math.round(s.progress * units.length)) });
  });

  /* F · Barras en relieve: crecen desde la base una tras otra */
  register("numbers", "F", (root, ux) => {
    if (ux.reduce) return;
    const bars = ux.$$(".num-f__bar", root);
    gsap.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "power4.out", stagger: .14, scrollTrigger: { trigger: ux.$(".num-f__chart", root), start: "top 80%", once: true } });
    gsap.from(ux.$$(".num-f__bar b, .num-f__col p", root), { opacity: 0, y: 12, duration: .6, stagger: .08, delay: .7, scrollTrigger: { trigger: ux.$(".num-f__chart", root), start: "top 80%", once: true } });
  });
})();
