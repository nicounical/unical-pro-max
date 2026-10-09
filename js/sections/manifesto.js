/* Por qué Unical · A (favorita fija) + 5 versiones futuristas */
(() => {
  const { register } = UX;

  /* ---------- A · Marquesina (favorita fija; antes B) ---------- */
  register("manifesto", "A", (root, ux) => {
    const [t1, t2] = ux.$$(".man-a__track", root);
    if (ux.reduce) return;
    const st = { trigger: root, start: "top bottom", end: "bottom top", scrub: .5 };
    gsap.fromTo(t1, { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: st });
    gsap.fromTo(t2, { xPercent: -40 }, { xPercent: -5, ease: "none", scrollTrigger: { ...st } });
    gsap.from(ux.$$(".man-a__img", root), { scale: 0, rotate: -12, duration: 1.2, stagger: .08, ease: "back.out(1.8)", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- B · Bento con brillo ---------- */
  register("manifesto", "B", (root, ux) => {
    const cards = ux.$$(".man-bento__card", root);
    if (!ux.fine) return;
    // El borde se ilumina en la dirección del cursor (en todas las tarjetas a la vez)
    const mv = e => cards.forEach(c => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); });
    root.addEventListener("pointermove", mv);
    return () => root.removeEventListener("pointermove", mv);
  });

  /* ---------- C · Órbita 3D ---------- */
  register("manifesto", "C", (root, ux) => {
    const ring = ux.$(".man-orbit__ring", root), dots = ux.$$(".man-orbit__dots span", root), faces = ux.$$(".man-orbit__face", root);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      if (ux.reduce) return;
      const st = { r: 0 };
      const paint = () => {
                const k = ((Math.round(st.r / 90) % 4) + 4) % 4;
        dots.forEach((d, i) => d.classList.toggle("is-on", i === k));
        const R = Math.min(innerWidth * .3, 420);
        faces.forEach((f, i) => {
          const a = (i * 90 - st.r) * Math.PI / 180, c = Math.cos(a);
          f.style.transform = `translate3d(${Math.sin(a) * R}px,0,${(c - 1) * R}px)`;
          f.style.opacity = Math.max(0, .15 + .85 * (c + 1) / 2 - (c < -.5 ? .4 : 0));
          f.style.zIndex = Math.round((c + 1) * 10);
        });
      };
      paint();
      gsap.to(st, { r: 270, ease: "none", onUpdate: paint, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .8, snap: { snapTo: 1 / 3, duration: .5, ease: "power2.inOut" } } });
      gsap.from(ring, { rotateX: 40, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
      return () => faces.forEach(f => { f.style.opacity = f.style.transform = f.style.zIndex = ""; });
    });
    if (!ux.reduce) gsap.from(faces, { y: 40, autoAlpha: 0, duration: .9, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ring, start: "top 85%" } });
    return () => mm.revert();
  });

  /* ---------- D · Diagnóstico ---------- */
  register("manifesto", "D", (root, ux) => {
    const mods = ux.$$(".man-sys__mod", root), pct = ux.$(".man-sys__pct", root);
    if (ux.reduce) { pct.textContent = "100%"; return; }
    const st = { p: 0 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: ux.$(".man-sys__panel", root), start: "top 70%" }, onUpdate: () => { pct.textContent = String(Math.round(st.p)).padStart(3, "0") + "%"; } });
    mods.forEach((m, i) => {
      const bar = ux.$(".man-sys__bar i", m), stt = ux.$(".man-sys__st", m), rest = ux.$$("p, .man-tags", m);
      gsap.set(bar, { scaleX: 0 }); gsap.set(stt, { autoAlpha: 0, scale: .6 }); gsap.set(rest, { autoAlpha: 0, y: 12 }); gsap.set(m, { autoAlpha: .35 });
      tl.to(m, { autoAlpha: 1, duration: .2 }, i * .55)
        .to(bar, { scaleX: 1, duration: .7, ease: "power2.inOut" }, i * .55)
        .to(st, { p: (i + 1) * 25, duration: .7, ease: "none" }, i * .55)
        .to(stt, { autoAlpha: 1, scale: 1, duration: .3, ease: "back.out(3)" }, i * .55 + .65)
        .to(rest, { autoAlpha: 1, y: 0, duration: .5, stagger: .05, ease: "expo.out" }, i * .55 + .3);
    });
    gsap.from(ux.$$(".man-sys__left > *", root), { y: 30, autoAlpha: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- E · Holotarjetas ---------- */
  register("manifesto", "E", (root, ux) => {
    const cards = ux.$$(".man-holo__card", root), offs = [];
    if (!ux.reduce) gsap.from(ux.$$(".man-holo__in", root), { y: 60, autoAlpha: 0, rotateX: -18, duration: 1.2, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 65%" } });
    if (!ux.fine || ux.reduce) return;
    cards.forEach(c => {
      const mv = e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add("is-live");
        c.style.setProperty("--px", x * 100 + "%"); c.style.setProperty("--py", y * 100 + "%");
        c.style.setProperty("--rx", (.5 - y) * 16 + "deg"); c.style.setProperty("--ry", (x - .5) * 18 + "deg"); c.style.setProperty("--o", 1);
      };
      const lv = () => { c.classList.remove("is-live"); ["--rx", "--ry"].forEach(p => c.style.setProperty(p, "0deg")); c.style.setProperty("--o", 0); };
      c.addEventListener("pointermove", mv); c.addEventListener("pointerleave", lv);
      offs.push(() => { c.removeEventListener("pointermove", mv); c.removeEventListener("pointerleave", lv); });
    });
    return () => offs.forEach(f => f());
  });

  /* ---------- F · Núcleo ---------- */
  register("manifesto", "F", (root, ux) => {
    const stage = ux.$(".man-core__stage", root), cv = ux.$(".man-core__cv", root), ctx = cv.getContext("2d"), nodes = ux.$$(".man-core__node", root);
    const offs = [];
    let m, active = 0, manual = false, raf = 0, on = false;
    const fit = () => { const d = Math.min(devicePixelRatio || 1, 2), r = cv.getBoundingClientRect(); cv.width = r.width * d; cv.height = r.height * d; m = { w: r.width, h: r.height, d }; };
    fit();
    const onR = () => fit(); addEventListener("resize", onR); offs.push(() => removeEventListener("resize", onR));
    const setActive = i => { active = i; nodes.forEach((n, k) => n.classList.toggle("is-on", k === i)); };
    setActive(0);
    nodes.forEach((n, i) => {
      const en = () => { manual = true; setActive(i); }, lv = () => { manual = false; };
      n.addEventListener("pointerenter", en); n.addEventListener("focus", en); n.addEventListener("pointerleave", lv); n.addEventListener("blur", lv);
      offs.push(() => { n.removeEventListener("pointerenter", en); n.removeEventListener("focus", en); n.removeEventListener("pointerleave", lv); n.removeEventListener("blur", lv); });
    });
    const cycle = setInterval(() => { if (!manual && on) setActive((active + 1) % nodes.length); }, 2600);
    offs.push(() => clearInterval(cycle));
    // anclas: punto del borde de cada tarjeta más cercano al núcleo
    const anchors = () => {
      const s = cv.getBoundingClientRect();
      return nodes.map(n => { const r = n.getBoundingClientRect(); const cx = s.left + s.width / 2, cy = s.top + s.height / 2;
        return { x: Math.max(r.left, Math.min(cx, r.right)) - s.left, y: (r.top + r.height / 2 < cy ? r.bottom : r.top) - s.top }; });
    };
    const parts = Array.from({ length: 140 }, () => ({ a: Math.random() * Math.PI * 2, r: .3 + Math.random() * .7, s: (.2 + Math.random() * .6) * (Math.random() < .5 ? -1 : 1) }));
    const draw = t => {
      const { w, h, d } = m; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * (w < 700 ? .38 : .2);
      const narrow = innerWidth <= 900;
      // halo
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6); g.addColorStop(0, "rgba(153,196,228,.35)"); g.addColorStop(.35, "rgba(46,108,160,.18)"); g.addColorStop(1, "rgba(16,16,29,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, 7); ctx.fill();
      // anillos
      for (let k = 0; k < 3; k++) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t / (4000 + k * 1500) * (k % 2 ? -1 : 1));
        ctx.strokeStyle = `rgba(153,196,228,${.5 - k * .12})`; ctx.lineWidth = 1; ctx.setLineDash(k === 1 ? [2, 8] : k === 2 ? [30, 12] : []);
        ctx.beginPath(); ctx.ellipse(0, 0, R * (.75 + k * .22), R * (.75 + k * .22) * (k === 2 ? .35 : 1), k * .6, 0, 7); ctx.stroke(); ctx.restore();
      }
      ctx.setLineDash([]);
      // partículas en órbita
      parts.forEach(p => { p.a += p.s * .006; const x = cx + Math.cos(p.a) * R * 1.3 * p.r, y = cy + Math.sin(p.a) * R * 1.3 * p.r * .8; ctx.fillStyle = `rgba(153,196,228,${.25 + .5 * p.r})`; ctx.fillRect(x, y, 1.6, 1.6); });
      // conexiones con impulsos de datos
      if (!narrow) anchors().forEach((a, i) => {
        const isOn = i === active;
        ctx.strokeStyle = isOn ? "rgba(153,196,228,.85)" : "rgba(153,196,228,.2)"; ctx.lineWidth = isOn ? 1.5 : 1;
        const mx = (cx + a.x) / 2, my = a.y;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(mx, my, a.x, a.y); ctx.stroke();
        for (let k = 0; k < (isOn ? 3 : 1); k++) {
          const u = ((t / (isOn ? 1100 : 2400)) + k / 3 + i * .25) % 1, v = 1 - u;
          const x = v * v * cx + 2 * v * u * mx + u * u * a.x, y = v * v * cy + 2 * v * u * my + u * u * a.y;
          ctx.fillStyle = "#fff"; ctx.shadowColor = "#99C4E4"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, isOn ? 2.6 : 1.6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        }
        ctx.fillStyle = isOn ? "#99C4E4" : "rgba(153,196,228,.5)"; ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, 7); ctx.fill();
      });
      // núcleo
      const c = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * .6); c.addColorStop(0, "rgba(46,108,160,.95)"); c.addColorStop(1, "rgba(16,16,29,.95)");
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, R * .62, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(153,196,228,.9)"; ctx.lineWidth = 1.2; ctx.shadowColor = "#99C4E4"; ctx.shadowBlur = 24 + 10 * Math.sin(t / 500); ctx.stroke(); ctx.shadowBlur = 0;
    };
    const tick = t => { draw(t); raf = requestAnimationFrame(tick); };
    if (ux.reduce) { draw(0); on = true; return () => offs.forEach(f => f()); }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); } else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); } });
    io.observe(stage); offs.push(() => { io.disconnect(); cancelAnimationFrame(raf); });
    gsap.from(nodes, { autoAlpha: 0, scale: .9, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: stage, start: "top 70%" } });
    return () => offs.forEach(f => f());
  });
})();
