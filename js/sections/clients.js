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

  /* ---------- B · Panel de salidas (split-flap) ---------- */
  register("clients", "B", (root, ux) => {
    const ROWS = 8, NAME_LEN = innerWidth < 600 ? 14 : 19, STATE = "A BORDO";
    const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ0123456789-.";
    const rowsEl = $(".clients-b__rows", root);
    const flaps = n => Array.from({ length: n }, () => `<span class="clients-b__flap"> </span>`).join("");
    rowsEl.innerHTML = Array.from({ length: ROWS }, () =>
      `<div class="clients-b__row" role="row"><span class="clients-b__flaps clients-b__num" role="cell">${flaps(2)}</span><span class="clients-b__flaps clients-b__name" role="cell">${flaps(NAME_LEN)}</span><span class="clients-b__flaps clients-b__state" role="cell">${flaps(STATE.length)}</span></div>`).join("");
    const rows = $$(".clients-b__row:not(.clients-b__row--th)", root).map(r => ({
      num: $$(".clients-b__num .clients-b__flap", r), name: $$(".clients-b__name .clients-b__flap", r), state: $$(".clients-b__state .clients-b__flap", r), row: r
    }));
    const pad = (s, n) => (s.toUpperCase() + " ".repeat(n)).slice(0, n);
    let page = 0;
    const targets = () => rows.map((r, i) => {
      const idx = (page * ROWS + i) % ALL.length;
      return { r, num: String(idx + 1).padStart(2, "0"), name: pad(name(ALL[idx]), NAME_LEN), state: STATE };
    });
    const write = (els, txt) => els.forEach((el, k) => (el.textContent = txt[k] || " "));
    // Etiqueta accesible por fila (los flaps son visuales)
    const label = () => targets().forEach(t => t.r.row.setAttribute("aria-label", `${t.num} ${t.name.trim()} ${t.state}`));
    if (ux.reduce) { targets().forEach(t => { write(t.r.num, t.num); write(t.r.name, t.name); write(t.r.state, t.state); }); label(); return; }
    // Cola de flaps animados: cada uno pasa por caracteres aleatorios antes de su letra final
    let queue = [];
    const flipTo = (els, txt, delay) => els.forEach((el, k) => queue.push({ el, final: txt[k] || " ", left: 3 + ((k * 7 + delay) % 9), wait: delay + k * .6 }));
    let acc = 0;
    const tick = (t, dt) => {
      acc += dt; if (acc < 55) return; acc = 0;
      queue = queue.filter(f => {
        if (f.wait > 0) { f.wait -= 1; return true; }
        if (f.left-- > 0) { f.el.textContent = CHARS[(Math.random() * CHARS.length) | 0]; }
        else f.el.textContent = f.final;
        f.el.classList.remove("is-flip"); void f.el.offsetWidth; f.el.classList.add("is-flip");
        return f.left >= 0;
      });
    };
    gsap.ticker.add(tick);
    const show = () => { targets().forEach((t, i) => { flipTo(t.r.num, t.num, i * 2); flipTo(t.r.name, t.name, i * 2); flipTo(t.r.state, t.state, i * 2 + 6); }); label(); };
    let timer = null, inView = false;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      clearInterval(timer);
      if (inView) { show(); timer = setInterval(() => { page++; show(); }, 6500); }
    }, { threshold: .25 });
    io.observe(root);
    return () => { io.disconnect(); clearInterval(timer); gsap.ticker.remove(tick); };
  });

  /* ---------- C · Vinilos apilados ---------- */
  register("clients", "C", (root, ux) => {
    fillList(root);
    const stage = $(".clients-c__stage", root);
    const picks = ALL.slice(0, 14);
    const skins = ["navy", "blue", "paper", "strong"];
    const rnd = seeded(11);
    const small = innerWidth < 700;
    stage.innerHTML = picks.map((n, i) => `<span class="clients-c__sticker clients-c__sticker--${skins[i % 4]}" style="font-size:${small ? 1.4 + rnd() * 1.4 : 2.2 + rnd() * 3.6}rem">${name(n)}</span>`).join("");
    const stickers = $$(".clients-c__sticker", root);
    if (ux.reduce) return;
    // Posición pseudoaleatoria dentro de la zona libre (bajo el titular)
    const place = () => {
      const head = $(".clients-c__head", root), W = stage.clientWidth, H = stage.clientHeight, top = head.offsetTop + head.offsetHeight + 24, r = seeded(5);
      stickers.forEach(s => {
        const w = s.offsetWidth, h = s.offsetHeight;
        const x = r() * Math.max(10, W - w - 20) + 10, y = top + r() * Math.max(10, H - top - h - 100);
        gsap.set(s, { x, y, rotate: (r() - .5) * 22 });
        s.dataset.r = gsap.getProperty(s, "rotate");
      });
    };
    place();
    gsap.set(stickers, { autoAlpha: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .5, invalidateOnRefresh: true, onRefresh: place } });
    stickers.forEach((s, i) => {
      const r = +s.dataset.r;
      tl.fromTo(s, { autoAlpha: 0, scale: 1.6, rotate: r + 18, yPercent: -40 }, { autoAlpha: 1, scale: 1, rotate: r, yPercent: 0, duration: 1, ease: "back.out(2.2)" }, i * .7);
    });
    tl.to($(".clients-c__hint", root), { autoAlpha: 0, duration: 1 }, 0);
    tl.to({}, { duration: 1.5 });
  });

  /* ---------- D · Constelación ---------- */
  register("clients", "D", (root, ux) => {
    fillList(root);
    const sky = $(".clients-d__sky", root), cv = $(".clients-d__canvas", root), ctx = cv.getContext("2d"), box = $(".clients-d__names", root);
    const mobile = innerWidth < 700;
    const list = mobile ? ALL.slice(0, 14) : ALL;
    const rnd = seeded(3);
    box.innerHTML = `<span class="clients-d__node clients-d__node--hub">Unical</span>` + list.map(n => `<span class="clients-d__node">${name(n)}</span>`).join("");
    const els = $$(".clients-d__node", root);
    // Coordenadas normalizadas en elipse alrededor del centro, sin solapar demasiado
    const nodes = els.map((el, i) => {
      if (i === 0) return { el, bx: .5, by: .5, hub: true, ph: 0 };
      const a = (i / list.length) * Math.PI * 2 + rnd() * .5, rr = .22 + rnd() * .26;
      return { el, bx: .5 + Math.cos(a) * rr * (mobile ? .9 : 1.25) * .8, by: .5 + Math.sin(a) * rr * .95, ph: rnd() * 6.28, sp: .3 + rnd() * .5 };
    });
    let W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { W = sky.clientWidth; H = sky.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    // Relajación: separa los nodos que quedan demasiado cerca (en píxeles reales)
    const relax = () => {
      const pts = nodes.map(n => ({ x: n.bx * W, y: n.by * H, w: n.el.offsetWidth + 14, h: n.el.offsetHeight + 12, hub: n.hub }));
      for (let it = 0; it < 120; it++) {
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], dx = b.x - a.x, dy = b.y - a.y;
          const ox = (a.w + b.w) / 2 - Math.abs(dx), oy = (a.h + b.h) / 2 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (ox / a.w < oy / a.h) { const m = ox / 2 * Math.sign(dx || 1); if (!a.hub) a.x -= m; if (!b.hub) b.x += m; }
            else { const m = oy / 2 * Math.sign(dy || 1); if (!a.hub) a.y -= m; if (!b.hub) b.y += m; }
          }
        }
        pts.forEach(p => { p.x = Math.min(W - p.w / 2, Math.max(p.w / 2, p.x)); p.y = Math.min(H - p.h / 2, Math.max(p.h / 2, p.y)); });
      }
      pts.forEach((p, i) => { nodes[i].bx = p.x / W; nodes[i].by = p.y / H; });
    };
    size(); relax();
    let mx = -9999, my = -9999, t = 0;
    const pos = n => ({ x: (n.bx + (n.hub ? 0 : Math.sin(t * n.sp + n.ph) * .004)) * W, y: (n.by + (n.hub ? 0 : Math.cos(t * n.sp * .8 + n.ph) * .008)) * H });
    const draw = () => {
      const P = nodes.map(pos);
      ctx.clearRect(0, 0, W, H);
      // Líneas: cada nodo con sus 2 vecinos más cercanos + algunas al centro
      P.forEach((p, i) => {
        if (i === 0) return;
        const near = P.map((q, j) => ({ j, d: (q.x - p.x) ** 2 + (q.y - p.y) ** 2 })).filter(o => o.j !== i && o.j !== 0).sort((a, b) => a.d - b.d).slice(0, 2);
        const hot = Math.hypot(p.x - mx, p.y - my) < 120;
        near.forEach(o => { const q = P[o.j]; ctx.strokeStyle = `rgba(153,196,228,${hot ? .55 : .16})`; ctx.lineWidth = hot ? 1.4 : 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); });
        if (i % 3 === 0 || hot) { ctx.strokeStyle = `rgba(153,196,228,${hot ? .5 : .08})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(P[0].x, P[0].y); ctx.stroke(); }
      });
      nodes.forEach((n, i) => {
        const p = P[i];
        n.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
        if (!n.hub) n.el.classList.toggle("is-hot", Math.hypot(p.x - mx, p.y - my) < 80);
      });
    };
    const move = e => { const r = sky.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const leave = () => { mx = my = -9999; };
    sky.addEventListener("pointermove", move); sky.addEventListener("pointerleave", leave);
    addEventListener("resize", size);
    if (ux.reduce) { draw(); return () => { removeEventListener("resize", size); }; }
    gsap.from(els, { scale: 0, opacity: 0, duration: 1, stagger: .03, ease: "back.out(2)", scrollTrigger: { trigger: sky, start: "top 80%" } });
    const tick = () => { if (!onScreen(sky)) return; t += .016; draw(); };
    gsap.ticker.add(tick); draw();
    return () => { gsap.ticker.remove(tick); removeEventListener("resize", size); };
  });

  /* ---------- E · Cinta de impresión ---------- */
  register("clients", "E", (root, ux) => {
    fillList(root);
    const linesEl = $(".clients-e__lines", root), paper = $(".clients-e__paper", root), car = $(".clients-e__carriage", root);
    const printed = $("[data-printed]", root);
    linesEl.innerHTML = ALL.map((n, i) => `<div class="clients-e__line" aria-hidden="true"><span>${name(n)}</span><small>Nº ${String(i + 1).padStart(2, "0")}</small></div>`).join("");
    const lines = $$(".clients-e__line", root);
    if (ux.reduce) { lines.forEach(l => (l.style.clipPath = "none")); printed.textContent = ALL.length; return; }
    let lineH = 0;
    const measure = () => { lineH = lines[1].offsetTop - lines[0].offsetTop; };
    measure();
    const visible = () => Math.max(4, Math.floor(paper.clientHeight / lineH) - 2);
    ScrollTrigger.create({
      trigger: root, start: "top 70%", end: "bottom 40%", scrub: true, onRefresh: measure,
      onUpdate: s => {
        const f = s.progress * ALL.length, cur = Math.min(ALL.length - 1, Math.floor(f)), local = f - cur;
        lines.forEach((l, i) => { const v = i < cur ? 1 : i === cur ? local : 0; l.style.clipPath = `inset(0 ${(1 - v) * 100}% 0 0)`; });
        const pw = paper.clientWidth;
        car.style.transform = `translateX(${local * (pw - 60)}px)`;
        linesEl.style.transform = `translateY(${-Math.max(0, cur - visible()) * lineH}px)`;
        printed.textContent = String(Math.min(ALL.length, Math.round(f))).padStart(2, "0");
      }
    });
  });

  /* ---------- F · Placas de metacrilato ---------- */
  register("clients", "F", (root, ux) => {
    const grid = $(".clients-f__grid", root);
    grid.innerHTML = ALL.map(n => `<li class="clients-f__plate" tabindex="0">${word(n)}</li>`).join("");
    const plates = $$(".clients-f__plate", root);
    const on = p => p.classList.add("is-on"), off = p => p.classList.remove("is-on");
    plates.forEach(p => { p.addEventListener("pointerenter", () => on(p)); p.addEventListener("pointerleave", () => off(p)); p.addEventListener("focus", () => on(p)); p.addEventListener("blur", () => off(p)); });
    if (ux.reduce) { plates.slice(0, 6).forEach(on); return; }
    gsap.from(plates, { y: 30, opacity: 0, duration: .9, stagger: { each: .03, from: "random" }, ease: "expo.out", scrollTrigger: { trigger: grid, start: "top 85%" } });
    // Se encienden solas en grupos aleatorios mientras la sección está a la vista
    let timer = null;
    const cycle = () => {
      plates.forEach(p => { if (!p.matches(":hover,:focus")) off(p); });
      for (let k = 0; k < 4; k++) on(plates[(Math.random() * plates.length) | 0]);
    };
    const io = new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting) { cycle(); timer = setInterval(cycle, 1400); } }, { threshold: .2 });
    io.observe(root);
    return () => { io.disconnect(); clearInterval(timer); };
  });
})();
