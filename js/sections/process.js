/* Proceso · 5 versiones */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Trazo ondulado ---------- */
  register("process", "A", (root, ux) => {
    const wave = $(".process-a__wave path", root);
    if (ux.reduce) return;
    wave.setAttribute("pathLength", 1);
    gsap.fromTo(wave, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: $(".process-a__wrap", root), start: "top 70%", end: "bottom 70%", scrub: true } });
    gsap.from($(".process-a__head .big", root), { yPercent: 30, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    $$(".process-a__steps li", root).forEach(li => gsap.from(li.children, { y: 50, opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 80%" } }));
  });

  /* ---------- B · Línea horizontal fijada ---------- */
  register("process", "B", (root, ux) => {
    const pin = $(".process-b__pin", root), track = $(".process-b__track", root), fill = $(".process-b__fill", root);
    const rail = $$(".process-b__rail li", root), steps = $$(".process-b__step", root);
    if (ux.reduce) { root.classList.add("is-static"); rail.forEach(r => r.classList.add("on")); fill.style.setProperty("--p", 1); return () => root.classList.remove("is-static"); }
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: .7, invalidateOnRefresh: true,
        onUpdate: s => {
          fill.style.setProperty("--p", s.progress);
          const idx = Math.min(steps.length - 1, Math.round(s.progress * (steps.length - 1)));
          rail.forEach((r, i) => r.classList.toggle("on", i <= idx));
        }
      }
    });
    rail[0].classList.add("on");
    steps.forEach((st, i) => {
      const img = $(".process-b__img img", st), n = $(".process-b__n", st), txt = $(".process-b__txt", st);
      gsap.fromTo(img, { scale: 1.25, xPercent: 8 }, { scale: 1, xPercent: -8, ease: "none", scrollTrigger: { trigger: st, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      gsap.fromTo(n, { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: st, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      if (i > 0) gsap.from(txt.children, { y: 60, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: st, containerAnimation: tween, start: "left 60%" } });
    });
  });

  /* ---------- C · Tarjetas flip ---------- */
  register("process", "C", (root, ux) => {
    const cards = $$(".process-c__card", root);
    const ac = new AbortController();
    cards.forEach(c => c.addEventListener("click", () => c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true"), { signal: ac.signal }));
    if (!ux.reduce) {
      const icons = $$(".process-c__ico *", root);
      icons.forEach(p => p.setAttribute("pathLength", 1));
      gsap.set(icons, { strokeDasharray: "1 1", strokeDashoffset: 1 });
      // Se anima el <li> (la tarjeta gira con CSS al pasar el cursor)
      const lis = $$(".process-c__grid > li", root);
      gsap.set(lis, { transformPerspective: 1400 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: $(".process-c__grid", root), start: "top 78%" } });
      tl.from(lis, { y: 80, opacity: 0, rotateX: -25, duration: 1.2, stagger: .12, ease: "expo.out" })
        .to(icons, { strokeDashoffset: 0, duration: 1.4, stagger: .04, ease: "power2.inOut" }, .3)
        .to(lis, { rotateY: 24, duration: .45, stagger: .12, ease: "power2.out", yoyo: true, repeat: 1 }, 1.2);
      gsap.from($(".process-c__head .big", root), { yPercent: 30, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    }
    return () => ac.abort();
  });

  /* ---------- D · Historias ---------- */
  register("process", "D", (root, ux) => {
    const bars = $$(".process-d__bars button", root), slides = $$(".process-d__slide", root);
    const media = $$(".process-d__phone img, .process-d__phone video", root), badge = $(".process-d__badge b", root);
    const vid = $(".process-d__phone video", root);
    let cur = 0, visible = false, prog = null;
    const DUR = 5;
    const go = i => {
      cur = (i + bars.length) % bars.length;
      bars.forEach((b, j) => { b.setAttribute("aria-selected", j === cur); $("i", b).style.setProperty("--p", j < cur ? 1 : 0); });
      media.forEach((m, j) => m.classList.toggle("on", j === cur));
      badge.textContent = String(cur + 1).padStart(2, "0");
      if (vid) { if (media[cur] === vid) { vid.preload = "auto"; vid.currentTime = 0; vid.play().catch(() => {}); } else vid.pause(); }
      const prev = slides.find(s => s.classList.contains("on")), next = slides[cur];
      if (prev !== next) {
        if (ux.reduce) { slides.forEach(s => s.classList.toggle("on", s === next)); }
        else {
          if (prev) gsap.to(prev, { opacity: 0, y: -20, duration: .35, onComplete: () => { prev.classList.remove("on"); gsap.set(prev, { clearProps: "opacity,transform" }); } });
          next.classList.add("on");
          gsap.fromTo(next.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .07, ease: "expo.out", delay: .25 });
        }
      }
      prog && prog.kill();
      if (ux.reduce) { $("i", bars[cur]).style.setProperty("--p", 1); return; }
      const bar = $("i", bars[cur]);
      prog = gsap.fromTo(bar, { "--p": 0 }, { "--p": 1, duration: DUR, ease: "none", paused: !visible, onComplete: () => go(cur + 1) });
    };
    const ac = new AbortController();
    bars.forEach((b, i) => b.addEventListener("click", () => go(i), { signal: ac.signal }));
    const phone = $(".process-d__phone", root);
    phone.addEventListener("pointerenter", () => prog && prog.pause(), { signal: ac.signal });
    phone.addEventListener("pointerleave", () => visible && prog && prog.play(), { signal: ac.signal });
    ScrollTrigger.create({ trigger: root, start: "top 65%", end: "bottom 35%", onToggle: s => { visible = s.isActive; if (prog) visible ? prog.play() : prog.pause(); if (!visible && vid) vid.pause(); } });
    go(0);
    return () => { ac.abort(); prog && prog.kill(); vid && vid.pause(); };
  });

  /* ---------- E · Progreso circular ---------- */
  register("process", "E", (root, ux) => {
    const pin = $(".process-e__pin", root), stairs = $(".process-e__stairs", root), items = $$(".process-e__stairs li", root);
    const fg = $(".process-e__ring .fg", root), pct = $(".process-e__pct b", root);
    fg.setAttribute("pathLength", 1); fg.style.strokeDasharray = "1 1";
    if (ux.reduce) { root.classList.add("is-static"); fg.style.strokeDashoffset = 0; pct.textContent = "100"; items.forEach(i => i.classList.add("on")); return () => root.classList.remove("is-static"); }
    let geo = {};
    const place = () => {
      const W = pin.offsetWidth, H = pin.offsetHeight, cw = items[0].offsetWidth, ch = items[0].offsetHeight;
      const narrow = W < 700, sx = narrow ? W * .05 : Math.min(W * .3, 440), sy = narrow ? Math.min(H * .2, 190) : Math.min(H * .2, 170);
      geo = { sx, sy };
      items.forEach((li, i) => { li.style.left = (W / 2 - cw / 2 + i * sx) + "px"; li.style.top = (H / 2 - ch / 2 - i * sy) + "px"; });
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
    gsap.from(".process-e__ring", { scale: .7, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => { items.forEach(li => { li.style.left = li.style.top = ""; }); };
  });
})();
