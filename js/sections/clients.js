/* ===== 08 · Clientes (A = muro de estadio; B–F nuevas) ===== */
(() => {
  const { register, $, $$ } = UX;
  const ALL = ["toyota","coca-cola","bankinter","generali","sony-music","monster-energy","philip-morris","mitsubishi-electric","otis","porcelanosa","rituals","wella","los40","rfef","cruz-roja","avoris","catai","csl-vifor","dial","elanco","fibratel","leo-pharma","longi","straumann","ucb"];
  const NAMES = { toyota: "Toyota", "coca-cola": "Coca-Cola", bankinter: "Bankinter", generali: "Generali", "sony-music": "Sony Music", "monster-energy": "Monster Energy", "philip-morris": "Philip Morris", "mitsubishi-electric": "Mitsubishi Electric", otis: "Otis", porcelanosa: "Porcelanosa", rituals: "Rituals", wella: "Wella", los40: "LOS40", rfef: "RFEF", "cruz-roja": "Cruz Roja", avoris: "Ávoris", catai: "Catai", "csl-vifor": "CSL Vifor", dial: "Dial", elanco: "Elanco", fibratel: "Fibratel", "leo-pharma": "LEO Pharma", longi: "LONGi", straumann: "Straumann", ucb: "UCB" };
  const name = n => NAMES[n] || n;
  // Los PNG disponibles son favicons de 16–128 px: usamos el nombre como marca tipográfica.
  const word = (n, decorative) => `<span class="clients-word"${decorative ? ' aria-hidden="true"' : ""}>${name(n)}</span>`;
  const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const listText = "Algunos de nuestros clientes: " + ALL.map(name).join(", ") + ".";
  const fillList = root => $$("[data-clients-list]", root).forEach(p => (p.textContent = listText));
  const seeded = s => () => ((s = (s * 9301 + 49297) % 233280) / 233280);

  /* ---------- A · Muro de estadio ---------- */
  register("clients", "A", (root, ux) => {
    fillList(root);
    const wall = $(".clients-a__wall", root);
    const rot = (a, n) => a.slice(n).concat(a.slice(0, n));
    wall.innerHTML = [0, 6, 12, 18].map(s => {
      const cells = rot(ALL, s).map(n => `<div class="clients-a__cell">${word(n, true)}</div>`).join("");
      return `<div class="clients-a__row">${cells}${cells}</div>`;
    }).join("");
    if (ux.reduce) return;
    const rows = $$(".clients-a__row", root).map((el, i) => ({ el, x: -i * 120, sp: (.45 + i * .12) * (i % 2 ? 1 : -1) }));
    const tick = () => {
      if (!onScreen(root)) return;
      rows.forEach(r => {
        const w = r.el.scrollWidth / 2; if (!w) return;
        r.x += r.sp; if (r.x <= -w) r.x += w; if (r.x > 0) r.x -= w;
        r.el.style.transform = `translate3d(${r.x}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    gsap.fromTo(wall, { rotateX: 58, scale: 1.3 }, { rotateX: 24, scale: 1.05, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    return () => gsap.ticker.remove(tick);
  });


  /* Lienzo nítido (DPR ≤ 2) + bucle rAF que solo corre con la sección en pantalla */
  const canvasLoop = (root, cv, draw) => {
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1, raf = 0, on = false, t0 = performance.now();
    const size = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const frame = now => { if (!on) return; draw(ctx, W, H, now - t0); raf = requestAnimationFrame(frame); };
    const ro = new ResizeObserver(() => { size(); if (!on) draw(ctx, W, H, performance.now() - t0); }); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) raf = requestAnimationFrame(frame); }, { rootMargin: "80px" });
    io.observe(root);
    size();
    return { ctx, stop: () => { on = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); }, size: () => [W, H] };
  };
  const SECTOR = { toyota: "automoción", "coca-cola": "bebidas", bankinter: "banca", generali: "seguros", "sony-music": "música", "monster-energy": "bebidas", "philip-morris": "gran consumo", "mitsubishi-electric": "climatización", otis: "ascensores", porcelanosa: "cerámica", rituals: "cosmética", wella: "belleza", los40: "radio", rfef: "deporte", "cruz-roja": "ONG", avoris: "viajes", catai: "viajes", "csl-vifor": "farma", dial: "radio", elanco: "salud animal", fibratel: "telecom", "leo-pharma": "farma", longi: "energía solar", straumann: "salud dental", ucb: "farma" };
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>";
  const decode = (el, text, dur = 700) => {
    const t0 = performance.now(); let raf;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), n = Math.floor(p * text.length);
      el.textContent = text.slice(0, n) + [...text.slice(n)].map(c => (c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  };

  /* ---------- B · Radar ---------- */
  register("clients", "B", (root, ux) => {
    fillList(root);
    const cv = $(".clients-b__cv", root), read = $("[data-read]", root);
    const rnd = seeded(7);
    const blips = ALL.map((n, i) => ({ n: name(n), a: (i / ALL.length) * Math.PI * 2 + rnd() * .2, r: .3 + rnd() * .62, lit: -1e9 }));
    const SPEED = .0011; // rad/ms
    let prev = 0;
    const draw = (ctx, W, H, t) => {
      const R = Math.min(W, H) / 2 - 8, cx = W / 2, cy = H / 2;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (let k = 1; k <= 4; k++) { ctx.strokeStyle = `rgba(153,196,228,${k === 4 ? .45 : .16})`; ctx.beginPath(); ctx.arc(cx, cy, R * k / 4, 0, Math.PI * 2); ctx.stroke(); }
      ctx.strokeStyle = "rgba(153,196,228,.12)";
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      for (let d = 0; d < 72; d++) { const a = d / 72 * Math.PI * 2, l = d % 6 ? 5 : 11; ctx.strokeStyle = "rgba(153,196,228,.35)"; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.lineTo(cx + Math.cos(a) * (R - l), cy + Math.sin(a) * (R - l)); ctx.stroke(); }
      const sw = ux.reduce ? -Math.PI / 4 : (t * SPEED) % (Math.PI * 2);
      // estela del barrido
      for (let s = 0; s < 40; s++) {
        const a1 = sw - s * .022, a0 = a1 - .024;
        ctx.fillStyle = `rgba(153,196,228,${.22 * (1 - s / 40) ** 2})`;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = "rgba(200,225,245,.9)"; ctx.shadowColor = "#99C4E4"; ctx.shadowBlur = 12; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sw) * R, cy + Math.sin(sw) * R); ctx.stroke(); ctx.shadowBlur = 0;
      // impactos
      const norm = a => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      let latest = null;
      blips.forEach(b => {
        if (!ux.reduce) { const d = norm(sw - b.a), dp = norm(prev - b.a); if (d < dp || (d < .05 && b.lit < 0)) { b.lit = t; latest = b; } }
        const k = ux.reduce ? .7 : Math.exp(-(t - b.lit) / 1500);
        const x = cx + Math.cos(b.a) * b.r * R, y = cy + Math.sin(b.a) * b.r * R;
        ctx.fillStyle = `rgba(153,196,228,${.15 + k * .85})`;
        ctx.beginPath(); ctx.arc(x, y, 2.5 + k * 2.5, 0, Math.PI * 2); ctx.fill();
        if (k > .18) {
          ctx.strokeStyle = `rgba(153,196,228,${k * .6})`; ctx.beginPath(); ctx.arc(x, y, 6 + (1 - k) * 18, 0, Math.PI * 2); ctx.stroke();
          ctx.font = `700 ${W < 420 ? 11 : 13}px Poppins, sans-serif`; ctx.fillStyle = `rgba(255,255,255,${Math.min(1, k * 1.2)})`;
          ctx.textAlign = x > cx ? "right" : "left"; ctx.fillText(b.n, x + (x > cx ? -10 : 10), y - 8);
        }
      });
      ctx.lineWidth = 1;
      prev = sw;
      if (latest && read.textContent !== latest.n) read.textContent = latest.n;
    };
    const loop = canvasLoop(root, cv, draw);
    if (ux.reduce) read.textContent = "25 marcas";
    return loop.stop;
  });

  /* ---------- C · Holograma (esfera de marcas) ---------- */
  register("clients", "C", (root, ux) => {
    fillList(root);
    const stage = $(".clients-c__stage", root), globe = $(".clients-c__globe", root);
    globe.innerHTML = ALL.map(n => `<span class="clients-c__item">${name(n)}</span>`).join("");
    const N = ALL.length, golden = Math.PI * (3 - Math.sqrt(5));
    const pts = $$(".clients-c__item", globe).map((el, i) => { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i; return { el, x: Math.cos(th) * r, y, z: Math.sin(th) * r, w: 0, h: 0 }; });
    const measure = () => pts.forEach(p => { p.w = p.el.offsetWidth; p.h = p.el.offsetHeight; });
    measure();
    let ry = 0, rx = -.25, vy = ux.reduce ? 0 : .0045, vx = 0, drag = null, raf = 0, on = false;
    const render = () => {
      const R = Math.min(stage.clientWidth * .38, stage.clientHeight * .42);
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      pts.forEach(p => {
        const x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
        const s = .55 + (z2 + 1) * .35, o = .18 + (z2 + 1) * .41;
        p.el.style.transform = `translate3d(${x1 * R - p.w / 2}px,${y2 * R * .9 - p.h / 2}px,0) scale(${s.toFixed(3)})`;
        p.el.style.opacity = o.toFixed(3); p.el.style.zIndex = Math.round(z2 * 100) + 100;
        p.el.style.filter = z2 < -.2 ? `blur(${(-z2 * 1.6).toFixed(1)}px)` : "none";
      });
    };
    const tick = () => { if (!on) return; if (!drag) { ry += vy; rx += vx; vx *= .94; vy += ((ux.reduce ? 0 : .0045) - vy) * .02; rx += (-.25 - rx) * .01; } render(); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) raf = requestAnimationFrame(tick); });
    io.observe(root);
    const down = e => { drag = { x: e.clientX, y: e.clientY, ry, rx }; vy = 0; stage.setPointerCapture(e.pointerId); };
    const move = e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; const nry = drag.ry + dx * .006, nrx = Math.max(-1, Math.min(1, drag.rx + dy * .004)); vy = nry - ry; vx = nrx - rx; ry = nry; rx = nrx; };
    const up = () => { drag = null; };
    stage.addEventListener("pointerdown", down); stage.addEventListener("pointermove", move); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    const onR = () => { measure(); render(); }; addEventListener("resize", onR);
    document.fonts && document.fonts.ready.then(onR);
    render();
    if (!ux.reduce) gsap.from(globe, { scale: .2, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: stage, start: "top 75%" } });
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", onR); stage.removeEventListener("pointerdown", down); stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerup", up); stage.removeEventListener("pointercancel", up); };
  });

  /* ---------- D · Terminal ---------- */
  register("clients", "D", (root, ux) => {
    fillList(root);
    const out = $(".clients-d__out", root), again = $(".clients-d__again", root);
    const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
    const lines = [
      `<b>unical@bcn</b>:~/clientes$ <em>unical clients --list --verify</em>`,
      `<small>conectando con el archivo de proyectos… ok</small>`,
      `<small>+25 años · +3.000 proyectos · +40 sectores</small>`,
      ``,
      ...ALL.map((n, i) => `<b>[ OK ]</b> ${String(i + 1).padStart(2, "0")}  <em>${pad(name(n), 20)}</em><small>${SECTOR[n] || ""}</small>`),
      ``,
      `<small>verificado: instaladores certificados 3M · Avery</small>`,
      `<b>›</b> <em>25 marcas cargadas.</em> Siguiente: <em>la tuya</em> <span class="clients-d__cur"></span>`
    ];
    let timers = [];
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const add = html => { const d = document.createElement("div"); d.className = "clients-d__ln"; d.innerHTML = html || " "; out.appendChild(d); while (out.children.length > 60) out.firstChild.remove(); return d; };
    const run = () => {
      clear(); out.innerHTML = "";
      if (ux.reduce) { lines.forEach(add); return; }
      // la orden se teclea; el resto aparece línea a línea
      const cmd = add(""), full = lines[0], plain = "unical clients --list --verify";
      let i = 0;
      const typeK = () => { i++; cmd.innerHTML = `<b>unical@bcn</b>:~/clientes$ <em>${plain.slice(0, i)}</em><span class="clients-d__cur"></span>`; if (i < plain.length) timers.push(setTimeout(typeK, 38 + Math.random() * 40)); else { cmd.innerHTML = full; timers.push(setTimeout(() => step(1), 380)); } };
      const step = k => { if (k >= lines.length) return; add(lines[k]); timers.push(setTimeout(() => step(k + 1), k < 4 ? 300 : 85)); };
      typeK();
    };
    const st = ScrollTrigger.create({ trigger: out, start: "top 80%", once: true, onEnter: run });
    again.addEventListener("click", run);
    if (ux.reduce) run();
    return () => { clear(); st.kill(); again.removeEventListener("click", run); };
  });

  /* ---------- E · Rejilla con foco ---------- */
  register("clients", "E", (root, ux) => {
    fillList(root);
    const grid = $(".clients-e__grid", root);
    grid.innerHTML = ALL.map(n => `<div class="clients-e__tile">${word(n, true)}</div>`).join("");
    const tiles = $$(".clients-e__tile", grid);
    const stops = [];
    const move = e => {
      tiles.forEach(t => { const r = t.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; t.style.setProperty("--x", x + "px"); t.style.setProperty("--y", y + "px"); t.classList.toggle("is-hot", x > -30 && y > -30 && x < r.width + 30 && y < r.height + 30); });
    };
    const leave = () => tiles.forEach(t => { t.style.setProperty("--x", "-999px"); t.style.setProperty("--y", "-999px"); t.classList.remove("is-hot"); });
    const enter = e => { const t = e.target.closest(".clients-e__tile"); if (!t || t.dataset.busy) return; const w = $(".clients-word", t), txt = w.dataset.t || (w.dataset.t = w.textContent); t.dataset.busy = 1; stops.push(decode(w, txt, 500)); setTimeout(() => { delete t.dataset.busy; w.textContent = txt; }, 520); };
    if (ux.fine) { grid.addEventListener("pointermove", move); grid.addEventListener("pointerleave", leave); grid.addEventListener("pointerover", enter); }
    if (!ux.reduce) {
      gsap.from(tiles, { opacity: 0, scale: .85, duration: .8, ease: "expo.out", stagger: { each: .03, from: "random" }, scrollTrigger: { trigger: grid, start: "top 82%" } });
      ScrollTrigger.create({ trigger: grid, start: "top 75%", once: true, onEnter: () => tiles.forEach((t, i) => { const w = $(".clients-word", t), txt = w.textContent; w.dataset.t = txt; setTimeout(() => stops.push(decode(w, txt, 900)), i * 25); }) });
      // sin ratón: un foco recorre la rejilla solo
      if (!ux.fine) {
        let k = 0; const iv = setInterval(() => { tiles.forEach(t => t.classList.remove("is-hot")); const t = tiles[k++ % tiles.length]; t.classList.add("is-hot"); t.style.setProperty("--x", "50%"); t.style.setProperty("--y", "50%"); }, 700);
        stops.push(() => clearInterval(iv));
      }
    }
    return () => { stops.forEach(f => f()); grid.removeEventListener("pointermove", move); grid.removeEventListener("pointerleave", leave); grid.removeEventListener("pointerover", enter); };
  });

  /* ---------- F · Túnel warp ---------- */
  register("clients", "F", (root, ux) => {
    fillList(root);
    const cv = $(".clients-f__cv", root), rnd = Math.random;
    const words = ALL.map((n, i) => ({ n: name(n), a: (i / ALL.length) * Math.PI * 2 + rnd() * .3, d: .35 + rnd() * .55, z: (i / ALL.length) }));
    const stars = Array.from({ length: 260 }, () => ({ a: rnd() * Math.PI * 2, d: .05 + rnd() * .95, z: rnd() }));
    let boost = 0, mx = 0, my = 0;
    const st = ux.reduce ? null : ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: s => { boost = Math.min(4, boost + Math.abs(s.getVelocity()) / 2500); } });
    const pm = e => { const r = root.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; };
    if (ux.fine) root.addEventListener("pointermove", pm);
    let last = 0, cx0 = 0, cy0 = 0;
    const draw = (ctx, W, H, t) => {
      const dt = Math.min(50, t - last || 16); last = t;
      const sp = ux.reduce ? 0 : (.00009 + boost * .00035) * dt; boost *= .95;
      if (!cx0) { cx0 = W / 2; cy0 = H / 2; }
      cx0 += ((W / 2 - mx * W * .12) - cx0) * .06; cy0 += ((H / 2 - my * H * .12) - cy0) * .06;
      const cx = cx0, cy = cy0, M = Math.max(W, H) * .75;
      ctx.fillStyle = `rgba(7,7,15,${ux.reduce ? 1 : .32 + Math.max(0, .3 - boost * .08)})`; ctx.fillRect(0, 0, W, H);
      const proj = (o, z) => { const k = 1 / (1.02 - z); return [cx + Math.cos(o.a) * o.d * M * k * .18, cy + Math.sin(o.a) * o.d * M * k * .18, k]; };
      stars.forEach(s => {
        const z0 = s.z; s.z += sp * 1.6; if (s.z >= 1) { s.z = 0; s.a = rnd() * Math.PI * 2; }
        const [x, y, k] = proj(s, s.z), [x0, y0] = proj(s, z0);
        ctx.strokeStyle = `rgba(153,196,228,${Math.min(.9, s.z * .9)})`; ctx.lineWidth = Math.min(2.2, k * .35);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
      });
      words.slice().sort((a, b) => a.z - b.z).forEach(w => {
        w.z += sp; if (w.z >= 1) { w.z = 0; w.a = rnd() * Math.PI * 2; w.d = .35 + rnd() * .55; }
        const [x, y, k] = proj(w, w.z), fs = Math.min(140, 6 + k * 5);
        const alpha = Math.min(1, w.z * 2.4) * Math.min(1, (1 - w.z) * 6);
        if (fs < 7 || alpha <= 0) return;
        ctx.font = `800 ${fs}px Poppins, sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255,255,255,${alpha * .92})`; ctx.shadowColor = "rgba(153,196,228,.8)"; ctx.shadowBlur = Math.min(24, k);
        ctx.fillText(w.n, x, y); ctx.shadowBlur = 0;
      });
    };
    const loop = canvasLoop(root, cv, draw);
    return () => { loop.stop(); st && st.kill(); root.removeEventListener("pointermove", pm); };
  });
})();
