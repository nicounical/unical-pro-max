/* ===== 06 · Proyectos · A (favorita) + B–F (selección 3) ===== */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Filtros por sector (favorita) ---------- */
  register("work", "A", (root, ux) => {
    const items = $$(".work-a__item", root), btns = $$(".work-a__filters button", root), live = $(".work-a__live", root);
    if (!ux.reduce) gsap.from(items, { y: 60, opacity: 0, duration: 1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: $(".work-a__grid", root), start: "top 85%" } });
    let busy = false;
    const apply = async f => {
      if (busy) return; busy = true;
      const match = it => f === "*" || it.dataset.s === f;
      const leaving = items.filter(it => !it.hidden && !match(it));
      if (!ux.reduce && leaving.length) await gsap.to(leaving, { opacity: 0, scale: .9, duration: .25, ease: "power2.in" });
      const first = new Map(items.filter(it => !it.hidden).map(it => [it, it.getBoundingClientRect()]));
      items.forEach(it => { it.hidden = !match(it); gsap.set(it, { clearProps: "opacity,scale,transform" }); });
      const shown = items.filter(it => !it.hidden);
      live.textContent = `${shown.length} proyectos`;
      if (!ux.reduce) {
        shown.forEach(it => {
          const a = first.get(it), b = it.getBoundingClientRect();
          if (a) gsap.from(it, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: "0 0", duration: .8, ease: "expo.inOut" });
          else gsap.from(it, { opacity: 0, scale: .85, duration: .6, delay: .25, ease: "expo.out" });
        });
      }
      ScrollTrigger.refresh();
      busy = false;
    };
    const onClick = e => {
      const b = e.target.closest("button"); if (!b) return;
      btns.forEach(x => x.setAttribute("aria-pressed", x === b));
      apply(b.dataset.f);
    };
    const bar = $(".work-a__filters", root);
    bar.addEventListener("click", onClick);
    return () => { bar.removeEventListener("click", onClick); items.forEach(it => (it.hidden = false)); btns.forEach((x, i) => x.setAttribute("aria-pressed", i === 0)); };
  });

  /* Pseudoaleatorio estable por índice (las posiciones no saltan al recalcular) */
  const rnd = (i, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ---------- B · Historias: un proyecto a pantalla completa cada 5 s ---------- */
  register("work", "B", (root, ux) => {
    const slides = $$(".work-b__slide", root), bars = $$(".work-b__bars b", root), frame = $(".work-b__frame", root), pause = $(".work-b__pause", root);
    const DUR = 5000; let i = 0, el = 0, last = performance.now(), raf = 0, visible = false, hover = false, stopped = ux.reduce;
    const go = n => {
      i = (n + slides.length) % slides.length; el = 0;
      slides.forEach((s, k) => { s.classList.toggle("is-on", k === i); s.setAttribute("aria-hidden", String(k !== i)); });
      bars.forEach((b, k) => (b.style.transform = `scaleX(${k < i ? 1 : 0})`));
    };
    const tick = now => {
      if (visible && !hover && !stopped) el += now - last;
      last = now;
      const p = Math.min(1, el / DUR); bars[i].style.transform = `scaleX(${p})`;
      if (p >= 1) go(i + 1);
      raf = requestAnimationFrame(tick);
    };
    const prev = () => go(i - 1), next = () => go(i + 1);
    const setPause = v => { stopped = v; pause.setAttribute("aria-pressed", String(v)); pause.textContent = v ? "Reproducir" : "Pausa"; };
    const onPause = () => setPause(!stopped);
    const onKey = e => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    const onEnter = () => (hover = true), onLeave = () => (hover = false);
    $(".work-b__nav--prev", root).addEventListener("click", prev);
    $(".work-b__nav--next", root).addEventListener("click", next);
    pause.addEventListener("click", onPause); frame.addEventListener("keydown", onKey);
    if (ux.fine) { frame.addEventListener("mouseenter", onEnter); frame.addEventListener("mouseleave", onLeave); }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: .3 }); io.observe(frame);
    go(0); if (ux.reduce) setPause(true);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      $(".work-b__nav--prev", root).removeEventListener("click", prev); $(".work-b__nav--next", root).removeEventListener("click", next);
      pause.removeEventListener("click", onPause); frame.removeEventListener("keydown", onKey);
      frame.removeEventListener("mouseenter", onEnter); frame.removeEventListener("mouseleave", onLeave);
    };
  });

  /* ---------- C · Rejilla que se ordena: de un montón sobre la mesa a una rejilla perfecta ---------- */
  register("work", "C", (root, ux) => {
    const items = $$(".work-c__item", root), grid = $(".work-c__grid", root), caps = $$(".work-c__cap", root);
    if (ux.reduce) return;
    if (innerWidth > 900) {
      const off = (el, axis) => {
        // posición de reposo (sin transform) a partir de offsetLeft/Top
        const g = { left: 0, top: 0, width: grid.offsetWidth, height: grid.offsetHeight }, r = { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
        return axis === "x" ? (g.left + g.width / 2) - (r.left + r.width / 2) : (g.top + g.height / 2) - (r.top + r.height / 2);
      };
      const tl = gsap.timeline({ scrollTrigger: { trigger: $(".work-c__pin", root), start: "top top", end: "+=130%", pin: true, scrub: .8, invalidateOnRefresh: true } });
      // fromTo con destino explícito: con from() + invalidateOnRefresh el destino se quedaría en el estado desordenado
      gsap.set(items, { x: 0, y: 0, rotation: 0, scale: 1 });
      tl.fromTo(items, {
        x: (i, el) => off(el, "x") + (rnd(i) - .5) * 260,
        y: (i, el) => off(el, "y") + (rnd(i, 2) - .5) * 160,
        rotation: i => (rnd(i, 3) - .5) * 40, scale: .62
      }, { x: 0, y: 0, rotation: 0, scale: 1, ease: "power2.inOut", duration: 1, stagger: { each: .025, from: "random" } })
        .from(caps, { opacity: 0, y: 10, duration: .25, stagger: .015 }, ">-.1")
        .to({}, { duration: .2 });
    } else {
      gsap.from(items, { y: 70, opacity: 0, rotation: i => (rnd(i) - .5) * 14, stagger: .05, ease: "power2.out",
        scrollTrigger: { trigger: grid, start: "top 90%", end: "top 30%", scrub: .6 } });
    }
  });

  /* ---------- D · Sectores desplegables ---------- */
  register("work", "D", (root, ux) => {
    const rows = $$(".work-d__row", root);
    const onClick = e => {
      const b = e.target.closest(".work-d__row button"); if (!b) return;
      const row = b.closest(".work-d__row"), open = !row.classList.contains("is-open");
      rows.forEach(r => { const on = r === row && open; r.classList.toggle("is-open", on); $("button", r).setAttribute("aria-expanded", String(on)); });
      setTimeout(() => ScrollTrigger.refresh(), 750);
    };
    const list = $(".work-d__list", root); list.addEventListener("click", onClick);
    if (!ux.reduce) gsap.from(rows, { y: 40, opacity: 0, stagger: .08, duration: .9, ease: "power3.out", scrollTrigger: { trigger: list, start: "top 85%" } });
    return () => list.removeEventListener("click", onClick);
  });

  /* ---------- E · Mazo: arrastra la carta de arriba (o usa las flechas) ---------- */
  register("work", "E", (root, ux) => {
    const cards = $$(".work-e__card", root), deck = $(".work-e__deck", root), cnt = $(".work-e__count", root);
    const names = cards.map(c => $("b", c).textContent);
    let order = cards.map((_, i) => i), busy = false;
    const pose = k => ({ x: 0, y: Math.min(k, 3) * 14, rotation: k === 0 ? 0 : (k % 2 ? 1 : -1) * Math.min(k, 3) * 2.2, scale: 1 - Math.min(k, 3) * .045, opacity: k > 3 ? 0 : 1 });
    const layout = (dur = .6, skipTop = false) => {
      order.forEach((ci, k) => { const c = cards[ci]; if (skipTop && k === 0) return; c.style.zIndex = String(100 - k); c.setAttribute("aria-hidden", String(k !== 0)); gsap.to(c, { ...pose(k), duration: ux.reduce ? 0 : dur, ease: "power3.out", overwrite: "auto" }); });
      const top = order[0]; cnt.innerHTML = `<b>${String(top + 1).padStart(2, "0")}</b> / ${cards.length} · <span>${names[top]}</span>`;
    };
    const throwTop = (dir = 1) => {
      if (busy) return; busy = true; const c = cards[order[0]], w = deck.offsetWidth;
      gsap.to(c, { x: dir * w * 1.3, y: 40, rotation: dir * 24, duration: ux.reduce ? 0 : .45, ease: "power2.in", onComplete: () => {
        order.push(order.shift()); c.style.zIndex = "1"; gsap.set(c, { x: 0, ...pose(3), opacity: 0 }); layout(); busy = false; } });
    };
    const back = () => {
      if (busy) return; busy = true; order.unshift(order.pop()); const c = cards[order[0]], w = deck.offsetWidth;
      layout(.6, true); c.style.zIndex = "200"; c.setAttribute("aria-hidden", "false");
      gsap.fromTo(c, { x: -w * 1.3, y: 40, rotation: -24, opacity: 1 }, { ...pose(0), duration: ux.reduce ? 0 : .5, ease: "power3.out", onComplete: () => { layout(0); busy = false; } });
    };
    // Arrastre de la carta superior
    let drag = null;
    const down = e => { const c = e.target.closest(".work-e__card"); if (!c || c !== cards[order[0]] || busy) return; drag = { c, x0: e.clientX, dx: 0 }; c.setPointerCapture(e.pointerId); };
    const move = e => { if (!drag) return; drag.dx = e.clientX - drag.x0; gsap.set(drag.c, { x: drag.dx, rotation: drag.dx / 18 }); };
    const up = () => { if (!drag) return; const { dx, c } = drag; drag = null;
      if (Math.abs(dx) > deck.offsetWidth * .28) throwTop(Math.sign(dx)); else gsap.to(c, { x: 0, rotation: 0, duration: .5, ease: "back.out(2)" }); };
    deck.addEventListener("pointerdown", down); deck.addEventListener("pointermove", move); deck.addEventListener("pointerup", up); deck.addEventListener("pointercancel", up);
    const onBtn = e => { const b = e.target.closest(".work-e__btn"); if (!b) return; b.dataset.dir === "1" ? throwTop(1) : back(); };
    const ctrl = $(".work-e__ctrl", root); ctrl.addEventListener("click", onBtn);
    cards.forEach((c, k) => gsap.set(c, pose(k))); layout(0);
    if (!ux.reduce) gsap.from(cards.slice(0, 4), { y: 120, opacity: 0, rotation: 8, stagger: .08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: deck, start: "top 80%" } });
    return () => {
      deck.removeEventListener("pointerdown", down); deck.removeEventListener("pointermove", move); deck.removeEventListener("pointerup", up); deck.removeEventListener("pointercancel", up);
      ctrl.removeEventListener("click", onBtn); cards.forEach(c => { c.style.zIndex = ""; c.removeAttribute("aria-hidden"); });
    };
  });

  /* ---------- F · Columnas en contra: tres columnas de fotos que se cruzan con el scroll ---------- */
  register("work", "F", (root, ux) => {
    if (ux.reduce) { root.classList.add("is-static"); return () => root.classList.remove("is-static"); }
    const cols = $$(".work-f__col", root);
    cols.forEach((c, k) => gsap.fromTo(c, { yPercent: k === 1 ? -14 : 10 }, { yPercent: k === 1 ? 14 : -22, ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } }));
    gsap.from($(".work-f__card", root), { y: 60, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 40%" } });
  });
})();
