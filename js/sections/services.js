/* Servicios · A (favorita: lista gigante + cursor) + 5 versiones nuevas B–F · contenido de la home v29 */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Lista gigante con media que sigue al cursor ---------- */
  register("services", "A", (root, ux) => {
    const items = $$(".services-a__list li", root);
    if (!ux.reduce) {
      gsap.from($$(".services-a__t", root), { yPercent: 100, opacity: 0, duration: 1.1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: $(".services-a__list", root), start: "top 80%" } });
    }
    if (!ux.fine || ux.reduce) return;
    const ac = new AbortController(), sig = { signal: ac.signal };
    const fl = $(".services-a__float", root), fin = $(".services-a__float-in", root), list = $(".services-a__list", root);
    // Mover el flotante al body evita que un transform del contenedor rompa position:fixed
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0, cur = "";
    const loop = () => {
      const dx = tx - x; x += dx * .14; y += (ty - y) * .14;
      const skew = gsap.utils.clamp(-14, 14, dx * .08), rot = gsap.utils.clamp(-8, 8, dx * .03);
      fl.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) skewX(${-skew}deg) rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    };
    list.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; }, sig);
    list.addEventListener("pointerenter", e => { x = tx = e.clientX; y = ty = e.clientY; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); }, sig);
    list.addEventListener("pointerover", e => {
      const a = e.target.closest("a[data-media]"); if (!a || a.dataset.media === cur) return;
      cur = a.dataset.media;
      const isV = a.dataset.type === "video";
      const m = document.createElement(isV ? "video" : "img");
      m.src = cur; if (isV) { m.muted = true; m.loop = true; m.playsInline = true; m.autoplay = true; } else m.alt = "";
      m.style.opacity = 0; fin.append(m);
      requestAnimationFrame(() => (m.style.opacity = 1));
      while (fin.children.length > 2) fin.firstChild.remove();
      fl.classList.add("on");
    }, sig);
    list.addEventListener("pointerleave", () => { fl.classList.remove("on"); cur = ""; setTimeout(() => cancelAnimationFrame(raf), 400); }, sig);
    return () => { ac.abort(); cancelAnimationFrame(raf); fl.classList.remove("on"); fin.innerHTML = ""; };
  });


  /* ===================== Ronda futurista · B–F ===================== */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_";
  // Texto que se «decodifica»: letras aleatorias que se van fijando de izquierda a derecha
  const decode = (el, dur = 520) => {
    const txt = el.dataset.text || el.textContent; el.dataset.text = txt;
    const t0 = performance.now(); let raf = 0;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), fixed = Math.floor(k * txt.length);
      el.textContent = [...txt].map((c, i) => (i < fixed || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (k < 1) raf = requestAnimationFrame(step); else el.textContent = txt;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); el.textContent = txt; };
  };
  // Ejecuta un bucle rAF solo mientras el elemento está en pantalla
  const visLoop = (el, frame) => {
    let raf = 0, on = false;
    const tick = t => { frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  };
  const coverDraw = (ctx, img, w, h) => {
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight), iw = img.naturalWidth * r, ih = img.naturalHeight * r;
    ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
  };

  /* ---------- B · Bento HUD ---------- */
  register("services", "B", (root, ux) => {
    const cards = $$(".services-b__card", root), bento = $(".services-b__bento", root);
    const ac = new AbortController(), sig = { signal: ac.signal }, stops = [];
    if (!ux.reduce) gsap.from(cards, { y: 60, opacity: 0, scale: .96, duration: 1.1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: bento, start: "top 80%" } });
    bento.addEventListener("pointermove", e => cards.forEach(c => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`);
    }), sig);
    if (!ux.reduce) cards.forEach(c => {
      const t = $(".services-b__t", c), run = () => stops.push(decode(t));
      c.addEventListener("pointerenter", run, sig); c.addEventListener("focus", run, sig);
    });
    return () => { ac.abort(); stops.forEach(f => f()); };
  });

  /* ---------- C · Escáner ---------- */
  register("services", "C", (root, ux) => {
    const imgs = $$(".services-c__imgs img", root), lis = $$(".services-c__list li", root), N = imgs.length;
    const laser = $(".services-c__laser", root), idx = $(".services-c__idx", root), tag = $(".services-c__tagline", root), box = $(".services-c__scan", root);
    let cur = -1;
    const apply = f => {
      const i = Math.min(N - 1, Math.floor(f)) % N, local = Math.min(1, (f - Math.floor(f)) * 1.5), prev = (i + N - 1) % N;
      imgs.forEach((im, j) => {
        let clip = "inset(0 0 100% 0)", z = 0;
        if (j === i) { clip = `inset(0 0 ${((1 - local) * 100).toFixed(2)}% 0)`; z = 3; }
        else if (j === prev && f >= 1 || j < i) { clip = "inset(0 0 0 0)"; z = j === prev ? 2 : 1; }
        im.style.clipPath = clip; im.style.zIndex = z;
      });
      laser.style.transform = `translateY(${(box.clientHeight - 28) * local}px)`;
      laser.style.opacity = local >= 1 ? .35 : 1;
      if (i !== cur) {
        cur = i; lis.forEach((l, j) => l.classList.toggle("on", j === i));
        idx.textContent = String(i + 1).padStart(2, "0"); tag.textContent = imgs[i].dataset.tag;
      }
    };
    const stat = ux.reduce || innerWidth < 900;
    root.classList.toggle("is-static", stat);
    if (ux.reduce) { apply(.99); return () => root.classList.remove("is-static"); }
    if (stat) {
      // Móvil: el escáner va solo, en bucle, mientras se ve
      const o = { f: 0 };
      const tw = gsap.to(o, { f: N, duration: N * 2.6, ease: "none", repeat: -1, paused: true, onUpdate: () => apply(o.f % N) });
      ScrollTrigger.create({ trigger: box, start: "top bottom", end: "bottom top", onToggle: s => (s.isActive ? tw.play() : tw.pause()) });
      apply(0);
      return () => root.classList.remove("is-static");
    }
    ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom bottom", onUpdate: s => apply(Math.min(N - .001, s.progress * N)) });
    apply(0);
    lis.forEach((l, j) => l.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey || l.classList.contains("on")) return;
      e.preventDefault();
      const top = root.getBoundingClientRect().top + scrollY, len = root.offsetHeight - innerHeight;
      const y = top + len * ((j + .7) / N);
      ux.lenis ? ux.lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: "smooth" });
    }));
    return () => root.classList.remove("is-static");
  });

  /* ---------- D · Terminal ---------- */
  register("services", "D", (root, ux) => {
    const rows = $$(".services-d__list a", root), cv = $(".services-d__cv", root), ctx = cv.getContext("2d");
    const vt = $(".services-d__vt", root), vd = $(".services-d__vd", root), typed = $(".services-d__typed", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const cache = {}; let img = null, block = 1, tw;
    const load = src => cache[src] || (cache[src] = new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; }));
    const small = document.createElement("canvas"), sctx = small.getContext("2d");
    const draw = () => {
      const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#06060D"; ctx.fillRect(0, 0, cv.width, cv.height);
      if (!img) return;
      const b = Math.max(1, block * dpr), sw = Math.max(1, Math.ceil(cv.width / b)), sh = Math.max(1, Math.ceil(cv.height / b));
      small.width = sw; small.height = sh; coverDraw(sctx, img, sw, sh);
      ctx.imageSmoothingEnabled = block <= 1.5; ctx.drawImage(small, 0, 0, sw, sh, 0, 0, sw * b, sh * b);
      // líneas de barrido
      ctx.fillStyle = "rgba(6,6,13,.18)"; for (let y = 0; y < cv.height; y += 3 * dpr) ctx.fillRect(0, y, cv.width, dpr);
    };
    const activate = async a => {
      rows.forEach(r => r.classList.toggle("on", r === a));
      vt.textContent = `${$(".mono", a).textContent} ${$("b", a).textContent}`; vd.textContent = a.dataset.d;
      const im = await load(a.dataset.img); if (!a.classList.contains("on")) return;
      img = im; tw && tw.kill();
      if (ux.reduce) { block = 1; draw(); return; }
      const o = { b: 42 }; block = 42; draw();
      tw = gsap.to(o, { b: 1, duration: .7, ease: "steps(9)", onUpdate: () => { block = o.b; draw(); } });
    };
    rows.forEach(a => { a.addEventListener("pointerenter", () => activate(a), sig); a.addEventListener("focus", () => activate(a), sig); });
    const ro = new ResizeObserver(() => draw()); ro.observe(cv);
    activate(rows[0]);
    if (!ux.reduce) {
      const full = typed.dataset.text; typed.textContent = "";
      gsap.set(rows, { opacity: 0, x: -14 });
      ScrollTrigger.create({ trigger: $(".services-d__win", root), start: "top 75%", once: true, onEnter: () => {
        const o = { n: 0 };
        gsap.timeline()
          .to(o, { n: full.length, duration: full.length * .045, ease: "none", onUpdate: () => (typed.textContent = full.slice(0, Math.round(o.n))) })
          .to(rows, { opacity: 1, x: 0, duration: .5, stagger: .09, ease: "power3.out" });
      } });
    }
    return () => { ac.abort(); ro.disconnect(); tw && tw.kill(); typed.textContent = typed.dataset.text; };
  });

  /* ---------- E · Túnel ---------- */
  register("services", "E", (root, ux) => {
    const cards = $$(".services-e__card", root), N = cards.length, cnt = $(".services-e__count b", root);
    const stat = ux.reduce || innerWidth < 900;
    root.classList.toggle("is-static", stat);
    if (stat) {
      if (!ux.reduce) gsap.from(cards, { y: 50, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: $(".services-e__stack", root), start: "top 85%" } });
      return () => root.classList.remove("is-static");
    }
    const cv = $(".services-e__cv", root), ctx = cv.getContext("2d");
    let t = 0, speed = 0, phase = 0, last = 0;
    const place = () => {
      let front = 0;
      cards.forEach((c, i) => {
        const z = t - i; let s, o;
        if (z < -1.5) { s = .08; o = 0; }
        else if (z < 0) { const k = (z + 1.5) / 1.5; s = .08 + .92 * Math.pow(k, 2.2); o = Math.min(1, (z + 1.5) / .7); }
        else if (z < .35) { s = 1; o = 1; }
        else { s = 1 + (z - .35) * 3.2; o = Math.max(0, 1 - (z - .35) / .55); }
        c.style.transform = `translate(-50%,-50%) scale(${s.toFixed(4)})`;
        c.style.opacity = o.toFixed(3);
        c.style.zIndex = Math.round(100 + z * 10);
        const live = z > -.25 && z < .6;
        c.style.pointerEvents = live ? "auto" : "none"; c.tabIndex = live ? 0 : -1;
        if (z > -.5) front = i;
      });
      cnt.textContent = String(Math.min(N, front + 1)).padStart(2, "0");
    };
    ScrollTrigger.create({ trigger: root, start: "top top", end: "bottom bottom", onUpdate: s => { const nt = s.progress * (N - 1 + .35); speed = Math.min(.4, Math.abs(nt - t) * 6 + speed); t = nt; place(); } });
    place();
    const stopLoop = visLoop(cv, now => {
      const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      speed *= .92; phase = (phase + dt * (.18 + speed * 6)) % 1;
      const cx = w / 2, cy = h * .54, R = 12;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * .6);
      g.addColorStop(0, "rgba(46,108,160,.35)"); g.addColorStop(1, "rgba(7,7,15,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // marcos concéntricos que vienen hacia ti
      for (let k = 0; k < R; k++) {
        const d = (k + 1 - phase) / R, sc = Math.pow(1 - d, 3.2);
        const rw = w * .02 + w * 1.25 * sc, rh = h * .02 + h * 1.25 * sc;
        ctx.strokeStyle = `rgba(153,196,228,${(.05 + .45 * sc).toFixed(3)})`; ctx.lineWidth = .6 + sc * 1.4;
        ctx.strokeRect(cx - rw / 2, cy - rh / 2, rw, rh);
      }
      // raíles hacia el punto de fuga
      ctx.strokeStyle = "rgba(153,196,228,.16)"; ctx.lineWidth = 1;
      const L = 9;
      for (let k = 0; k <= L; k++) {
        const f = k / L;
        [[f * w, 0], [f * w, h], [0, f * h], [w, f * h]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); });
      }
    });
    return () => { stopLoop(); root.classList.remove("is-static"); cards.forEach(c => { c.style.cssText = ""; c.removeAttribute("tabindex"); }); };
  });

  /* ---------- F · Circuito ---------- */
  register("services", "F", (root, ux) => {
    const board = $(".services-f__board", root), svg = $(".services-f__svg", root), g = $(".services-f__traces", root);
    const chip = $(".services-f__chip", root), nodes = $$(".services-f__node", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const NS = "http://www.w3.org/2000/svg";
    let drawn = false;
    const build = () => {
      g.innerHTML = "";
      if (getComputedStyle(svg).display === "none") return;
      const b = board.getBoundingClientRect(), c = chip.getBoundingClientRect();
      nodes.forEach((n, i) => {
        const r = n.getBoundingClientRect(), left = i < 3, k = i % 3;
        const sy = c.top - b.top + c.height * (.28 + k * .22), ny = r.top - b.top + r.height / 2;
        const sx = (left ? c.left : c.right) - b.left, nx = (left ? r.right : r.left) - b.left;
        const mx = sx + (nx - sx) * (.35 + k * .15);
        const d = `M${sx},${sy} H${mx} V${ny} H${nx}`;
        const base = document.createElementNS(NS, "path"); base.setAttribute("d", d);
        const pulse = document.createElementNS(NS, "path"); pulse.setAttribute("d", d); pulse.setAttribute("class", "pulse");
        pulse.style.animationDelay = `${-(i * .43).toFixed(2)}s`;
        const dot = document.createElementNS(NS, "circle"); dot.setAttribute("cx", nx); dot.setAttribute("cy", ny); dot.setAttribute("r", 4);
        g.append(base, pulse, dot); n._pulse = pulse;
        if (!drawn && !ux.reduce) { const L = base.getTotalLength(); base.style.strokeDasharray = L; base.style.strokeDashoffset = L; pulse.style.opacity = 0; }
      });
    };
    build();
    const ro = new ResizeObserver(() => { build(); if (drawn) $$("path", g).forEach(p => { p.style.strokeDashoffset = ""; }); }); ro.observe(board);
    nodes.forEach(n => {
      const on = () => n._pulse && n._pulse.classList.add("hot"), off = () => n._pulse && n._pulse.classList.remove("hot");
      n.addEventListener("pointerenter", on, sig); n.addEventListener("pointerleave", off, sig);
      n.addEventListener("focus", on, sig); n.addEventListener("blur", off, sig);
    });
    if (!ux.reduce) {
      gsap.from(chip, { scale: .7, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: board, start: "top 75%" } });
      gsap.from(nodes, { opacity: 0, x: (i) => (i < 3 ? -40 : 40), duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: board, start: "top 75%" } });
      ScrollTrigger.create({ trigger: board, start: "top 65%", once: true, onEnter: () => {
        drawn = true;
        if (!g.firstChild) return;
        gsap.to($$("path:not(.pulse)", g), { strokeDashoffset: 0, duration: 1.4, stagger: .08, ease: "power2.inOut" });
        gsap.to($$("path.pulse", g), { opacity: 1, duration: .4, delay: 1.2 });
      } });
    } else drawn = true;
    return () => { ac.abort(); ro.disconnect(); g.innerHTML = ""; };
  });
})();
