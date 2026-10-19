/* Stands · Cómo trabajamos · A «Despiece» (ronda 10b; ronda 13: stand de 10 × 7 m con aéreo y gráfica de Unical)
   Motor 3D propio (canvas 2D, sin librerías): un stand de 70 m² con tarima, pared en L, almacén, pantalla LED,
   mostrador, dos tótems, zona de reunión, expositores, plantas y un aéreo colgado con focos.
   Guion por t ∈ [0, 4]: 1 plano acotado · 2 las paredes se levantan · 3 las piezas se imprimen en taller
   (separadas) · 4 montaje pieza a pieza, el aéreo baja desde arriba y se encienden los focos. */
(() => {
  const { register, $, $$ } = UX;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const easeOut = x => 1 - Math.pow(1 - x, 3);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const css = getComputedStyle(document.documentElement);
  const MONO = css.getPropertyValue("--f-mono").trim() || "'JetBrains Mono', monospace";
  const HEAD = css.getPropertyValue("--f-head").trim() || "'Poppins', sans-serif";
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

  /* ---------- Gráfica impresa del stand: todo diseño de Unical (se genera una vez) ---------- */
  const IMG = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const mk = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d"), w, h); return c; };
  const NAVY = "#10182E", NIGHT = "#0B0F1E", BLUE = "#99C4E4", STRONG = "#2E6CA0", DEEP = "#1E5076";
  /* ondas de la marca (las de la «~» del logo) */
  const waves = (g, w, h, y0, amp, n, col, lw = 3) => {
    g.save(); g.strokeStyle = col; g.lineWidth = lw;
    for (let k = 0; k < n; k++) { g.globalAlpha = .9 - k * (.7 / n); g.beginPath();
      for (let x = 0; x <= w; x += 8) { const y = y0 + k * amp * .55 + Math.sin(x / w * 6.283 * 1.4 + k * .5) * amp * (1 - k * .08); x ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke(); }
    g.restore();
  };
  let TX = null, txP = null;
  const loadTextures = () => txP || (txP = Promise.all([
    IMG("assets/img/logo/logo-unical-light-xl.png"), IMG("assets/img/logo/logo-unical.png"), document.fonts ? document.fonts.ready : null
  ]).then(([lgL, lgD]) => {
    const logoC = (g, img, cx, cy, w) => { if (img) { const h = w * img.height / img.width; g.drawImage(img, cx - w / 2, cy - h / 2, w, h); } };
    const txt = (g, s, x, y, font, col, align = "left") => { g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = "alphabetic"; g.fillText(s, x, y); };
    TX = {
      /* Pared del fondo (10 × 3 m). La pantalla LED tapa u ≈ 0,14–0,40 y el almacén u ≈ 0,74–1 */
      wall: mk(2000, 600, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, NIGHT); gr.addColorStop(.55, NAVY); gr.addColorStop(1, DEEP); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        waves(g, w, h, h * .8, 34, 6, BLUE, 3);
        const rg = g.createRadialGradient(w * .58, h * .45, 20, w * .58, h * .45, 520); rg.addColorStop(0, "rgba(153,196,228,.22)"); rg.addColorStop(1, "rgba(153,196,228,0)"); g.fillStyle = rg; g.fillRect(0, 0, w, h);
        logoC(g, lgL, w * .57, h * .2, 380);
        txt(g, "Producción visual", w * .43, h * .44, `800 76px ${HEAD}`, "#fff");
        txt(g, "sin límites.", w * .43, h * .58, `italic 800 76px ${HEAD}`, BLUE);
        txt(g, "IMPRESIÓN · ROTULACIÓN · STANDS · EVENTOS", w * .43, h * .68, `600 24px ${MONO}`, "rgba(221,238,255,.8)");
        g.fillStyle = BLUE; g.fillRect(0, h - 12, w, 12);
      }),
      /* Pared lateral (3,8 × 3 m): azul de marca con el mensaje del stand */
      side: mk(760, 600, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, STRONG); gr.addColorStop(1, BLUE); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        waves(g, w, h, h * .78, 26, 5, "rgba(255,255,255,.75)", 2.5);
        logoC(g, lgL, w / 2, h * .2, 300);
        txt(g, "Stands", w / 2, h * .46, `800 74px ${HEAD}`, "#fff", "center");
        txt(g, "a medida.", w / 2, h * .59, `italic 800 74px ${HEAD}`, NAVY, "center");
      }),
      /* Almacén: frente blanco con puerta y logo, lateral azul noche */
      store: mk(520, 600, (g, w, h) => {
        g.fillStyle = "#F4F7FB"; g.fillRect(0, 0, w, h);
        g.strokeStyle = "rgba(16,24,46,.35)"; g.lineWidth = 3; g.strokeRect(w * .58, h * .3, w * .3, h * .7); g.fillStyle = "rgba(16,24,46,.5)"; g.fillRect(w * .62, h * .64, 14, 4);
        if (lgD) logoC(g, lgD, w * .3, h * .2, 220);
        g.fillStyle = STRONG; g.fillRect(0, h - 14, w, 14);
      }),
      storeSide: mk(400, 600, (g, w, h) => {
        g.fillStyle = NAVY; g.fillRect(0, 0, w, h); waves(g, w, h, h * .55, 22, 5, BLUE, 2.5);
        g.save(); g.translate(w * .5, h * .38); g.rotate(-Math.PI / 2); txt(g, "UNICAL", 0, 22, `800 64px ${HEAD}`, "#fff", "center"); g.restore();
      }),
      counter: mk(600, 240, (g, w, h) => {
        g.fillStyle = NAVY; g.fillRect(0, 0, w, h); waves(g, w, h, h * .78, 12, 3, "rgba(153,196,228,.6)", 2);
        logoC(g, lgL, w / 2, h * .42, 300); g.fillStyle = BLUE; g.fillRect(0, h - 10, w, 10);
      }),
      totem: mk(160, 640, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#fff"); gr.addColorStop(.35, "#fff"); gr.addColorStop(.36, STRONG); gr.addColorStop(1, BLUE); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        if (lgD) logoC(g, lgD, w / 2, h * .17, 128);
        g.save(); g.translate(w * .62, h * .95); g.rotate(-Math.PI / 2); txt(g, "Diseño · Producción · Montaje", 0, 0, `800 30px ${HEAD}`, "#fff"); g.restore();
      }),
      /* Pantalla LED encendida con el motivo de marca */
      screen: mk(520, 300, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, DEEP); gr.addColorStop(1, "#070A14"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        waves(g, w, h, h * .66, 16, 4, BLUE, 2.5); logoC(g, lgL, w / 2, h * .38, 250);
        txt(g, "SHOWREEL 2026", w / 2, h * .9, `600 16px ${MONO}`, "rgba(221,238,255,.85)", "center");
      }),
      /* Aéreo: banda de 6 × 1 m con el logo y la línea LED arriba y abajo */
      aerial: mk(1200, 200, (g, w, h) => {
        g.fillStyle = NAVY; g.fillRect(0, 0, w, h); logoC(g, lgL, w / 2, h / 2, 420);
        g.fillStyle = BLUE; g.fillRect(0, 0, w, 8); g.fillRect(0, h - 8, w, 8);
      }),
      aerialS: mk(760, 200, (g, w, h) => {
        g.fillStyle = NAVY; g.fillRect(0, 0, w, h); txt(g, "Producción visual sin límites", w / 2, h * .6, `800 48px ${HEAD}`, "#fff", "center");
        g.fillStyle = BLUE; g.fillRect(0, 0, w, 8); g.fillRect(0, h - 8, w, 8);
      }),
      plinth: mk(200, 300, (g, w, h) => { g.fillStyle = "#F7F9FC"; g.fillRect(0, 0, w, h); g.fillStyle = STRONG; g.fillRect(0, 0, w, 26); if (lgD) logoC(g, lgD, w / 2, h * .55, 130); })
    };
  }));

  /* ---------- Modelo: 10 × 7 m. Piezas [x0,y0,z0,x1,y1,z1], color, gráfica por cara, despiece y orden de montaje ---------- */
  const WHITE = [244, 246, 250], NAVYC = [20, 30, 56];
  const PARTS = [
    { b: [-5, 0, -3.5, 5, .12, 3.5], c: [150, 160, 178], ex: [0, -.8, 0], floor: 1, plan: 1, o: 0 },                         // 0 tarima
    { b: [-5, .12, -3.5, 5, 3.12, -3.3], c: WHITE, tex: { front: "wall" }, ex: [0, .9, -3.2], plan: 1, o: 1 },                 // 1 pared del fondo
    { b: [-5, .12, -3.3, -4.8, 3.12, .5], c: WHITE, tex: { right: "side", left: "side" }, ex: [-2.6, .7, .2], plan: 1, o: 2 },              // 2 pared lateral
    { b: [2.4, .12, -3.3, 5, 3.12, -1.3], c: WHITE, tex: { front: "store", left: "storeSide" }, ex: [3, 1, -1.2], plan: 1, o: 3 }, // 3 almacén
    { b: [-3.6, 1.05, -3.3, -1.0, 2.55, -3.22], c: [10, 12, 20], tex: { front: "screen" }, ex: [-.6, 1.6, -1.8], o: 4 },     // 4 pantalla LED
    { b: [1.0, .12, 1.7, 3.6, 1.05, 2.5], c: NAVYC, tex: { front: "counter" }, ex: [2.4, 1, 3], plan: 1, o: 5 },              // 5 mostrador
    { b: [.95, 1.05, 1.65, 3.65, 1.11, 2.55], c: [250, 251, 253], ex: [2.4, 2, 3], o: 5 },                                    // 6 encimera
    { b: [-4.6, .12, 2.7, -4.05, 2.7, 3.1], c: WHITE, tex: { front: "totem" }, ex: [-2.8, 1.4, 2.4], plan: 1, o: 6 },          // 7 tótem izquierdo
    { b: [4.05, .12, 2.7, 4.6, 2.7, 3.1], c: WHITE, tex: { front: "totem" }, ex: [2.8, 1.4, 2.4], plan: 1, o: 6 },             // 8 tótem derecho
    { b: [-3.5, .12, -1.4, -2.1, .85, -.2], c: [250, 251, 253], ex: [-2.4, 1.4, .8], plan: 1, o: 7 },                         // 9 mesa de reunión
    { b: [-3.95, .12, -1.0, -3.6, .58, -.6], c: STRONGC(), ex: [-3, 1.2, .8], o: 7 },                                          // 10–13 sillas
    { b: [-2.0, .12, -1.0, -1.65, .58, -.6], c: STRONGC(), ex: [-1.8, 1.2, .8], o: 7 },
    { b: [-3.0, .12, -1.85, -2.6, .58, -1.5], c: STRONGC(), ex: [-2.4, 1.2, -.2], o: 7 },
    { b: [-3.0, .12, -.1, -2.6, .58, .25], c: STRONGC(), ex: [-2.4, 1.2, 1.6], o: 7 },
    { b: [-.9, .12, 2.3, -.3, 1.0, 2.9], c: WHITE, tex: { front: "plinth" }, ex: [-.4, 1.6, 2.6], plan: 1, o: 8 },            // 14–15 expositores
    { b: [-.1, .12, 2.5, .45, .75, 3.05], c: WHITE, tex: { front: "plinth" }, ex: [.2, 1.6, 2.8], plan: 1, o: 8 },
    { b: [-4.65, .12, -3.2, -4.15, .7, -2.7], c: [236, 238, 242], ex: [-2.6, 1, -1.6], o: 8 },                                // 16–17 jardineras + verde
    { b: [-4.7, .7, -3.25, -4.1, 1.55, -2.65], c: [74, 128, 92], ex: [-2.6, 1.6, -1.6], o: 8 },
    { b: [-1.6, 3.12, -3.5, -1.5, 3.2, -2.6], c: [36, 38, 50], ex: [0, 2.4, -2], o: 9 },                                      // 18–20 brazos de focos
    { b: [.45, 3.12, -3.5, .55, 3.2, -2.6], c: [36, 38, 50], ex: [0, 2.6, -2], o: 9 },
    { b: [1.9, 3.12, -3.5, 2.0, 3.2, -2.6], c: [36, 38, 50], ex: [0, 2.4, -2], o: 9 },
    { b: [-3, 4.4, 1.85, 3, 5.4, 1.95], c: NAVYC, tex: { front: "aerial" }, ex: [0, 4.5, 0], o: 10, aerial: 1 },               // 21–24 aéreo
    { b: [-3, 4.4, -1.95, 3, 5.4, -1.85], c: NAVYC, tex: { back: "aerial" }, ex: [0, 4.5, 0], o: 10, aerial: 1 },
    { b: [-3.1, 4.4, -1.95, -3, 5.4, 1.95], c: NAVYC, tex: { left: "aerialS" }, ex: [0, 4.5, 0], o: 10, aerial: 1 },
    { b: [3, 4.4, -1.95, 3.1, 5.4, 1.95], c: NAVYC, tex: { right: "aerialS" }, ex: [0, 4.5, 0], o: 10, aerial: 1 },
    ...[[-2.9, -1.8], [2.9, -1.8], [-2.9, 1.8], [2.9, 1.8]].map(([x, z]) => ({ b: [x - .015, 5.4, z - .015, x + .015, 8.6, z + .015], c: [120, 130, 150], ex: [0, 4.5, 0], o: 10, aerial: 1, cable: 1 }))
  ];
  function STRONGC() { return [46, 108, 160]; }
  const NORDER = Math.max(...PARTS.map(p => p.o)) + 1;
  /* Focos: los de la pared (brazos) y los que cuelgan del aéreo */
  const SPOTS = [{ pi: 18, x: -1.55, z: -2.65 }, { pi: 19, x: .5, z: -2.65 }, { pi: 20, x: 1.95, z: -2.65 },
                 { pi: 21, x: -2, z: 1.9 }, { pi: 21, x: 0, z: 1.9 }, { pi: 21, x: 2, z: 1.9 }, { pi: 22, x: -1.5, z: -1.9 }, { pi: 22, x: 1.5, z: -1.9 }];
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
  // nube de puntos: muestras sobre las aristas, cada una con un origen aleatorio (los cables no llevan)
  const PTS = []; PARTS.forEach((p, pi) => { if (p.cable) return; EDGES.forEach(([a, b]) => { for (let k = 0; k < 4; k++) { const r = 5 + 5 * Math.cbrt(Math.random()), th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); PTS.push({ pi, a, b, s: Math.random(), from: [r * Math.sin(ph) * Math.cos(th), 2 + r * Math.cos(ph) * .7, r * Math.sin(ph) * Math.sin(th)] }); } }); });

  /* Despiece de cada pieza: s.explode (0–1) o, en el montaje, una curva escalonada por orden de montaje */
  const explodeOf = (p, s) => {
    if (s.asm == null) return (s.explode || 0) * .72;
    const d = p.o / NORDER * .62, k = clamp01((s.asm - d) / .38);
    return (1 - easeOut(k)) * .72;
  };
  /* Caja de una pieza en el estado actual (extrusión en altura y despiece) */
  const boxOf = (p, s) => { const e = explodeOf(p, s), k = s.ext == null ? 1 : s.ext, b = p.b.slice();
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
  const TEXN = { wall: 7, side: 4, aerial: 5, aerialS: 4 };

  /* ---------- Render de una escena ----------
     s: yaw, pitch, dist, zoom, ty, cx, cy · grid · plan (0–1 dibujo de planta) · planA · dims · ext (extrusión) · explode | asm (montaje escalonado)
        pts (convergencia nube) · ptsA · wire · wireA · glow · fill (barrido de sólidos) · tex (gráfica) · light (focos) · outline */
  const render = (g, W, H, s) => {
    const { P, pos } = camera(s, W, H);
    const line = (a, b) => { const A = P(a), B = P(b); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); };
    // suelo técnico
    if (s.grid) { g.lineWidth = 1; g.strokeStyle = `rgba(153,196,228,${.09 * s.grid})`; g.beginPath(); for (let k = -9; k <= 9.001; k += 1) { line([k, 0, -7], [k, 0, 7]); line([-9, 0, k * .78], [9, 0, k * .78]); } g.stroke(); }
    // planta acotada
    if (s.plan > 0) {
      const pl = s.plan, pa = s.planA == null ? 1 : s.planA; g.lineWidth = 1.4; g.strokeStyle = `rgba(153,196,228,${.95 * pa})`; g.setLineDash([]);
      PARTS.filter(p => p.plan).forEach((p, i) => { const k = clamp01(pl * 1.8 - i * .07); if (!k) return; const b = boxOf(p, { ...s, ext: 1 }), y = .002;
        const R = [[b[0], y, b[2]], [b[3], y, b[2]], [b[3], y, b[5]], [b[0], y, b[5]], [b[0], y, b[2]]], per = [];
        let L = 0; for (let j = 0; j < 4; j++) { const d = Math.hypot(R[j + 1][0] - R[j][0], R[j + 1][2] - R[j][2]); per.push(d); L += d; }
        let rem = L * k; g.beginPath(); const A0 = P(R[0]); g.moveTo(A0[0], A0[1]);
        for (let j = 0; j < 4 && rem > 0; j++) { const f = Math.min(1, rem / per[j]); rem -= per[j]; const E = P(R[j].map((c, m) => c + (R[j + 1][m] - c) * f)); g.lineTo(E[0], E[1]); }
        g.stroke(); });
      if (s.dims > 0) {
        const a = clamp01(s.dims) * pa; g.strokeStyle = `rgba(221,238,255,${.7 * a})`; g.fillStyle = `rgba(221,238,255,${.9 * a})`; g.lineWidth = 1; g.font = `500 12px ${MONO}`; g.textAlign = "center";
        const dim = (A, B, off, label) => { const a1 = A.map((c, i) => c + off[i]), b1 = B.map((c, i) => c + off[i]); g.beginPath(); line(A, a1); line(B, b1); line(a1, b1); g.stroke();
          [a1, b1].forEach(v => { const q = P(v); g.fillRect(q[0] - 2, q[1] - 2, 4, 4); }); const m = P(a1.map((c, i) => (c + b1[i]) / 2)); g.fillText(label, m[0], m[1] - 8); };
        dim([-5, 0, 3.5], [5, 0, 3.5], [0, 0, .8], "10,00 m"); dim([5, 0, -3.5], [5, 0, 3.5], [.8, 0, 0], "7,00 m");
        const ex = s.ext == null ? 1 : s.ext; if (ex > .3) dim([-5, .12, -3.5], [-5, .12 + 3 * ex, -3.5], [-.7, 0, 0], "3,00 m");
        // superficie en el centro de la planta
        const c = P([0, .01, .4]); g.font = `800 ${Math.round(Math.max(18, W * .022))}px ${HEAD}`; g.fillStyle = `rgba(153,196,228,${.95 * a})`; g.fillText("70 m²", c[0], c[1]);
        g.textAlign = "start";
      }
    }
    // sombra en el suelo
    const lit = s.light || 0, solid = s.fill || 0;
    if (solid > 0) { const c = P([0, 0, .1]), r = Math.abs(P([6, 0, .1])[0] - c[0]); g.save(); g.translate(c[0], c[1]); g.scale(1, .34); const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, `rgba(0,0,0,${.5 * solid})`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.restore(); }
    // caras sólidas ordenadas de lejos a cerca (la tarima siempre primero), con barrido de abajo arriba
    if (solid > 0) {
      const sweep = -.2 + solid * 10.5, list = [];
      PARTS.forEach((p, pi) => { const b = boxOf(p, s); if (b[1] > sweep) return;
        for (const k in FACES) { const F = FACES[k], q = F.q(b), c = q.reduce((m, v) => [m[0] + v[0] / 4, m[1] + v[1] / 4, m[2] + v[2] / 4], [0, 0, 0]);
          if (dot(F.n, sub(pos, c)) <= 0) continue; const sq = q.map(P); list.push({ p, k, q, sq, z: p.floor ? 1e9 : sq.reduce((m, v) => m + v[2], 0) / 4, n: F.n }); } });
      list.sort((a, b) => b.z - a.z);
      list.forEach(({ p, k, q, sq, n }) => {
        const sh = (.5 + .5 * Math.max(0, dot(n, LIGHT))) * (.8 + .24 * lit) + (n[1] > 0 ? .04 : 0);
        g.fillStyle = `rgb(${p.c.map(v => Math.min(255, Math.round(v * sh))).join(",")})`; poly(g, sq); g.fill();
        const tx = p.tex && p.tex[k] && TX && TX[p.tex[k]];
        if (tx && (s.tex || 0) > 0) { g.globalAlpha = s.tex; texQuad(g, tx, q, P, TEXN[p.tex[k]] || 3); if (lit < 1) { g.globalAlpha = s.tex * (1 - lit) * .3; g.fillStyle = "#000"; poly(g, sq); g.fill(); } g.globalAlpha = 1; }
        if (!p.cable) { g.globalAlpha = s.outline == null ? .35 : s.outline; g.strokeStyle = "rgba(153,196,228,.6)"; g.lineWidth = 1; poly(g, sq); g.stroke(); g.globalAlpha = 1; }
      });
      if (solid < 1) { const y = sweep; poly(g, [[-5.8, y, -4.2], [5.8, y, -4.2], [5.8, y, 4.2], [-5.8, y, 4.2]].map(P)); g.fillStyle = "rgba(153,196,228,.06)"; g.fill(); g.strokeStyle = "rgba(221,238,255,.8)"; g.lineWidth = 1.4; g.stroke(); }
    }
    // malla (aristas que se dibujan progresivamente)
    if ((s.wire || 0) > 0 && (s.wireA == null ? 1 : s.wireA) > .01) {
      g.lineWidth = 1.1; g.strokeStyle = `rgba(153,196,228,${s.wireA == null ? .9 : s.wireA})`; if (s.glow) { g.shadowColor = "rgba(153,196,228,.9)"; g.shadowBlur = 8 * s.glow; }
      g.beginPath(); let i = 0; const N = PARTS.length * EDGES.length;
      PARTS.forEach(p => { const C = corners(boxOf(p, s)); EDGES.forEach(([a, b]) => { const e = clamp01(s.wire * 1.7 - i++ / N * .7); if (!e) return; line(C[a], C[a].map((c, j) => c + (C[b][j] - c) * e)); }); });
      g.stroke(); g.shadowBlur = 0;
    }
    // nube de puntos
    const pa = s.ptsA || 0;
    if (pa > .02) { g.fillStyle = `rgba(221,238,255,${pa})`; const cc = PARTS.map(p => corners(boxOf(p, s))), k = ease(clamp01(s.pts || 0));
      PTS.forEach(o => { const A = cc[o.pi][o.a], B = cc[o.pi][o.b], to = [A[0] + (B[0] - A[0]) * o.s, A[1] + (B[1] - A[1]) * o.s, A[2] + (B[2] - A[2]) * o.s], v = P(o.from.map((c, j) => c + (to[j] - c) * k)); g.fillRect(v[0] - 1, v[1] - 1, 2, 2); }); }
    // focos (se encienden uno tras otro), pantalla LED, tótems y línea LED del aéreo
    if (lit > .01) {
      g.save(); g.globalCompositeOperation = "lighter";
      SPOTS.forEach(({ pi, x, z }, i) => { const L = clamp01(lit * 1.6 - i * .08); if (!L) return; const p = PARTS[pi], b = boxOf(p, s), dx = b[0] - p.b[0], dy = b[1] - p.b[1], dz = b[2] - p.b[2];
        const ap = P([x + dx, p.b[1] + dy - .02, z + dz]), fc = P([x * .95, .13, z + .7]), f1 = P([x * .95 - .9, .13, z + .7]), f2 = P([x * .95 + .9, .13, z + .7]);
        const gr = g.createLinearGradient(ap[0], ap[1], fc[0], fc[1]); gr.addColorStop(0, `rgba(255,244,222,${.26 * L})`); gr.addColorStop(1, "rgba(255,244,222,0)");
        g.fillStyle = gr; g.beginPath(); g.moveTo(ap[0], ap[1]); g.lineTo(f1[0], f1[1]); g.lineTo(f2[0], f2[1]); g.closePath(); g.fill();
        const rr = Math.abs(f2[0] - f1[0]) * .6; g.save(); g.translate(fc[0], fc[1]); g.scale(1, .35); const pg = g.createRadialGradient(0, 0, 0, 0, 0, rr); pg.addColorStop(0, `rgba(255,240,215,${.24 * L})`); pg.addColorStop(1, "rgba(255,240,215,0)"); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, rr, 0, 6.283); g.fill(); g.restore();
        const hg = g.createRadialGradient(ap[0], ap[1], 0, ap[0], ap[1], 18); hg.addColorStop(0, `rgba(255,255,255,${.9 * L})`); hg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = hg; g.beginPath(); g.arc(ap[0], ap[1], 18, 0, 6.283); g.fill(); });
      const glow = (pi, face, col, k) => { const b = boxOf(PARTS[pi], s), c = P([(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, face === "front" ? b[5] : (b[2] + b[5]) / 2]), r = Math.abs(P([b[3], b[4], b[5]])[0] - P([b[0], b[4], b[5]])[0]) * k + 30;
        const gg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); gg.addColorStop(0, col); gg.addColorStop(1, "rgba(153,196,228,0)"); g.fillStyle = gg; g.beginPath(); g.arc(c[0], c[1], r, 0, 6.283); g.fill(); };
      glow(4, "front", `rgba(153,196,228,${.2 * lit})`, .6); glow(7, "front", `rgba(153,196,228,${.16 * lit})`, 1.6); glow(8, "front", `rgba(153,196,228,${.16 * lit})`, 1.6); glow(21, "front", `rgba(153,196,228,${.12 * lit})`, .45);
      g.restore();
    }
  };

  /* Estado por defecto de las 4 fases a partir de t */
  const phases = t => { const p0 = clamp01(t), p1 = clamp01(t - 1), p2 = clamp01(t - 2), p3 = clamp01(t - 3); return { p0, p1, p2, p3 }; };

  /* Montaje común: lienzo + t suavizado + ScrollTrigger (con o sin pantalla fija) */
  const mount = (root, ux, { cv, trigger, pin, start, end, setUI, scene, onFrame }) => {
    let T = ux.reduce ? 4 : 0, shown = T;
    loadTextures().then(() => loop.redraw());
    const loop = canvasLoop(cv, root, (g, W, H, now) => { shown += (T - shown) * .085; if (Math.abs(T - shown) < .001) shown = T; g.clearRect(0, 0, W, H); scene(g, W, H, shown, now); onFrame && onFrame(shown); }, ux);
    if (ux.reduce) { root.classList.add("is-static"); setUI(4); loop.redraw(); return () => { loop.stop(); root.classList.remove("is-static"); }; }
    setUI(0);
    ScrollTrigger.create({ trigger, start, end, pin: pin || false, anticipatePin: pin ? 1 : 0, invalidateOnRefresh: true, onUpdate: st => { T = st.progress * 4; setUI(Math.min(3.999, T)); } });
    return () => loop.stop();
  };
  const onIdx = (items, i) => items.forEach((li, k) => { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
  const pinEnd = () => innerWidth < 900 ? "+=300%" : "+=380%";

  /* ---------- A · Despiece (también en la landing: Cómo trabajamos A) ----------
     0–1 Presupuesto: la planta se dibuja y se acota (vista casi cenital) mientras la nube de puntos converge
     1–2 Diseño: las paredes se levantan en malla y la cámara baja
     2–3 Producción: las piezas se separan como en el taller, se rellenan y se imprimen
     3–4 Instalación: montaje pieza a pieza; el aéreo baja el último y se encienden los focos */
  const despiece = (root, ux) => {
    const steps = $$(".stproc-a__steps li", root), bars = $$(".stproc-a__bar b", root), pin = $(".stproc-a__pin", root);
    const setUI = t => { onIdx(steps, Math.min(3, Math.floor(t))); bars.forEach((b, k) => b.style.setProperty("--p", clamp01(t - k))); };
    return mount(root, ux, { cv: $(".stproc-a__cv", root), trigger: pin, pin, start: "top top", end: pinEnd, setUI,
      scene: (g, W, H, t, now) => { const { p0, p1, p2, p3 } = phases(t), m = W < 900, e1 = ease(p1), e2 = ease(p2), e3 = ease(p3);
        const top = 1 - e1;                                   // cuánto de cenital tiene la cámara
        render(g, W, H, {
          yaw: -.15 - .55 * e1 - .2 * e2 + .35 * e3 + Math.sin(now * .00025) * .03,
          pitch: lerp(lerp(1.15, .5, e1), .3, e3), dist: lerp(lerp(19, 17.5, e1), 15.5, e3) + 2.2 * e2 * (1 - e3),
          zoom: m ? 1.05 : 1.55, ty: lerp(.2, 2.1, Math.max(e1, e3 * .9)) + .8 * e2 * (1 - e3), cx: m ? .5 : .62, cy: m ? .5 : lerp(.56, .54, e3),
          grid: .6 + .4 * top,
          plan: p0 * 1.1, planA: 1 - e1 * .85, dims: clamp01(p0 * 1.6 - .5) * (1 - p2),
          ext: p0 < 1 ? 0 : e1,
          explode: p2 < 1 ? e2 * (p3 > 0 ? 1 : 1) : 1, asm: p3 > 0 ? p3 : null,
          pts: p0, ptsA: .85 * (1 - e1),
          wire: clamp01(p0 * 1.2 + p1), wireA: .85 - .6 * e2, glow: 1 - e2,
          fill: e2, tex: clamp01(p2 * 1.6 - .5),
          light: clamp01(p3 * 1.8 - .75), outline: .4 - .28 * e3 }); } });
  };
  register("stands-process", "A", despiece);
  register("process", "A", despiece);

})();
