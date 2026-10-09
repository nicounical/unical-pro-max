/* 03 · Showreel — A (favorita) + 5 versiones futuristas */
(() => {
  const { register } = UX;

  /* A · Bola de vídeo que sigue al cursor sobre el titular */
  register("reel", "A", (root, ux) => {
    const stage = ux.$(".reel-a__stage", root), ball = ux.$(".reel-a__ball", root);
    const rows = ux.$$(".reel-a__row", root);
    const onKey = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ux.openReel(); } };
    stage.addEventListener("keydown", onKey);
    if (ux.reduce) return () => stage.removeEventListener("keydown", onKey);
    gsap.fromTo(rows, { xPercent: i => (i % 2 ? 12 : -12) }, { xPercent: i => (i % 2 ? -6 : 6), ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    if (!ux.fine || innerWidth <= 860) return () => stage.removeEventListener("keydown", onKey);
    const r0 = stage.getBoundingClientRect();
    gsap.set(ball, { x: r0.width * .62, y: r0.height * .52, xPercent: -50, yPercent: -50, scale: 1 });
    const xTo = gsap.quickTo(ball, "x", { duration: .7, ease: "power3" }), yTo = gsap.quickTo(ball, "y", { duration: .7, ease: "power3" });
    const sTo = gsap.quickTo(ball, "scale", { duration: .5, ease: "power3" });
    const move = e => { const r = stage.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top); };
    const enter = () => sTo(1.12), leave = () => sTo(1);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerenter", enter);
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("keydown", onKey);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointerleave", leave);
    };
  });

  /* ===================== Ronda futurista · B–F ===================== */
  // Teclado: Enter/Espacio sobre la zona clicable abre el showreel
  const keyOpen = (els, ux) => {
    const on = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ux.openReel(); } };
    els.forEach(el => el.addEventListener("keydown", on));
    return () => els.forEach(el => el.removeEventListener("keydown", on));
  };
  // Bucle rAF + reproducción del vídeo solo mientras el elemento está en pantalla
  const whileVisible = (el, frame, video) => {
    let raf = 0, on = false;
    const tick = t => { frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) {
        on = true; if (video) { if (video.preload === "none") video.preload = "auto"; video.play().catch(() => {}); }
        if (frame) raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && on) { on = false; video && video.pause(); cancelAnimationFrame(raf); }
    }, { rootMargin: "100px" });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); video && video.pause(); };
  };
  const fitCanvas = cv => {
    const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    return { w, h, dpr };
  };
  const posterOf = v => { const im = new Image(); im.src = v.getAttribute("poster"); return im; };
  const srcReady = (v, im) => (v.readyState >= 2 ? [v, v.videoWidth, v.videoHeight] : im.complete && im.naturalWidth ? [im, im.naturalWidth, im.naturalHeight] : null);

  /* B · Visor HUD con código de tiempo real */
  register("reel", "B", (root, ux) => {
    const view = ux.$(".reel-b__view", root), v = ux.$(".reel-b__v", root);
    const tc = ux.$(".reel-b__tc", root), rule = ux.$(".reel-b__rule b", root), bar = ux.$(".reel-b__bar", root);
    const off = keyOpen([view], ux);
    if (!ux.reduce) gsap.fromTo(view, { scale: .86, borderRadius: 28 }, { scale: 1, borderRadius: 10, ease: "none", scrollTrigger: { trigger: view, start: "top bottom", end: "top 30%", scrub: .6 } });
    const pad = n => String(Math.floor(n)).padStart(2, "0");
    const stop = whileVisible(view, () => {
      const t = v.currentTime || 0, d = v.duration || 36.84;
      tc.textContent = `00:${pad(t / 60)}:${pad(t % 60)}:${pad((t % 1) * 25)}`;
      bar.style.setProperty("--p", (t / d).toFixed(4));
      rule.style.setProperty("--y", `${(t / d) * (rule.parentNode.clientHeight - 10)}px`);
    });
    return () => { off(); stop(); };
  });

  /* C · Holograma que se endereza al bajar */
  register("reel", "C", (root, ux) => {
    const holo = ux.$(".reel-c__holo", root), off = keyOpen([holo], ux);
    if (!ux.reduce) {
      gsap.fromTo(holo, { rotationX: 52, scale: .82 }, { rotationX: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ux.$(".reel-c__stage", root), start: "top 85%", end: "center 55%", scrub: .8 } });
      gsap.fromTo(ux.$(".reel-c__beam", root), { opacity: 1 }, { opacity: .45, ease: "none", scrollTrigger: { trigger: ux.$(".reel-c__stage", root), start: "top 85%", end: "center 55%", scrub: .8 } });
    }
    return off;
  });

  /* D · Muro LED con lente nítida bajo el cursor */
  register("reel", "D", (root, ux) => {
    const stage = ux.$(".reel-d__stage", root), v = ux.$(".reel-d__v", root), cv = ux.$(".reel-d__cv", root), ctx = cv.getContext("2d");
    const off = keyOpen([stage], ux);
    if (ux.reduce) { root.classList.add("no-canvas"); v.preload = "auto"; return () => { off(); root.classList.remove("no-canvas"); }; }
    const poster = posterOf(v), small = document.createElement("canvas"), sctx = small.getContext("2d", { willReadFrequently: true });
    let mx = -999, my = -999, tx = -999, ty = -999, inside = false, lens = 0;
    const move = e => { const r = stage.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; inside = true; };
    const leave = () => (inside = false);
    stage.addEventListener("pointermove", move); stage.addEventListener("pointerleave", leave);
    const stop = whileVisible(stage, now => {
      const src = srcReady(v, poster); if (!src) return;
      const { w, h, dpr } = fitCanvas(cv), [el, vw, vh] = src;
      const cell = innerWidth < 700 ? 8 : 12, cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
      if (small.width !== cols || small.height !== rows) { small.width = cols; small.height = rows; }
      const sc = Math.max(cols / vw, rows / vh);
      sctx.drawImage(el, (cols - vw * sc) / 2, (rows - vh * sc) / 2, vw * sc, vh * sc);
      const px = sctx.getImageData(0, 0, cols, rows).data;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#040409"; ctx.fillRect(0, 0, w, h);
      const g = cell * .78, o = (cell - g) / 2;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4, r = px[i], gg = px[i + 1], b = px[i + 2];
        const l = (r * .3 + gg * .59 + b * .11) / 255;
        if (l < .06) continue;
        // un punto por píxel, con un leve tinte azul de marca
        ctx.fillStyle = `rgb(${(r * .85) | 0},${(gg * .92 + 8) | 0},${Math.min(255, b * 1.05 + 18) | 0})`;
        const s = g * (.45 + .55 * l);
        ctx.fillRect(x * cell + (cell - s) / 2, y * cell + (cell - s) / 2, s, s);
      }
      // lente: ratón en escritorio; deriva sola en táctil
      if (!ux.fine) { tx = w * (.5 + .3 * Math.sin(now / 2100)); ty = h * (.42 + .18 * Math.cos(now / 1700)); inside = true; }
      if (mx < -900) { mx = tx; my = ty; }
      mx += (tx - mx) * .14; my += (ty - my) * .14;
      lens += ((inside ? 1 : 0) - lens) * .1;
      if (lens > .02) {
        const R = Math.min(w, h) * .2 * lens, k = Math.max(w / vw, h / vh);
        ctx.save(); ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(el, (w - vw * k) / 2, (h - vh * k) / 2, vw * k, vh * k);
        ctx.restore();
        ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.strokeStyle = "rgba(153,196,228,.9)"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(mx, my, R + 8, -.6, .6); ctx.stroke();
        ctx.beginPath(); ctx.arc(mx, my, R + 8, Math.PI - .6, Math.PI + .6); ctx.stroke();
      }
    }, v);
    return () => { off(); stop(); stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerleave", leave); };
  });

  /* E · Iris que se abre con el scroll */
  register("reel", "E", (root, ux) => {
    const media = ux.$(".reel-e__media", root), rings = ux.$(".reel-e__rings", root), pct = ux.$(".reel-e__pct b", root);
    const off = keyOpen([media], ux);
    if (ux.reduce) { root.classList.add("is-static"); return () => { off(); root.classList.remove("is-static"); }; }
    [[".reel-e__r1", 40], [".reel-e__r2", -26], [".reel-e__r3", 60], [".reel-e__r4", -14]].forEach(([s, d]) =>
      gsap.to(ux.$(s, root), { rotation: d > 0 ? 360 : -360, svgOrigin: "0 0", duration: Math.abs(d), ease: "none", repeat: -1 }));
    const o = { p: 0 };
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .8 } })
      .to(o, { p: 1, ease: "power2.inOut", duration: 1, onUpdate: () => {
        media.style.setProperty("--r", `${(14 + o.p * 62).toFixed(2)}%`);
        media.style.setProperty("--veil", (.35 * (1 - o.p)).toFixed(3));
        pct.textContent = String(Math.round(o.p * 100)).padStart(3, "0");
      } }, 0)
      .to(rings, { scale: 2.8, opacity: 0, ease: "power2.in", duration: .8 }, .1)
      .to({}, { duration: .25 });
    return off;
  });

  /* F · Pantalla curva que se aplana al bajar */
  register("reel", "F", (root, ux) => {
    const stage = ux.$(".reel-f__stage", root), v = ux.$(".reel-f__v", root), cv = ux.$(".reel-f__cv", root), ctx = cv.getContext("2d");
    const off = keyOpen([stage], ux), poster = posterOf(v);
    const st = { c: ux.reduce ? .12 : 1 };
    const draw = () => {
      const src = srcReady(v, poster); if (!src) return;
      const { w, h, dpr } = fitCanvas(cv), [el, vw, vh] = src;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const N = 96, arc = .2 + st.c * 1.5, W = Math.min(w * .94, h * 1.9), H0 = W / (16 / 9) * .74, cy = h * .44;
      const X = u => w / 2 + Math.sin((u - .5) * arc) / Math.sin(arc / 2) * W / 2;
      const tops = [], bots = [];
      for (let i = 0; i < N; i++) {
        const u0 = i / N, u1 = (i + 1) / N, th = (u0 + u1 - 1) / 2 * arc;
        const hh = H0 * (1 + st.c * (1 - Math.cos(th)) * 2.4), x0 = X(u0), x1 = X(u1);
        const sx = u0 * vw, sw = vw / N;
        ctx.globalAlpha = 1 - st.c * .35 * Math.abs(u0 - .5) * 2;
        ctx.drawImage(el, sx, 0, sw, vh, x0, cy - hh / 2, x1 - x0 + .6, hh);
        // reflejo en el suelo
        ctx.save(); ctx.globalAlpha = .14; ctx.translate(0, cy + hh / 2 + 6); ctx.scale(1, -1);
        ctx.drawImage(el, sx, vh * .5, sw, vh * .5, x0, -hh * .5, x1 - x0 + .6, hh * .5);
        ctx.restore();
        tops.push([x0, cy - hh / 2]); bots.push([x0, cy + hh / 2]);
      }
      ctx.globalAlpha = 1;
      // degradado que funde el reflejo con el suelo
      const g = ctx.createLinearGradient(0, cy + H0 / 2, 0, h);
      g.addColorStop(0, "rgba(7,7,15,0)"); g.addColorStop(.7, "rgba(7,7,15,1)");
      ctx.fillStyle = g; ctx.fillRect(0, cy + H0 / 2, w, h);
      ctx.strokeStyle = "rgba(153,196,228,.8)"; ctx.lineWidth = 1.5; ctx.shadowColor = "rgba(153,196,228,.9)"; ctx.shadowBlur = 10;
      [tops, bots].forEach(pts => { ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); });
      ctx.shadowBlur = 0;
    };
    if (ux.reduce) {
      poster.onload = draw; draw();
      const ro = new ResizeObserver(draw); ro.observe(cv);
      return () => { off(); ro.disconnect(); };
    }
    gsap.to(st, { c: .12, ease: "none", scrollTrigger: { trigger: stage, start: "top 90%", end: "bottom 70%", scrub: .8 } });
    const stop = whileVisible(stage, draw, v);
    return () => { off(); stop(); };
  });
})();
