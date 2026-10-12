/* Servicios · A (favorita «Circuito») + B–F nuevas sin fotos · contenido de la home v29 */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Circuito (favorita): la planta reparte a los seis servicios ---------- */
  register("services", "A", (root, ux) => {
    const board = $(".services-a__board", root), svg = $(".services-a__svg", root), g = $(".services-a__traces", root);
    const chip = $(".services-a__chip", root), nodes = $$(".services-a__node", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const NS = "http://www.w3.org/2000/svg";
    let drawn = false;
    const build = () => {
      g.innerHTML = "";
      if (getComputedStyle(svg).display === "none") return;
      const b = board.getBoundingClientRect(), c = chip.getBoundingClientRect();
      nodes.forEach((n, i) => {
        const r = n.getBoundingClientRect(), left = i < 3, k = i % 3;
        const sy = c.top - b.top + c.height * (.28 + k * .22), ny = r.top - b.top + r.height / 2;
        const sx = (left ? c.left : c.right) - b.left, nx = (left ? r.right : r.left) - b.left;
        const mx = sx + (nx - sx) * (.35 + k * .15);
        const d = `M${sx},${sy} H${mx} V${ny} H${nx}`;
        const base = document.createElementNS(NS, "path"); base.setAttribute("d", d);
        const pulse = document.createElementNS(NS, "path"); pulse.setAttribute("d", d); pulse.setAttribute("class", "pulse");
        pulse.style.animationDelay = `${-(i * .43).toFixed(2)}s`;
        const dot = document.createElementNS(NS, "circle"); dot.setAttribute("cx", nx); dot.setAttribute("cy", ny); dot.setAttribute("r", 4);
        g.append(base, pulse, dot); n._pulse = pulse;
        if (!drawn && !ux.reduce) { const L = base.getTotalLength(); base.style.strokeDasharray = L; base.style.strokeDashoffset = L; pulse.style.opacity = 0; }
      });
    };
    build();
    const ro = new ResizeObserver(() => { build(); if (drawn) $$("path", g).forEach(p => { p.style.strokeDashoffset = ""; }); }); ro.observe(board);
    nodes.forEach(n => {
      const on = () => n._pulse && n._pulse.classList.add("hot"), off = () => n._pulse && n._pulse.classList.remove("hot");
      n.addEventListener("pointerenter", on, sig); n.addEventListener("pointerleave", off, sig);
      n.addEventListener("focus", on, sig); n.addEventListener("blur", off, sig);
    });
    if (!ux.reduce) {
      gsap.from(chip, { scale: .7, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: board, start: "top 75%" } });
      gsap.from(nodes, { opacity: 0, x: (i) => (i < 3 ? -40 : 40), duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: board, start: "top 75%" } });
      ScrollTrigger.create({ trigger: board, start: "top 65%", once: true, onEnter: () => {
        drawn = true;
        if (!g.firstChild) return;
        gsap.to($$("path:not(.pulse)", g), { strokeDashoffset: 0, duration: 1.4, stagger: .08, ease: "power2.inOut" });
        gsap.to($$("path.pulse", g), { opacity: 1, duration: .4, delay: 1.2 });
      } });
    } else drawn = true;
    return () => { ac.abort(); ro.disconnect(); g.innerHTML = ""; };
  });

  /* Ejecuta fn cada `ms` solo mientras el elemento está en pantalla; devuelve { stop, dispose } */
  const autoCycle = (el, ms, fn) => {
    let t = null, stopped = false;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(t); t = null;
      if (e.isIntersecting && !stopped) t = setInterval(fn, ms);
    }, { threshold: .35 });
    io.observe(el);
    return { stop() { stopped = true; clearInterval(t); }, dispose() { io.disconnect(); clearInterval(t); } };
  };

  /* B · Esquema de planta: líneas de plano que se trazan al entrar y se marcan al pasar por un servicio */
  register("services", "B", (root, ux) => {
    const board = $(".services-b__board", root), svg = $(".services-b__svg", root), g = $(".services-b__traces", root);
    const core = $(".services-b__core", root), nodes = $$(".services-b__node", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const NS = "http://www.w3.org/2000/svg";
    let drawn = !!ux.reduce;
    const build = () => {
      g.innerHTML = "";
      if (getComputedStyle(svg).display === "none") return;
      const b = board.getBoundingClientRect(), c = core.getBoundingClientRect();
      nodes.forEach((n, i) => {
        const r = n.getBoundingClientRect(), left = i < 3, k = i % 3;
        const sy = c.top - b.top + c.height * (.25 + k * .25), ny = r.top - b.top + r.height / 2;
        const sx = (left ? c.left : c.right) - b.left, nx = (left ? r.right : r.left) - b.left;
        const mx = sx + (nx - sx) * .5;
        const p = document.createElementNS(NS, "path"); p.setAttribute("d", `M${sx},${sy} H${mx} V${ny} H${nx}`);
        const sq = document.createElementNS(NS, "rect");
        sq.setAttribute("x", nx - 4); sq.setAttribute("y", ny - 4); sq.setAttribute("width", 8); sq.setAttribute("height", 8);
        g.append(p, sq); n._path = p;
        if (!drawn) { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; sq.style.opacity = 0; }
      });
    };
    build();
    const ro = new ResizeObserver(() => { build(); if (drawn) $$("path", g).forEach(p => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; }); });
    ro.observe(board);
    nodes.forEach(n => {
      const on = () => n._path && n._path.classList.add("hot"), off = () => n._path && n._path.classList.remove("hot");
      n.addEventListener("pointerenter", on, sig); n.addEventListener("pointerleave", off, sig);
      n.addEventListener("focus", on, sig); n.addEventListener("blur", off, sig);
    });
    if (!ux.reduce) {
      gsap.from(core, { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: board, start: "top 75%" } });
      gsap.from(nodes, { opacity: 0, y: 24, duration: .9, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: board, start: "top 75%" } });
      ScrollTrigger.create({ trigger: board, start: "top 65%", once: true, onEnter: () => {
        drawn = true;
        gsap.to($$("path", g), { strokeDashoffset: 0, duration: 1.3, stagger: .08, ease: "power2.inOut" });
        gsap.to($$("rect", g), { opacity: 1, duration: .3, stagger: .08, delay: 1 });
      } });
    }
    return () => { ac.abort(); ro.disconnect(); g.innerHTML = ""; };
  });

  /* C · Rueda: gira a su sitio con el scroll; el servicio elegido se explica al lado y rota solo hasta que el usuario elige */
  register("services", "C", (root, ux) => {
    const wheel = $(".services-c__wheel", root), btns = $$(".services-c__items button", root);
    const spokes = $$(".services-c__ring i", root), arts = $$(".services-c__detail article", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    let cur = 0;
    const set = i => {
      cur = i;
      btns.forEach((b, k) => b.setAttribute("aria-pressed", k === i));
      spokes.forEach((s, k) => s.classList.toggle("is-on", k === i));
      arts.forEach((a, k) => a.classList.toggle("is-on", k === i));
    };
    set(0);
    const cyc = ux.reduce ? null : autoCycle(wheel, 3800, () => set((cur + 1) % btns.length));
    btns.forEach((b, i) => {
      b.addEventListener("click", () => { cyc && cyc.stop(); set(i); }, sig);
      if (ux.fine) b.addEventListener("pointerenter", () => { cyc && cyc.stop(); set(i); }, sig);
    });
    if (!ux.reduce) {
      gsap.fromTo(wheel, { "--r": "-75deg" }, { "--r": "0deg", ease: "none", scrollTrigger: { trigger: wheel, start: "top 90%", end: "center 50%", scrub: 1 } });
      gsap.from($(".services-c__hub", root), { scale: .6, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: wheel, start: "top 75%" } });
    }
    return () => { ac.abort(); cyc && cyc.dispose(); };
  });

  /* D · Bloques de color: los carteles se descubren de abajo arriba, uno tras otro */
  register("services", "D", (root, ux) => {
    if (ux.reduce) return;
    const cards = $$(".services-d__card", root);
    gsap.fromTo(cards, { clipPath: "inset(100% 0% 0% 0% round 6px)" }, { clipPath: "inset(0% 0% 0% 0% round 6px)", duration: 1.1, stagger: .09, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: $(".services-d__grid", root), start: "top 80%" } });
    gsap.from(cards.map(c => $(".services-d__n", c)), { yPercent: 60, opacity: 0, duration: 1, stagger: .09, delay: .35, ease: "expo.out", scrollTrigger: { trigger: $(".services-d__grid", root), start: "top 80%" } });
  });

  /* E · Panel con iconos: pestañas accesibles, icono que se dibuja y avance automático con barra */
  register("services", "E", (root, ux) => {
    const tabs = $$(".services-e__tabs [role=tab]", root), panels = $$(".services-e__panel", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    let cur = 0, prog = null;
    panels.forEach(p => $$("path, circle", p).forEach(s => s.setAttribute("pathLength", 1)));
    const draw = p => {
      if (ux.reduce) return;
      const shapes = $$("path, circle", p);
      gsap.fromTo(shapes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: .12, ease: "power2.inOut" });
      gsap.fromTo($$(".services-e__tag, h3, p, a", p), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: "power3.out" });
    };
    const set = (i, focus) => {
      cur = i;
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; t.style.setProperty("--p", k === i ? (prog ? 0 : 1) : 0); });
      panels.forEach((p, k) => { p.hidden = k !== i; });
      if (focus) tabs[i].focus();
      draw(panels[i]);
      if (prog) { prog.kill(); prog = gsap.fromTo(tabs[i], { "--p": 0 }, { "--p": 1, duration: 6, ease: "none", paused: !visible, onComplete: () => set((cur + 1) % tabs.length) }); }
    };
    let visible = false, manual = !!ux.reduce;
    const stopAuto = () => { manual = true; if (prog) { prog.kill(); prog = null; } tabs.forEach(t => t.style.setProperty("--p", 1)); };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => { stopAuto(); set(i); }, sig);
      t.addEventListener("keydown", e => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (e.key === "Home" || e.key === "End" || k) { e.preventDefault(); stopAuto(); set(e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (cur + k + tabs.length) % tabs.length, true); }
      }, sig);
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (manual) return;
      if (visible && !prog) { prog = gsap.fromTo(tabs[cur], { "--p": 0 }, { "--p": 1, duration: 6, ease: "none", onComplete: () => set((cur + 1) % tabs.length) }); }
      else if (prog) visible ? prog.resume() : prog.pause();
    }, { threshold: .4 });
    io.observe(root);
    set(0);
    return () => { ac.abort(); io.disconnect(); prog && prog.kill(); };
  });

  /* F · Frase que se completa: «En Unical hacemos …» y la palabra cambia con el scroll */
  register("services", "F", (root, ux) => {
    if (ux.reduce) return;
    const pin = $(".services-f__pin", root), ws = $$(".services-f__w", root), count = $(".services-f__count b", root), bar = $(".services-f__bar i", root);
    gsap.set(ws.slice(1), { autoAlpha: 0 });
    gsap.set(ws.slice(1).map(w => $("b", w)), { yPercent: 70 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + innerHeight * ws.length * .55, pin: true, scrub: .5, invalidateOnRefresh: true } });
    ws.forEach((w, i) => {
      if (i) {
        tl.set(w, { autoAlpha: 1 }, i);
        tl.to($("b", w), { yPercent: 0, duration: .45, ease: "power3.out" }, i);
        tl.fromTo($("span", w), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .35 }, i + .1);
      }
      tl.call(() => { count.textContent = String(i + 1).padStart(2, "0"); }, null, i + .02);
      if (i < ws.length - 1) {
        tl.to($("b", w), { yPercent: -70, autoAlpha: 0, duration: .35, ease: "power2.in" }, i + .65);
        tl.to($("span", w), { autoAlpha: 0, duration: .25 }, i + .65);
        tl.set(w, { autoAlpha: 0 }, i + 1);
      }
    });
    tl.fromTo(bar, { "--p": 1 / ws.length }, { "--p": 1, duration: ws.length - 1, ease: "none" }, 0);
    tl.to({}, { duration: .4 });
    // Al volver hacia arriba el contador debe reflejar la palabra visible
    tl.eventCallback("onUpdate", () => { const i = Math.min(ws.length - 1, Math.floor(tl.time() + .02)); count.textContent = String(i + 1).padStart(2, "0"); });
  });
})();
