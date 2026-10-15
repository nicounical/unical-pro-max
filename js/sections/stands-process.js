/* Stands · Cómo trabajamos · A «Despiece» (ronda 10b; antes C de la ronda 10)
   Motor 3D compartido (canvas 2D, sin librerías): un stand de 6 × 3 m con tarima, pared trasera
   con gráfica, pared lateral, mostrador con logo, tótem luminoso, pantalla, mesa y focos.
   Cada versión decide cámara, materiales y maquetación a partir de t ∈ [0, 4] (las 4 fases). */
(() => {
  const { register, $, $$ } = UX;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const css = getComputedStyle(document.documentElement);
  const MONO = css.getPropertyValue("--f-mono").trim() || "monospace";
  const HEAD = css.getPropertyValue("--f-head").trim() || "sans-serif";
  const NAMES = ["Presupuesto", "Diseño", "Producción", "Instalación"];

  /* ---------- Lienzo con DPR ≤ 2 que solo anima mientras se ve ---------- */
  const canvasLoop = (cv, host, draw, ux) => {
    const ctx = cv.getContext("2d"); let W = 0, H = 0, raf = 0, run = false;
    const frame = (now, once) => { if (W && H) draw(ctx, W, H, now); if (run && !once) raf = requestAnimationFrame(frame); };
    const size = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = cv.offsetWidth; H = cv.offsetHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); frame(performance.now(), true); };
    const io = new IntersectionObserver(([e]) => { run = e.isIntersecting && !ux.reduce; cancelAnimationFrame(raf); if (run) raf = requestAnimationFrame(frame); });
    io.observe(host); const ro = new ResizeObserver(size); ro.observe(cv); size();
    return { redraw: () => frame(performance.now(), true), stop: () => { run = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); } };
  };

  /* ---------- Texturas de la gráfica impresa (se generan una vez) ---------- */
  const IMG = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const cover = (g, img, x, y, w, h) => { if (!img) return; const s = Math.max(w / img.width, h / img.height), iw = img.width * s, ih = img.height * s; g.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih); };
  const mk = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); return c; };
  let TX = null, txP = null;
  const loadTextures = () => txP || (txP = Promise.all([
    IMG("assets/img/logo/logo-unical-light-xl.png"), IMG("assets/img/logo/logo-unical.png"), IMG("assets/img/hubs/eventos/stand-luz.webp"),
    document.fonts ? document.fonts.ready : null
  ]).then(([lgL, lgD, luz]) => {
    const logo = (g, img, x, y, w) => { if (img) g.drawImage(img, x, y, w, w * img.height / img.width); };
    const logoC = (g, img, cx, cy, w) => { if (img) { const h = w * img.height / img.width; g.drawImage(img, cx - w / 2, cy - h / 2, w, h); } };
    TX = {
      /* Pared trasera = gráfica del cliente: foto «LUZ». Fondo con la misma foto muy desenfocada y,
         encima, la franja de las letras (y ≈ 6–62 % de la foto) encajada en alto para que se lean enteras */
      wall: mk(1200, 500, (g, w, h) => {
        g.fillStyle = "#C8551A"; g.fillRect(0, 0, w, h);
        if (luz) {
          g.save(); g.filter = "blur(26px) saturate(1.15)"; cover(g, luz, -60, -60, w + 120, h + 120); g.restore();
          const sy = luz.height * .06, sh = luz.height * .56, dh = h, dw = luz.width * dh / sh, dx = Math.min(w - dw - 20, 430); /* a la derecha de la TV (u ≈ 0,13–0,34) */
          g.drawImage(luz, 0, sy, luz.width, sh, dx, 0, dw, dh);
          /* fundido suave de los bordes de la franja con el fondo */
          const fl = g.createLinearGradient(dx, 0, dx + 70, 0); fl.addColorStop(0, "rgba(160,60,18,.85)"); fl.addColorStop(1, "rgba(160,60,18,0)"); g.fillStyle = fl; g.fillRect(dx, 0, 70, h);
          const fr = g.createLinearGradient(dx + dw, 0, dx + dw - 70, 0); fr.addColorStop(0, "rgba(160,60,18,.85)"); fr.addColorStop(1, "rgba(160,60,18,0)"); g.fillStyle = fr; g.fillRect(dx + dw - 70, 0, 70, h);
        }
      }),
      /* Pared lateral izquierda: a juego con la trasera (degradado naranja → ámbar con bokeh) y SOLO el logo de Unical */
      side: mk(420, 500, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#D9541A"); gr.addColorStop(.55, "#E8822A"); gr.addColorStop(1, "#F2B045"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        const bok = [[60, 70, 46, .22], [330, 110, 60, .18], [110, 400, 70, .16], [360, 420, 40, .22], [220, 250, 90, .1], [40, 250, 28, .25], [300, 300, 22, .3]];
        for (const [x, y, r, a] of bok) { const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(255,236,190,${a})`); rg.addColorStop(1, "rgba(255,236,190,0)"); g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
        const sh = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 220); sh.addColorStop(0, "rgba(90,30,8,.28)"); sh.addColorStop(1, "rgba(90,30,8,0)"); g.fillStyle = sh; g.fillRect(0, 0, w, h);
        logoC(g, lgL, w / 2, h / 2, 320);
      }),
      counter: mk(420, 240, (g, w, h) => {
        g.fillStyle = "#14223F"; g.fillRect(0, 0, w, h); logo(g, lgL, 70, 92, 280); g.fillStyle = "#99C4E4"; g.fillRect(0, h - 10, w, 10);
      }),
      totem: mk(140, 900, (g, w, h) => {
        g.fillStyle = "#F7F9FC"; g.fillRect(0, 0, w, h);
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#2E6CA0"); gr.addColorStop(1, "#99C4E4"); g.fillStyle = gr; g.fillRect(0, 260, w, h - 260);
        logo(g, lgD, 14, 120, 112);
        g.save(); g.translate(92, h - 60); g.rotate(-Math.PI / 2); g.fillStyle = "#fff"; g.font = `800 32px ${HEAD}`; g.fillText("Diseño · Producción · Montaje", 0, 0); g.restore();
      }),
      /* TV apagada: panel negro con un reflejo diagonal muy sutil, sin imagen */
      screen: mk(380, 220, (g, w, h) => {
        g.fillStyle = "#05060A"; g.fillRect(0, 0, w, h);
        const r = g.createLinearGradient(0, 0, w, h); r.addColorStop(0, "rgba(255,255,255,.07)"); r.addColorStop(.45, "rgba(255,255,255,.015)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(6, 6, w - 12, h - 12);
      })
    };
  }));

  /* ---------- Modelo: piezas [x0,y0,z0,x1,y1,z1], color, gráfica por cara y vector de despiece ---------- */
  const PARTS = [
    { b: [-3, 0, -1.5, 3, .12, 1.5], c: [206, 212, 222], ex: [0, -.9, 0] },                                   // tarima
    { b: [-3, .12, -1.5, 3, 2.62, -1.36], c: [240, 243, 248], tex: { front: "wall" }, ex: [0, .6, -2.2] },   // pared trasera
    { b: [-3, .12, -1.36, -2.86, 2.62, .7], c: [240, 243, 248], tex: { right: "side" }, ex: [-2.4, .6, .2] }, // pared lateral
    { b: [.3, .12, .35, 1.9, 1.0, .9], c: [22, 36, 66], tex: { front: "counter" }, ex: [1.8, .8, 2] },        // mostrador
    { b: [.25, 1.0, .3, 1.95, 1.06, .95], c: [248, 249, 252], ex: [1.8, 1.8, 2] },                            // encimera
    { b: [2.35, .12, .95, 2.75, 2.9, 1.25], c: [247, 249, 252], tex: { front: "totem" }, ex: [2.6, 1.2, 1.6] },// tótem
    { b: [-2.25, 1.25, -1.36, -.95, 2.0, -1.3], c: [12, 12, 18], tex: { front: "screen" }, ex: [-.8, 1.6, -1.4] }, // pantalla
    { b: [-1.9, .12, -.25, -1.3, .78, .35], c: [246, 247, 250], ex: [-1.8, 1.2, 1.4] },                       // mesa
    { b: [-1.84, 2.62, -1.5, -1.76, 2.68, -.7], c: [36, 38, 50], ex: [-.4, 2.4, -1.4] },                      // brazos de focos
    { b: [-.04, 2.62, -1.5, .04, 2.68, -.7], c: [36, 38, 50], ex: [0, 2.6, -1.4] },
    { b: [1.76, 2.62, -1.5, 1.84, 2.68, -.7], c: [36, 38, 50], ex: [.4, 2.4, -1.4] }
  ];
  const SPOTS = [[-1.8, 8], [0, 9], [1.8, 10]];
  const FACES = {
    front: { n: [0, 0, 1], q: b => [[b[0], b[4], b[5]], [b[3], b[4], b[5]], [b[3], b[1], b[5]], [b[0], b[1], b[5]]] },
    back: { n: [0, 0, -1], q: b => [[b[3], b[4], b[2]], [b[0], b[4], b[2]], [b[0], b[1], b[2]], [b[3], b[1], b[2]]] },
    right: { n: [1, 0, 0], q: b => [[b[3], b[4], b[5]], [b[3], b[4], b[2]], [b[3], b[1], b[2]], [b[3], b[1], b[5]]] },
    left: { n: [-1, 0, 0], q: b => [[b[0], b[4], b[2]], [b[0], b[4], b[5]], [b[0], b[1], b[5]], [b[0], b[1], b[2]]] },
    top: { n: [0, 1, 0], q: b => [[b[0], b[4], b[2]], [b[3], b[4], b[2]], [b[3], b[4], b[5]], [b[0], b[4], b[5]]] },
    bottom: { n: [0, -1, 0], q: b => [[b[0], b[1], b[5]], [b[3], b[1], b[5]], [b[3], b[1], b[2]], [b[0], b[1], b[2]]] }
  };
  const LIGHT = norm([-.35, .85, .55]);
  const corners = b => { const o = []; for (let i = 0; i < 8; i++) o.push([i & 4 ? b[3] : b[0], i & 2 ? b[4] : b[1], i & 1 ? b[5] : b[2]]); return o; };
  const EDGES = []; for (let a = 0; a < 8; a++) for (const k of [1, 2, 4]) if (!(a & k)) EDGES.push([a, a | k]);
  // nube de puntos: muestras sobre las aristas, cada una con un origen aleatorio
  const PTS = []; PARTS.forEach((_, pi) => EDGES.forEach(([a, b]) => { for (let k = 0; k < 5; k++) { const r = 3 + 3 * Math.cbrt(Math.random()), th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); PTS.push({ pi, a, b, s: Math.random(), from: [r * Math.sin(ph) * Math.cos(th), 1.2 + r * Math.cos(ph) * .7, r * Math.sin(ph) * Math.sin(th)] }); } }));

  /* Caja de una pieza en el estado actual (extrusión en altura y despiece) */
  const boxOf = (p, s) => { const e = s.explode || 0, k = s.ext == null ? 1 : s.ext, b = p.b.slice();
    if (k < 1 && b[1] >= .12) { b[1] = .12 + (b[1] - .12) * k; b[4] = .12 + (b[4] - .12) * k; } else if (k < 1) { b[4] = b[1] + (b[4] - b[1]) * Math.max(k, .15); }
    return [b[0] + p.ex[0] * e, b[1] + p.ex[1] * e, b[2] + p.ex[2] * e, b[3] + p.ex[0] * e, b[4] + p.ex[1] * e, b[5] + p.ex[2] * e]; };

  /* Cámara: órbita alrededor de un objetivo */
  const camera = (s, W, H) => {
    const T = [s.tx || 0, s.ty == null ? 1.1 : s.ty, s.tz || 0], cp = Math.cos(s.pitch);
    const pos = [T[0] + s.dist * Math.sin(s.yaw) * cp, T[1] + s.dist * Math.sin(s.pitch), T[2] + s.dist * Math.cos(s.yaw) * cp];
    const f = norm(sub(T, pos)), r = norm(cross(f, [0, 1, 0])), u = cross(r, f), F = Math.min(W * (W < 700 ? .95 : .62), H) * (s.zoom || 1.5), cx = W * (s.cx == null ? .5 : s.cx), cy = H * (s.cy == null ? .56 : s.cy);
    return { pos, P: v => { const d = sub(v, pos), z = Math.max(dot(d, f), .05); return [cx + dot(d, r) * F / z, cy - dot(d, u) * F / z, z]; } };
  };

  /* Gráfica sobre una cara: rejilla de triángulos afines (aproxima la perspectiva) */
  const texTri = (g, img, p0, p1, p2, u0, v0, u1, v1, u2, v2) => {
    const d = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1); if (!d) return;
    g.save(); g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.closePath(); g.clip();
    g.transform((p0[0] * (v1 - v2) + p1[0] * (v2 - v0) + p2[0] * (v0 - v1)) / d, (p0[1] * (v1 - v2) + p1[1] * (v2 - v0) + p2[1] * (v0 - v1)) / d,
      (p0[0] * (u2 - u1) + p1[0] * (u0 - u2) + p2[0] * (u1 - u0)) / d, (p0[1] * (u2 - u1) + p1[1] * (u0 - u2) + p2[1] * (u1 - u0)) / d,
      (p0[0] * (u1 * v2 - u2 * v1) + p1[0] * (u2 * v0 - u0 * v2) + p2[0] * (u0 * v1 - u1 * v0)) / d, (p0[1] * (u1 * v2 - u2 * v1) + p1[1] * (u2 * v0 - u0 * v2) + p2[1] * (u0 * v1 - u1 * v0)) / d);
    g.drawImage(img, 0, 0); g.restore();
  };
  const texQuad = (g, img, q, P, N) => {
    const at = (i, j) => { const a = i / N, b = j / N, top = q[0].map((c, k) => c + (q[1][k] - c) * a), bot = q[3].map((c, k) => c + (q[2][k] - c) * a); return P(top.map((c, k) => c + (bot[k] - c) * b)); };
    const w = img.width, h = img.height, G = [];
    for (let i = 0; i <= N; i++) { G[i] = []; for (let j = 0; j <= N; j++) G[i][j] = at(i, j); }
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const u0 = w * i / N, u1 = w * (i + 1) / N, v0 = h * j / N, v1 = h * (j + 1) / N;
      texTri(g, img, G[i][j], G[i + 1][j], G[i + 1][j + 1], u0, v0, u1, v0, u1, v1);
      texTri(g, img, G[i][j], G[i + 1][j + 1], G[i][j + 1], u0, v0, u1, v1, u0, v1);
    }
  };
  const poly = (g, pts) => { g.beginPath(); pts.forEach((v, i) => i ? g.lineTo(v[0], v[1]) : g.moveTo(v[0], v[1])); g.closePath(); };

  /* ---------- Render de una escena ----------
     s: yaw, pitch, dist, zoom, ty, cx, cy · grid · plan (0–1 dibujo de planta) · dims · ext (extrusión) · explode
        pts (convergencia nube) · ptsA · wire (progreso aristas) · wireA · glow · fill (barrido de sólidos) · solidA
        clay (maqueta blanca) · tex (gráfica) · light (focos encendidos) · time */
  const render = (g, W, H, s) => {
    const { P, pos } = camera(s, W, H);
    const line = (a, b) => { const A = P(a), B = P(b); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); };
    // suelo técnico
    if (s.grid) { g.lineWidth = 1; g.strokeStyle = `rgba(153,196,228,${.1 * s.grid})`; g.beginPath(); for (let k = -6; k <= 6.001; k += .5) { line([k, 0, -5], [k, 0, 5]); line([-6, 0, k * .84], [6, 0, k * .84]); } g.stroke(); }
    // planta acotada
    if (s.plan > 0) {
      const pl = s.plan; g.lineWidth = 1.4; g.strokeStyle = `rgba(153,196,228,${.95 * (s.planA == null ? 1 : s.planA)})`; g.setLineDash([]);
      PARTS.slice(0, 8).forEach((p, i) => { const k = clamp01(pl * 1.6 - i * .08); if (!k) return; const b = boxOf(p, { ...s, ext: 1 }), y = .002;
        const R = [[b[0], y, b[2]], [b[3], y, b[2]], [b[3], y, b[5]], [b[0], y, b[5]], [b[0], y, b[2]]], per = [];
        let L = 0; for (let j = 0; j < 4; j++) { const d = Math.hypot(R[j + 1][0] - R[j][0], R[j + 1][2] - R[j][2]); per.push(d); L += d; }
        let rem = L * k; g.beginPath(); const A0 = P(R[0]); g.moveTo(A0[0], A0[1]);
        for (let j = 0; j < 4 && rem > 0; j++) { const f = Math.min(1, rem / per[j]); rem -= per[j]; const E = P(R[j].map((c, m) => c + (R[j + 1][m] - c) * f)); g.lineTo(E[0], E[1]); }
        g.stroke(); });
      if (s.dims > 0) {
        const a = clamp01(s.dims) * (s.planA == null ? 1 : s.planA); g.strokeStyle = `rgba(221,238,255,${.7 * a})`; g.fillStyle = `rgba(221,238,255,${.9 * a})`; g.lineWidth = 1; g.font = `500 11px ${MONO}`; g.textAlign = "center";
        const dim = (A, B, off, label) => { const a1 = A.map((c, i) => c + off[i]), b1 = B.map((c, i) => c + off[i]); g.beginPath(); line(A, a1); line(B, b1); line(a1, b1); g.stroke();
          [a1, b1].forEach(v => { const q = P(v); g.fillRect(q[0] - 2, q[1] - 2, 4, 4); }); const m = P(a1.map((c, i) => (c + b1[i]) / 2)); g.fillText(label, m[0], m[1] - 8); };
        dim([-3, 0, 1.5], [3, 0, 1.5], [0, 0, .55], "6,00 m"); dim([3, 0, -1.5], [3, 0, 1.5], [.55, 0, 0], "3,00 m");
        if ((s.ext == null ? 1 : s.ext) > .3) dim([-3, .12, -1.5], [-3, .12 + 2.5 * (s.ext == null ? 1 : s.ext), -1.5], [-.5, 0, 0], "2,50 m");
        g.textAlign = "start";
      }
    }
    // sombra y charcos de luz en el suelo
    const lit = s.light || 0, solid = Math.max(s.fill || 0, s.clay ? 1 : 0);
    if (solid > 0) { const c = P([0, 0, .1]), r = Math.abs(P([3.6, 0, .1])[0] - c[0]); g.save(); g.translate(c[0], c[1]); g.scale(1, .32); const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, `rgba(0,0,0,${.45 * solid})`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.restore(); }
    // caras sólidas ordenadas de lejos a cerca, con barrido de abajo arriba
    if (solid > 0) {
      const sweep = s.clay ? 9 : -.2 + (s.fill || 0) * 3.4, list = [];
      PARTS.forEach((p, pi) => { const b = boxOf(p, s); if (b[1] > sweep) return;
        for (const k in FACES) { const F = FACES[k], q = F.q(b), c = q.reduce((m, v) => [m[0] + v[0] / 4, m[1] + v[1] / 4, m[2] + v[2] / 4], [0, 0, 0]);
          if (dot(F.n, sub(pos, c)) <= 0) continue; const sq = q.map(P); list.push({ p, k, q, sq, z: sq.reduce((m, v) => m + v[2], 0) / 4, n: F.n }); } });
      list.sort((a, b) => b.z - a.z);
      const sa = s.solidA == null ? 1 : s.solidA;
      list.forEach(({ p, k, q, sq, n }) => {
        const base = s.clay ? [236, 239, 244] : p.c, sh = (.5 + .5 * Math.max(0, dot(n, LIGHT))) * (.82 + .22 * lit) + (n[1] > 0 ? .04 : 0);
        g.globalAlpha = sa; g.fillStyle = `rgb(${base.map(v => Math.min(255, Math.round(v * sh))).join(",")})`; poly(g, sq); g.fill();
        const tx = p.tex && p.tex[k] && TX && TX[p.tex[k]];
        if (tx && (s.tex || 0) > 0) { g.globalAlpha = sa * s.tex; texQuad(g, tx, q, P, p.tex[k] === "wall" ? 5 : 3); if (lit < 1) { g.globalAlpha = sa * s.tex * (1 - lit) * .28; g.fillStyle = "#000"; poly(g, sq); g.fill(); } }
        g.globalAlpha = sa * (s.outline == null ? .35 : s.outline); g.strokeStyle = s.clay ? "rgba(46,108,160,.5)" : "rgba(153,196,228,.6)"; g.lineWidth = 1; poly(g, sq); g.stroke();
      });
      g.globalAlpha = 1;
      if (!s.clay && s.fill > 0 && s.fill < 1) { const y = sweep; poly(g, [[-3.6, y, -1.9], [3.6, y, -1.9], [3.6, y, 1.9], [-3.6, y, 1.9]].map(P)); g.fillStyle = "rgba(153,196,228,.07)"; g.fill(); g.strokeStyle = "rgba(221,238,255,.85)"; g.lineWidth = 1.4; g.stroke(); }
    }
    // malla (aristas que se dibujan progresivamente)
    if ((s.wire || 0) > 0 && (s.wireA == null ? 1 : s.wireA) > .01) {
      g.lineWidth = 1.2; g.strokeStyle = `rgba(153,196,228,${s.wireA == null ? .9 : s.wireA})`; if (s.glow) { g.shadowColor = "rgba(153,196,228,.9)"; g.shadowBlur = 8 * s.glow; }
      g.beginPath(); let i = 0; const N = PARTS.length * EDGES.length;
      PARTS.forEach(p => { const C = corners(boxOf(p, s)); EDGES.forEach(([a, b]) => { const e = clamp01(s.wire * 1.7 - i++ / N * .7); if (!e) return; line(C[a], C[a].map((c, j) => c + (C[b][j] - c) * e)); }); });
      g.stroke(); g.shadowBlur = 0;
    }
    // nube de puntos
    const pa = s.ptsA || 0;
    if (pa > .02) { g.fillStyle = `rgba(221,238,255,${pa})`; const cc = PARTS.map(p => corners(boxOf(p, s))), k = ease(clamp01(s.pts || 0));
      PTS.forEach(o => { const A = cc[o.pi][o.a], B = cc[o.pi][o.b], to = [A[0] + (B[0] - A[0]) * o.s, A[1] + (B[1] - A[1]) * o.s, A[2] + (B[2] - A[2]) * o.s], v = P(o.from.map((c, j) => c + (to[j] - c) * k)); g.fillRect(v[0] - 1, v[1] - 1, 2, 2); }); }
    // focos: haz de luz y halo (suma de luz)
    if (lit > .01) {
      g.save(); g.globalCompositeOperation = "lighter";
      SPOTS.forEach(([x, pi]) => { const b = boxOf(PARTS[pi], s), ap = P([x, b[1] - .02, b[5]]), f1 = P([x - .8, .13, .55]), f2 = P([x + .8, .13, .55]), fc = P([x * .95, .13, .4]);
        const gr = g.createLinearGradient(ap[0], ap[1], fc[0], fc[1]); gr.addColorStop(0, `rgba(255,244,222,${.32 * lit})`); gr.addColorStop(1, "rgba(255,244,222,0)");
        g.fillStyle = gr; g.beginPath(); g.moveTo(ap[0], ap[1]); g.lineTo(f1[0], f1[1]); g.lineTo(f2[0], f2[1]); g.closePath(); g.fill();
        const rr = Math.abs(f2[0] - f1[0]) * .6; g.save(); g.translate(fc[0], fc[1]); g.scale(1, .35); const pg = g.createRadialGradient(0, 0, 0, 0, 0, rr); pg.addColorStop(0, `rgba(255,240,215,${.3 * lit})`); pg.addColorStop(1, "rgba(255,240,215,0)"); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, rr, 0, 6.283); g.fill(); g.restore();
        const hg = g.createRadialGradient(ap[0], ap[1], 0, ap[0], ap[1], 22); hg.addColorStop(0, `rgba(255,255,255,${.9 * lit})`); hg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = hg; g.beginPath(); g.arc(ap[0], ap[1], 22, 0, 6.283); g.fill(); });
      // brillo del tótem retroiluminado
      const tb = boxOf(PARTS[5], s), tc = P([(tb[0] + tb[3]) / 2, (tb[1] + tb[4]) / 2, tb[5]]), th = Math.abs(P([tb[0], tb[4], tb[5]])[1] - P([tb[0], tb[1], tb[5]])[1]);
      const tg = g.createRadialGradient(tc[0], tc[1], 0, tc[0], tc[1], th * .7); tg.addColorStop(0, `rgba(153,196,228,${.22 * lit})`); tg.addColorStop(1, "rgba(153,196,228,0)"); g.fillStyle = tg; g.beginPath(); g.arc(tc[0], tc[1], th * .7, 0, 6.283); g.fill();
      g.restore();
    }
  };

  /* Estado por defecto de las 4 fases a partir de t */
  const phases = t => { const p0 = clamp01(t), p1 = clamp01(t - 1), p2 = clamp01(t - 2), p3 = clamp01(t - 3); return { p0, p1, p2, p3 }; };

  /* Montaje común: lienzo + t suavizado + ScrollTrigger (con o sin pantalla fija) */
  const mount = (root, ux, { cv, trigger, pin, start, end, setUI, scene, onFrame }) => {
    let T = ux.reduce ? 4 : 0, shown = T;
    loadTextures().then(() => loop.redraw());
    const loop = canvasLoop(cv, root, (g, W, H, now) => { shown += (T - shown) * .1; if (Math.abs(T - shown) < .001) shown = T; g.clearRect(0, 0, W, H); scene(g, W, H, shown, now); onFrame && onFrame(shown); }, ux);
    if (ux.reduce) { root.classList.add("is-static"); setUI(4); loop.redraw(); return () => { loop.stop(); root.classList.remove("is-static"); }; }
    setUI(0);
    ScrollTrigger.create({ trigger, start, end, pin: pin || false, anticipatePin: pin ? 1 : 0, invalidateOnRefresh: true, onUpdate: st => { T = st.progress * 4; setUI(Math.min(3.999, T)); } });
    return () => loop.stop();
  };
  const onIdx = (items, i) => items.forEach((li, k) => { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
  const pinEnd = () => innerWidth < 900 ? "+=240%" : "+=300%";

  /* ---------- A · Despiece (también en la landing: Cómo trabajamos G) ---------- */
  const despiece = (root, ux) => {
    const steps = $$(".stproc-a__steps li", root), bars = $$(".stproc-a__bar b", root), pin = $(".stproc-a__pin", root);
    const setUI = t => { onIdx(steps, Math.min(3, Math.floor(t))); bars.forEach((b, k) => b.style.setProperty("--p", clamp01(t - k))); };
    return mount(root, ux, { cv: $(".stproc-a__cv", root), trigger: pin, pin, start: "top top", end: pinEnd, setUI,
      scene: (g, W, H, t, now) => { const { p0, p1, p2, p3 } = phases(t), m = W < 900, asm = ease(p3);
        render(g, W, H, { yaw: -.95 + t * .22 + Math.sin(now * .0003) * .04, pitch: lerp(.5, .36, asm), dist: lerp(12.5, 9.2, asm), zoom: m ? 1.2 : 1.35, ty: lerp(1.6, 1.15, asm), cx: m ? .5 : .6, cy: m ? .46 : .5,
          grid: .7 + .3 * asm, explode: 1 - asm, pts: p0, ptsA: .95 * (1 - p1 * .9), wire: p1, wireA: .85 - .55 * p2, glow: 1 - p2, fill: p2, tex: clamp01(p2 * 1.5 - .4), light: clamp01(p3 * 1.6 - .6), outline: .45 - .3 * asm }); } });
  };
  register("stands-process", "A", despiece);
  register("process", "G", despiece);

})();
