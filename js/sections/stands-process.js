/* Stands · Cómo trabajamos · A Holograma 3D (reservada para la futura página de stands) */
(() => {
  const { register, $, $$ } = UX;


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

  /* ---------- A · Holograma 3D: puntos → malla → sólido → montado ---------- */
  register("stands-process", "A", (root, ux) => {
    const cv = $(".stproc-a__cv", root), steps = $$(".stproc-a__steps li", root), hud = $(".stproc-a__phase", root), pctEl = $(".stproc-a__pct b", root);
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
    ScrollTrigger.create({ trigger: $(".stproc-a__steps", root), start: "top 65%", end: "bottom 75%", onUpdate: s => { T = s.progress * 4; setUI(Math.min(3.99, T)); } });
    return () => loop.stop();
  });
})();
