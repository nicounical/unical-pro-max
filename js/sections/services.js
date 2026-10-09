/* Servicios · A (favorita: lista gigante + cursor) + 5 versiones nuevas B–F · contenido de la home v29 */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Lista gigante con media que sigue al cursor ---------- */
  register("services", "A", (root, ux) => {
    const items = $$(".services-a__list li", root);
    if (!ux.reduce) {
      gsap.from($$(".services-a__t", root), { yPercent: 100, opacity: 0, duration: 1.1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: $(".services-a__list", root), start: "top 80%" } });
    }
    if (!ux.fine || ux.reduce) return;
    const ac = new AbortController(), sig = { signal: ac.signal };
    const fl = $(".services-a__float", root), fin = $(".services-a__float-in", root), list = $(".services-a__list", root);
    // Mover el flotante al body evita que un transform del contenedor rompa position:fixed
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0, cur = "";
    const loop = () => {
      const dx = tx - x; x += dx * .14; y += (ty - y) * .14;
      const skew = gsap.utils.clamp(-14, 14, dx * .08), rot = gsap.utils.clamp(-8, 8, dx * .03);
      fl.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) skewX(${-skew}deg) rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    };
    list.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, sig);
    list.addEventListener("pointerenter", e => { x = tx = e.clientX; y = ty = e.clientY; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }, sig);
    list.addEventListener("pointerover", e => {
      const a = e.target.closest("a[data-media]"); if (!a || a.dataset.media === cur) return;
      cur = a.dataset.media;
      const isV = a.dataset.type === "video";
      const m = document.createElement(isV ? "video" : "img");
      m.src = cur; if (isV) { m.muted = true; m.loop = true; m.playsInline = true; m.autoplay = true; } else m.alt = "";
      m.style.opacity = 0; fin.append(m);
      requestAnimationFrame(() => (m.style.opacity = 1));
      while (fin.children.length > 2) fin.firstChild.remove();
      fl.classList.add("on");
    }, sig);
    list.addEventListener("pointerleave", () => { fl.classList.remove("on"); cur = ""; setTimeout(() => cancelAnimationFrame(raf), 400); }, sig);
    return () => { ac.abort(); cancelAnimationFrame(raf); fl.classList.remove("on"); fin.innerHTML = ""; };
  });


  /* ---------- B · Vinilos que se despegan ---------- */
  register("services", "B", (root, ux) => {
    const cards = $$(".services-b__card", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const REST = .07, OPEN = 1.05;
    const peel = (c, on) => {
      c.classList.toggle("peeled", on);
      gsap.to(c, { "--p": on ? OPEN : REST, duration: ux.reduce ? 0 : (on ? .95 : .6), ease: on ? "power3.inOut" : "power2.out", overwrite: true });
    };
    cards.forEach(c => {
      if (ux.fine) {
        c.addEventListener("pointerenter", () => peel(c, true), sig);
        c.addEventListener("pointerleave", () => { if (!c.contains(document.activeElement)) peel(c, false); }, sig);
      }
      c.addEventListener("focusin", () => peel(c, true), sig);
      c.addEventListener("focusout", e => { if (!c.contains(e.relatedTarget)) peel(c, false); }, sig);
      // En táctil: el primer toque despega; el enlace ya queda accesible
      c.addEventListener("click", e => { if (!e.target.closest("a")) peel(c, !c.classList.contains("peeled")); }, sig);
    });
    if (!ux.reduce) {
      gsap.from(cards, { y: 70, opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: $(".services-b__grid", root), start: "top 82%" } });
      // Guiño: las esquinas se levantan un poco al entrar
      gsap.timeline({ scrollTrigger: { trigger: $(".services-b__grid", root), start: "top 60%" } })
        .to(cards, { "--p": .17, duration: .45, stagger: .07, ease: "power2.out" })
        .to(cards, { "--p": REST, duration: .5, stagger: .07, ease: "power2.inOut" }, "-=.25");
    }
    return () => ac.abort();
  });

  /* ---------- C · Muestrario Pantone en abanico ---------- */
  register("services", "C", (root, ux) => {
    const strips = $$(".services-c__strip", root), items = $$(".services-c__item", root);
    const step = () => (innerWidth < 860 ? 11 : 13);
    let cur = 0, timer = 0, touched = false, inView = false;
    const ac = new AbortController(), sig = { signal: ac.signal };
    const fanOut = instant => gsap.to(strips, { "--rot": i => (i - (strips.length - 1) / 2) * step(), duration: instant ? 0 : 1.3, stagger: .05, ease: "expo.out" });
    const select = (i, user) => {
      if (user) { touched = true; clearInterval(timer); }
      const prev = cur; cur = i;
      strips.forEach((s, j) => { s.setAttribute("aria-pressed", j === i); gsap.to(s, { "--lift": j === i ? "-48px" : "0px", duration: ux.reduce ? 0 : .6, ease: "expo.out" }); });
      if (prev === i && !items[i].hidden) return;
      items.forEach((it, j) => (it.hidden = j !== i));
      if (!ux.reduce) gsap.fromTo(items[i].children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .05, ease: "expo.out" });
    };
    strips.forEach((s, i) => {
      s.addEventListener("click", () => select(i, true), sig);
      if (ux.fine) s.addEventListener("pointerenter", () => select(i, true), sig);
      s.addEventListener("keydown", e => {
        const k = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!k) return; e.preventDefault();
        const n = (i + k + strips.length) % strips.length; strips[n].focus(); select(n, true);
      }, sig);
    });
    const auto = () => { clearInterval(timer); if (!ux.reduce && !touched && inView) timer = setInterval(() => select((cur + 1) % strips.length), 3800); };
    if (ux.reduce) { fanOut(true); select(0); }
    else {
      gsap.set(strips, { "--rot": 0 });
      ScrollTrigger.create({ trigger: $(".services-c__fan", root), start: "top 78%", once: true, onEnter: () => fanOut(false) });
      ScrollTrigger.create({ trigger: root, start: "top 70%", end: "bottom 30%", onToggle: s => { inView = s.isActive; auto(); } });
      select(0);
    }
    addEventListener("resize", () => fanOut(true), sig);
    return () => { ac.abort(); clearInterval(timer); };
  });

  /* ---------- D · Rollo de lona que se desenrolla ---------- */
  register("services", "D", (root, ux) => {
    const track = $(".services-d__track", root), roll = $(".services-d__roll", root), bar = $(".services-d__progress", root);
    if (ux.reduce || innerWidth < 820) { root.classList.add("is-static"); return () => root.classList.remove("is-static"); }
    root.classList.remove("is-static");
    const rollX = () => innerWidth * .08;
    const visible = () => innerWidth - rollX();
    const dist = () => track.scrollWidth;
    gsap.fromTo(track, { x: () => visible() }, {
      x: () => visible() - dist() + 40, ease: "none",
      scrollTrigger: {
        trigger: root, start: "top top", end: () => "+=" + (dist() + visible() * .2), pin: $(".services-d__pin", root), scrub: .7, invalidateOnRefresh: true,
        onUpdate: s => { roll.style.setProperty("--spin", (s.progress * dist() * -.35) + "px"); bar.style.setProperty("--p", s.progress); }
      }
    });
    // El rollo «respira» un poco al girar (se hace más fino a medida que se gasta la lona)
    gsap.fromTo(roll, { scaleX: 1.15 }, { scaleX: .82, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: () => "+=" + (dist() + visible() * .2), scrub: true } });
    gsap.from($$(".services-d__head > *", root), { y: 40, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => root.classList.remove("is-static");
  });

  /* ---------- E · Persianas que se levantan ---------- */
  register("services", "E", (root, ux) => {
    const wins = $$(".services-e__win", root), shutters = $$(".services-e__shutter", root), btn = $(".services-e__toggle", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const openAll = (instant) => {
      wins.forEach(w => w.classList.remove("open"));
      gsap.to(shutters, { yPercent: -100, duration: instant ? 0 : 1.15, stagger: instant ? 0 : .16, ease: "power3.inOut", overwrite: true,
        onComplete() {}, onStart() {} });
      shutters.forEach((s, i) => gsap.delayedCall(instant ? 0 : .55 + i * .16, () => wins[i].classList.add("open")));
      btn.setAttribute("aria-pressed", "false"); btn.textContent = "Bajar persianas";
    };
    const closeAll = () => {
      wins.forEach(w => w.classList.remove("open"));
      gsap.to(shutters, { yPercent: 0, duration: .9, stagger: .08, ease: "bounce.out", overwrite: true });
      btn.setAttribute("aria-pressed", "true"); btn.textContent = "Subir persianas";
    };
    btn.addEventListener("click", () => (btn.getAttribute("aria-pressed") === "true" ? openAll(false) : closeAll()), sig);
    if (ux.reduce) { openAll(true); return () => ac.abort(); }
    gsap.set(shutters, { yPercent: 0 });
    gsap.from(wins, { y: 60, opacity: 0, duration: 1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: $(".services-e__street", root), start: "top 85%" } });
    ScrollTrigger.create({ trigger: $(".services-e__street", root), start: "top 62%", once: true, onEnter: () => openAll(false) });
    // Al pasar el cursor por un escaparate abierto, la persiana «tiembla»
    if (ux.fine) wins.forEach((w, i) => w.addEventListener("pointerenter", () => { if (w.classList.contains("open")) gsap.fromTo(shutters[i], { yPercent: -92 }, { yPercent: -100, duration: .6, ease: "elastic.out(1,.4)" }); }, sig));
    return () => ac.abort();
  });

  /* ---------- F · Tablero de polaroids arrastrables ---------- */
  register("services", "F", (root, ux) => {
    const board = $(".services-f__board", root), pols = $$(".services-f__pol", root);
    const drawer = $(".services-f__drawer", root), items = $$(".services-f__item", root), x = $(".services-f__x", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const small = () => matchMedia("(max-width: 760px)").matches;
    let z = 20, lastPol = null;
    const ROT = pols.map(p => parseFloat(p.style.getPropertyValue("--r")) || 0);
    gsap.set(pols, { rotation: i => ROT[i], x: 0, y: 0 });

    const openDrawer = i => {
      items.forEach((it, j) => (it.hidden = j !== i));
      drawer.hidden = false; lastPol = pols[i];
      if (!ux.reduce) gsap.fromTo(drawer, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .5, ease: "expo.out" });
      x.focus();
    };
    const closeDrawer = () => { drawer.hidden = true; lastPol && lastPol.focus(); };
    x.addEventListener("click", closeDrawer, sig);
    addEventListener("keydown", e => { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); }, sig);

    // Arrastre con inercia (sin plugins)
    pols.forEach((p, i) => {
      let sx, sy, ox, oy, moved = false, down = false, vx = 0, vy = 0, lx, ly, lt;
      p.addEventListener("pointerdown", e => {
        if (small() || root.classList.contains("is-grid") || e.button !== 0) return;
        down = true; moved = false; p.setPointerCapture(e.pointerId);
        sx = e.clientX; sy = e.clientY; ox = gsap.getProperty(p, "x"); oy = gsap.getProperty(p, "y");
        lx = sx; ly = sy; lt = performance.now(); p.style.zIndex = ++z;
        gsap.to(p, { scale: 1.06, rotation: ROT[i] * .3, duration: .25, ease: "power2.out", overwrite: "auto" });
      }, sig);
      p.addEventListener("pointermove", e => {
        if (!down) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) > 5) { moved = true; p.classList.add("dragging"); }
        if (!moved) return;
        const now = performance.now(), dt = Math.max(1, now - lt);
        vx = (e.clientX - lx) / dt; vy = (e.clientY - ly) / dt; lx = e.clientX; ly = e.clientY; lt = now;
        gsap.set(p, { x: ox + dx, y: oy + dy });
      }, sig);
      const end = () => {
        if (!down) return; down = false; p.classList.remove("dragging");
        if (!moved) { gsap.to(p, { scale: 1, rotation: ROT[i], duration: .3 }); return; }
        const b = board.getBoundingClientRect(), r = p.getBoundingClientRect();
        const cx = gsap.getProperty(p, "x"), cy = gsap.getProperty(p, "y");
        let tx = cx + vx * 180, ty = cy + vy * 180;
        tx -= Math.max(0, (r.right + vx * 180) - b.right) + Math.min(0, (r.left + vx * 180) - b.left);
        ty -= Math.max(0, (r.bottom + vy * 180) - b.bottom) + Math.min(0, (r.top + vy * 180) - b.top);
        ROT[i] = gsap.utils.clamp(-12, 12, ROT[i] + vx * 6);
        gsap.to(p, { x: tx, y: ty, scale: 1, rotation: ROT[i], duration: ux.reduce ? 0 : .9, ease: "power3.out" });
      };
      p.addEventListener("pointerup", end, sig);
      p.addEventListener("pointercancel", end, sig);
      p.addEventListener("click", e => { if (moved) { e.preventDefault(); moved = false; return; } openDrawer(i); }, sig);
    });

    // Ordenar / Mezclar con transición FLIP
    const flip = mutate => {
      const before = pols.map(p => p.getBoundingClientRect());
      mutate();
      pols.forEach((p, i) => {
        const a = before[i], c = p.getBoundingClientRect();
        if (ux.reduce) return;
        gsap.fromTo(p, { x: `+=${a.left - c.left}`, y: `+=${a.top - c.top}` }, { x: 0, y: 0, duration: .9, ease: "expo.inOut", delay: i * .03 });
      });
    };
    $("[data-f='order']", root).addEventListener("click", () => flip(() => { root.classList.add("is-grid"); gsap.set(pols, { x: 0, y: 0 }); }), sig);
    $("[data-f='shuffle']", root).addEventListener("click", () => flip(() => {
      root.classList.remove("is-grid");
      pols.forEach((p, i) => {
        p.style.setProperty("--x", gsap.utils.random(2, 74) + "%"); p.style.setProperty("--y", gsap.utils.random(0, 56) + "%");
        ROT[i] = gsap.utils.random(-9, 9); gsap.set(p, { x: 0, y: 0, rotation: ROT[i] });
      });
    }), sig);

    if (!ux.reduce) gsap.from(pols, { y: -140, opacity: 0, rotation: i => ROT[i] * 3, duration: 1.1, stagger: .09, ease: "back.out(1.6)", scrollTrigger: { trigger: board, start: "top 75%" } });
    return () => { ac.abort(); root.classList.remove("is-grid"); drawer.hidden = true; };
  });
})();
