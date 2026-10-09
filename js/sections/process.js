/* Cómo trabajamos · A (favorita: progreso circular) + 5 futuristas */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Progreso circular ---------- */
  register("process", "A", (root, ux) => {
    const pin = $(".process-a__pin", root), stairs = $(".process-a__stairs", root), items = $$(".process-a__stairs li", root);
    const fg = $(".process-a__ring .fg", root), pct = $(".process-a__pct b", root);
    fg.setAttribute("pathLength", 1); fg.style.strokeDasharray = "1 1";
    if (ux.reduce) { root.classList.add("is-static"); fg.style.strokeDashoffset = 0; pct.textContent = "100"; items.forEach(i => i.classList.add("on")); return () => root.classList.remove("is-static"); }
    let geo = {};
    const place = () => {
      const W = pin.offsetWidth, H = pin.offsetHeight, cw = items[0].offsetWidth, ch = items[0].offsetHeight;
      const narrow = W < 700, sx = narrow ? W * .05 : Math.min(W * .3, 440), sy = narrow ? Math.min(H * .2, 190) : Math.min(H * .2, 170);
      geo = { sx, sy };
      const cy = narrow ? H * .58 : H / 2;
      items.forEach((li, i) => { li.style.left = (W / 2 - cw / 2 + i * sx) + "px"; li.style.top = (cy - ch / 2 - i * sy) + "px"; });
    };
    place();
    const render = p => {
      fg.style.strokeDashoffset = 1 - p;
      pct.textContent = Math.round(p * 100);
      const f = p * (items.length - 1);
      gsap.set(stairs, { x: -f * geo.sx, y: f * geo.sy });
      const idx = Math.round(f);
      items.forEach((li, i) => { li.classList.toggle("on", i === idx); li.classList.toggle("done", i < idx); });
    };
    render(0);
    ScrollTrigger.create({
      trigger: pin, start: "top top", end: "+=220%", pin: true, scrub: .6, invalidateOnRefresh: true,
      onRefresh: () => place(), onUpdate: s => render(s.progress)
    });
    gsap.from($(".process-a__ring", root), { scale: .7, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => { items.forEach(li => { li.style.left = li.style.top = ""; }); };
  });


  const clamp01 = v => Math.max(0, Math.min(1, v));
  /* Lienzo con DPR limitado que solo anima mientras se ve */
  const canvasLoop = (cv, host, draw, ux) => {
    const ctx = cv.getContext("2d"); let W = 0, H = 0, raf = 0, run = false;
    const size = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); frame(performance.now(), true); };
    const frame = (now, once) => { if (W && H) draw(ctx, W, H, now); if (run && !once) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { run = e.isIntersecting && !ux.reduce; cancelAnimationFrame(raf); if (run) raf = requestAnimationFrame(frame); });
    io.observe(host); const ro = new ResizeObserver(size); ro.observe(cv); size();
    return { redraw: () => frame(performance.now(), true), stop: () => { run = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); } };
  };

  /* ---------- B · Secuencia de lanzamiento ---------- */
  register("process", "B", (root, ux) => {
    const pin = $(".process-b__pin", root), mods = $$(".process-b__mods li", root), clock = $(".process-b__clock i", root);
    const fill = $(".process-b__fill", root), dot = $(".process-b__head-dot", root);
    const states = ["En espera", "En curso", "Completado"];
    const setIdx = (idx, finished) => {
      mods.forEach((li, i) => {
        const st = finished || i < idx ? 2 : i === idx ? 1 : 0;
        li.classList.toggle("on", st === 1); li.classList.toggle("done", st === 2);
        $(".process-b__state", li).textContent = states[st];
      });
      clock.textContent = String(finished ? 0 : 4 - idx).padStart(2, "0");
    };
    if (ux.reduce) { setIdx(4, true); gsap.set(fill, { scaleX: 1 }); gsap.set(dot, { left: "100%" }); return; }
    setIdx(0);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      let last = "";
      ScrollTrigger.create({ trigger: pin, start: "top top", end: "+=200%", pin: true, scrub: .6, onUpdate: s => {
        const p = s.progress; gsap.set(fill, { scaleX: p }); gsap.set(dot, { left: p * 100 + "%" });
        const fin = p > .97, idx = Math.min(3, Math.floor(p * 4)), key = idx + "" + fin;
        if (key !== last) { last = key; setIdx(idx, fin); }
      } });
      gsap.from(mods, { y: 40, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
    });
    mm.add("(max-width: 900px)", () => {
      mods.forEach((li, i) => ScrollTrigger.create({ trigger: li, start: "top 65%", end: "bottom 65%", onToggle: s => s.isActive && setIdx(i), onLeave: () => i === mods.length - 1 && setIdx(4, true), onEnterBack: () => setIdx(i) }));
    });
    return () => { mm.revert(); setIdx(0); };
  });

  /* ---------- C · Terminal de producción ---------- */
  register("process", "C", (root, ux) => {
    const jobs = $$(".process-c__job", root);
    if (ux.reduce) { root.classList.add("is-done"); $$(".process-c__pct", root).forEach(p => (p.textContent = "100%")); return () => root.classList.remove("is-done"); }
    const timers = [];
    jobs.forEach(job => {
      const t = $(".process-c__t", job), full = t.dataset.t, bar = $(".process-c__bars b", job), pct = $(".process-c__pct", job), ok = $(".process-c__ok", job);
      const rest = [$("h3", job), $(".process-c__out", job)];
      t.textContent = ""; gsap.set(rest, { opacity: 0, y: 10 });
      ScrollTrigger.create({ trigger: job, start: "top 78%", once: true, onEnter: () => {
        let i = 0;
        const iv = setInterval(() => {
          t.textContent = full.slice(0, ++i);
          if (i < full.length) return;
          clearInterval(iv);
          const o = { v: 0 };
          gsap.timeline()
            .to(rest, { opacity: 1, y: 0, duration: .5, stagger: .08, ease: "expo.out" })
            .to(o, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { bar.style.clipPath = `inset(0 ${100 - o.v}% 0 0)`; pct.textContent = Math.round(o.v) + "%"; } }, .2)
            .to(ok, { opacity: 1, duration: .3 });
        }, 26);
        timers.push(iv);
      } });
    });
    gsap.from($(".process-c__win", root), { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    return () => { timers.forEach(clearInterval); jobs.forEach(job => { const t = $(".process-c__t", job); t.textContent = t.dataset.t; $(".process-c__bars b", job).style.clipPath = ""; $(".process-c__pct", job).textContent = "0%"; }); };
  });

  /* ---------- D · Holograma 3D: puntos → malla → sólido → montado ---------- */
  register("process", "D", (root, ux) => {
    const cv = $(".process-d__cv", root), steps = $$(".process-d__steps li", root), hud = $(".process-d__phase", root), pctEl = $(".process-d__pct b", root);
    const names = ["01 · Presupuesto", "02 · Diseño", "03 · Producción", "04 · Instalación"];
    // Geometría: un stand (tarima, fondo, lateral y mostrador)
    const boxes = [[-1.1, -.75, -.7, 2.2, .12, 1.4], [-1.1, -.63, -.7, 2.2, 1.35, .08], [-1.1, -.63, -.62, .08, 1.35, .75], [.15, -.63, .05, .7, .55, .4]];
    const V = [], E = [], F = [];
    boxes.forEach(([x, y, z, w, h, d]) => {
      const o = V.length;
      for (let i = 0; i < 8; i++) V.push([x + (i & 4 ? w : 0), y + (i & 2 ? h : 0), z + (i & 1 ? d : 0)]);
      for (let a = 0; a < 8; a++) for (const b of [1, 2, 4]) if (!(a & b)) E.push([o + a, o + (a | b)]);
      for (const bit of [1, 2, 4]) { const [b1, b2] = [1, 2, 4].filter(k => k !== bit); for (const val of [0, bit]) F.push([0, b1, b1 | b2, b2].map(k => o + (k | val))); }
    });
    const pts = [];
    E.forEach(([a, b]) => { for (let k = 0; k < 7; k++) { const s = Math.random(); const r = 2.6 * Math.cbrt(Math.random()), th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
      pts.push({ to: V[a].map((c, j) => c + (V[b][j] - c) * s), from: [r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)] }); } });
    let T = ux.reduce ? 4 : 0, shown = 0;
    const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const draw = (ctx, W, H, now) => {
      shown += (T - shown) * .12; const t = shown;
      const p0 = ease(clamp01(t)), p1 = clamp01(t - 1), p2 = clamp01(t - 2), p3 = clamp01(t - 3);
      const ang = -.75 + (ux.reduce ? 0 : now * .00012) + t * .3, tx = .34, ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tx), st = Math.sin(tx);
      const f = Math.min(W, H) * 1.55, Dz = 5;
      const P = ([x, y, z]) => { const x1 = x * ca - z * sa, z1 = x * sa + z * ca, y2 = y * ct - z1 * st, z2 = y * st + z1 * ct, k = f / (z2 + Dz); return [W / 2 + x1 * k, H * .56 - y2 * k, z2]; };
      ctx.clearRect(0, 0, W, H);
      // suelo
      const ga = .07 + .22 * p3; ctx.lineWidth = 1; ctx.strokeStyle = `rgba(153,196,228,${ga})`; ctx.beginPath();
      for (let g = -2; g <= 2.001; g += .4) { let a = P([g, -.75, -2]), b = P([g, -.75, 2]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); a = P([-2, -.75, g]); b = P([2, -.75, g]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
      ctx.stroke();
      // caras (sólido) con barrido de abajo arriba
      if (p2 > 0) {
        const ys = -.76 + p2 * 1.5;
        F.map(q => ({ q, s: q.map(i => P(V[i])), minY: Math.min(...q.map(i => V[i][1])) })).sort((a, b) => b.s.reduce((m, v) => m + v[2], 0) - a.s.reduce((m, v) => m + v[2], 0))
          .forEach(({ s, minY }) => { if (minY > ys) return; ctx.fillStyle = `rgba(${p3 ? "120,170,215" : "153,196,228"},${.13 + .1 * p3})`; ctx.beginPath(); s.forEach((v, i) => i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1])); ctx.closePath(); ctx.fill(); });
        if (p2 < 1) { const c = [[-1.4, ys, -1], [1.4, ys, -1], [1.4, ys, 1], [-1.4, ys, 1]].map(P); ctx.fillStyle = "rgba(153,196,228,.08)"; ctx.strokeStyle = "rgba(221,238,255,.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); c.forEach((v, i) => i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1])); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      }
      // aristas (malla) que se dibujan progresivamente
      if (p1 > 0) {
        ctx.lineWidth = 1.3; ctx.strokeStyle = `rgba(153,196,228,${.75 + .25 * p3})`; ctx.shadowColor = "rgba(153,196,228,.9)"; ctx.shadowBlur = 6 + 10 * p3; ctx.beginPath();
        E.forEach(([a, b], i) => { const e = clamp01(p1 * 1.7 - i / E.length * .7); if (!e) return; const A = V[a], B = V[b], m = A.map((c, j) => c + (B[j] - c) * e); const s = P(A), d = P(m); ctx.moveTo(s[0], s[1]); ctx.lineTo(d[0], d[1]); });
        ctx.stroke(); ctx.shadowBlur = 0;
      }
      // nube de puntos
      const pa = .9 * (1 - .75 * p1);
      if (pa > .02) { ctx.fillStyle = `rgba(221,238,255,${pa})`; pts.forEach(o => { const v = P(o.from.map((c, j) => c + (o.to[j] - c) * p0)); ctx.fillRect(v[0] - 1, v[1] - 1, 2, 2); }); }
    };
    const loop = canvasLoop(cv, root, draw, ux);
    const setUI = t => { const i = Math.min(3, Math.floor(t)); steps.forEach((li, k) => li.classList.toggle("on", k === i)); hud.textContent = names[i]; pctEl.textContent = Math.round(t / 4 * 100); };
    if (ux.reduce) { root.classList.add("is-static"); shown = 4; setUI(3.99); pctEl.textContent = "100"; loop.redraw(); return () => { loop.stop(); root.classList.remove("is-static"); }; }
    setUI(0);
    ScrollTrigger.create({ trigger: $(".process-d__steps", root), start: "top 65%", end: "bottom 75%", onUpdate: s => { T = s.progress * 4; setUI(Math.min(3.99, T)); } });
    return () => loop.stop();
  });

  /* ---------- E · Bento con brillo ---------- */
  register("process", "E", (root, ux) => {
    const grid = $(".process-e__grid", root), cards = $$(".process-e__card", root);
    const pm = e => cards.forEach(c => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); });
    if (ux.fine) grid.addEventListener("pointermove", pm);
    if (!ux.reduce) gsap.from(cards, { y: 60, opacity: 0, scale: .96, duration: 1.1, stagger: .1, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: grid, start: "top 85%" } });
    return () => grid.removeEventListener("pointermove", pm);
  });

  /* ---------- F · Flujo de datos ---------- */
  register("process", "F", (root, ux) => {
    const flow = $(".process-f__flow", root), cv = $(".process-f__cv", root), items = $$(".process-f__nodes li", root), nodes = $$(".process-f__node", root);
    let prog = ux.reduce ? 1 : 0, shown = prog;
    const parts = Array.from({ length: 46 }, () => ({ s: Math.random(), v: .0009 + Math.random() * .0016, o: (Math.random() - .5) * 6, r: .8 + Math.random() * 1.6 }));
    let last = 0;
    const draw = (ctx, W, H, now) => {
      const dt = Math.min(50, now - (last || now)); last = now;
      shown += (prog - shown) * .1;
      const fr = flow.getBoundingClientRect();
      const C = nodes.map(n => { const r = n.getBoundingClientRect(); return [r.left - fr.left + r.width / 2, r.top - fr.top + r.height / 2]; });
      const vertical = Math.abs(C[3][0] - C[0][0]) < 10;
      const A = vertical ? [C[0][0], 0] : [0, C[0][1]], B = vertical ? [C[0][0], H] : [W, C[0][1]];
      const L = vertical ? H : W, at = s => vertical ? [A[0], s * L] : [s * L, A[1]];
      const fN = C.map(c => (vertical ? c[1] : c[0]) / L), head = fN[0] + (fN[3] - fN[0] + .06) * shown;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(153,196,228,.16)"; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.stroke(); ctx.setLineDash([]);
      const g = vertical ? ctx.createLinearGradient(0, 0, 0, head * L) : ctx.createLinearGradient(0, 0, head * L, 0);
      g.addColorStop(0, "rgba(46,108,160,0)"); g.addColorStop(.6, "rgba(153,196,228,.7)"); g.addColorStop(1, "rgba(221,238,255,1)");
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.shadowColor = "rgba(153,196,228,.9)"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...at(Math.min(1, head))); ctx.stroke(); ctx.shadowBlur = 0;
      parts.forEach(p => {
        if (!ux.reduce) { p.s += p.v * dt * .06; if (p.s > head) p.s = Math.max(0, head - .35) * Math.random(); }
        if (p.s > head) return;
        const [x, y] = at(p.s), a = .25 + .75 * (p.s / Math.max(head, .01));
        ctx.fillStyle = `rgba(221,238,255,${a})`; ctx.beginPath(); ctx.arc(vertical ? x + p.o : x, vertical ? y : y + p.o, p.r, 0, 6.283); ctx.fill();
      });
      items.forEach((li, i) => li.classList.toggle("on", head >= fN[i] - .005));
    };
    const loop = canvasLoop(cv, root, draw, ux);
    if (ux.reduce) { items.forEach(li => li.classList.add("on")); loop.redraw(); return () => loop.stop(); }
    ScrollTrigger.create({ trigger: flow, start: "top 80%", end: "bottom 55%", scrub: true, onUpdate: s => { prog = s.progress; } });
    gsap.from(items, { y: 40, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: flow, start: "top 85%" } });
    return () => { loop.stop(); items.forEach(li => li.classList.remove("on")); };
  });
})();

