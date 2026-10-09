/* 11 · Sectores — A favorita (bolas de texto) + 5 nuevas */
(() => {
  const { register } = UX;

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
      const base = Math.max(52, Math.min(120, W * .105));
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


  /* ---------- B · Dial giratorio ---------- */
  register("sectors", "B", (root, ux) => {
    const dial = ux.$(".sec-b__dial", root), wheel = ux.$(".sec-b__wheel", root);
    const items = ux.$$(".sec-b__item", root), imgs = ux.$$(".sec-b__core img", root);
    const nEl = ux.$(".sec-b__n", root), nameEl = ux.$(".sec-b__name", root), descEl = ux.$(".sec-b__desc", root);
    const DESCS = ["Rotulación de vehículos y flotas, car wrapping y cambio de color.", "Stands llave en mano para ferias y congresos en toda España.", "PLV, escaparates y pop-up stores para el punto de venta.", "Murales, decoración y señalética para restaurantes y hoteles.", "Vinilos decorativos, murales corporativos y señalética interior.", "Lonas de fachada, vallas y grandes formatos de exterior.", "Gráfica y rotulación para equipos, competiciones y eventos.", "Stands, congresos y material para la industria farmacéutica."];
    const N = items.length, STEP = 360 / N;
    let rot = 0, cur = 0;
    const rotObj = { r: 0 };
    const apply = r => wheel.style.setProperty("--rot", r + "deg");
    const select = i => {
      i = ((i % N) + N) % N; if (i === cur && nameEl.textContent === items[i].textContent) return;
      cur = i;
      items.forEach((it, k) => it.setAttribute("aria-selected", k === i));
      imgs.forEach((im, k) => im.classList.toggle("is-on", k === i));
      dial.setAttribute("aria-activedescendant", items[i].id);
      nEl.textContent = `${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      nameEl.textContent = items[i].textContent; descEl.textContent = DESCS[i];
      if (!ux.reduce) gsap.fromTo([nameEl, descEl], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06, ease: "expo.out", overwrite: "auto" });
    };
    const goTo = (target, animate = true) => {
      rot = target;
      const idx = Math.round(-rot / STEP);
      select(idx);
      if (ux.reduce || !animate) { rotObj.r = rot; apply(rot); return; }
      gsap.to(rotObj, { r: rot, duration: .8, ease: "expo.out", overwrite: true, onUpdate: () => apply(rotObj.r) });
    };
    const step = d => goTo(Math.round(rot / STEP) * STEP - d * STEP);
    const onBtn = e => { const b = e.target.closest(".sec-b__ctrl button"); if (b) step(+b.dataset.d); };
    const onKey = e => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    };
    const onItem = e => { const it = e.target.closest(".sec-b__item"); if (!it || moved > 6) return; const i = +it.dataset.i; let d = (i - cur) % N; if (d > N / 2) d -= N; if (d < -N / 2) d += N; step(d); };
    // Arrastre circular
    let dragging = false, a0 = 0, r0 = 0, moved = 0;
    const ang = e => { const r = dial.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
    const down = e => { dragging = true; moved = 0; a0 = ang(e); r0 = rotObj.r; dial.classList.add("is-grab"); dial.setPointerCapture(e.pointerId); gsap.killTweensOf(rotObj); };
    const move = e => { if (!dragging) return; let d = ang(e) - a0; if (d > 180) d -= 360; if (d < -180) d += 360; moved = Math.max(moved, Math.abs(d)); rotObj.r = r0 + d; apply(rotObj.r); select(Math.round(-rotObj.r / STEP)); };
    const up = () => { if (!dragging) return; dragging = false; dial.classList.remove("is-grab"); goTo(Math.round(rotObj.r / STEP) * STEP); };
    root.addEventListener("click", onBtn); dial.addEventListener("keydown", onKey); dial.addEventListener("click", onItem);
    dial.addEventListener("pointerdown", down); dial.addEventListener("pointermove", move); dial.addEventListener("pointerup", up); dial.addEventListener("pointercancel", up);
    apply(0);
    if (!ux.reduce) {
      gsap.fromTo(rotObj, { r: 90 }, { r: 0, duration: 1.6, ease: "expo.out", onUpdate: () => apply(rotObj.r), scrollTrigger: { trigger: dial, start: "top 80%", once: true } });
      gsap.from(ux.$(".sec-b__core", root), { scale: .6, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: dial, start: "top 80%", once: true } });
    }
    return () => {
      root.removeEventListener("click", onBtn); dial.removeEventListener("keydown", onKey); dial.removeEventListener("click", onItem);
      dial.removeEventListener("pointerdown", down); dial.removeEventListener("pointermove", move); dial.removeEventListener("pointerup", up); dial.removeEventListener("pointercancel", up);
    };
  });

  /* ---------- C · Iconos de línea que se dibujan ---------- */
  register("sectors", "C", (root, ux) => {
    const tiles = ux.$$(".sec-c__tile", root);
    const shapes = tile => ux.$$(".sec-ico path, .sec-ico circle", tile);
    tiles.forEach(t => shapes(t).forEach(s => s.setAttribute("pathLength", 1)));
    if (ux.reduce) return;
    tiles.forEach(t => gsap.set(shapes(t), { strokeDasharray: "1 1", strokeDashoffset: 1 }));
    ScrollTrigger.batch(tiles, { start: "top 85%", once: true, onEnter: b => b.forEach((t, k) => gsap.to(shapes(t), { strokeDashoffset: 0, duration: 1.4, delay: k * .12, ease: "power2.inOut" })) });
    const redraw = e => { const t = e.currentTarget; gsap.fromTo(shapes(t), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .9, ease: "power2.inOut", overwrite: true }); };
    tiles.forEach(t => { t.addEventListener("pointerenter", redraw); t.addEventListener("focus", redraw); });
    return () => tiles.forEach(t => { t.removeEventListener("pointerenter", redraw); t.removeEventListener("focus", redraw); });
  });

  /* ---------- D · Nube tipográfica con foto flotante ---------- */
  register("sectors", "D", (root, ux) => {
    const cloud = ux.$(".sec-d__cloud", root), words = ux.$$(".sec-d__w", root);
    const desc = ux.$(".sec-d__desc", root), fl = ux.$(".sec-d__float", root), flImg = ux.$("img", fl);
    const DEF = desc.textContent;
    const on = w => {
      cloud.classList.add("is-hover"); words.forEach(x => x.classList.toggle("is-on", x === w));
      desc.textContent = `${w.textContent} — ${w.dataset.desc}`;
      if (flImg.getAttribute("src") !== w.dataset.img) flImg.src = w.dataset.img;
      if (ux.fine) fl.classList.add("is-on");
    };
    const off = () => { cloud.classList.remove("is-hover"); words.forEach(x => x.classList.remove("is-on")); desc.textContent = DEF; fl.classList.remove("is-on"); };
    const enter = e => on(e.currentTarget);
    words.forEach(w => { w.addEventListener("pointerenter", enter); w.addEventListener("focus", enter); w.addEventListener("click", enter); });
    cloud.addEventListener("pointerleave", off); cloud.addEventListener("focusout", e => { if (!cloud.contains(e.relatedTarget)) off(); });
    let xTo, yTo, pm;
    if (ux.fine && !ux.reduce) {
      xTo = gsap.quickTo(fl, "x", { duration: .5, ease: "power3" }); yTo = gsap.quickTo(fl, "y", { duration: .5, ease: "power3" });
      pm = e => { xTo(e.clientX + 24); yTo(e.clientY - fl.offsetHeight / 2); };
      addEventListener("pointermove", pm);
    }
    if (!ux.reduce) gsap.from(ux.$$("li", cloud), { yPercent: 80, opacity: 0, rotate: () => gsap.utils.random(-8, 8), duration: 1.2, stagger: { each: .07, from: "random" }, ease: "expo.out", scrollTrigger: { trigger: cloud, start: "top 80%", once: true } });
    return () => { if (pm) removeEventListener("pointermove", pm); words.forEach(w => { w.removeEventListener("pointerenter", enter); w.removeEventListener("focus", enter); w.removeEventListener("click", enter); }); cloud.removeEventListener("pointerleave", off); fl.classList.remove("is-on"); };
  });

  /* ---------- E · Fichas de dominó que caen en cadena ---------- */
  register("sectors", "E", (root, ux) => {
    const tiles = ux.$$(".sec-e__tile", root);
    if (ux.reduce) return;
    gsap.set(tiles, { rotateX: -88, opacity: 0, transformPerspective: 1200 });
    gsap.to(tiles, { rotateX: 0, opacity: 1, duration: .9, ease: "bounce.out", stagger: .11, scrollTrigger: { trigger: ux.$(".sec-e__row", root), start: "top 78%", once: true } });
  });

  /* ---------- F · Franjas diagonales ---------- */
  register("sectors", "F", (root, ux) => {
    const strips = ux.$$(".sec-f__s", root);
    const set = s => strips.forEach(x => { const on = x === s; x.classList.toggle("is-on", on); ux.$("button", x).setAttribute("aria-expanded", on); });
    const h = e => set(e.currentTarget.closest(".sec-f__s"));
    strips.forEach(s => { const b = ux.$("button", s); b.addEventListener("click", h); b.addEventListener("focus", h); if (ux.fine) s.addEventListener("pointerenter", h); });
    if (!ux.reduce) gsap.from(strips, { yPercent: 110, opacity: 0, duration: 1.1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ux.$(".sec-f__strips", root), start: "top 80%", once: true } });
    return () => strips.forEach(s => { const b = ux.$("button", s); b.removeEventListener("click", h); b.removeEventListener("focus", h); s.removeEventListener("pointerenter", h); });
  });
})();
