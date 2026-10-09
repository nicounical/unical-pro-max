/* 05 · Cifras («Por qué elegirnos») — A favorita (odómetro) + 5 nuevas */
(() => {
  const { register } = UX;

  /* A · Odómetro: dígitos en columnas que ruedan */
  register("numbers", "A", (root, ux) => {
    const odos = ux.$$(".num-a__odo", root);
    odos.forEach(o => {
      if (o.dataset.built) return;
      const txt = ux.fmt(+o.dataset.odo);
      o.innerHTML = [...txt].map(ch => /\d/.test(ch)
        ? `<span class="num-a__digit" aria-hidden="true"><span class="num-a__strip" data-d="${ch}">${Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join("")}</span></span>`
        : `<span class="num-a__sep" aria-hidden="true">${ch}</span>`).join("") + `<span class="num-a__suf" aria-hidden="true">${o.dataset.suffix || ""}</span>`;
      o.dataset.built = "1";
    });
    const strips = ux.$$(".num-a__strip", root);
    const target = s => -((10 + +s.dataset.d) / 20) * 100;
    if (ux.reduce) { strips.forEach(s => gsap.set(s, { yPercent: target(s) })); return; }
    gsap.set(strips, { yPercent: 0 });
    odos.forEach(o => {
      const ss = ux.$$(".num-a__strip", o);
      gsap.to(ss, { yPercent: i => target(ss[i]), duration: 2.4, ease: "power4.inOut", stagger: { each: .12, from: "end" }, scrollTrigger: { trigger: o, start: "top 85%", once: true } });
    });
    gsap.fromTo(ux.$(".num-a__bg", root), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* B · Etiquetas que salen del plotter */
  register("numbers", "B", (root, ux) => {
    const labels = ux.$$(".num-b__label", root), head = ux.$(".num-b__head-print", root), machine = ux.$(".num-b__machine", root);
    const counts = ux.$$("[data-count]", root);
    if (ux.reduce) { counts.forEach(c => (c.textContent = ux.fmt(+c.dataset.count))); return; }
    gsap.set(labels, { clipPath: "inset(0 0 100% 0)", y: -14 });
    counts.forEach(c => (c.textContent = "0"));
    const count = (el, at, tl) => { const o = { v: 0 }; tl.to(o, { v: +el.dataset.count, duration: 1.4, ease: "power3.out", onUpdate: () => (el.textContent = ux.fmt(o.v)) }, at); };
    const headX = lab => { const m = machine.getBoundingClientRect(), r = lab.getBoundingClientRect(); return r.left - m.left + r.width / 2 - head.offsetWidth / 2; };
    const tl = gsap.timeline({ paused: true });
    labels.forEach((lab, i) => {
      const at = i * .9;
      if (getComputedStyle(machine).display !== "none") tl.to(head, { x: () => headX(lab), duration: .55, ease: "power2.inOut" }, at);
      tl.to(lab, { clipPath: "inset(0 0 0% 0)", y: 0, duration: .85, ease: "power2.out" }, at + .35);
      const c = ux.$("[data-count]", lab); if (c) count(c, at + .55, tl);
    });
    tl.to(head, { x: 0, duration: .8, ease: "power2.inOut" });
    ScrollTrigger.create({ trigger: root, start: "top 65%", once: true, onEnter: () => tl.play() });
    gsap.to(ux.$(".num-b__led", root), { opacity: .25, duration: .5, repeat: -1, yoyo: true });
  });

  /* C · Cifras gigantes con foto dentro */
  register("numbers", "C", (root, ux) => {
    const bigs = ux.$$(".num-c__big", root);
    if (ux.reduce) return;
    bigs.forEach(b => {
      gsap.fromTo(b, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: b, start: "top 85%", once: true } });
      if (b.style.backgroundImage) gsap.fromTo(b, { backgroundPosition: "50% 0%" }, { backgroundPosition: "50% 100%", ease: "none", scrollTrigger: { trigger: b, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.from(ux.$$(".num-c__txt", root), { x: 40, opacity: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ux.$(".num-c__rows", root), start: "top 75%", once: true } });
  });

  /* D · Panel de aeropuerto: las letras giran hasta fijarse */
  register("numbers", "D", (root, ux) => {
    const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+·.";
    const flaps = ux.$$(".num-d__flap", root);
    flaps.forEach(f => {
      if (f.dataset.built) return;
      f.setAttribute("aria-hidden", "true");
      f.innerHTML = f.dataset.flap.split(" ").map(w => `<span class="num-d__word">${[...w].map(c => `<span class="num-d__c" data-c="${c}">${c}</span>`).join("")}</span>`).join("");
      f.dataset.built = "1";
    });
    const rows = ux.$$(".num-d__row", root);
    if (ux.reduce) { rows.forEach(r => r.classList.add("is-done")); return; }
    const cells = rows.map(r => ux.$$(".num-d__c:not(.is-sp)", r));
    cells.flat().forEach(c => (c.textContent = " "));
    rows.forEach(r => r.classList.remove("is-done"));
    const run = () => rows.forEach((r, ri) => {
      const cs = cells[ri], settle = cs.map((_, i) => .35 + i * .05 + Math.random() * .25);
      const total = Math.max(...settle) + .1, o = { t: 0 };
      gsap.to(o, { t: total, duration: total, delay: ri * .35, ease: "none",
        onUpdate: () => cs.forEach((c, i) => { c.textContent = o.t >= settle[i] ? c.dataset.c : CH[(Math.random() * CH.length) | 0]; }),
        onComplete: () => { cs.forEach(c => (c.textContent = c.dataset.c)); r.classList.add("is-done"); } });
    });
    ScrollTrigger.create({ trigger: root, start: "top 65%", once: true, onEnter: run });
  });

  /* E · Línea de tiempo: del año 1 a hoy con el scroll */
  register("numbers", "E", (root, ux) => {
    const line = ux.$(".num-e__line", root), year = ux.$(".num-e__year", root), vals = ux.$$(".num-e__v", root);
    const ticks = ux.$(".num-e__ticks", root);
    ticks.style.background = `repeating-linear-gradient(90deg,rgba(255,255,255,.28) 0 2px,transparent 2px ${100 / 24}%)`;
    const paint = p => {
      line.style.setProperty("--p", p);
      year.textContent = p >= .999 ? "25" : String(1 + Math.round(p * 24));
      vals.forEach(v => (v.textContent = ux.fmt(Math.max(p > 0 ? 1 : 0, Math.round(+v.dataset.to * p)))));
    };
    if (ux.reduce) { paint(1); year.textContent = "25"; return; }
    paint(0);
    ScrollTrigger.create({ trigger: ux.$(".num-e__track", root), start: "top top", end: "bottom bottom", scrub: .4, onUpdate: s => paint(s.progress) });
    gsap.from(ux.$(".num-e__cert", root), { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ux.$(".num-e__track", root), start: "60% bottom", once: true } });
  });

  /* F · Partículas que forman cada cifra + sello que rota */
  register("numbers", "F", (root, ux) => {
    const LABELS = ["+25", "+3.000", "+40", "3M·AVERY"];
    const cv = ux.$(".num-f__cv", root), stage = ux.$(".num-f__stage", root), stat = ux.$(".num-f__static", root);
    const tabs = ux.$$(".num-f__chips button", root);
    let cur = 0, auto = true, timer = null;
    const setTab = i => { cur = i; tabs.forEach((t, j) => t.setAttribute("aria-selected", j === i)); stat.textContent = LABELS[i]; build && build(); };
    const onTab = e => { const b = e.target.closest("button"); if (!b) return; auto = false; clearInterval(timer); setTab(+b.dataset.i); };
    const onKey = e => { if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return; e.preventDefault(); auto = false; clearInterval(timer); const n = (cur + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + 4) % 4; setTab(n); tabs[n].focus(); };
    root.addEventListener("click", onTab); root.addEventListener("keydown", onKey);
    let build = null;
    if (ux.reduce) { root.classList.add("is-static"); return () => { root.removeEventListener("click", onTab); root.removeEventListener("keydown", onKey); }; }
    root.classList.remove("is-static");

    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1, pts = [], targets = [], raf = 0, running = false, mx = -9999, my = -9999;
    const N = innerWidth < 700 ? 1100 : 2600;
    for (let i = 0; i < N; i++) pts.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, tx: 0, ty: 0, on: false, c: Math.random() < .22 });
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1); W = stage.clientWidth; H = stage.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts.forEach(p => { if (p.x <= 1 && p.y <= 1) { p.x *= W; p.y *= H; } });
    };
    build = () => {
      if (!W) return;
      const off = document.createElement("canvas"), ox = off.getContext("2d");
      off.width = W; off.height = H;
      const txt = LABELS[cur];
      let fs = H * .5; ox.font = `900 ${fs}px Poppins, sans-serif`;
      while (ox.measureText(txt).width > W * .88 && fs > 20) { fs -= 4; ox.font = `900 ${fs}px Poppins, sans-serif`; }
      ox.fillStyle = "#fff"; ox.textAlign = "center"; ox.textBaseline = "middle"; ox.fillText(txt, W / 2, H * .46);
      const data = ox.getImageData(0, 0, W, H).data, gap = Math.max(3, Math.round(Math.sqrt((W * H * .5) / N) * .62));
      targets = [];
      for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) if (data[(y * W + x) * 4 + 3] > 128) targets.push([x, y]);
      for (let i = targets.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [targets[i], targets[j]] = [targets[j], targets[i]]; }
      pts.forEach((p, i) => { const t = targets[i]; p.on = !!t; if (t) { p.tx = t[0]; p.ty = t[1]; } else { p.tx = Math.random() * W; p.ty = Math.random() * H; } });
    };
    const frame = () => {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 6400) { const f = (6400 - d2) / 6400 * 2.2; p.vx += dx / Math.sqrt(d2 + 1) * f; p.vy += dy / Math.sqrt(d2 + 1) * f; }
        p.vx += (p.tx - p.x) * .012; p.vy += (p.ty - p.y) * .012; p.vx *= .86; p.vy *= .86;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.on ? (p.c ? "#99C4E4" : "#F4F6FA") : "rgba(153,196,228,.18)";
        const s = p.on ? 3.2 : 1.6; ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
    };
    const start = () => { if (running) return; running = true; raf = requestAnimationFrame(frame); if (auto) { clearInterval(timer); timer = setInterval(() => setTab((cur + 1) % 4), 3600); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); clearInterval(timer); };
    const pm = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const pl = () => { mx = my = -9999; };
    stage.addEventListener("pointermove", pm); stage.addEventListener("pointerleave", pl);
    const onResize = () => { size(); build(); };
    addEventListener("resize", onResize);
    size(); build();
    ScrollTrigger.create({ trigger: stage, start: "top bottom", end: "bottom top", onToggle: s => (s.isActive ? start() : stop()) });
    gsap.to(ux.$(".num-f__seal svg", root), { rotation: 360, duration: 20, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    return () => {
      stop(); removeEventListener("resize", onResize);
      stage.removeEventListener("pointermove", pm); stage.removeEventListener("pointerleave", pl);
      root.removeEventListener("click", onTab); root.removeEventListener("keydown", onKey);
    };
  });
})();
