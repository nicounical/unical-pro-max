/* Cómo trabajamos · A (favorita: holograma 3D) + B–F profesionales */
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
  register("process", "A", (root, ux) => {
    const cv = $(".process-a__cv", root), steps = $$(".process-a__steps li", root), hud = $(".process-a__phase", root), pctEl = $(".process-a__pct b", root);
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
    ScrollTrigger.create({ trigger: $(".process-a__steps", root), start: "top 65%", end: "bottom 75%", onUpdate: s => { T = s.progress * 4; setUI(Math.min(3.99, T)); } });
    return () => loop.stop();
  });

  /* ===== B–F · comunes ===== */
  /* Fases 0→4 ligadas al scroll: con pin la escena se fija; sin pin sigue la lista de pasos */
  const phased = (root, ux, pre, render, pin) => {
    const steps = $$(`.${pre}__steps li`, root), o = { t: 0 };
    const upd = () => { const i = Math.min(3, Math.floor(o.t)); steps.forEach((li, k) => li.classList.toggle("on", k === i)); render(o.t); };
    if (ux.reduce) { root.classList.add("is-static"); render(4); steps.forEach(li => li.classList.add("on")); return () => { root.classList.remove("is-static"); steps.forEach(li => li.classList.remove("on")); }; }
    upd();
    const st = pin
      ? { trigger: $(`.${pre}__pin`, root), start: "top top", end: "+=320%", pin: true, scrub: .7 }
      : { trigger: $(`.${pre}__steps`, root), start: "top 65%", end: "bottom 75%", scrub: .6 };
    gsap.to(o, { t: 4, ease: "none", onUpdate: upd, scrollTrigger: st });
  };
  /* Elementos con data-ph (fase 1–4), data-o (retardo dentro de la fase) y data-w (duración) */
  const phaseEls = root => $$("[data-ph]", root).map(el => ({ el, ph: +el.dataset.ph, o: +(el.dataset.o || 0), w: +(el.dataset.w || 1), ln: el.classList.contains("ln"), drop: "drop" in el.dataset }));
  const paint = (list, t) => list.forEach(({ el, ph, o, w, ln, drop }) => {
    const k = clamp01((t - (ph - 1) - o) / w);
    if (ln) el.style.strokeDashoffset = String(1 - k);
    else { el.style.opacity = String(k); if (drop) el.style.transform = `translateY(${(-(1 - k) * 34).toFixed(1)}px)`; }
  });
  const NAMES = ["Presupuesto", "Diseño", "Producción", "Instalación"];
  const phaseName = t => { const i = Math.min(3, Math.floor(t)); return `Fase 0${i + 1} · ${NAMES[i]}`; };

  /* ---------- B · Plano técnico: cotas → alzado → materiales → montaje ---------- */
  register("process", "B", (root, ux) => {
    const list = phaseEls($(".process-b__svg", root)), lab = $(".process-b__phase", root);
    return phased(root, ux, "process-b", t => { paint(list, t); lab.textContent = phaseName(t); });
  });

  /* ---------- C · Isometría: superficie → volumen → fabricación → montado ---------- */
  register("process", "C", (root, ux) => {
    const svg = $(".process-c__svg", root), pct = $(".process-c__pct", root);
    if (!svg.childElementCount) {
      const s = 46, ox = 262, oy = 150;
      const P = (x, y, z) => [ox + (x - y) * .866 * s, oy + (x + y) * .5 * s - z * s];
      const pts = a => a.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
      const faces = (x, y, z, w, d, h) => ({
        top: [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)],
        front: [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)],
        right: [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
      });
      const outline = f => ["top", "front", "right"].map(k => "M" + pts(f[k]).replace(/ /g, "L") + "Z").join("");
      const box = (b, col, ph2, ph3) => {
        const f = faces(...b);
        return `<g data-ph="3" data-o="${ph3}" data-w=".35" data-drop>` + ["top", "front", "right"].map((k, i) => `<polygon class="face" points="${pts(f[k])}" fill="${col[i]}"/>`).join("") + `</g>` +
          `<path class="ln" data-ph="2" data-o="${ph2}" data-w=".45" pathLength="1" d="${outline(f)}"/>`;
      };
      const quad = (a, fill, o, extra = "") => `<polygon data-ph="4" data-o="${o}" data-w=".35" points="${pts(a)}" fill="${fill}" ${extra}/>`;
      const person = (x, y, col, o) => { const b = P(x, y, .1); return `<g data-ph="4" data-o="${o}" data-w=".3"><ellipse cx="${b[0]}" cy="${b[1]}" rx="12" ry="5" fill="rgba(26,26,46,.18)"/><rect x="${b[0] - 6}" y="${b[1] - 1.45 * s}" width="12" height="${1.4 * s}" rx="6" fill="${col}"/><circle cx="${b[0]}" cy="${b[1] - 1.62 * s}" r="6.5" fill="${col}"/></g>`; };
      const W = ["#FFFFFF", "#E8EDF4", "#CFD8E4"], C = ["#FFFFFF", "#1A1A2E", "#232339"], T = ["#99C4E4", "#2E6CA0", "#1E5076"];
      const floor = faces(0, 0, 0, 6, 3, .1);
      const lbl = (p, txt, o) => `<text data-ph="1" data-o="${o}" data-w=".4" x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" text-anchor="middle">${txt}</text>`;
      svg.innerHTML =
        `<defs><linearGradient id="process-c-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A1A2E"/><stop offset="1" stop-color="#2E6CA0"/></linearGradient></defs>` +
        `<ellipse data-ph="4" data-o="0" data-w=".4" cx="${P(3, 1.5, 0)[0]}" cy="${P(3, 1.5, 0)[1] + 18}" rx="250" ry="70" fill="rgba(26,26,46,.08)"/>` +
        `<path class="ln" data-ph="1" data-o="0" data-w=".55" pathLength="1" d="M${pts(floor.top).replace(/ /g, "L")}Z"/>` +
        lbl(P(3, 3.9, 0), "6.000 mm", .4) + lbl(P(6.9, 1.5, 0), "3.000 mm", .5) +
        `<g data-ph="3" data-o="0" data-w=".3">` + ["top", "front", "right"].map((k, i) => `<polygon class="face" points="${pts(floor[k])}" fill="${["#E9EEF4", "#C9D2DD", "#B7C2D0"][i]}"/>`).join("") + `</g>` +
        box([0, 0, .1, 6, .16, 2.5], W, 0, .1) +
        box([0, .16, .1, .16, 2.84, 2.5], W, .1, .15) +
        quad([P(.7, .16, .7), P(3.5, .16, .7), P(3.5, .16, 2.25), P(.7, .16, 2.25)], "url(#process-c-g)", 0) +
        quad([P(4, .16, 1.2), P(5.4, .16, 1.2), P(5.4, .16, 2), P(4, .16, 2)], "#10101D", .1, 'stroke="#99C4E4"') +
        quad([P(.16, .6, .7), P(.16, 2.6, .7), P(.16, 2.6, 2.1), P(.16, .6, 2.1)], "#99C4E4", .15) +
        box([3.6, 1.8, .1, 1.5, .6, 1], C, .2, .25) +
        quad([P(3.75, 2.4, .45), P(4.95, 2.4, .45), P(4.95, 2.4, .7), P(3.75, 2.4, .7)], "#99C4E4", .2) +
        box([5.3, 2.3, .1, .5, .5, 2.2], T, .3, .35) +
        person(2.4, 2.1, "#1A1A2E", .35) + person(4.4, 2.75, "#2E6CA0", .45) + person(1.4, 1.2, "#5F6673", .5) +
        `<g data-ph="4" data-o=".55" data-w=".35"><text x="${P(.7, .16, 2.25)[0] + 16}" y="${P(.7, .16, 2.25)[1] + 30}" style="fill:#fff;font-family:var(--f-head);font-weight:800;font-size:15px">SIN LÍMITES</text></g>`;
    }
    const list = phaseEls(svg);
    return phased(root, ux, "process-c", t => { paint(list, t); pct.textContent = String(Math.round(t / 4 * 100)).padStart(2, "0"); });
  });

  /* ---------- D · Maqueta que se pliega: plancha troquelada → plegado → impreso → montado ---------- */
  register("process", "D", (root, ux) => {
    const q = s => $(s, root), qa = s => $$(s, root);
    const scene = q(".process-d__scene"), back = q(".process-d__wall--back"), side = q(".process-d__wall--side"), counter = q(".process-d__counter"), plate = q(".process-d__top-plate"),
      cut = q(".process-d__cut"), prints = qa(".process-d__print"), figs = qa(".process-d__fig"), spots = qa(".process-d__spot"), shadow = q(".process-d__shadow"),
      count = q(".process-d__count b"), rail = q(".process-d__rail i");
    const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    return phased(root, ux, "process-d", t => {
      const p1 = clamp01(t * 1.4), f = ease(clamp01(t - 1)), p3 = clamp01(t - 2), p4 = ease(clamp01(t - 3));
      scene.style.opacity = String(.25 + .75 * p1);
      scene.style.transform = `rotateX(${58 - 6 * p4}deg) rotateZ(${-36 + 16 * p4}deg)`;
      cut.style.opacity = String(p1 * (1 - f));
      back.style.transform = `rotateX(${-90 * f}deg)`;
      side.style.transform = `rotateY(${90 * f}deg)`;
      counter.style.transform = `rotateX(${90 * f}deg)`;
      prints.forEach((p, i) => (p.style.clipPath = `inset(0 ${(1 - clamp01(p3 * 1.6 - i * .2)) * 100}% 0 0)`));
      plate.style.opacity = String(clamp01(p3 * 2 - .6));
      plate.style.transform = `translateZ(${55 * clamp01(p3 * 2 - .6)}px)`;
      figs.forEach((g, i) => { const k = clamp01(p4 * 1.6 - i * .3); g.style.opacity = String(k); g.style.transform = `rotateX(-90deg) scaleY(${k})`; });
      spots.forEach(s => (s.style.opacity = String(p4)));
      shadow.style.opacity = String(.4 + .5 * p4);
      count.textContent = "0" + (Math.min(3, Math.floor(t)) + 1);
      rail.style.transform = `scaleX(${t / 4})`;
    }, true);
  });

  /* ---------- E · Ficha de proyecto: la hoja técnica se rellena cuadrante a cuadrante ---------- */
  register("process", "E", (root, ux) => {
    const list = phaseEls($(".process-e__sheet", root)), qs = $$(".process-e__q", root), photo = $(".process-e__photo", root), ph = $(".process-e__phase", root);
    return phased(root, ux, "process-e", t => {
      paint(list, t);
      const i = Math.min(3, Math.floor(t));
      qs.forEach((q, k) => { q.classList.toggle("is-on", k === i && t < 4); q.classList.toggle("is-done", k < i || t >= 4); });
      photo.style.clipPath = `inset(${(1 - clamp01((t - 3) / .7)) * 100}% 0 0 0)`;
      ph.textContent = `0${i + 1} / 04`;
    });
  });

  /* ---------- F · Despiece por capas: un rótulo explosionado que se ensambla y se instala ---------- */
  register("process", "F", (root, ux) => {
    const stack = $(".process-f__stack", root), layers = $$(".process-f__layer", root), legend = $$(".process-f__legend li", root),
      wall = $(".process-f__wall", root), screws = $$(".process-f__wall i", root), rail = $(".process-f__rail i", root);
    const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    return phased(root, ux, "process-f", t => {
      const p4 = ease(clamp01(t - 3)), gap = 62 * (1 - p4);
      const vis = [clamp01(t * 2), clamp01((t - 1) * 2), clamp01((t - 2) * 2), clamp01((t - 2.5) * 2)];
      stack.style.transform = `scale(var(--z,1)) rotateX(${58 * (1 - p4)}deg) rotateZ(${-38 * (1 - p4)}deg)`;
      layers.forEach((l, k) => { l.style.opacity = String(k === 2 ? vis[k] * (1 - .88 * p4) : vis[k]); l.style.transform = `translateZ(${k * gap + (1 - vis[k]) * 40}px)`; });
      layers[1].style.setProperty("--art", String(clamp01((t - 1.35) / .55)));
      layers.forEach(l => (l.querySelector(".process-f__badge").style.opacity = String(1 - p4)));
      wall.style.opacity = String(p4);
      screws.forEach(s => (s.style.opacity = String(clamp01((t - 3.6) / .3))));
      const i = Math.min(3, Math.floor(t)); legend.forEach((li, k) => li.classList.toggle("on", k <= i));
      rail.style.transform = `scaleX(${t / 4})`;
    }, true);
  });
})();
