/* Cómo trabajamos · A (favorita: progreso circular) + 5 versiones nuevas */
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

  /* ---------- B · Cinta transportadora ---------- */
  register("process", "B", (root, ux) => {
    const pin = $(".process-b__pin", root), stage = $(".process-b__stage", root), piece = $(".process-b__piece", root);
    const sts = $$(".process-b__st", root), cards = $$(".process-b__card", root), states = $$(".process-b__s", root), belt = $(".process-b__belt i", root);
    let cur = -1;
    const setStep = i => {
      if (i === cur) return; cur = i;
      sts.forEach((s, j) => s.classList.toggle("on", j === i));
      cards.forEach((c, j) => c.classList.toggle("on", j === i));
      states.forEach((s, j) => s.classList.toggle("on", j === i));
    };
    if (ux.reduce) { root.classList.add("is-static"); setStep(0); cards.forEach(c => c.classList.add("on")); return () => root.classList.remove("is-static"); }
    let xs = [];
    const measure = () => {
      const sr = stage.getBoundingClientRect(), pw = piece.offsetWidth;
      xs = sts.map(s => { const r = $(".process-b__machine", s).getBoundingClientRect(); return r.left - sr.left + r.width / 2 - pw / 2; });
    };
    measure();
    const render = p => {
      // Se detiene un rato en cada estación y viaja entre ellas
      const seg = p * (xs.length - 1), i = Math.min(xs.length - 2, Math.floor(seg)), t = seg - i;
      const ease = t < .35 ? 0 : t > .85 ? 1 : (t - .35) / .5;
      const e = ease * ease * (3 - 2 * ease);
      const x = xs[i] + (xs[i + 1] - xs[i]) * e;
      gsap.set(piece, { x, rotate: (ease > 0 && ease < 1) ? -2 : 0 });
      belt.style.setProperty("--bx", (-x * 1.2) + "px");
      setStep(Math.round(i + e));
    };
    setStep(0); render(0);
    ScrollTrigger.create({
      trigger: pin, start: "top top", end: "+=260%", pin: true, scrub: .5, invalidateOnRefresh: true,
      onRefresh: () => measure(), onUpdate: s => render(s.progress)
    });
    gsap.from(sts, { y: 40, opacity: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- C · Orden de trabajo con sellos ---------- */
  register("process", "C", (root, ux) => {
    const rows = $$(".process-c__row", root);
    rows.forEach(r => { const p = $(".process-c__box path", r); p.setAttribute("pathLength", 1); p.style.strokeDasharray = "1 1"; p.style.strokeDashoffset = 1; });
    if (ux.reduce) { rows.forEach(r => { $(".process-c__box path", r).style.strokeDashoffset = 0; $(".process-c__stamp", r).style.opacity = .9; }); return; }
    gsap.set($$(".process-c__row > div", root), { opacity: .35 });
    rows.forEach(r => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: "top 72%" } });
      tl.to($(".process-c__row > div", r), { opacity: 1, duration: .5 })
        .to($(".process-c__box path", r), { strokeDashoffset: 0, duration: .45, ease: "power2.out" }, "<.1")
        .fromTo($(".process-c__stamp", r), { scale: 2.4, opacity: 0, rotate: -24 }, { scale: 1, opacity: .9, rotate: -12, duration: .45, ease: "back.out(2.4)" }, ">-.05")
        .fromTo($(".process-c__doc", root), { x: 0 }, { x: 3, duration: .05, yoyo: true, repeat: 3, ease: "none" }, "<.3");
    });
    gsap.from($(".process-c__doc", root), { y: 60, rotate: 1.5, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- D · Del plano a la realidad ---------- */
  register("process", "D", (root, ux) => {
    const pin = $(".process-d__pin", root), layers = $$(".process-d__layer", root), steps = $$(".process-d__steps li", root);
    const scan = $(".process-d__scan", root), frame = $(".process-d__frame", root);
    const capB = $(".process-d__cap b", root), capS = $(".process-d__cap span", root);
    const caps = ["Medición", "Plano técnico", "Prueba de producción", "Instalado"];
    let cur = -1;
    const setStep = i => {
      if (i === cur) return; cur = i;
      steps.forEach((s, j) => s.classList.toggle("on", j === i));
      capB.textContent = "Fase 0" + (i + 1); capS.textContent = caps[i];
    };
    setStep(0);
    if (ux.reduce) { root.classList.add("is-static"); layers.forEach(l => (l.style.clipPath = "none")); setStep(3); steps.forEach(s => s.classList.add("on")); return () => root.classList.remove("is-static"); }
    gsap.set(layers.slice(1), { clipPath: "inset(0 100% 0 0)" });
    const render = p => {
      const W = frame.offsetWidth;
      let edge = -1;
      layers.slice(1).forEach((l, k) => {
        const a = k / 3, t = gsap.utils.clamp(0, 1, (p - a) * 3);
        l.style.clipPath = `inset(0 ${100 - t * 100}% 0 0)`;
        if (t > 0 && t < 1) edge = t;
      });
      gsap.set(scan, { x: edge >= 0 ? edge * W - 1 : 0, opacity: edge >= 0 ? 1 : 0 });
      setStep(Math.min(3, Math.floor(p * 3 + .5)));
    };
    render(0);
    ScrollTrigger.create({ trigger: pin, start: "top top", end: "+=240%", pin: true, scrub: .6, invalidateOnRefresh: true, onUpdate: s => render(s.progress) });
    gsap.from(frame, { scale: .92, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- E · Línea de metro ---------- */
  register("process", "E", (root, ux) => {
    const map = $(".process-e__map", root), svg = $(".process-e__svg", root), done = $(".process-e__done", root);
    const train = $(".process-e__train", root), stops = $$(".process-e__stops > li", root), list = $(".process-e__stops", root);
    const len = done.getTotalLength();
    done.style.strokeDasharray = `${len} ${len}`;
    const stopsAt = [0, 1 / 3, 2 / 3, 1];
    const render = p => {
      done.style.strokeDashoffset = len * (1 - p);
      const pt = done.getPointAtLength(len * p), vb = svg.viewBox.baseVal;
      const sx = svg.clientWidth / vb.width, sy = svg.clientHeight / vb.height;
      const ahead = done.getPointAtLength(Math.min(len, len * p + 2));
      const ang = Math.atan2((ahead.y - pt.y) * sy, (ahead.x - pt.x) * sx) * 180 / Math.PI;
      gsap.set(train, { x: pt.x * sx, y: pt.y * sy, rotate: ang });
      list.style.setProperty("--p", p);
      stops.forEach((s, i) => s.classList.toggle("on", p >= stopsAt[i] - .02));
    };
    if (ux.reduce) { root.classList.add("is-static"); render(1); return () => root.classList.remove("is-static"); }
    render(0);
    ScrollTrigger.create({ trigger: map, start: "top 75%", end: "bottom 45%", scrub: .8, onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
  });

  /* ---------- F · Expediente con pestañas ---------- */
  register("process", "F", (root, ux) => {
    const tabs = $$('[role="tab"]', root), panels = $$('[role="tabpanel"]', root);
    let cur = 0, timer = null, touched = false, inView = false, busy = false;
    panels.forEach((p, i) => { p.hidden = i !== 0; gsap.set(p, { clearProps: "all" }); });
    tabs.forEach((t, i) => { t.setAttribute("aria-selected", i === 0); t.tabIndex = i === 0 ? 0 : -1; });
    const show = (i, focus) => {
      if (i === cur || busy) return;
      const prev = panels[cur], next = panels[i];
      tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
      if (focus) tabs[i].focus();
      cur = i;
      if (ux.reduce) { prev.hidden = true; next.hidden = false; return; }
      busy = true;
      gsap.to(prev, { y: 60, rotate: 3, opacity: 0, duration: .35, ease: "power2.in", onComplete: () => {
        prev.hidden = true; gsap.set(prev, { clearProps: "all" }); next.hidden = false;
        gsap.fromTo(next, { y: -50, rotate: -2.5, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .6, ease: "expo.out", onComplete: () => (busy = false) });
        gsap.from($$(".process-f__body > *", next), { y: 20, opacity: 0, duration: .5, stagger: .05, ease: "power3.out", delay: .1 });
      } });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => { touched = true; stop(); show(i); });
      t.addEventListener("keydown", e => {
        const k = e.key; let n = null;
        if (k === "ArrowRight") n = (cur + 1) % tabs.length; else if (k === "ArrowLeft") n = (cur - 1 + tabs.length) % tabs.length;
        else if (k === "Home") n = 0; else if (k === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); touched = true; stop(); show(n, true); }
      });
    });
    const stop = () => { clearInterval(timer); timer = null; };
    const auto = () => { stop(); if (!ux.reduce && !touched && inView) timer = setInterval(() => show((cur + 1) % tabs.length), 4500); };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; auto(); }, { threshold: .4 });
    io.observe(root);
    root.addEventListener("pointerenter", stop); root.addEventListener("pointerleave", auto);
    if (!ux.reduce) gsap.from($(".process-f__cabinet", root), { y: 70, rotate: -2, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => { stop(); io.disconnect(); };
  });
})();
