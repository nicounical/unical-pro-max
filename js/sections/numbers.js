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

  /* Bucle rAF que solo corre mientras el elemento está en pantalla */
  const whileVisible = (el, frame) => {
    let raf = 0, on = false;
    const tick = t => { raf = 0; if (!on) return; frame(t); raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); });
    io.observe(el);
    return () => { on = false; io.disconnect(); cancelAnimationFrame(raf); };
  };

  /* B · HUD de cabina: diales que se cargan, barrido de escáner y mira que sigue al ratón */
  register("numbers", "B", (root, ux) => {
    const hud = ux.$(".num-b__hud", root), arcs = ux.$$(".num-b__arc", root);
    const pct = a => +getComputedStyle(a.closest(".num-b__g")).getPropertyValue("--p");
    if (ux.reduce) return;
    arcs.forEach(a => gsap.fromTo(a, { strokeDashoffset: 100 }, { strokeDashoffset: 100 - pct(a), duration: 2, ease: "power3.inOut", scrollTrigger: { trigger: hud, start: "top 80%", once: true } }));
    gsap.from(ux.$$(".num-b__g", root), { autoAlpha: 0, y: 30, stagger: .12, duration: .9, ease: "power3.out", scrollTrigger: { trigger: hud, start: "top 80%", once: true } });
    gsap.from(ux.$$(".num-b__c", root), { scale: 2.4, autoAlpha: 0, duration: .8, ease: "expo.out", stagger: .06, scrollTrigger: { trigger: hud, start: "top 85%", once: true } });
    gsap.to(ux.$(".num-b__scan", root), { y: () => hud.offsetHeight + 10, duration: 3.2, ease: "none", repeat: -1, repeatDelay: .6 });
    if (!ux.fine) return;
    const move = e => { const r = hud.getBoundingClientRect(); hud.style.setProperty("--x", e.clientX - r.left + "px"); hud.style.setProperty("--y", e.clientY - r.top + "px"); };
    hud.addEventListener("pointermove", move);
    return () => hud.removeEventListener("pointermove", move);
  });

  /* C · Decodificador: las cifras se descifran y las tarjetas se iluminan bajo el ratón */
  register("numbers", "C", (root, ux) => {
    const nums = ux.$$(".num-c__n", root), cards = ux.$$(".num-c__card", root), bars = ux.$$(".num-c__bars i", root);
    bars.forEach((b, i) => b.style.setProperty("--h", Math.round(20 + 60 * Math.pow(i / (bars.length - 1), 1.6) + (i % 3) * 6) + "%"));
    const timers = [];
    if (!ux.reduce) {
      const G = "0123456789#%<>/_=+*";
      const decode = el => {
        const fin = el.dataset.dec; let f = 0; const total = 26;
        const id = setInterval(() => {
          f++;
          el.innerHTML = [...fin].map((ch, i) => (ch === " " || f / total > (i + 1) / fin.length) ? ch : `<span class="num-c__g">${G[(Math.random() * G.length) | 0]}</span>`).join("");
          if (f >= total) { clearInterval(id); el.textContent = fin; }
        }, 45);
        timers.push(id);
      };
      nums.forEach(n => ScrollTrigger.create({ trigger: n, start: "top 88%", once: true, onEnter: () => decode(n) }));
      gsap.from(cards, { autoAlpha: 0, y: 40, scale: .97, stagger: .1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ux.$(".num-c__grid", root), start: "top 85%", once: true } });
      gsap.from(bars, { scaleY: 0, stagger: .04, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ux.$(".num-c__bars", root), start: "top 90%", once: true } });
    }
    const move = e => cards.forEach(c => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); });
    if (ux.fine) root.addEventListener("pointermove", move);
    return () => { timers.forEach(clearInterval); root.removeEventListener("pointermove", move); nums.forEach(n => (n.textContent = n.dataset.dec)); };
  });

  /* D · Holograma: la cifra elegida se proyecta en 3D sobre una plataforma */
  register("numbers", "D", (root, ux) => {
    const data = [["+25", "años de experiencia"], ["+3.000", "proyectos entregados"], ["+40", "sectores atendidos"], ["3M·AVERY", "instaladores certificados"]];
    const tabs = ux.$$(".num-d__tabs button", root), stack = ux.$(".num-d__stack", root), cap = ux.$(".num-d__cap", root), holo = ux.$(".num-d__holo", root), stage = ux.$(".num-d__stage", root);
    const LAYERS = 7; let cur = 0, timer = 0;
    const show = i => {
      cur = i;
      stack.classList.toggle("is-word", i === 3);
      stack.innerHTML = Array.from({ length: LAYERS }, (_, k) => `<span style="transform:translateZ(${(k - LAYERS + 1) * 5}px)">${data[i][0]}</span>`).join("");
      cap.textContent = "// " + data[i][1];
      tabs.forEach((t, k) => t.setAttribute("aria-selected", k === i));
      if (!ux.reduce) { holo.classList.remove("is-glitch"); void holo.offsetWidth; holo.classList.add("is-glitch"); }
    };
    const auto = () => { clearInterval(timer); if (!ux.reduce) timer = setInterval(() => show((cur + 1) % data.length), 3600); };
    const click = e => { const b = e.target.closest("button"); if (!b) return; show(+b.dataset.i); auto(); };
    const key = e => {
      const k = tabs.indexOf(document.activeElement); if (k < 0) return;
      const n = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!n) return; e.preventDefault(); const j = (k + n + tabs.length) % tabs.length; tabs[j].focus(); show(j); auto();
    };
    const tl = ux.$(".num-d__tabs", root);
    tl.addEventListener("click", click); tl.addEventListener("keydown", key);
    show(0); auto();
    let stop = () => {};
    if (!ux.reduce) {
      let tx = 0, ty = 0, rx = 0, ry = 0;
      const mv = e => { const r = stage.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * 40; ty = ((e.clientY - r.top) / r.height - .5) * -24; };
      if (ux.fine) root.addEventListener("pointermove", mv);
      const loop = whileVisible(stage, t => {
        const idle = Math.sin(t / 1400) * 12;
        rx += ((ux.fine ? tx : 0) + idle - rx) * .06; ry += (ty - ry) * .06;
        holo.style.transform = `rotateY(${rx}deg) rotateX(${ry + 8}deg) translateY(${Math.sin(t / 900) * 6}px)`;
      });
      stop = () => { loop(); root.removeEventListener("pointermove", mv); };
    }
    return () => { clearInterval(timer); stop(); tl.removeEventListener("click", click); tl.removeEventListener("keydown", key); };
  });

  /* E · Terminal: las líneas se escriben solas al llegar */
  register("numbers", "E", (root, ux) => {
    const lines = ux.$$(".num-e__l", root);
    if (ux.reduce) return;
    gsap.set(lines, { "--w": "0%" });
    const tl = gsap.timeline({ scrollTrigger: { trigger: ux.$(".num-e__term", root), start: "top 75%", once: true } });
    lines.forEach((l, i) => {
      const n = l.textContent.length;
      tl.to(l, { "--w": "100%", duration: Math.min(.55, .012 * n + .1), ease: `steps(${Math.max(4, n)})` }, "+=.08");
    });
  });

  /* F · Matriz LED: rótulo de puntos que se desplaza; los LED se encienden más cerca del ratón */
  register("numbers", "F", (root, ux) => {
    const cv = ux.$(".num-f__cv", root), ctx = cv.getContext("2d");
    const MSG = "   +25 AÑOS  ·  +3.000 PROYECTOS  ·  +40 SECTORES  ·  3M · AVERY CERTIFICADOS   ";
    let W, H, cell, rows, cols, map, mapW, dpr, mx = -1e4, my = -1e4, off = 0;
    const build = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      rows = 15; cell = H / (rows + 2); cols = Math.ceil(W / cell) + 1;
      // rasteriza el texto a 15 filas de alto
      const o = document.createElement("canvas"), oc = o.getContext("2d");
      oc.font = `900 ${rows}px Poppins, sans-serif`;
      mapW = Math.ceil(oc.measureText(MSG).width); o.width = mapW; o.height = rows;
      oc.font = `900 ${rows}px Poppins, sans-serif`; oc.fillStyle = "#fff"; oc.textBaseline = "alphabetic"; oc.fillText(MSG, 0, rows - 1.5);
      const d = oc.getImageData(0, 0, mapW, rows).data; map = new Uint8Array(mapW * rows);
      for (let i = 0; i < map.length; i++) map[i] = d[i * 4 + 3] > 110 ? 1 : 0;
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const r0 = cell * .34, y0 = cell * 1.5, start = Math.floor(off);
      for (let c = 0; c < cols; c++) {
        const mc = (start + c) % mapW, x = c * cell + cell / 2 - (off % 1) * cell;
        for (let r = 0; r < rows; r++) {
          const y = y0 + r * cell, on = map[r * mapW + mc];
          const dd = Math.hypot(x - mx, y - my), near = Math.max(0, 1 - dd / 160);
          if (on) { ctx.fillStyle = `rgba(${170 + near * 85 | 0},${210 + near * 45 | 0},255,1)`; ctx.shadowColor = "rgba(153,196,228,.9)"; ctx.shadowBlur = 8 + near * 10; }
          else { ctx.fillStyle = `rgba(153,196,228,${.07 + near * .25})`; ctx.shadowBlur = 0; }
          ctx.beginPath(); ctx.arc(x, y, r0 * (on ? 1 + near * .35 : 1), 0, 6.283); ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    };
    build();
    if (ux.reduce) { off = 0; draw(); return; }
    let last = 0;
    const stop = whileVisible(cv, t => { const dt = Math.min(50, t - (last || t)); last = t; off = (off + dt * .012) % mapW; draw(); });
    const mv = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const lv = () => { mx = my = -1e4; };
    const rs = () => build();
    cv.parentElement.addEventListener("pointermove", mv); cv.parentElement.addEventListener("pointerleave", lv);
    addEventListener("resize", rs);
    document.fonts && document.fonts.ready.then(() => build());
    return () => { stop(); removeEventListener("resize", rs); cv.parentElement.removeEventListener("pointermove", mv); cv.parentElement.removeEventListener("pointerleave", lv); };
  });

  /* =========== Ronda «Impacto sin tecnología» · G–K =========== */

  /* G · Cartel suizo: la cifra gigante sube por máscara y se desplaza con el scroll */
  register("numbers", "G", (root, ux) => {
    if (ux.reduce) return;
    const giant = ux.$(".num-g__giant", root);
    const chars = ux.splitChars(ux.$(".num-g__digits", root));
    const tl = gsap.timeline({ scrollTrigger: { trigger: giant, start: "top 85%", once: true } });
    tl.from(ux.$(".num-g__plus", root), { yPercent: 60, opacity: 0, duration: .9, ease: "expo.out" })
      .from(chars, { yPercent: 100, opacity: 0, duration: 1.1, stagger: .07, ease: "expo.out" }, "<.05")
      .from(ux.$(".num-g__cap", root), { y: 24, opacity: 0, duration: .8, ease: "expo.out" }, "<.3");
    gsap.fromTo(giant, { xPercent: 4 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(ux.$$(".num-g__rule", root), { scaleX: 0, duration: 1.2, stagger: .12, ease: "expo.inOut", scrollTrigger: { trigger: ux.$(".num-g__row", root), start: "top 88%", once: true } });
    gsap.from(ux.$$(".num-g__row b, .num-g__row li > span", root), { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out", delay: .3, scrollTrigger: { trigger: ux.$(".num-g__row", root), start: "top 88%", once: true } });
  });

  /* H · Columnas de foto: cortinas que se abren de abajo arriba con zoom de la foto */
  register("numbers", "H", (root, ux) => {
    if (ux.reduce) return;
    const cols = ux.$$(".num-h__col", root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: ux.$(".num-h__cols", root), start: "top 80%", once: true } });
    cols.forEach((c, i) => {
      tl.fromTo(ux.$(".num-h__ph", c), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, i * .12)
        .fromTo(ux.$("img", c), { scale: 1.35 }, { scale: 1.05, duration: 1.8, ease: "expo.out" }, i * .12)
        .from(ux.$$(".num-h__txt > *", c), { y: 40, opacity: 0, duration: .9, stagger: .08, ease: "expo.out" }, i * .12 + .6);
    });
    cols.forEach((c, i) => gsap.to(ux.$("img", c), { yPercent: i % 2 ? -6 : 6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } }));
  });

  /* I · Revista: foto con parallax dentro del marco y texto que entra por líneas */
  register("numbers", "I", (root, ux) => {
    if (ux.reduce) return;
    const img = ux.$(".num-i__frame img", root);
    gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(ux.$(".num-i__frame", root), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: root, start: "top 75%", once: true } });
    const words = ux.splitWords(ux.$(".num-i__title", root));
    gsap.from(words, { yPercent: 60, opacity: 0, duration: 1, stagger: .04, ease: "expo.out", scrollTrigger: { trigger: ux.$(".num-i__title", root), start: "top 85%", once: true } });
    gsap.from(ux.$(".num-i__big", root), { xPercent: -30, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ux.$(".num-i__drop", root), start: "top 85%", once: true } });
    gsap.from(ux.$$(".num-i__body, .num-i__facts li", root), { y: 30, opacity: 0, duration: .9, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ux.$(".num-i__drop", root), start: "top 85%", once: true } });
  });

  /* J · Pliegos apilados: cada pliego se queda pegado y el anterior se hunde un poco */
  register("numbers", "J", (root, ux) => {
    if (ux.reduce) return;
    const sheets = ux.$$(".num-j__sheet", root);
    sheets.forEach((s, i) => {
      const next = sheets[i + 1];
      if (next) gsap.to(s, { scale: .94, filter: "brightness(.7)", ease: "none", scrollTrigger: { trigger: next, start: "top 75%", end: "top 20%", scrub: true } });
      gsap.from(ux.$("img", s), { scale: 1.25, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "top 30%", scrub: true } });
      gsap.from(ux.$(".num-j__n b", s), { yPercent: 40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 70%", once: true } });
    });
  });

  /* K · Marquesina con fotos: las filas se desplazan en sentidos opuestos con el scroll */
  register("numbers", "K", (root, ux) => {
    if (ux.reduce) return;
    ux.$$(".num-k__row", root).forEach((r, i) => {
      const dir = +r.dataset.dir || 1;
      const dist = () => Math.max(0, r.scrollWidth - root.clientWidth);
      gsap.fromTo(r, { x: () => dir > 0 ? -dist() * .9 : 0 }, { x: () => dir > 0 ? 0 : -dist() * .9, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: .6, invalidateOnRefresh: true } });
    });
    gsap.from(ux.$$(".num-k__row i", root), { scale: 0, duration: 1, stagger: .05, ease: "back.out(1.6)", scrollTrigger: { trigger: ux.$(".num-k__rows", root), start: "top 85%", once: true } });
  });
})();
