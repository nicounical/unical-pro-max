/* Portada · A (favorita fija) + 5 versiones futuristas */
(() => {
  const { register } = UX;

  /* ---------- A · Lexus en letras (favorita fija) ---------- */
  register("hero", "A", (root, ux) => {
    const layers = ux.$$(".hero-a__knock, .hero-a__stroke", root), stroke = ux.$(".hero-a__stroke", root);
    const words = ux.$$(".hero-a__word", root), img = ux.$(".hero-a__img", root);
    const copy = ux.$$(".hero-a__kicker, .hero-a__h1, .hero-a__ctas", root);
    if (ux.reduce) return;
    gsap.set(words, { yPercent: 40, autoAlpha: 0 });
    gsap.set(copy, { y: 30, autoAlpha: 0 });
    // Vídeo del Lexus: arranca desde el principio al terminar la precarga, con un zoom de entrada
    gsap.set(img, { scale: 1.18 });
    const breathe = { kill() {} };
    const intro = gsap.timeline({ paused: true })
      .add(() => { img.currentTime = 0; img.play().catch(() => {}); })
      .to(img, { scale: 1.04, duration: 2.6, ease: "expo.out" }, 0)
      .to(words, { yPercent: 0, autoAlpha: 1, duration: 1.4, stagger: .06, ease: "expo.out" }, .1)
      .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, .6);
    ux.onIntro(() => intro.play());
    // Parallax suave con el ratón
    let off;
    if (ux.fine) {
      const mx = gsap.quickTo(ux.$(".hero-a__media", root), "x", { duration: 1.2, ease: "power3" });
      const my = gsap.quickTo(ux.$(".hero-a__media", root), "y", { duration: 1.2, ease: "power3" });
      const move = e => { mx((e.clientX / innerWidth - .5) * -26); my((e.clientY / innerHeight - .5) * -18); };
      addEventListener("pointermove", move, { passive: true });
      off = () => removeEventListener("pointermove", move);
    }
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6 } })
      .to(layers, { scale: 28, ease: "power2.in", duration: 1 }, 0)
      .to(stroke, { autoAlpha: 0, duration: .2 }, .25)
      .to(layers, { autoAlpha: 0, duration: .15 }, .85)
      .to(ux.$(".hero-a__hint", root), { autoAlpha: 0, duration: .2 }, 0)
      .to(copy, { y: -20, ease: "none", duration: 1 }, 0);
    return () => { off && off(); breathe.kill(); };
  });


  /* Bucle rAF que solo corre mientras la portada está en pantalla */
  const visibleLoop = (root, frame) => {
    let raf = 0, on = false;
    const tick = t => { frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  };
  const fitCanvas = (cv, dprMax = 2) => {
    const d = Math.min(devicePixelRatio || 1, dprMax), r = cv.getBoundingClientRect();
    cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d);
    return { w: r.width, h: r.height, d };
  };
  const introIn = (ux, els) => {
    if (ux.reduce) return;
    gsap.set(els, { autoAlpha: 0, y: 34 });
    ux.onIntro(() => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .08, ease: "expo.out", delay: .2 }));
  };

  /* ---------- B · HUD escáner ---------- */
  register("hero", "B", (root, ux) => {
    const vids = ux.$$("video", root), pct = ux.$(".hero-hud__pct", root);
    const offs = [];
    vids.forEach(v => { v.preload = "auto"; v.muted = true; });
    const play = () => { vids[0].currentTime = vids[1].currentTime = 0; vids.forEach(v => v.play().catch(() => {})); };
    // Mantiene los dos vídeos alineados
    const sync = setInterval(() => { if (Math.abs(vids[0].currentTime - vids[1].currentTime) > .12) vids[1].currentTime = vids[0].currentTime; }, 1000);
    offs.push(() => { clearInterval(sync); vids.forEach(v => v.pause()); });
    introIn(ux, ux.$$(".hero-hud__kicker, .hero-hud__h1, .hero-hud__sub, .hero-hud .hero-ctas, .hero-hud__data", root));
    if (ux.reduce) { root.style.setProperty("--scan", "100%"); pct.textContent = "100%"; play(); return () => offs.forEach(f => f()); }
    const s = { scan: 0, l: 0 };
    const paint = () => { root.style.setProperty("--scan", s.scan + "%"); root.style.setProperty("--l", s.l + "%"); pct.textContent = String(Math.round(s.scan)).padStart(3, "0") + "%"; };
    paint();
    ux.onIntro(() => {
      play();
      gsap.timeline({ onUpdate: paint })
        .to(s, { scan: 100, l: 100, duration: 3.2, ease: "power2.inOut", delay: .3 })
        .to(s, { l: 0, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true, onUpdate: paint });
    });
    // Retícula que sigue al ratón (o patrulla sola en táctil)
    const rt = { x: 62, y: 46 };
    const rp = () => { root.style.setProperty("--rx", rt.x + "%"); root.style.setProperty("--ry", rt.y + "%"); };
    if (ux.fine) {
      const xt = gsap.quickTo(rt, "x", { duration: .9, ease: "power3", onUpdate: rp }), yt = gsap.quickTo(rt, "y", { duration: .9, ease: "power3", onUpdate: rp });
      const mv = e => { const r = root.getBoundingClientRect(); xt((e.clientX - r.left) / r.width * 100); yt((e.clientY - r.top) / r.height * 100); };
      root.addEventListener("pointermove", mv); offs.push(() => root.removeEventListener("pointermove", mv));
    } else {
      gsap.to(rt, { keyframes: [{ x: 30, y: 38 }, { x: 70, y: 30 }, { x: 55, y: 50 }, { x: 62, y: 40 }], duration: 12, repeat: -1, ease: "sine.inOut", onUpdate: rp });
    }
    gsap.to(ux.$(".hero-hud__copy", root), { yPercent: -18, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(ux.$(".hero-hud__media", root), { scale: 1.12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });

  /* ---------- C · Rejilla infinita + panel flotante ---------- */
  register("hero", "C", (root, ux) => {
    const cv = ux.$(".hero-grid__cv", root), ctx = cv.getContext("2d"), panel = ux.$(".hero-grid__panel", root);
    const offs = [];
    let m = fitCanvas(cv);
    const onR = () => { m = fitCanvas(cv); if (ux.reduce) draw(0); };
    addEventListener("resize", onR); offs.push(() => removeEventListener("resize", onR));
    const stars = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random() * .5, a: Math.random() }));
    function draw(t) {
      const { w, h, d } = m; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h);
      const hz = h * (m.w < 960 ? .5 : .72), vx = w / 2;
      stars.forEach(s => { ctx.fillStyle = `rgba(153,196,228,${.15 + .35 * Math.abs(Math.sin(t / 1600 + s.a * 9))})`; ctx.fillRect(s.x * w, s.y * hz, 1.5, 1.5); });
      ctx.lineWidth = 1;
      // líneas que fugan al horizonte
      for (let i = -24; i <= 24; i++) {
        const x = vx + i * w / 14;
        const g = ctx.createLinearGradient(0, hz, 0, h); g.addColorStop(0, "rgba(153,196,228,0)"); g.addColorStop(1, "rgba(153,196,228,.38)");
        ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(vx + i * 8, hz); ctx.lineTo(x * 1 + i * w / 9, h); ctx.stroke();
      }
      // líneas horizontales que avanzan
      const off = (t / 2600) % 1;
      for (let k = 0; k < 18; k++) {
        const z = (k + off) / 18, y = hz + Math.pow(z, 2.4) * (h - hz);
        ctx.strokeStyle = `rgba(153,196,228,${.05 + z * .4})`; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      const hg = ctx.createLinearGradient(0, hz - 2, 0, hz + 2); hg.addColorStop(.5, "rgba(153,196,228,.8)"); hg.addColorStop(0, "rgba(153,196,228,0)"); hg.addColorStop(1, "rgba(153,196,228,0)");
      ctx.fillStyle = hg; ctx.fillRect(0, hz - 2, w, 4);
    }
    if (ux.reduce) draw(0); else offs.push(visibleLoop(root, draw));
    introIn(ux, [...ux.$$(".hero-grid__kicker, .hero-grid__h1, .hero-grid__sub, .hero-grid .hero-ctas", root)]);
    if (!ux.reduce) {
      gsap.set(panel, { autoAlpha: 0, z: -300, rotateX: 30 });
      ux.onIntro(() => gsap.to(panel, { autoAlpha: 1, z: 0, rotateX: 0, duration: 1.8, ease: "expo.out", delay: .35, clearProps: "transform" }));
      // inclinación 3D + brillo que sigue al ratón
      if (ux.fine) {
        const st = { rx: 0, ry: 0 };
        const ap = () => { panel.style.setProperty("--rx", st.rx + "deg"); panel.style.setProperty("--ry", st.ry + "deg"); };
        const rx = gsap.quickTo(st, "rx", { duration: .8, ease: "power3", onUpdate: ap }), ry = gsap.quickTo(st, "ry", { duration: .8, ease: "power3", onUpdate: ap });
        const mv = e => {
          const r = panel.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
          rx((.5 - ny) * 10); ry((nx - .5) * 14);
          panel.style.setProperty("--sx", nx * 100 + "%"); panel.style.setProperty("--sy", ny * 100 + "%");
        };
        root.addEventListener("pointermove", mv); offs.push(() => root.removeEventListener("pointermove", mv));
      }
      gsap.to(ux.$(".hero-grid__in", root), { yPercent: -12, autoAlpha: .3, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    }
    return () => offs.forEach(f => f());
  });

  /* ---------- D · Nube de puntos (el vídeo convertido en LEDs) ---------- */
  register("hero", "D", (root, ux) => {
    const cv = ux.$(".hero-pts__cv", root), ctx = cv.getContext("2d"), vid = ux.$(".hero-pts__src", root);
    const off = document.createElement("canvas"), octx = off.getContext("2d", { willReadFrequently: true });
    const offs = [];
    let m, cols, rows, step, P = [], ready = false;
    const poster = new Image(); poster.src = "assets/video/hero-coche.jpg";
    const build = () => {
      m = fitCanvas(cv);
      step = m.w < 700 ? 7 : 9;
      cols = Math.ceil(m.w / step); rows = Math.ceil(m.h / step);
      off.width = cols; off.height = rows;
      P = new Float32Array(cols * rows * 5); // dx, dy, vx, vy, rand
      for (let i = 0; i < cols * rows; i++) P[i * 5 + 4] = Math.random();
    };
    build();
    const onR = () => build(); addEventListener("resize", onR); offs.push(() => removeEventListener("resize", onR));
    vid.preload = "auto"; vid.muted = true;
    const tryPlay = () => vid.play().then(() => { ready = true; }).catch(() => {});
    offs.push(() => vid.pause());
    const mouse = { x: -9999, y: -9999 }, sc = { p: 0 };
    if (ux.fine) {
      const mv = e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
      const lv = () => { mouse.x = mouse.y = -9999; };
      root.addEventListener("pointermove", mv); root.addEventListener("pointerleave", lv);
      offs.push(() => { root.removeEventListener("pointermove", mv); root.removeEventListener("pointerleave", lv); });
    }
    const BINS = 7, shades = Array.from({ length: BINS }, (_, b) => {
      const k = b / (BINS - 1); // de azul de marca a blanco
      return `rgb(${Math.round(46 + (255 - 46) * k)},${Math.round(108 + (255 - 108) * k)},${Math.round(160 + (255 - 160) * k)})`;
    });
    const cover = (src, sw, sh) => { // dibuja con object-fit:cover en el lienzo reducido
      const s = Math.max(cols / sw, rows / sh), w = sw * s, h = sh * s;
      octx.drawImage(src, (cols - w) / 2, (rows - h) * .45, w, h);
    };
    let auto = 0;
    function frame(t) {
      const src = ready && vid.readyState >= 2 ? vid : (poster.complete && poster.naturalWidth ? poster : null);
      const { w, h, d } = m; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h);
      if (!src) return;
      cover(src, src.videoWidth || src.naturalWidth, src.videoHeight || src.naturalHeight);
      const px = octx.getImageData(0, 0, cols, rows).data;
      if (!ux.fine) { auto += .012; mouse.x = w * (.5 + .3 * Math.sin(auto)); mouse.y = h * (.4 + .12 * Math.sin(auto * 1.7)); }
      const R = Math.min(w, h) * .16, R2 = R * R, boom = sc.p;
      const paths = shades.map(() => new Path2D());
      for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
        const o = i * 4, L = Math.pow((px[o] * .3 + px[o + 1] * .59 + px[o + 2] * .11) / 255, .72);
        if (L < .07) continue;
        const b = i * 5, hx = x * step + step / 2, hy = y * step + step / 2;
        let ddx = P[b], ddy = P[b + 1];
        const ex = hx + ddx - mouse.x, ey = hy + ddy - mouse.y, d2 = ex * ex + ey * ey;
        if (d2 < R2) { const f = (1 - d2 / R2) * 2.2, dd = Math.sqrt(d2) || 1; P[b + 2] += ex / dd * f; P[b + 3] += ey / dd * f; }
        P[b + 2] = (P[b + 2] - ddx * .06) * .86; P[b + 3] = (P[b + 3] - ddy * .06) * .86;
        P[b] = ddx + P[b + 2]; P[b + 1] = ddy + P[b + 3];
        const rnd = P[b + 4], sx = hx + P[b] + (rnd - .5) * boom * w * .6, sy = hy + P[b + 1] - boom * h * (.2 + rnd * .5);
        const sz = Math.max(.8, Math.min(step * .78, L * step * 1.05));
        paths[Math.min(BINS - 1, Math.floor(L * BINS))].rect(sx - sz / 2, sy - sz / 2, sz, sz);
      }
      paths.forEach((p, k) => { ctx.fillStyle = shades[k]; ctx.globalAlpha = .45 + .55 * (k / (BINS - 1)); ctx.fill(p); });
      ctx.globalAlpha = 1;
    }
    introIn(ux, ux.$$(".hero-pts__kicker, .hero-pts__h1, .hero-pts__row, .hero-pts__hint", root));
    ux.onIntro(tryPlay);
    if (ux.reduce) { poster.onload = () => frame(0); if (poster.complete) frame(0); return () => offs.forEach(f => f()); }
    gsap.fromTo(cv, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 2.2, ease: "expo.out" });
    offs.push(visibleLoop(root, frame));
    // Al hacer scroll los puntos se dispersan hacia arriba
    gsap.to(sc, { p: 1, ease: "power1.in", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(ux.$(".hero-pts__in", root), { yPercent: -15, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });

  /* ---------- E · Terminal de producción ---------- */
  register("hero", "E", (root, ux) => {
    const log = ux.$(".hero-term__log", root), dec = ux.$(".hero-term__dec", root), tc = ux.$(".hero-term__tc", root), vid = ux.$(".hero-term__screen video", root);
    const offs = [];
    const LINES = [
      "<b>$</b> <em>unical --nuevo-proyecto</em>",
      "  briefing recibido .............. <b>OK</b>",
      "  diseño + mockup previo ......... <b>OK</b>",
      "  impresión gran formato ......... <b>100%</b>",
      "  rotulación · vinilo 3M / Avery . <b>OK</b>",
      "  montaje en toda España ......... <b>listo</b>",
      "<b>✓</b> <em>+3.000 proyectos entregados</em>"
    ];
    const full = LINES.join("\n");
    const tcT = setInterval(() => { const s = vid.currentTime || 0; tc.textContent = `00:${String(Math.floor(s)).padStart(2, "0")}:${String(Math.floor((s % 1) * 24)).padStart(2, "0")}`; }, 120);
    offs.push(() => clearInterval(tcT));
    introIn(ux, ux.$$(".hero-term__kicker, .hero-term__h1, .hero-term__sub, .hero-term .hero-ctas", root));
    if (ux.reduce) { log.innerHTML = full; return () => offs.forEach(f => f()); }
    gsap.from(ux.$(".hero-term__screen", root), { clipPath: "inset(50% 0 50% 0)", duration: 1.4, ease: "expo.inOut", delay: .1 });
    // Escritura línea a línea (las etiquetas HTML se insertan de golpe)
    let li = 0, ci = 0, typed = "", timer;
    const step = () => {
      if (li >= LINES.length) { log.innerHTML = typed + '<span class="cur"></span>'; return; }
      const line = LINES[li];
      if (line[ci] === "<") ci = line.indexOf(">", ci) + 1;
      else ci++;
      log.innerHTML = typed + line.slice(0, ci) + '<span class="cur"></span>';
      if (ci >= line.length) { typed += line + "\n"; li++; ci = 0; timer = setTimeout(step, 220); }
      else timer = setTimeout(step, line.includes(".....") && ci > 30 ? 6 : 26);
    };
    log.innerHTML = '<span class="cur"></span>';
    ux.onIntro(() => { timer = setTimeout(step, 500); });
    offs.push(() => clearTimeout(timer));
    // Titular que se «decodifica»
    const text = dec.textContent, GL = "█▓▒░<>/\\#*+=01";
    const scr = { p: 0 };
    ux.onIntro(() => gsap.to(scr, { p: 1, duration: 1.6, delay: .35, ease: "power2.out", onUpdate() {
      const n = Math.floor(scr.p * text.length);
      dec.textContent = text.slice(0, n) + text.slice(n).replace(/\S/g, () => GL[Math.floor(Math.random() * GL.length)]);
    }, onComplete() { dec.textContent = text; } }));
    offs.push(() => { dec.textContent = text; });
    gsap.to(ux.$(".hero-term__in", root), { yPercent: -10, autoAlpha: .3, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });

  /* ---------- F · Cristal acanalado ---------- */
  register("hero", "F", (root, ux) => {
    const glass = ux.$(".hero-flute__glass", root), offs = [];
    introIn(ux, ux.$$(".hero-flute__kicker, .hero-flute__h1, .hero-flute__foot, .hero-flute__hint", root));
    if (ux.reduce) return;
    const st = { x: 70, y: 45, r: 0 };
    const paint = () => { root.style.setProperty("--mx", st.x + "%"); root.style.setProperty("--my", st.y + "%"); root.style.setProperty("--r", st.r + "px"); };
    const big = () => Math.max(160, Math.min(innerWidth * .2, 320));
    gsap.fromTo(glass, { backgroundPositionX: "-400px" }, { backgroundPositionX: "0px", duration: 2.4, ease: "expo.out" });
    if (ux.fine) {
      const xt = gsap.quickTo(st, "x", { duration: .7, ease: "power3", onUpdate: paint }), yt = gsap.quickTo(st, "y", { duration: .7, ease: "power3", onUpdate: paint });
      const mv = e => { const r = root.getBoundingClientRect(); xt((e.clientX - r.left) / r.width * 100); yt((e.clientY - r.top) / r.height * 100); };
      const en = () => gsap.to(st, { r: big(), duration: .8, ease: "expo.out", onUpdate: paint });
      const lv = () => gsap.to(st, { r: 0, duration: .6, ease: "power2.in", onUpdate: paint });
      root.addEventListener("pointermove", mv); root.addEventListener("pointerenter", en); root.addEventListener("pointerleave", lv);
      offs.push(() => { root.removeEventListener("pointermove", mv); root.removeEventListener("pointerenter", en); root.removeEventListener("pointerleave", lv); });
      ux.onIntro(() => gsap.to(st, { r: big(), duration: 1.4, delay: .6, ease: "expo.out", onUpdate: paint }));
    } else {
      ux.onIntro(() => gsap.to(st, { r: big(), duration: 1.2, delay: .6, onUpdate: paint }));
      gsap.to(st, { keyframes: [{ x: 30, y: 35 }, { x: 72, y: 30 }, { x: 55, y: 55 }, { x: 70, y: 45 }], duration: 14, repeat: -1, ease: "sine.inOut", onUpdate: paint });
    }
    // Al bajar, el cristal se cierra del todo
    gsap.to(root, { "--flute": "14px", ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(ux.$(".hero-flute__in", root), { yPercent: -12, autoAlpha: .25, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });

  /* =====================================================================
     Ronda «Impacto sin tecnología» · G–K
     ===================================================================== */
  const mqDesk = () => matchMedia("(min-width: 861px)").matches;

  /* ---------- G · Telón y marco ---------- */
  register("hero", "G", (root, ux) => {
    const frame = ux.$(".hero-tel__frame", root), v = ux.$(".hero-tel__v", root);
    const curT = ux.$(".hero-tel__cur--t", root), curB = ux.$(".hero-tel__cur--b", root);
    const lines = ux.$$(".hero-tel__l", root), rest = ux.$$(".hero-tel__kicker, .hero-tel__sub, .hero-tel__ctas", root);
    if (ux.reduce) { gsap.set([curT, curB], { autoAlpha: 0 }); return; }
    gsap.set(lines, { yPercent: 110, autoAlpha: 0 });
    gsap.set(rest, { y: 24, autoAlpha: 0 });
    gsap.set(v, { scale: 1.25 });
    const intro = gsap.timeline({ paused: true })
      .add(() => { v.currentTime = 0; v.play().catch(() => {}); })
      .to(curT, { yPercent: -101, duration: 1.4, ease: "expo.inOut" }, .1)
      .to(curB, { yPercent: 101, duration: 1.4, ease: "expo.inOut" }, .1)
      .to(v, { scale: 1, duration: 2.4, ease: "expo.out" }, .3)
      .to(lines, { yPercent: 0, autoAlpha: 1, duration: 1.2, stagger: .1, ease: "expo.out" }, .9)
      .to(rest, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, 1.1);
    ux.onIntro(() => intro.play());
    if (!mqDesk()) return;
    // Al bajar, el vídeo se encoge hasta quedar enmarcado como una foto colgada, con su pie
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .7 } })
      .fromTo(frame, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(13% 6% 19% 52% round 22px)", ease: "power2.inOut", duration: 1 }, 0)
      .to(ux.$(".hero-tel__shade", root), { autoAlpha: 0, duration: .6 }, .2)
      .to(ux.$(".hero-tel__cap", root), { autoAlpha: 1, duration: .3 }, .7);
  });

  /* ---------- H · Portada de revista ---------- */
  register("hero", "H", (root, ux) => {
    const words = ux.$$(".hero-mag__w", root), frame = ux.$(".hero-mag__frame", root);
    const side = ux.$$(".hero-mag__bar, .hero-mag__lines li, .hero-mag__foot, .hero-mag__fig figcaption", root);
    const v = ux.$(".hero-mag__v", root);
    if (ux.reduce) return;
    gsap.set(words, { yPercent: 60, autoAlpha: 0 });
    gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(side, { y: 18, autoAlpha: 0 });
    const intro = gsap.timeline({ paused: true })
      .add(() => { v.currentTime = 0; v.play().catch(() => {}); })
      .to(words, { yPercent: 0, autoAlpha: 1, duration: 1.3, stagger: .12, ease: "expo.out" }, .1)
      .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, .3)
      .to(side, { y: 0, autoAlpha: 1, duration: .9, stagger: .06, ease: "expo.out" }, .9);
    ux.onIntro(() => intro.play());
    // Al bajar: la foto sube más despacio que la cabecera (profundidad de revista)
    gsap.to(ux.$(".hero-mag__fig", root), { yPercent: -10, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(words, { letterSpacing: "-.02em", ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  });

  /* ---------- I · Recortes ---------- */
  register("hero", "I", (root, ux) => {
    const pieces = ux.$$(".hero-cut__p", root);
    const copy = ux.$$(".hero-cut__kicker, .hero-cut__l, .hero-cut__sub, .hero-cut__ctas", root);
    const v = ux.$(".hero-cut__p--main video", root);
    if (ux.reduce) return;
    gsap.set(pieces, { autoAlpha: 0, y: -70, scale: 1.12, rotation: i => (i % 2 ? 9 : -9) });
    gsap.set(copy, { y: 30, autoAlpha: 0 });
    const intro = gsap.timeline({ paused: true })
      .add(() => { v.currentTime = 0; v.play().catch(() => {}); })
      // Cada recorte «cae» sobre la mesa con un pequeño rebote
      .to(pieces, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: .9, stagger: .11, ease: "back.out(1.6)" }, .1)
      .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, .4);
    ux.onIntro(() => intro.play());
    // Al bajar, los recortes se dispersan según su profundidad
    gsap.to(pieces, { yPercent: (i, el) => -22 * +el.dataset.depth, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    if (!ux.fine) return;
    const movers = pieces.map(el => ({ d: +el.dataset.depth, x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }) }));
    const tilt = pieces.map(el => gsap.quickTo(el, "rotation", { duration: 1.2, ease: "power3" }));
    const move = e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      movers.forEach((m, i) => { m.x(nx * -14 * m.d); tilt[i](nx * m.d * 1.2 + ny); });
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  });

  /* ---------- J · Cartel suizo ---------- */
  register("hero", "J", (root, ux) => {
    const rows = ux.$$(".hero-swiss__row", root), disc = ux.$(".hero-swiss__disc", root);
    const rest = ux.$$(".hero-swiss__meta, .hero-swiss__foot", root), grid = ux.$$(".hero-swiss__grid i", root);
    const v = ux.$("video", disc);
    if (ux.reduce) return;
    gsap.set(rows, { x: -80, autoAlpha: 0 });
    gsap.set(disc, { clipPath: "circle(0% at 50% 50%)" });
    gsap.set(rest, { y: 20, autoAlpha: 0 });
    gsap.set(grid, { scaleY: 0, transformOrigin: "50% 0%" });
    const intro = gsap.timeline({ paused: true })
      .add(() => { v.currentTime = 0; v.play().catch(() => {}); })
      .to(grid, { scaleY: 1, duration: 1.2, stagger: .05, ease: "expo.inOut" }, 0)
      .to(rows, { x: 0, autoAlpha: 1, duration: 1.2, stagger: .1, ease: "expo.out" }, .3)
      .to(disc, { clipPath: "circle(50% at 50% 50%)", duration: 1.4, ease: "expo.out" }, .55)
      .to(rest, { y: 0, autoAlpha: 1, duration: .9, stagger: .08, ease: "expo.out" }, .8);
    ux.onIntro(() => intro.play());
    if (!mqDesk()) return;
    // Al bajar: las filas se desplazan en direcciones opuestas y el círculo crece hasta llenar el cartel
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6 } })
      .to(rows[0], { xPercent: -14, ease: "none", duration: 1 }, 0)
      .to(rows[1], { xPercent: 22, ease: "none", duration: 1 }, 0)
      .to(rows[2], { xPercent: -8, ease: "none", duration: 1 }, 0)
      .to(disc, { scale: () => Math.hypot(innerWidth, innerHeight) / disc.offsetWidth * 1.15, xPercent: -40, ease: "power2.in", duration: 1 }, .15)
      .fromTo(rest, { autoAlpha: 1 }, { autoAlpha: 0, duration: .25, immediateRender: false }, .35);
  });

  /* ---------- K · Rasqueta ---------- */
  register("hero", "K", (root, ux) => {
    const film = ux.$(".hero-sq__film", root), tool = ux.$(".hero-sq__tool", root);
    const v = ux.$(".hero-sq__v", root), note = ux.$(".hero-sq__note", root);
    const copy = ux.$$(".hero-sq__kicker, .hero-sq__h1, .hero-sq__sub, .hero-sq__ctas", root);
    if (ux.reduce) { gsap.set([film, tool], { autoAlpha: 0 }); return; }
    gsap.set(copy, { y: 30, autoAlpha: 0 });
    gsap.set(v, { scale: 1.08 });
    // La rasqueta recorre la pantalla de izquierda a derecha y «aplica» el vinilo: detrás aparece el Lexus
    const sweep = { p: 0 };
    const draw = () => {
      const w = root.clientWidth;
      gsap.set(film, { clipPath: `inset(0 0 0 ${sweep.p * 100}%)` });
      gsap.set(tool, { x: sweep.p * (w + 60) - 30, rotation: 4 - sweep.p * 3 });
    };
    const intro = gsap.timeline({ paused: true })
      .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, 0)
      .add(() => { v.currentTime = 0; v.play().catch(() => {}); }, .5)
      .to(sweep, { p: 1, duration: 2.1, ease: "power2.inOut", onUpdate: draw }, .6)
      .to(v, { scale: 1, duration: 2.6, ease: "expo.out" }, .8)
      .to(tool, { autoAlpha: 0, duration: .3 }, 2.6)
      .to(note, { autoAlpha: 1, duration: .6 }, 2.6);
    draw();
    ux.onIntro(() => intro.play());
    gsap.to(v, { yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(ux.$(".hero-sq__copy", root), { y: -50, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  });
})();
