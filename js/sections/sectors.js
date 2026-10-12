/* 11 · Sectores — A favorita (túnel warp) + 5 nuevas · Selección 3 */
(() => {
  const { register } = UX;

  const whileVisible = (el, frame) => {
    let raf = 0, on = false;
    const tick = t => { raf = 0; if (!on) return; frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); });
    io.observe(el);
    return () => { on = false; io.disconnect(); cancelAnimationFrame(raf); };
  };

  /* ---------- B · Radar: el barrido detecta cada sector ---------- */

  /* ---------- A · Túnel warp (la favorita): los sectores vienen hacia ti entre estelas ---------- */
  register("sectors", "A", (root, ux) => {
    if (ux.reduce) return;
    const track = ux.$(".sec-a__track", root), words = ux.$$(".sec-a__w", root), end = ux.$(".sec-a__end", root);
    const cv = ux.$(".sec-a__cv", root), ctx = cv.getContext("2d"), spd = ux.$(".sec-a__hud b", root);
    const N = words.length, DEPTH = 2600;
    const place = words.map((_, i) => { const a = i * 2.4 + .6; return { x: Math.cos(a), y: Math.sin(a) }; });
    let prog = 0, vel = 0;
    const layout = p => {
      const W = innerWidth, H = innerHeight, rx = Math.min(W * .26, 380), ry = Math.min(H * .22, 200);
      words.forEach((w, i) => {
        const z = -DEPTH + (p * (N + 1.2) - i) * (DEPTH / 2.2);
        const o = z > 300 ? Math.max(0, 1 - (z - 300) / 250) : Math.min(1, (z + DEPTH) / 900);
        w.style.transform = `translate(-50%,-50%) translate3d(${place[i].x * rx}px,${place[i].y * ry}px,${Math.min(z, 640)}px)`;
        w.style.opacity = o;
      });
      const e = gsap.utils.clamp(0, 1, (p - .82) / .14);
      end.style.opacity = e; end.style.transform = `scale(${.9 + e * .1})`;
    };
    // estrellas que se estiran según la velocidad
    let W, H, dpr, stars = [];
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      stars = Array.from({ length: W < 700 ? 140 : 260 }, () => ({ a: Math.random() * 6.283, d: Math.random(), s: .3 + Math.random() * .9 }));
    };
    size();
    const st = ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: s => { prog = s.progress; vel = Math.abs(s.getVelocity()); layout(prog); } });
    layout(0);
    let v = 0;
    const stop = whileVisible(cv, () => {
      v += (Math.min(vel / 900, 6) - v) * .08; vel *= .9;
      spd.textContent = Math.round(120 + v * 380) + " km/h";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.hypot(cx, cy);
      ctx.lineCap = "round";
      stars.forEach(s => {
        s.d += .0025 * (1 + v * 3) * s.s; if (s.d > 1) { s.d = .02; s.a = Math.random() * 6.283; }
        const r1 = Math.pow(s.d, 2.2) * R, r0 = Math.max(0, r1 - (6 + v * 70) * s.d);
        ctx.strokeStyle = `rgba(170,210,240,${Math.min(1, s.d * 1.4) * (1 - prog * .5)})`; ctx.lineWidth = s.s * 1.6 * (s.d + .3);
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(s.a) * r0, cy + Math.sin(s.a) * r0); ctx.lineTo(cx + Math.cos(s.a) * r1, cy + Math.sin(s.a) * r1); ctx.stroke();
      });
    });
    addEventListener("resize", size);
    return () => { stop(); st.kill(); removeEventListener("resize", size); };
  });


  /* ---------- B · Señales de carretera: los sectores se acercan como salidas de autopista ---------- */
  register("sectors", "B", (root, ux) => {
    if (ux.reduce) return;
    const track = ux.$(".sec-b__track", root), signs = ux.$$(".sec-b__sign", root), line = ux.$(".sec-b__line", root);
    const intro = ux.$(".sec-b__intro", root), end = ux.$(".sec-b__end", root), km = ux.$(".sec-b__km b", root);
    const N = signs.length;
    const layout = p => {
      const W = innerWidth, H = innerHeight, k = p * (N + 2.2) - .4;
      signs.forEach((s, i) => {
        const u = gsap.utils.clamp(0, 1.25, (k - i) / 1.6);
        const e = Math.pow(u, 3), side = i % 2 ? 1 : -1;
        const sc = .05 + e * (W < 700 ? 2.2 : 2.8);
        s.style.transform = `translate(-50%,-100%) translate(${side * (W * .025 + e * W * (W < 700 ? .22 : .34))}px,${-e * H * .06}px) scale(${sc})`;
        s.style.opacity = u <= 0 ? 0 : Math.min(1, u / .12) * (u > .95 ? Math.max(0, 1 - (u - .95) / .2) : 1);
      });
      line.style.setProperty("--off", `${p * 5200}px`);
      const f = gsap.utils.clamp(0, 1, (p - .86) / .1);
      intro.style.opacity = Math.max(1 - gsap.utils.clamp(0, 1, (p - .03) / .08), f);
      end.style.opacity = f; end.style.transform = `translateY(${(1 - f) * 30}px)`;
      km.textContent = Math.round(p * 40);
    };
    layout(0);
    const st = ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: s => layout(s.progress) });
    const re = () => layout(st.progress);
    addEventListener("resize", re);
    return () => { st.kill(); removeEventListener("resize", re); };
  });

  /* ---------- C · Viaje por las letras: atraviesas cada palabra hasta el siguiente sector ---------- */
  register("sectors", "C", (root, ux) => {
    if (ux.reduce) return;
    const track = ux.$(".sec-c__track", root), panels = ux.$$(".sec-c__panel", root), count = ux.$(".sec-c__count b", root);
    const M = panels.length - 1;
    panels.forEach((p, j) => (p.style.zIndex = panels.length - j));
    const zoomEl = p => p.querySelector("b") || p.querySelector(".wrap");
    const layout = prog => {
      const k = prog * M;
      panels.forEach((p, j) => {
        const t = gsap.utils.clamp(0, 1, k - j), z = zoomEl(p);
        if (j < Math.floor(k) || (t >= 1 && j < M)) { p.style.visibility = "hidden"; return; }
        p.style.visibility = j > Math.ceil(k) + 1 ? "hidden" : "visible";
        const s = 1 + Math.pow(t, 2.4) * 46;
        z.style.transform = `scale(${s})`;
        p.style.opacity = j === M ? 1 : 1 - gsap.utils.clamp(0, 1, (t - .72) / .28);
      });
      const idx = Math.min(8, Math.max(0, Math.round(k)));
      count.textContent = String(idx).padStart(2, "0");
    };
    layout(0);
    const st = ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: s => layout(s.progress) });
    return () => st.kill();
  });

  /* ---------- D · Bloque tipográfico: cada sector ocupa todo el ancho y sube desde su línea ---------- */
  register("sectors", "D", (root, ux) => {
    const block = ux.$(".sec-d__block", root), bs = ux.$$(".sec-d__block b", root);
    const fit = () => {
      const avail = block.clientWidth;
      bs.forEach(b => {
        b.style.setProperty("--fs", "100px");
        const pad = parseFloat(getComputedStyle(b).paddingLeft) || 0;
        const w = b.scrollWidth - pad;
        if (w > 0) b.style.setProperty("--fs", `${Math.min(240, 100 * (avail - pad - 6) / w)}px`);
      });
    };
    fit();
    document.fonts && document.fonts.ready.then(() => { fit(); ScrollTrigger.refresh(); });
    const ro = new ResizeObserver(fit); ro.observe(block);
    if (!ux.reduce) {
      bs.forEach(b => gsap.from(b, { yPercent: 105, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: b.parentNode, start: "top 92%", once: true } }));
      gsap.from(ux.$$(".sec-d__block span", root), { opacity: 0, duration: .6, stagger: .06, scrollTrigger: { trigger: block, start: "top 85%", once: true } });
    }
    return () => ro.disconnect();
  });

  /* ---------- E · Abanico de tarjetas: el mazo abierto en abanico se reparte en la mesa ---------- */
  register("sectors", "E", (root, ux) => {
    if (ux.reduce) return;
    const deck = ux.$(".sec-e__deck", root), cards = ux.$$(".sec-e__card", root), n = cards.length;
    const off = (c, i) => {
      const d = deck.getBoundingClientRect(), r = c.getBoundingClientRect();
      const cx = d.left + d.width / 2, cy = d.top + d.height / 2;
      return { x: cx - (r.left + r.width / 2) + (i - (n - 1) / 2) * Math.min(26, d.width / 40), y: cy - (r.top + r.height / 2) + Math.abs(i - (n - 1) / 2) * 6 };
    };
    let base = cards.map((c, i) => off(c, i));
    const tl = gsap.timeline({ scrollTrigger: { trigger: deck, start: "top 88%", end: "center 55%", scrub: .8, invalidateOnRefresh: true, onRefreshInit: () => { gsap.set(cards, { clearProps: "transform" }); base = cards.map((c, i) => off(c, i)); } } });
    tl.from(cards, { x: i => base[i].x, y: i => base[i].y, rotation: i => (i - (n - 1) / 2) * 7, transformOrigin: "50% 120%", ease: "power2.inOut", stagger: { each: .03, from: "center" } });
    if (!ux.fine) return;
    const enter = e => gsap.to(e.currentTarget, { y: -8, rotation: (Math.random() - .5) * 3, duration: .4, overwrite: "auto" });
    const leave = e => gsap.to(e.currentTarget, { y: 0, rotation: 0, duration: .5, overwrite: "auto" });
    cards.forEach(c => { c.addEventListener("mouseenter", enter); c.addEventListener("mouseleave", leave); });
    return () => cards.forEach(c => { c.removeEventListener("mouseenter", enter); c.removeEventListener("mouseleave", leave); });
  });

  /* ---------- F · Pegatinas de vinilo: se pegan una a una sobre el tablero ---------- */
  register("sectors", "F", (root, ux) => {
    const sts = ux.$$(".sec-f__st", root);
    const rot = s => parseFloat(s.style.getPropertyValue("--r")) || 0;
    gsap.set(sts, { rotation: i => rot(sts[i]) });
    if (ux.reduce) return;
    gsap.from(sts, { scale: 1.6, opacity: 0, y: -40, rotation: i => rot(sts[i]) + (i % 2 ? 22 : -22), duration: .75, ease: "back.out(2.2)", stagger: .12, scrollTrigger: { trigger: ux.$(".sec-f__board", root), start: "top 75%", once: true } });
    if (!ux.fine) return;
    const enter = e => { const s = e.currentTarget; gsap.to(s, { scale: 1.05, rotation: rot(s) + (rot(s) > 0 ? -4 : 4), duration: .35, overwrite: "auto" }); };
    const leave = e => { const s = e.currentTarget; gsap.to(s, { scale: 1, rotation: rot(s), duration: .5, ease: "back.out(2)", overwrite: "auto" }); };
    sts.forEach(s => { s.addEventListener("mouseenter", enter); s.addEventListener("mouseleave", leave); });
    return () => sts.forEach(s => { s.removeEventListener("mouseenter", enter); s.removeEventListener("mouseleave", leave); });
  });
})();
