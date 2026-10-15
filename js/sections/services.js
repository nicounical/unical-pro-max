/* Servicios · A (favorita «Circuito») + B–F reinterpretaciones (Ronda Selección 4) · contenido de la home v29 */
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

  const smoothTo = (ux, y, immediate) => {
    if (ux.lenis) ux.lenis.scrollTo(y, immediate ? { immediate: true } : { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: immediate || ux.reduce ? "auto" : "smooth" });
  };

  /* ---------- B · Índice editorial: el servicio activo recompone el folio (número, ruta, texto) ---------- */
  register("services", "B", (root, ux) => {
    const rows = $$(".services-b__row", root), list = $(".services-b__list", root);
    const fno = $(".services-b__fno-in", root), dest = $(".services-b__dest", root), line = $(".services-b__route i", root);
    const ftag = $(".services-b__ftag", root), fdesc = $(".services-b__fdesc", root);
    const data = rows.map(r => ({ n: $(".services-b__n", r).textContent, name: $(".services-b__name", r).textContent, tag: $(".services-b__tag", r).textContent, desc: $(".services-b__desc", r).textContent }));
    const ac = new AbortController(), sig = { signal: ac.signal };
    let cur = 0;
    rows[0].classList.add("is-on");
    const set = (i) => {
      if (i === cur) return;
      const dir = i > cur ? 1 : -1; cur = i;
      rows.forEach((r, k) => r.classList.toggle("is-on", k === i));
      const d = data[i];
      if (ux.reduce) { fno.textContent = d.n; dest.textContent = d.name; ftag.textContent = d.tag; fdesc.textContent = d.desc; return; }
      gsap.killTweensOf([fno, line, ftag, fdesc, dest]);
      gsap.timeline()
        .to(fno, { yPercent: -100 * dir, duration: .22, ease: "power2.in" })
        .add(() => { fno.textContent = d.n; dest.textContent = d.name; ftag.textContent = d.tag; fdesc.textContent = d.desc; })
        .fromTo(fno, { yPercent: 100 * dir }, { yPercent: 0, duration: .7, ease: "expo.out" })
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: .8, ease: "expo.out" }, "<")
        .fromTo([ftag, fdesc, dest], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .55, stagger: .05, ease: "power3.out" }, "<.05");
    };
    rows.forEach((r, i) => {
      r.addEventListener("pointerenter", () => set(i), sig);
      r.addEventListener("focus", () => set(i), sig);
    });
    if (!ux.reduce) {
      const names = rows.map(r => $(".services-b__name>span", r));
      gsap.fromTo(names, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: list, start: "top 80%" } });
      gsap.from($$(".services-b__meta", root), { opacity: 0, duration: .8, stagger: .04, ease: "power2.out", scrollTrigger: { trigger: list, start: "top 80%" } });
      gsap.from($(".services-b__title", root), { yPercent: 25, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
      gsap.from(fno, { yPercent: 100, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: list, start: "top 75%" } });
      gsap.from(line, { scaleX: 0, duration: 1.2, delay: .3, ease: "expo.out", scrollTrigger: { trigger: list, start: "top 75%" } });
    }
    return () => ac.abort();
  });

  /* ---------- C · Recorrido horizontal: pin con scrub en escritorio (scroll normal, nunca bloquea), carril nativo en móvil ---------- */
  register("services", "C", (root, ux) => {
    const pinEl = $(".services-c__pin", root), view = $(".services-c__view", root), track = $(".services-c__track", root);
    const panels = $$(".services-c__p", root), dots = $$(".services-c__dots button", root), bar = $(".services-c__bar i", root);
    const prev = $(".services-c__prev", root), next = $(".services-c__next", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const pinned = !ux.reduce && matchMedia("(min-width: 901px) and (min-height: 620px)").matches;
    let active = -1;
    const pad = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const setActive = (k, p) => {
      bar.style.setProperty("--prog", p);
      if (k === active) return; active = k;
      panels.forEach((el, i) => el.classList.toggle("is-on", i <= k));
      dots.forEach((d, i) => i === k ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current"));
      prev.disabled = k <= 0; next.disabled = k >= panels.length - 1;
    };
    const idxFor = (x, w) => { let k = 0; panels.forEach((el, i) => { if (el.offsetLeft - pad() <= x + w * .4) k = i; }); return k; };
    let go;
    if (pinned) {
      root.classList.add("is-pinned");
      const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
      const tween = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: {
        trigger: root, pin: pinEl, start: "top top", end: () => "+=" + dist() * .9, scrub: .7, invalidateOnRefresh: true,
        onUpdate: (s) => setActive(idxFor(s.progress * dist(), view.clientWidth), s.progress)
      } });
      const st = tween.scrollTrigger;
      go = (k, immediate) => {
        k = gsap.utils.clamp(0, panels.length - 1, k);
        const x = Math.min(dist(), Math.max(0, panels[k].offsetLeft - pad()));
        smoothTo(ux, st.start + (dist() ? x / dist() : 0) * (st.end - st.start) + 1, immediate);
      };
      panels.forEach(p => {
        const img = $(".services-c__fig img", p); if (!img) return;
        gsap.fromTo(img, { scale: 1.22, xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      gsap.from($$(".services-c__p--hub > *", root), { y: 40, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
      // al tabular a un enlace fuera de vista, el recorrido lo trae a pantalla
      view.addEventListener("focusin", (e) => { const p = e.target.closest(".services-c__p"); if (p) go(panels.indexOf(p), true); }, sig);
    } else {
      const upd = () => { const max = view.scrollWidth - view.clientWidth; setActive(idxFor(view.scrollLeft, view.clientWidth), max ? view.scrollLeft / max : 0); };
      view.addEventListener("scroll", upd, { passive: true, signal: ac.signal });
      go = (k) => { k = gsap.utils.clamp(0, panels.length - 1, k); view.scrollTo({ left: panels[k].offsetLeft - pad(), behavior: ux.reduce ? "auto" : "smooth" }); };
      upd();
      const hint = $(".services-c__hint", root); if (hint) hint.firstChild.textContent = "Desliza o usa las flechas ";
    }
    dots.forEach((d, i) => d.addEventListener("click", () => go(i), sig));
    prev.addEventListener("click", () => go(active - 1), sig);
    next.addEventListener("click", () => go(active + 1), sig);
    root.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (!pinned && e.target === view) return; // el carril nativo ya responde a las flechas
      const n = active + (e.key === "ArrowRight" ? 1 : -1);
      if (n < 0 || n >= panels.length) return; // en los extremos no retenemos nada
      e.preventDefault(); go(n);
    }, sig);
    setActive(0, 0);
    return () => { ac.abort(); root.classList.remove("is-pinned"); };
  });

  /* ---------- D · Pantalla dividida: índice que avanza con el scroll + escenario fijo con cortina de tinta ---------- */
  register("services", "D", (root, ux) => {
    const items = $$(".services-d__item", root), slides = $$(".services-d__slide", root);
    const ink = $(".services-d__ink", root), bigIn = $(".services-d__big-in", root), dest = $(".services-d__dest", root), ticks = $$(".services-d__ticks li", root);
    const names = items.map(it => $("h3", it).textContent);
    const desktop = matchMedia("(min-width: 901px)").matches;
    let cur = -1, tl = null;
    const show = (i, dir = 1) => {
      if (i === cur) return;
      const prevI = cur; cur = i;
      items.forEach((it, k) => it.classList.toggle("is-on", k === i));
      ticks.forEach((t, k) => t.classList.toggle("is-on", k === i));
      if (!desktop) return;
      if (tl) tl.progress(1).kill();
      const nw = slides[i], old = prevI >= 0 ? slides[prevI] : null, img = $("img", nw);
      const label = String(i + 1).padStart(2, "0");
      if (ux.reduce || prevI < 0) {
        slides.forEach((s, k) => { s.classList.toggle("is-on", k === i); gsap.set(s, { clearProps: "clipPath,zIndex" }); });
        bigIn.textContent = label; dest.textContent = names[i]; return;
      }
      const from = dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", to = dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";
      tl = gsap.timeline({ defaults: { overwrite: "auto" } })
        .fromTo(ink, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: .42, ease: "power3.in" })
        .to(old ? $("img", old) : {}, { scale: 1.06, duration: .42, ease: "power2.in" }, 0)
        .to(bigIn, { yPercent: -105 * dir, duration: .3, ease: "power2.in" }, 0)
        .add(() => {
          slides.forEach((s, k) => s.classList.toggle("is-on", k === i));
          if (old) gsap.set($("img", old), { clearProps: "transform" });
          bigIn.textContent = label; dest.textContent = names[i];
        })
        .fromTo(img, { scale: 1.28, yPercent: 6 * dir }, { scale: 1, yPercent: 0, duration: 1.5, ease: "expo.out" })
        .fromTo(ink, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: to, duration: .75, ease: "expo.inOut" }, "<")
        .fromTo(bigIn, { yPercent: 105 * dir }, { yPercent: 0, duration: .9, ease: "expo.out" }, "<.15")
        .fromTo(dest, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: .5, ease: "power2.out" }, "<.1");
    };
    items.forEach((it, i) => ScrollTrigger.create({ trigger: it, start: "top 58%", end: "bottom 58%", onToggle: (s) => { if (s.isActive) show(i, s.direction); } }));
    show(0);
    if (!ux.reduce) {
      gsap.from($(".services-d__title", root), { yPercent: 30, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
      if (desktop) gsap.from($(".services-d__frame", root), { clipPath: "inset(12% 8% 12% 8%)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: root, start: "top 65%" } });
      else $$(".services-d__mfig", root).forEach(f => gsap.from(f, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 85%" } }));
    }
    return () => { if (tl) tl.kill(); };
  });
})();

/* ==========================================================
   Ronda 7 «Siete nuevas, línea de las favoritas» · G–M
   Todo arranca solo al entrar en pantalla y se pausa fuera de ella
   (IntersectionObserver) o con la pestaña oculta. Ratón, foco y
   teclado mandan sobre el modo automático.
   ========================================================== */
(() => {
  const { register, $, $$ } = UX;
  const TAU = Math.PI * 2;
  const mod = (a, n) => ((a % n) + n) % n;

  /* on(true/false) cuando la versión entra o sale de pantalla (o se oculta la pestaña) */
  const onScreen = (el, on) => {
    let vis = false;
    const emit = () => on(vis && !document.hidden);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; emit(); }, { threshold: .2 });
    io.observe(el);
    document.addEventListener("visibilitychange", emit);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", emit); };
  };

  /* Recorre los seis servicios cada `sec` segundos mientras está en pantalla y nadie lo maneja */
  const cycler = (n, go, sec) => {
    let i = 0, call = null, live = false, held = false;
    const arm = () => { if (call) call.kill(); call = live && !held ? gsap.delayedCall(sec, tick) : null; };
    const tick = () => { i = (i + 1) % n; go(i); arm(); };
    return {
      live(v) { live = v; arm(); },
      hold(j) { held = true; if (j != null && j !== i) { i = j; go(i); } arm(); },
      release() { held = false; arm(); },
      kill() { if (call) call.kill(); call = null; live = false; }
    };
  };

  /* Bucle rAF que solo corre mientras la versión está en pantalla */
  const frameLoop = frame => {
    let raf = 0, last = 0, on = false;
    const tick = t => { raf = 0; if (!on) return; const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t; frame(dt); raf = requestAnimationFrame(tick); };
    return {
      set(v) { on = v; last = 0; if (on && !raf) raf = requestAnimationFrame(tick); },
      kill() { on = false; cancelAnimationFrame(raf); }
    };
  };

  /* Muelle como easing CSS linear() (port de springEasing del «3D Isometric Image Carousel» de 21st.dev) */
  const springEasing = (bounce, duration, samples = 48) => {
    const zeta = 1 - Math.min(Math.max(bounce, 0), .9), w = TAU / Math.max(duration, .05);
    const at = t => zeta >= 1 ? 1 - Math.exp(-w * t) * (1 + w * t)
      : (() => { const wd = w * Math.sqrt(1 - zeta * zeta); return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t)); })();
    const T = Math.log(1000) / (zeta * w), pts = [];
    for (let k = 0; k <= samples; k++) pts.push(+(k === samples ? 1 : at(k / samples * T)).toFixed(4));
    return { easing: `linear(${pts.join(", ")})`, ms: Math.round(T * 1000) };
  };

  const enter = (trigger, vars) => gsap.from(vars.targets, { ...vars, targets: undefined, scrollTrigger: { trigger, start: "top 78%" } });

  /* ---------- E · Mosaico duotono (antes M): la foto activa tiñe el fondo ---------- */
  register("services", "E", (root, ux) => {
    const grid = $(".services-e__grid", root), tiles = $$(".services-e__tile", root), cards = $$(".services-e__card", root), bgs = $$(".services-e__bg img", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const ORDER = [0, 4, 2, 3, 1, 5];
    let cur = -1;
    const show = i => {
      if (i === cur) return;
      const prev = cur; cur = i;
      tiles.forEach((t, k) => t.classList.toggle("is-on", k === i));
      if (i > -1) bgs.forEach((b, k) => b.classList.toggle("is-on", k === i));
      if (prev > -1) ux.reduce ? gsap.set(cards[prev], { rotationY: 92 }) : gsap.to(cards[prev], { rotationY: 92, duration: .6, ease: "power3.in", overwrite: true });
      if (i > -1) ux.reduce ? gsap.set(cards[i], { rotationY: 0 }) : gsap.fromTo(cards[i], { rotationY: -92 }, { rotationY: 0, duration: 1.1, ease: "expo.out", overwrite: true, delay: prev > -1 ? .25 : 0 });
    };
    if (ux.reduce) {
      tiles.forEach((t, k) => { t.addEventListener("pointerenter", () => show(k), sig); t.addEventListener("focus", () => show(k), sig); });
      grid.addEventListener("pointerleave", () => show(-1), sig);
      return () => ac.abort();
    }
    let step = 0;
    const c = cycler(ORDER.length, j => { step = j; show(ORDER[j]); }, 3.1);
    tiles.forEach((t, k) => {
      t.addEventListener("pointerenter", () => { c.hold(); show(k); }, sig);
      t.addEventListener("focus", () => { c.hold(); show(k); }, sig);
    });
    grid.addEventListener("pointerleave", () => c.release(), sig);
    grid.addEventListener("focusout", e => { if (!grid.contains(e.relatedTarget)) c.release(); }, sig);
    let started = false;
    const stop = onScreen(root, v => { if (v && !started) { started = true; show(ORDER[0]); } c.live(v); });
    enter(grid, { targets: tiles, opacity: 0, scale: .94, duration: 1, stagger: { each: .07, from: "center" }, ease: "expo.out" });
    return () => { ac.abort(); stop(); c.kill(); };
  });

  /* Lógica común de F y G: una ventana activa que gira (en X o en Y) y recorre los seis servicios sola.
     axis "x" = persiana vertical (F), "y" = tarjeta que da la vuelta (G). onShow(i) cambia el fondo. */
  const flipper = (root, ux, { tileSel, inSel, axis, order, sec, onShow }) => {
    const tiles = $$(tileSel, root), ins = tiles.map(t => $(inSel, t)), box = tiles[0].parentElement;
    const rot = axis === "x" ? "rotationX" : "rotationY";
    const ac = new AbortController(), sig = { signal: ac.signal };
    let cur = -1;
    const show = i => {
      if (i === cur) return;
      const prev = cur; cur = i;
      tiles.forEach((t, k) => t.classList.toggle("is-on", k === i));
      if (prev > -1) ux.reduce ? gsap.set(ins[prev], { [rot]: 0 }) : gsap.to(ins[prev], { [rot]: 0, duration: .9, ease: "power3.inOut", overwrite: true });
      if (i > -1) ux.reduce ? gsap.set(ins[i], { [rot]: 180 }) : gsap.to(ins[i], { [rot]: 180, duration: 1.15, ease: "expo.inOut", overwrite: true, delay: prev > -1 ? .15 : 0 });
      if (i > -1 && onShow) onShow(i);
    };
    if (ux.reduce) {
      tiles.forEach((t, k) => { t.addEventListener("pointerenter", () => show(k), sig); t.addEventListener("focus", () => show(k), sig); });
      box.addEventListener("pointerleave", () => show(-1), sig);
      return () => ac.abort();
    }
    const c = cycler(order.length, j => show(order[j]), sec);
    tiles.forEach((t, k) => {
      t.addEventListener("pointerenter", () => { c.hold(); show(k); }, sig);
      t.addEventListener("focus", () => { c.hold(); show(k); }, sig);
    });
    box.addEventListener("pointerleave", () => c.release(), sig);
    box.addEventListener("focusout", e => { if (!box.contains(e.relatedTarget)) c.release(); }, sig);
    let started = false;
    const stop = onScreen(root, v => { if (v && !started) { started = true; show(order[0]); } c.live(v); });
    return () => { ac.abort(); stop(); c.kill(); };
  };

  /* ---------- F · Columnas azules: la columna activa gira en vertical; detrás, su nombre a toda escala ---------- */
  register("services", "F", (root, ux) => {
    const words = $$(".services-f__word span", root);
    const off = flipper(root, ux, { tileSel: ".services-f__col", inSel: ".services-f__in", axis: "x", order: [0, 1, 2, 3, 4, 5], sec: 3,
      onShow: i => words.forEach((w, k) => w.classList.toggle("is-on", k === i)) });
    if (!ux.reduce) enter($(".services-f__cols", root), { targets: $$(".services-f__col", root), opacity: 0, yPercent: 14, duration: 1.1, stagger: .08, ease: "expo.out" });
    return off;
  });

  /* ---------- G · Mosaico claro: una panorámica partida en seis ventanas; cada una da la vuelta como una tarjeta.
     Al completar una vuelta a los seis servicios cambia la panorámica. ---------- */
  register("services", "G", (root, ux) => {
    const pans = $$(".services-g__pan img", root);
    let seen = 0, p = 0;
    const off = flipper(root, ux, { tileSel: ".services-g__tile", inSel: ".services-g__in", axis: "y", order: [0, 4, 2, 3, 1, 5], sec: 3.2,
      onShow: () => { if (++seen > 1 && seen % 6 === 1) { p = (p + 1) % pans.length; pans.forEach((im, k) => im.classList.toggle("is-on", k === p)); } } });
    let pan = null;
    if (!ux.reduce) {
      pan = gsap.fromTo(pans, { xPercent: 2.5 }, { xPercent: -2.5, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 });
      enter($(".services-g__grid", root), { targets: $$(".services-g__tile", root), opacity: 0, scale: .94, duration: 1, stagger: { each: .07, from: "center" }, ease: "expo.out" });
    }
    return () => { off(); if (pan) pan.kill(); };
  });
})();
