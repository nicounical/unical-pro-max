/* Por qué elegirnos (#cifras) · ronda 8
   Cinco versiones sin fotos ni vídeo (petición: «en esta sección no tienen que haber fotos»).
   La animación arranca sola cuando la versión entra en pantalla, sigue en bucle y se pausa fuera de
   pantalla, con la pestaña oculta o con el botón «Pausar animación». Nada depende del scroll.
   Con prefers-reduced-motion la versión añade .is-static y enseña todos los datos quietos. */
(() => {
  const { register } = UX;

  const DATA = [
    { s: "+25", u: "", l: "años de experiencia" },
    { s: "+3.000", u: "", l: "proyectos entregados" },
    { s: "+40", u: "", l: "sectores atendidos" },
    { s: "1.000", u: "m²", l: "de planta propia en Cabrera de Mar" }
  ];

  // Llama a play() mientras la versión se ve y la pestaña está activa; pause() en caso contrario.
  const live = (root, play, pause) => {
    let seen = false, vis = !document.hidden;
    const sync = () => (seen && vis ? play() : pause());
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }, { threshold: .2 });
    const onVis = () => { vis = !document.hidden; sync(); };
    io.observe(root);
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  };

  // Botón «Pausar animación»: una pausa del usuario que manda sobre la visibilidad.
  const pauser = (root, onChange) => {
    const b = root.querySelector(".num-pz");
    if (!b) return { paused: () => false, off: () => {} };
    let on = false;
    const click = () => {
      on = !on;
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "Reanudar animación" : "Pausar animación";
      onChange();
    };
    b.addEventListener("click", click);
    return { paused: () => on, off: () => b.removeEventListener("click", click) };
  };

  const fontReady = () => (document.fonts && document.fonts.load ? document.fonts.load("900 100px Poppins").catch(() => {}) : Promise.resolve());

  /* Motor común: build() crea (con la fuente ya cargada) una línea de tiempo en bucle; frame(t)
     es opcional y se llama en cada fotograma con un reloj propio. Ambos corren solo mientras la
     versión se ve, la pestaña está activa y el usuario no ha pausado. */
  const run = (root, ux, build, frame) => {
    if (ux.reduce) { root.classList.add("is-static"); return; }
    let tl = null, seen = false, dead = false, t = 0, ticking = false;
    const tick = (time, dt) => { t += Math.min(dt, 50) / 1000; frame(t); };
    const pz = pauser(root, () => sync());
    const sync = () => {
      const go = seen && !pz.paused();
      if (tl) go ? tl.resume() : tl.pause();
      if (frame && go !== ticking) { ticking = go; go ? gsap.ticker.add(tick) : gsap.ticker.remove(tick); }
    };
    const stop = live(root, () => { seen = true; sync(); }, () => { seen = false; sync(); });
    fontReady().then(() => { if (dead) return; tl = build(); if (tl) tl.pause(); sync(); });
    return () => { dead = true; stop(); pz.off(); if (ticking) gsap.ticker.remove(tick); if (tl) tl.kill(); };
  };

  // «+3.000» → <span class="m"><span class="c">+</span></span>… (cada carácter tras su máscara)
  const masked = d => [...d.s].map(c => `<span class="m"><span class="c">${c}</span></span>`).join("") +
    (d.u ? `<small><span class="m"><span class="c">${d.u}</span></span></small>` : "");

  /* ---------- A · Cifra protagonista ----------
     Las cuatro cifras viven apiladas en la misma celda; cada una sube letra a letra tras su
     máscara, se queda y sale hacia arriba mientras entra la siguiente. El filete de la lista
     hace de reloj del dato activo. */
  register("numbers", "A", (root, ux) => run(root, ux, () => {
    const stage = ux.$(".num-a__stage", root), rows = ux.$$(".num-a__list>div", root);
    stage.innerHTML = `<p class="num-a__fig num-a__stack">${DATA.map(d => `<span>${masked(d)}</span>`).join("")}</p>` +
      `<p class="num-a__lab num-a__stack">${DATA.map(d => `<span>${d.l}</span>`).join("")}</p>`;
    const figs = ux.$$(".num-a__fig>span", stage), labs = ux.$$(".num-a__lab>span", stage);
    const bars = rows.map(r => { const b = document.createElement("i"); b.className = "num-a__bar"; r.append(b); return b; });
    const chars = figs.map(f => ux.$$(".c", f));
    root.classList.add("is-run");
    gsap.set(chars.flat(), { yPercent: 112 });
    gsap.set(labs, { yPercent: 110 });
    const HOLD = 3.4, mark = i => rows.forEach((r, k) => r.classList.toggle("on", k === i));
    const tl = gsap.timeline({ repeat: -1 });
    DATA.forEach((_, i) => {
      const t0 = i * HOLD;
      tl.call(mark, [i], t0)
        .to(chars[i], { yPercent: 0, duration: .9, stagger: .05, ease: "expo.out" }, t0)
        .to(labs[i], { yPercent: 0, duration: .8, ease: "expo.out" }, t0 + .18)
        .fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: "none" }, t0)
        .to(chars[i], { yPercent: -112, duration: .55, stagger: .03, ease: "expo.in" }, t0 + HOLD - .62)
        .to(labs[i], { yPercent: -110, duration: .5, ease: "expo.in" }, t0 + HOLD - .55)
        .set(chars[i], { yPercent: 112 }, t0 + HOLD)
        .set(labs[i], { yPercent: 110 }, t0 + HOLD)
        .set(bars[i], { scaleX: 0 }, t0 + HOLD);
    });
    return tl;
  }));

  /* ---------- B · Frase que se enciende ----------
     Cada tramo de la frase se ilumina por turnos (los leídos quedan en gris medio); al final
     la frase entera queda encendida un momento y vuelve a empezar. */
  register("numbers", "B", (root, ux) => run(root, ux, () => {
    const segs = ux.$$(".num-b__seg", root), STEP = 2.5;
    const state = i => segs.forEach((s, k) => {
      s.classList.toggle("on", i < 0 || k === i);
      s.classList.toggle("was", i >= 0 && k < i);
    });
    root.classList.add("is-run");
    state(0);
    const tl = gsap.timeline({ repeat: -1 });
    segs.forEach((_, i) => tl.call(state, [i], i * STEP));
    tl.call(state, [-1], segs.length * STEP).to({}, { duration: 3 });
    return tl;
  }));

  /* ---------- C · Mil puntos ----------
     Retícula de 50 × 20 casillas en <canvas>. Cuatro pasos de 4,4 s:
       0  25 casillas (un año cada una) aparecen salteadas
       1  se suman hasta 40 (un sector cada una)
       2  la planta entera se enciende en diagonal (1.000 m²)
       3  tres barridos de izquierda a derecha: 1.000 → 2.000 → +3.000 proyectos
     Las casillas de cada paso son las primeras de una permutación fija, así 25 ⊂ 40 ⊂ 1.000. */
  register("numbers", "C", (root, ux) => {
    const COLS = 50, ROWS = 20, N = COLS * ROWS, STEP = 4.4;
    const cv = ux.$(".num-c__cv", root), ctx = cv.getContext("2d");
    const fig = ux.$(".num-c__fig", root), lab = ux.$(".num-c__lab", root), key = ux.$(".num-c__key", root), txt = ux.$(".num-c__txt", root);
    // permutación con semilla fija (mulberry32) para que el dibujo sea siempre el mismo
    let seed = 7;
    const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const perm = [...Array(N).keys()];
    for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    const rank = new Array(N); perm.forEach((c, k) => { rank[c] = k; });
    const TXT = [
      ["+25", "años de experiencia", "25 casillas · un año cada una"],
      ["+40", "sectores atendidos", "40 casillas · un sector cada una"],
      ["1.000<small>m²</small>", "de planta propia en Cabrera de Mar", "1.000 casillas · un metro cuadrado cada una"],
      ["1.000", "proyectos entregados", "La planta, llena tres veces"]
    ];
    let W = 0, cell = 0, dpr = 1, shownStep = -1, shownSweep = -1;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.parentElement.clientWidth; cell = W / COLS;
      cv.width = Math.round(W * dpr); cv.height = Math.round(cell * ROWS * dpr);
      cv.style.height = cell * ROWS + "px";
    };
    const sm = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
    const setText = (i, figHtml) => {
      fig.innerHTML = figHtml ?? TXT[i][0]; lab.textContent = TXT[i][1]; key.textContent = TXT[i][2];
      gsap.fromTo(txt.children, { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, stagger: .07, ease: "expo.out", overwrite: true });
    };
    const draw = t => {
      const step = Math.floor(t / STEP) % 4, l = t % STEP;
      if (step !== shownStep) { shownStep = step; shownSweep = 0; setText(step); }
      const sweepNow = step === 3 ? (l > 2.6 ? 3 : l > 1.3 ? 2 : 1) : 0;
      if (step === 3 && sweepNow !== shownSweep) { shownSweep = sweepNow; setText(3, sweepNow === 3 ? "+3.000" : sweepNow === 2 ? "2.000" : "1.000"); }
      const fade = step === 3 ? Math.min(1, (STEP - l) / .6) : 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, cell * ROWS);
      const s = Math.max(2, cell * .66), o = (cell - s) / 2;
      for (let c = 0; c < N; c++) {
        const x = c % COLS, y = (c / COLS) | 0, k = rank[c];
        let a = 0, white = 0;
        if (step === 0) a = k < 25 ? sm((l - .2 - k * .07) / .35) : 0;
        else if (step === 1) a = k < 25 ? 1 : k < 40 ? sm((l - .2 - (k - 25) * .08) / .35) : 0;
        else if (step === 2) a = k < 40 ? 1 : .5 * sm((l - .3 - (x + y) / (COLS + ROWS) * 1.8) / .4);
        else {
          const d = x / COLS * .9;
          const s1 = sm((l - .1 - d) / .3), s2 = sm((l - 1.4 - d) / .3), s3 = sm((l - 2.7 - d) / .3);
          a = k < 40 ? 1 : .5 + .5 * s1; white = s2 * .55 + s3 * .45;
        }
        // casilla apagada
        ctx.fillStyle = "rgba(255,255,255,.07)";
        ctx.fillRect(x * cell + o, y * cell + o, s, s);
        if (a <= 0) continue;
        const r = Math.round(153 + (255 - 153) * white), g = Math.round(196 + (255 - 196) * white), b = Math.round(228 + (255 - 228) * white);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * fade})`;
        ctx.fillRect(x * cell + o, y * cell + o, s, s);
      }
    };
    if (ux.reduce) { root.classList.add("is-static"); return; }
    size();
    const ro = new ResizeObserver(() => { size(); });
    ro.observe(cv.parentElement);
    const off = run(root, ux, () => null, draw);
    return () => { ro.disconnect(); off && off(); };
  });

  /* ---------- D · Una línea, 25 años ----------
     Un marcador recorre una regla de 25 tramos; los contadores avanzan con él. Al llegar aparece
     el dato de planta y certificación; después el marcador rebobina y todo vuelve a empezar. */
  register("numbers", "D", (root, ux) => {
    const ticks = ux.$(".num-d__ticks", root);
    if (!ticks.children.length) ticks.innerHTML = "<i></i>".repeat(26);
    return run(root, ux, () => {
      const vals = ux.$$(".num-d__v", root), late = ux.$(".num-d__late", root);
      const fill = ux.$(".num-d__fill", root), mark = ux.$(".num-d__mark", root);
      const st = { p: 0 };
      const apply = () => {
        const p = st.p;
        vals.forEach(v => { v.textContent = v.dataset.pre + ux.fmt(Math.round(p * +v.dataset.to)); });
        fill.style.transform = `scaleX(${p})`;
        mark.style.left = p * 100 + "%";
      };
      apply();
      gsap.set(late, { autoAlpha: 0, y: 14 });
      return gsap.timeline({ repeat: -1, repeatDelay: .3 })
        .to(st, { p: 1, duration: 6.2, ease: "power1.inOut", onUpdate: apply })
        .to(late, { autoAlpha: 1, y: 0, duration: .8, ease: "expo.out" }, "-=.3")
        .to({}, { duration: 2.8 })
        .to(late, { autoAlpha: 0, y: -10, duration: .5, ease: "power2.in" })
        .to(st, { p: 0, duration: 1.3, ease: "power2.inOut", onUpdate: apply }, "<");
    });
  });

  /* ---------- E · Bloque que recorre ----------
     Un bloque claro viaja de dato en dato; dentro lleva una copia de la retícula en tinta oscura,
     desplazada al revés, de modo que el dato que cubre cambia de color sin moverse. La posición se
     interpola entre las celdas reales en cada fotograma, así funciona igual en 4 o en 2 columnas. */
  register("numbers", "E", (root, ux) => {
    let onR = null;
    const off = run(root, ux, () => {
    const wrap = ux.$(".num-e__wrap", root), grid = ux.$(".num-e__grid", root);
    const block = ux.$(".num-e__block", root), copy = ux.$(".num-e__copy", root);
    copy.innerHTML = grid.innerHTML;
    const cells = [...grid.children], n = cells.length, st = { p: 0 };
    const rect = c => ({ x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight });
    const apply = () => {
      const i = Math.floor(st.p) % n, f = st.p - Math.floor(st.p);
      const a = rect(cells[i]), b = rect(cells[(i + 1) % n]);
      const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f, w = a.w + (b.w - a.w) * f, h = a.h + (b.h - a.h) * f;
      block.style.transform = `translate(${x}px,${y}px)`;
      block.style.width = w + "px"; block.style.height = h + "px";
      copy.style.width = wrap.offsetWidth + "px";
      copy.style.transform = `translate(${-x}px,${-y}px)`;
    };
    block.style.visibility = "visible";
    apply();
    const tl = gsap.timeline({ repeat: -1 });
    for (let i = 0; i < n; i++) tl.to({}, { duration: 2.2 }).to(st, { p: i + 1, duration: 1.05, ease: "expo.inOut", onUpdate: apply });
    tl.eventCallback("onRepeat", () => { st.p = 0; apply(); });
    onR = () => apply();
    addEventListener("resize", onR);
    return tl;
    });
    return () => { off && off(); onR && removeEventListener("resize", onR); };
  });
})();
