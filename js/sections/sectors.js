/* 11 · Sectores — 5 versiones */
(() => {
  const { register } = UX;

  const SECTORS = [
    { name: "Vehículos", desc: "Rotulación de vehículos y flotas, car wrapping y cambio de color.", proj: "Lexus · TK Elevator · J.Pujol" },
    { name: "Stands y Ferias", desc: "Stands llave en mano para ferias y congresos en toda España.", proj: "Eversense · Janssen · Cava Pharma" },
    { name: "Retail y PLV", desc: "PLV, escaparates y pop-up stores para el punto de venta.", proj: "Venca" },
    { name: "Hostelería", desc: "Murales, decoración y señalética para restaurantes y hoteles.", proj: "McDonald's · Five Guys" },
    { name: "Oficinas", desc: "Vinilos decorativos, murales corporativos y señalética interior.", proj: "3cat" },
    { name: "Publicidad Exterior", desc: "Lonas de fachada, vallas y grandes formatos de exterior.", proj: "Tibidabo" },
    { name: "Eventos Deportivos", desc: "Gráfica y rotulación para equipos, competiciones y eventos.", proj: "Tibau Team" },
    { name: "Pharma", desc: "Stands, congresos y material para la industria farmacéutica.", proj: "Janssen · Eversense · Cava Pharma" }
  ];

  /* ---------- A · Bolas con física (arrastrables) ---------- */
  register("sectors", "A", (root, ux) => {
    const box = ux.$(".sec-a__box", root);
    const els = ux.$$(".sec-ball", box);
    if (ux.reduce) { box.classList.add("is-static"); return; }
    box.classList.remove("is-static");

    let W = 0, H = 0, raf = 0, running = false, dropped = false, last = 0;
    const balls = els.map(el => ({ el, k: +el.dataset.r || 1, r: 40, x: 0, y: 0, vx: 0, vy: 0, drag: false }));
    const G = 2200, REST = .38, AIR = .9985, FLOOR_FRICTION = .985;

    const size = () => {
      W = box.clientWidth; H = box.clientHeight;
      const base = Math.max(44, Math.min(98, W * .085));
      balls.forEach(b => {
        b.r = base * b.k;
        const label = b.el.textContent.trim();
        b.el.style.width = b.el.style.height = b.r * 2 + "px";
        b.el.style.fontSize = (label ? b.r * (label.length > 12 ? .21 : .27) : 0) + "px";
        b.x = Math.min(Math.max(b.x, b.r), W - b.r);
        if (b.y > H - b.r) b.y = H - b.r;
      });
    };
    const place = () => balls.forEach((b, i) => {
      b.x = b.r + Math.random() * (W - 2 * b.r);
      b.y = -b.r - i * (H * .12) - Math.random() * 60;
      b.vx = (Math.random() - .5) * 200; b.vy = 0;
    });
    const draw = () => balls.forEach(b => (b.el.style.transform = `translate3d(${b.x - b.r}px,${b.y - b.r}px,0)`));

    const step = dt => {
      balls.forEach(b => {
        if (b.drag) return;
        b.vy += G * dt; b.vx *= AIR; b.vy *= AIR;
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * REST; }
        if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * REST; }
        if (b.y > H - b.r) { b.y = H - b.r; b.vy = -Math.abs(b.vy) * REST; b.vx *= FLOOR_FRICTION; if (Math.abs(b.vy) < 30) b.vy = 0; }
      });
      for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], c = balls[j];
        const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || .001, min = a.r + c.r;
        if (d >= min) continue;
        const nx = dx / d, ny = dy / d, ov = min - d;
        const ma = a.drag ? 0 : 1 / (a.r * a.r), mc = c.drag ? 0 : 1 / (c.r * c.r), mt = ma + mc;
        if (!mt) continue;
        a.x -= nx * ov * (ma / mt); a.y -= ny * ov * (ma / mt);
        c.x += nx * ov * (mc / mt); c.y += ny * ov * (mc / mt);
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) {
          const jimp = -(1 + REST) * rv / mt;
          a.vx -= jimp * nx * ma; a.vy -= jimp * ny * ma;
          c.vx += jimp * nx * mc; c.vy += jimp * ny * mc;
        }
      }
    };
    const loop = t => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(1 / 30, (t - (last || t)) / 1000); last = t;
      for (let s = 0; s < 3; s++) step(dt / 3);
      draw();
    };
    const start = () => { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // Arrastre
    let held = null, offX = 0, offY = 0, px = 0, py = 0, pt = 0;
    const local = e => { const r = box.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const down = e => {
      const el = e.target.closest(".sec-ball"); if (!el) return;
      held = balls.find(b => b.el === el); if (!held) return;
      e.preventDefault();
      const [x, y] = local(e); offX = x - held.x; offY = y - held.y; px = x; py = y; pt = performance.now();
      held.drag = true; held.vx = held.vy = 0; box.classList.add("is-grab");
      box.setPointerCapture(e.pointerId);
      gsap.to(el, { scale: 1.08, duration: .25, overwrite: "auto" });
    };
    const move = e => {
      if (!held) return;
      const [x, y] = local(e), now = performance.now(), dt = Math.max(.008, (now - pt) / 1000);
      held.vx = (x - px) / dt; held.vy = (y - py) / dt; px = x; py = y; pt = now;
      held.x = Math.min(Math.max(x - offX, held.r), W - held.r);
      held.y = Math.min(y - offY, H - held.r);
    };
    const up = () => {
      if (!held) return;
      held.vx = Math.max(-2600, Math.min(2600, held.vx)); held.vy = Math.max(-2600, Math.min(2600, held.vy));
      gsap.to(held.el, { scale: 1, duration: .4, ease: "back.out(2)" });
      held.drag = false; held = null; box.classList.remove("is-grab");
    };
    box.addEventListener("pointerdown", down);
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerup", up);
    box.addEventListener("pointercancel", up);
    const onResize = () => size();
    addEventListener("resize", onResize);

    size(); place(); draw();
    ScrollTrigger.create({
      trigger: box, start: "top 85%", end: "bottom top",
      onToggle: s => { if (s.isActive) { if (!dropped) { dropped = true; place(); } start(); } else stop(); }
    });

    return () => {
      stop(); removeEventListener("resize", onResize);
      box.removeEventListener("pointerdown", down); box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerup", up); box.removeEventListener("pointercancel", up);
    };
  });

  /* ---------- B · Lista con imagen fija ---------- */
  register("sectors", "B", (root, ux) => {
    const btns = ux.$$(".sec-b__list button", root), figs = ux.$$(".sec-b__frame figure", root), count = ux.$(".sec-b__count b", root);
    let cur = 0;
    figs.forEach((f, j) => { f.classList.remove("was"); f.classList.toggle("is-on", j === 0); });
    btns.forEach((b, j) => { b.classList.toggle("is-on", j === 0); b.setAttribute("aria-pressed", j === 0); });
    count.textContent = "01";
    const set = i => {
      if (i === cur) return;
      figs.forEach(f => f.classList.remove("was"));
      figs[cur].classList.replace("is-on", "was");
      figs[i].classList.add("is-on");
      btns.forEach((b, j) => { b.classList.toggle("is-on", j === i); b.setAttribute("aria-pressed", j === i); });
      count.textContent = String(i + 1).padStart(2, "0");
      cur = i;
    };
    const handlers = btns.map((b, i) => {
      const h = () => set(i);
      b.addEventListener("click", h); b.addEventListener("focus", h);
      if (ux.fine) b.addEventListener("pointerenter", h);
      return h;
    });
    if (!ux.reduce) gsap.from(ux.$$(".sec-b__list li", root), { y: 40, opacity: 0, duration: 1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ux.$(".sec-b__list", root), start: "top 85%" } });
    return () => btns.forEach((b, i) => { b.removeEventListener("click", handlers[i]); b.removeEventListener("focus", handlers[i]); b.removeEventListener("pointerenter", handlers[i]); });
  });

  /* ---------- C · Tarjetas ---------- */
  register("sectors", "C", (root, ux) => {
    const cards = ux.$$(".sec-c__card", root);
    const vids = cards.filter(c => ux.$("video", c));
    const on = e => { const c = e.currentTarget, v = ux.$("video", c); if (v.preload === "none") v.preload = "auto"; v.play().then(() => c.classList.add("is-vid")).catch(() => {}); };
    const off = e => { const c = e.currentTarget, v = ux.$("video", c); v.pause(); c.classList.remove("is-vid"); };
    if (!ux.reduce) {
      vids.forEach(c => { c.addEventListener("pointerenter", on); c.addEventListener("pointerleave", off); c.addEventListener("focus", on); c.addEventListener("blur", off); });
      gsap.from(cards, { clipPath: "inset(100% 0 0 0 round 20px)", duration: 1.3, stagger: .07, ease: "expo.inOut", scrollTrigger: { trigger: ux.$(".sec-c__grid", root), start: "top 85%" } });
      gsap.from(ux.$$(".sec-c__card img", root), { scale: 1.3, duration: 1.8, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ux.$(".sec-c__grid", root), start: "top 85%" } });
    }
    return () => vids.forEach(c => { c.removeEventListener("pointerenter", on); c.removeEventListener("pointerleave", off); c.removeEventListener("focus", on); c.removeEventListener("blur", off); });
  });

  /* ---------- D · Marquesina de iconos (acelera con el scroll) ---------- */
  register("sectors", "D", (root, ux) => {
    const tracks = ux.$$(".sec-d__track", root);
    tracks.forEach(t => {
      if (t.dataset.dup) return;
      const items = [...t.children];
      for (let k = 0; k < 2; k++) items.forEach(li => { const c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); t.append(c); });
      t.dataset.dup = "1";
    });
    if (ux.reduce) return;
    gsap.from(ux.$$(".sec-d__row", root), { y: 60, opacity: 0, duration: 1.2, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    const rows = tracks.map((el, i) => ({ el, x: i % 2 ? -el.scrollWidth / 3 : 0, dir: i % 2 ? 1 : -1 }));
    let vel = 0, visible = false;
    const onLenis = e => (vel = e.velocity || 0);
    const unsub = ux.lenis ? ux.lenis.on("scroll", onLenis) : null;
    ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onToggle: s => (visible = s.isActive) });
    const tick = () => {
      if (!visible) return;
      const boost = Math.min(Math.abs(vel) * .3, 14);
      rows.forEach(r => {
        const third = r.el.scrollWidth / 3; if (!third) return;
        r.x += (.7 + boost) * r.dir;
        if (r.x <= -third) r.x += third; if (r.x > 0) r.x -= third;
        r.el.style.transform = `translate3d(${r.x}px,0,0)`;
      });
      vel *= .9;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); if (typeof unsub === "function") unsub(); else if (ux.lenis && ux.lenis.off) ux.lenis.off("scroll", onLenis); };
  });

  /* ---------- E · Pestañas ---------- */
  register("sectors", "E", (root, ux) => {
    const tabs = ux.$$('[role="tab"]', root), imgs = ux.$$(".sec-e__imgs img", root), panel = ux.$(".sec-e__panel", root);
    const n = ux.$(".sec-e__n b", root), name = ux.$(".sec-e__name", root), desc = ux.$(".sec-e__desc", root), proj = ux.$(".sec-e__proj span", root);
    const info = [n.parentElement, name, desc, proj.parentElement];
    let cur = 0, timer = 0, touched = false, inView = false;
    imgs.forEach((im, j) => { im.classList.remove("was"); im.classList.toggle("is-on", j === 0); });
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === 0); t.tabIndex = j === 0 ? 0 : -1; });
    n.textContent = "01"; name.textContent = SECTORS[0].name; desc.textContent = SECTORS[0].desc; proj.textContent = SECTORS[0].proj;
    const set = (i, focus) => {
      if (i === cur) return;
      imgs.forEach(im => im.classList.remove("was"));
      imgs[cur].classList.replace("is-on", "was"); imgs[i].classList.add("is-on");
      tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
      panel.setAttribute("aria-labelledby", tabs[i].id);
      if (focus) tabs[i].focus();
      const s = SECTORS[i];
      const apply = () => { n.textContent = String(i + 1).padStart(2, "0"); name.textContent = s.name; desc.textContent = s.desc; proj.textContent = s.proj; };
      if (ux.reduce) apply();
      else gsap.timeline().to(info, { y: -16, opacity: 0, duration: .25, stagger: .03, ease: "power2.in" }).add(apply).fromTo(info, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: "expo.out" });
      cur = i;
    };
    const auto = () => { clearInterval(timer); if (!ux.reduce && !touched && inView) timer = setInterval(() => set((cur + 1) % tabs.length), 5000); };
    const stopAuto = () => { touched = true; clearInterval(timer); };
    const onClick = e => { const i = tabs.indexOf(e.currentTarget); stopAuto(); set(i); };
    const onKey = e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in map) { e.preventDefault(); stopAuto(); set((i + map[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === "Home") { e.preventDefault(); stopAuto(); set(0, true); }
      if (e.key === "End") { e.preventDefault(); stopAuto(); set(tabs.length - 1, true); }
    };
    tabs.forEach(t => t.addEventListener("click", onClick));
    const tl = ux.$(".sec-e__tabs", root); tl.addEventListener("keydown", onKey);
    root.addEventListener("pointerenter", stopAuto);
    ScrollTrigger.create({ trigger: root, start: "top 70%", end: "bottom 30%", onToggle: s => { inView = s.isActive; auto(); if (!inView) clearInterval(timer); } });
    if (!ux.reduce) gsap.from(tabs, { x: -30, opacity: 0, duration: .9, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => { clearInterval(timer); tabs.forEach(t => t.removeEventListener("click", onClick)); tl.removeEventListener("keydown", onKey); root.removeEventListener("pointerenter", stopAuto); };
  });
})();