/* Cómo trabajamos · G–K: impacto editorial, sin recursos tecnológicos */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- G · Carteles numerados ---------- */
  register("process", "G", (root, ux) => {
    const ps = $$(".process-g__p", root);
    const open = p => ps.forEach(q => { const on = q === p; q.classList.toggle("is-on", on); $(".process-g__btn", q).setAttribute("aria-expanded", on); });
    const offs = [];
    ps.forEach(p => {
      const b = $(".process-g__btn", p), c = () => open(p), h = () => ux.fine && open(p);
      b.addEventListener("click", c); p.addEventListener("pointerenter", h);
      offs.push(() => { b.removeEventListener("click", c); p.removeEventListener("pointerenter", h); });
    });
    if (!ux.reduce) gsap.from(ps, { y: 80, opacity: 0, duration: 1.1, stagger: .09, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: $(".process-g__row", root), start: "top 82%" } });
    return () => offs.forEach(f => f());
  });

  /* ---------- H · Relato con foto fija ---------- */
  register("process", "H", (root, ux) => {
    const steps = $$(".process-h__step", root), phs = $$(".process-h__ph", root), cap = $(".process-h__cap b", root);
    const set = i => { steps.forEach((s, k) => s.classList.toggle("is-on", k === i)); phs.forEach((p, k) => p.classList.toggle("is-on", k <= i)); cap.textContent = "0" + (i + 1); };
    set(0);
    steps.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: "top 55%", end: "bottom 55%", onToggle: e => e.isActive && set(i) }));
  });

  /* ---------- I · Palabras gigantes ---------- */
  register("process", "I", (root, ux) => {
    const pin = $(".process-i__pin", root), track = $(".process-i__track", root);
    if (ux.reduce) { root.classList.add("is-static"); return () => root.classList.remove("is-static"); }
    const mm = gsap.matchMedia();
    mm.add("(max-width:800px)", () => {
      root.classList.add("is-static");
      $$(".process-i__panel", root).forEach(p => gsap.from(p, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 85%" } }));
      return () => root.classList.remove("is-static");
    });
    mm.add("(min-width:801px)", () => {
      const dist = () => Math.max(0, track.scrollWidth - pin.offsetWidth);
      gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: .6, invalidateOnRefresh: true } })
        .to(track, { x: () => -dist(), ease: "none" }, 0)
        .to($(".process-i__bar i", root), { scaleX: 1, ease: "none" }, 0);
    });
    return () => mm.revert();
  });

  /* ---------- J · Bandas impresas ---------- */
  register("process", "J", (root, ux) => {
    const rows = $$(".process-j__row", root);
    if (ux.reduce) { rows.forEach(r => { r.classList.add("is-on"); $(".process-j__band", r).style.clipPath = "inset(0 0 0 0)"; }); return; }
    rows.forEach(r => {
      gsap.fromTo($(".process-j__band", r), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: r, start: "top 78%", end: "top 38%", scrub: .5, onUpdate: s => r.classList.toggle("is-on", s.progress > .5) } });
      gsap.fromTo($("img", r), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  /* ---------- K · Registro CMYK ---------- */
  register("process", "K", (root, ux) => {
    const pin = $(".process-k__pin", root), steps = $$(".process-k__step", root), pct = $(".process-k__sheet figcaption b", root);
    const [c, m, y] = ["c", "m", "y"].map(k => $(".process-k__pl--" + k, root));
    const set = i => steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
    if (ux.reduce) { root.classList.add("is-static"); set(3); pct.textContent = "100%"; return () => root.classList.remove("is-static"); }
    set(0);
    const o = () => Math.max(14, pin.offsetWidth * .022);
    const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: "+=260%", pin: true, scrub: .6, invalidateOnRefresh: true,
      onUpdate: s => { set(Math.min(3, Math.floor(s.progress * 4))); pct.textContent = Math.round(s.progress * 100) + "%"; } } });
    tl.fromTo(c, { opacity: 0, x: () => -o() * 2, y: () => -o() }, { opacity: 1, x: () => -o(), y: () => -o() * .6, duration: 1 }, 0)
      .fromTo(m, { opacity: 0, x: () => o() * 2, y: () => o() }, { opacity: 1, x: () => o(), y: () => o() * .5, duration: 1 }, 1)
      .fromTo(y, { opacity: 0, x: () => o() * .4, y: () => o() * 2 }, { opacity: 1, x: () => -o() * .3, y: () => o(), duration: 1 }, 2)
      .to([c, m, y], { x: 0, y: 0, duration: 1, ease: "power2.inOut" }, 3);
  });
})();
