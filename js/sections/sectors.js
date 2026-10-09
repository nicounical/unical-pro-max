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

  /* Bucle rAF que solo corre mientras el elemento está en pantalla */
  const whileVisible = (el, frame) => {
    let raf = 0, on = false;
    const tick = t => { raf = 0; if (!on) return; frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); });
    io.observe(el);
    return () => { on = false; io.disconnect(); cancelAnimationFrame(raf); };
  };

  /* ---------- B · Radar: el barrido detecta cada sector ---------- */
  register("sectors", "B", (root, ux) => {
    const radar = ux.$(".sec-b__radar", root), sweep = ux.$(".sec-b__sweep", root), wrap = ux.$(".sec-b__blips", root);
    const items = ux.$$(".sec-b__list li", root), read = ux.$(".sec-b__read b", root);
    const names = items.map(li => li.lastChild.textContent.trim());
    const pos = names.map((_, i) => ({ a: i * 45 + 18 + (i % 2) * 14, r: [.62, .38, .78, .5, .7, .3, .55, .82][i] }));
    wrap.innerHTML = pos.map((p, i) => {
      const rad = (p.a - 90) * Math.PI / 180;
      return `<span class="sec-b__blip" style="left:${50 + Math.cos(rad) * p.r * 46}%;top:${50 + Math.sin(rad) * p.r * 46}%"><i></i><span>${String(i + 1).padStart(2, "0")}</span></span>`;
    }).join("");
    const blips = ux.$$(".sec-b__blip", wrap);
    let pinned = -1, lastHit = -1;
    const hit = i => {
      blips[i].classList.remove("is-hit"); void blips[i].offsetWidth; blips[i].classList.add("is-hit");
      setTimeout(() => blips[i] && pinned !== i && blips[i].classList.remove("is-hit"), 260);
      if (pinned < 0) { items.forEach((li, k) => li.classList.toggle("is-on", k === i)); read.textContent = names[i]; }
      lastHit = i;
    };
    const over = e => { const li = e.target.closest("li"); if (!li) return; pinned = +li.dataset.i; items.forEach((x, k) => x.classList.toggle("is-on", k === pinned)); blips.forEach((b, k) => b.classList.toggle("is-hit", k === pinned)); read.textContent = names[pinned]; };
    const out = () => { pinned = -1; blips.forEach(b => b.classList.remove("is-hit")); };
    const list = ux.$(".sec-b__list", root);
    list.addEventListener("pointerover", over); list.addEventListener("pointerleave", out);
    if (ux.reduce) { read.textContent = names[0]; items[0].classList.add("is-on"); blips.forEach(b => b.classList.add("is-hit")); return () => { list.removeEventListener("pointerover", over); list.removeEventListener("pointerleave", out); }; }
    gsap.from(blips, { scale: 0, autoAlpha: 0, stagger: .08, duration: .6, ease: "back.out(2)", scrollTrigger: { trigger: radar, start: "top 80%", once: true } });
    let ang = 0, last = 0;
    const stop = whileVisible(radar, t => {
      const dt = Math.min(50, t - (last || t)); last = t;
      const prev = ang; ang = (ang + dt * .072) % 360;
      sweep.style.setProperty("--a", ang + "deg");
      pos.forEach((p, i) => { const a = p.a % 360; if ((prev <= a && a < ang) || (prev > ang && (a >= prev || a < ang))) hit(i); });
    });
    return () => { stop(); list.removeEventListener("pointerover", over); list.removeEventListener("pointerleave", out); };
  });

  /* ---------- C · Órbitas: los sectores giran alrededor del núcleo en 3D ---------- */
  register("sectors", "C", (root, ux) => {
    const sys = ux.$(".sec-c__sys", root), chips = ux.$$(".sec-c__chip", root);
    if (ux.reduce) { sys.classList.add("is-static"); return; }
    sys.classList.remove("is-static");
    let rot = 0, speed = 1, target = 1, last = 0, tilt = 0, tiltT = 0;
    const orbit = chips.map((_, i) => ({ ring: i % 2, a: (i / chips.length) * Math.PI * 2 + (i % 2) * .4 }));
    const enter = () => (target = .15), leave = () => (target = 1);
    const mv = e => { const r = sys.getBoundingClientRect(); tiltT = ((e.clientY - r.top) / r.height - .5) * .6; };
    sys.addEventListener("pointerenter", enter); sys.addEventListener("pointerleave", leave);
    if (ux.fine) sys.addEventListener("pointermove", mv);
    gsap.from(chips, { autoAlpha: 0, duration: 1, stagger: .08, scrollTrigger: { trigger: sys, start: "top 80%", once: true } });
    gsap.from(ux.$(".sec-c__core", root), { scale: 0, duration: 1.4, ease: "elastic.out(1,.6)", scrollTrigger: { trigger: sys, start: "top 80%", once: true } });
    const stop = whileVisible(sys, t => {
      const dt = Math.min(50, t - (last || t)); last = t;
      speed += (target - speed) * .05; tilt += (tiltT - tilt) * .05; rot += dt * .00022 * speed;
      const W = sys.clientWidth, H = sys.clientHeight, mob = W < 700;
      chips.forEach((c, i) => {
        const o = orbit[i], a = o.a + rot * (o.ring ? -1.25 : 1);
        const rx = mob ? W * (o.ring ? .2 : .3) : o.ring ? Math.min(350, W * .31) : Math.min(550, W * .46), ry = rx * ((mob ? .9 : .34) + tilt * .2);
        const tiltRad = (o.ring ? 10 : -8) * Math.PI / 180;
        const x0 = Math.cos(a) * rx, y0 = Math.sin(a) * ry;
        const x = x0 * Math.cos(tiltRad) - y0 * Math.sin(tiltRad), y = x0 * Math.sin(tiltRad) + y0 * Math.cos(tiltRad);
        const depth = Math.sin(a), s = .78 + (depth + 1) * .16;
        c.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${s})`;
        c.style.opacity = .45 + (depth + 1) * .275;
        c.style.zIndex = depth > 0 ? 60 : 10;
        c.style.filter = depth < -.3 ? `blur(${(-depth - .3) * 2.2}px)` : "none";
      });
    });
    return () => { stop(); sys.removeEventListener("pointerenter", enter); sys.removeEventListener("pointerleave", leave); sys.removeEventListener("pointermove", mv); };
  });

  /* ---------- D · Cristales: los paneles llegan desde el fondo ---------- */
  register("sectors", "D", (root, ux) => {
    if (ux.reduce) return;
    const panes = ux.$$(".sec-d__p", root);
    gsap.from(panes, { z: -900, autoAlpha: 0, rotationY: -70, stagger: .07, duration: 1.3, ease: "expo.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: ux.$(".sec-d__panes", root), start: "top 80%", once: true } });
  });

  /* ---------- E · Túnel warp: el scroll te lanza a través de los sectores ---------- */
  register("sectors", "E", (root, ux) => {
    if (ux.reduce) return;
    const track = ux.$(".sec-e__track", root), words = ux.$$(".sec-e__w", root), end = ux.$(".sec-e__end", root);
    const cv = ux.$(".sec-e__cv", root), ctx = cv.getContext("2d"), spd = ux.$(".sec-e__hud b", root);
    const N = words.length, DEPTH = 2600;
    const place = words.map((_, i) => { const a = i * 2.4 + .6; return { x: Math.cos(a), y: Math.sin(a) }; });
    let prog = 0, vel = 0;
    const layout = p => {
      const W = innerWidth, H = innerHeight, rx = Math.min(W * .26, 380), ry = Math.min(H * .22, 200);
      words.forEach((w, i) => {
        const z = -DEPTH + (p * (N + 1.2) - i) * (DEPTH / 2.2);
        const o = z > 300 ? Math.max(0, 1 - (z - 300) / 250) : Math.min(1, (z + DEPTH) / 900);
        w.style.transform = `translate(-50%,-50%) translate3d(${place[i].x * rx}px,${place[i].y * ry}px,${Math.min(z, 640)}px)`;
        w.style.opacity = o;
      });
      const e = gsap.utils.clamp(0, 1, (p - .82) / .14);
      end.style.opacity = e; end.style.transform = `scale(${.9 + e * .1})`;
    };
    // estrellas que se estiran según la velocidad
    let W, H, dpr, stars = [];
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      stars = Array.from({ length: W < 700 ? 140 : 260 }, () => ({ a: Math.random() * 6.283, d: Math.random(), s: .3 + Math.random() * .9 }));
    };
    size();
    const st = ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: s => { prog = s.progress; vel = Math.abs(s.getVelocity()); layout(prog); } });
    layout(0);
    let v = 0;
    const stop = whileVisible(cv, () => {
      v += (Math.min(vel / 900, 6) - v) * .08; vel *= .9;
      spd.textContent = Math.round(120 + v * 380) + " km/h";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.hypot(cx, cy);
      ctx.lineCap = "round";
      stars.forEach(s => {
        s.d += .0025 * (1 + v * 3) * s.s; if (s.d > 1) { s.d = .02; s.a = Math.random() * 6.283; }
        const r1 = Math.pow(s.d, 2.2) * R, r0 = Math.max(0, r1 - (6 + v * 70) * s.d);
        ctx.strokeStyle = `rgba(170,210,240,${Math.min(1, s.d * 1.4) * (1 - prog * .5)})`; ctx.lineWidth = s.s * 1.6 * (s.d + .3);
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(s.a) * r0, cy + Math.sin(s.a) * r0); ctx.lineTo(cx + Math.cos(s.a) * r1, cy + Math.sin(s.a) * r1); ctx.stroke();
      });
    });
    addEventListener("resize", size);
    return () => { stop(); st.kill(); removeEventListener("resize", size); };
  });

  /* ---------- F · Escáner láser: cada sector se «imprime» al cruzar el láser ---------- */
  register("sectors", "F", (root, ux) => {
    if (ux.reduce) return;
    ux.$$(".sec-f__n", root).forEach(n => {
      gsap.fromTo(n, { "--f": "0%" }, { "--f": "100%", ease: "none", scrollTrigger: { trigger: n, start: "top 50%", end: "bottom 50%", scrub: true } });
    });
    gsap.from(ux.$(".sec-f__laser i", root), { scaleX: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ux.$(".sec-f__body", root), start: "top 60%", once: true } });
  });

  /* =========== Ronda «Impacto sin tecnología» · G–K =========== */

  /* G · Índice con foto: lista editorial y una foto que sigue al cursor */
  register("sectors", "G", (root, ux) => {
    const rows = ux.$$(".sec-g__row", root);
    if (!ux.reduce) gsap.from(rows, { y: 50, opacity: 0, duration: 1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ux.$(".sec-g__list", root), start: "top 85%", once: true } });
    if (!ux.fine) return;
    const fl = ux.$(".sec-g__float", root), imgs = ux.$$("img", fl);
    gsap.set(fl, { xPercent: -50, yPercent: -50, scale: .6 });
    const qx = gsap.quickTo(fl, "x", { duration: .6, ease: "power3" }), qy = gsap.quickTo(fl, "y", { duration: .6, ease: "power3" });
    const mv = e => { const r = root.getBoundingClientRect(); qx(e.clientX - r.left); qy(e.clientY - r.top); };
    const on = i => { imgs.forEach((m, k) => m.classList.toggle("is-on", k === i)); gsap.to(fl, { opacity: 1, scale: 1, rotate: (i % 2 ? 4 : -4), duration: .5, ease: "expo.out" }); };
    const off = () => gsap.to(fl, { opacity: 0, scale: .6, duration: .4, ease: "power2.in" });
    const list = ux.$(".sec-g__list", root);
    const enters = rows.map((r, i) => { const f = () => on(i); r.addEventListener("pointerenter", f); return f; });
    root.addEventListener("pointermove", mv); list.addEventListener("pointerleave", off);
    return () => { root.removeEventListener("pointermove", mv); list.removeEventListener("pointerleave", off); rows.forEach((r, i) => r.removeEventListener("pointerenter", enters[i])); };
  });

  /* H · Galería horizontal: la sección se fija y las fotos pasan de lado con el scroll */
  register("sectors", "H", (root, ux) => {
    if (ux.reduce || innerWidth <= 860) return;
    const pin = ux.$(".sec-h__pin", root), track = ux.$(".sec-h__track", root);
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: .8, invalidateOnRefresh: true } });
    gsap.from(ux.$$(".sec-h__card", root), { y: 80, opacity: 0, duration: 1.1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: pin, start: "top 70%", once: true } });
  });

  /* I · Mosaico editorial: cada foto se destapa desde un lado distinto */
  register("sectors", "I", (root, ux) => {
    if (ux.reduce) return;
    const from = ["inset(0% 100% 0% 0%)", "inset(100% 0% 0% 0%)", "inset(0% 0% 100% 0%)", "inset(0% 0% 0% 100%)"];
    ux.$$(".sec-i__t", root).forEach((t, i) => {
      const st = { trigger: t, start: "top 90%", once: true };
      gsap.fromTo(t, { clipPath: from[i % 4] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", delay: (i % 3) * .08, scrollTrigger: st });
      gsap.fromTo(ux.$(".sec-i__ph", t), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out", delay: (i % 3) * .08, scrollTrigger: st });
      gsap.from(ux.$(".sec-i__name", t), { y: 30, opacity: 0, duration: .9, ease: "expo.out", delay: .5 + (i % 3) * .08, scrollTrigger: st });
    });
  });

  /* J · Acordeón de fotos: se abre el sector con el ratón, el foco o un toque; avanza solo hasta que interactúas */
  register("sectors", "J", (root, ux) => {
    const items = ux.$$(".sec-j__s", root);
    let cur = 0, timer = 0, touched = false;
    const set = i => { cur = i; items.forEach((s, k) => { s.classList.toggle("is-on", k === i); ux.$(".sec-j__btn", s).setAttribute("aria-expanded", k === i ? "true" : "false"); }); };
    const stopAuto = () => { touched = true; clearInterval(timer); };
    const hs = items.map((s, i) => {
      const b = ux.$(".sec-j__btn", s);
      const act = () => { stopAuto(); set(i); };
      b.addEventListener("click", act); b.addEventListener("focus", act);
      if (ux.fine) s.addEventListener("pointerenter", act);
      return { s, b, act };
    });
    if (!ux.reduce) {
      const io = new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting && !touched) timer = setInterval(() => set((cur + 1) % items.length), 3200); });
      io.observe(root);
      gsap.from(items, { y: 60, opacity: 0, duration: 1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: ux.$(".sec-j__row", root), start: "top 85%", once: true } });
      return () => { io.disconnect(); clearInterval(timer); hs.forEach(({ s, b, act }) => { b.removeEventListener("click", act); b.removeEventListener("focus", act); s.removeEventListener("pointerenter", act); }); };
    }
    return () => hs.forEach(({ s, b, act }) => { b.removeEventListener("click", act); b.removeEventListener("focus", act); s.removeEventListener("pointerenter", act); });
  });

  /* K · Fotos a sangre: la foto fija a la izquierda cambia con un barrido según el sector que pasa por el centro */
  register("sectors", "K", (root, ux) => {
    const imgs = ux.$$(".sec-k__img", root), items = ux.$$(".sec-k__it", root), n = ux.$(".sec-k__count b", root);
    let cur = -1;
    const set = i => {
      if (i === cur) return;
      imgs.forEach((m, k) => { m.classList.toggle("was-on", k === cur); m.classList.toggle("is-on", k === i); });
      items.forEach((it, k) => it.classList.toggle("is-on", k === i));
      n.textContent = String(i + 1).padStart(2, "0"); cur = i;
    };
    set(0);
    items.forEach((it, i) => ScrollTrigger.create({ trigger: it, start: "top 55%", end: "bottom 55%", onToggle: s => s.isActive && set(i) }));
  });
})();
