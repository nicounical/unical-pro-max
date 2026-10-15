/* Por qué elegirnos (#cifras) · ronda 11
   Cinco versiones nuevas de tipografía cinética, sin fotos ni vídeo (petición: «en esta sección no tienen que haber fotos»).
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

  const fig = d => d.s + (d.u ? `<small>${d.u}</small>` : "");
  const pad2 = n => String(n).padStart(2, "0");

  /* ---------- A · Cinta gigante ----------
     Dos cintas CSS en bucle (sentidos opuestos). El JS solo decide si corren: --run pasa a
     «running» mientras la versión se ve, la pestaña está activa y no se ha pausado. */
  register("numbers", "A", (root, ux) => {
    if (ux.reduce) { root.classList.add("is-static"); return; }
    let seen = false;
    const set = () => root.style.setProperty("--run", seen && !pz.paused() ? "running" : "paused");
    const pz = pauser(root, () => set());
    const stop = live(root, () => { seen = true; set(); }, () => { seen = false; set(); });
    return () => { stop(); pz.off(); root.style.removeProperty("--run"); };
  });

  /* ---------- B · Rodillos ----------
     Seis ranuras alineadas a la derecha; cada una es un rodillo con « +.0123456789» que gira
     hasta su carácter y ajusta su ancho (dígito, «+», punto o vacía). */
  const REEL = [" ", "+", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const kind = c => c === " " ? "x" : c === "+" ? "p" : c === "." ? "s" : "d";
  const WIDTH = { d: .64, p: .56, s: .26, x: 0 };
  register("numbers", "B", (root, ux) => run(root, ux, () => {
    const figEl = ux.$(".num-b__fig", root), lab = ux.$(".num-b__lab span", root), dots = ux.$$(".num-b__dots li", root);
    const N = 6;
    figEl.innerHTML = Array.from({ length: N }, () => `<span class="num-b__slot"><span class="num-b__reel">${REEL.map(c => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("")}</span></span>`).join("") + `<span class="num-b__unit">m²</span>`;
    const slots = ux.$$(".num-b__slot", figEl), reels = ux.$$(".num-b__reel", figEl), unit = ux.$(".num-b__unit", figEl);
    const show = (i, first) => {
      const d = DATA[i], chars = d.s.padStart(N, " ").split("");
      chars.forEach((c, k) => {
        const dur = first ? 0 : 1.1 + k * .12;
        gsap.to(reels[k], { yPercent: -100 * REEL.indexOf(c) / REEL.length, duration: dur, ease: "power3.inOut", overwrite: true });
        gsap.to(slots[k], { width: WIDTH[kind(c)] + "em", duration: first ? 0 : .7, ease: "power2.inOut", overwrite: true });
      });
      gsap.to(unit, { autoAlpha: d.u ? 1 : 0, duration: first ? 0 : .4, delay: first ? 0 : .8 });
      dots.forEach((li, k) => li.classList.toggle("is-on", k === i));
      if (first) { lab.textContent = d.l; return; }
      gsap.timeline().to(lab, { yPercent: -110, duration: .35, ease: "power2.in" })
        .add(() => { lab.textContent = d.l; }).fromTo(lab, { yPercent: 110 }, { yPercent: 0, duration: .55, ease: "expo.out" });
    };
    show(0, true);
    const tl = gsap.timeline({ repeat: -1 });
    [1, 2, 3, 0].forEach(i => tl.to({}, { duration: 3.4 }).add(() => show(i)));
    return tl;
  }));

  /* ---------- C · Filas a sangre ----------
     El relleno azul (degradado recortado al texto) recorre cada cifra por turnos; al final se
     vacían todas a la vez y vuelve a empezar. */
  register("numbers", "C", (root, ux) => run(root, ux, () => {
    const rows = ux.$$(".num-c__row", root), nums = rows.map(r => ux.$(".num-c__n", r));
    const on = i => rows.forEach((r, k) => r.classList.toggle("is-on", k === i));
    const tl = gsap.timeline({ repeat: -1 });
    nums.forEach((n, i) => tl.add(() => on(i)).to(n, { backgroundPosition: "0% 0%", duration: 1.2, ease: "power2.inOut" }).to({}, { duration: .9 }));
    tl.add(() => on(-1)).to(nums, { backgroundPosition: "100% 0%", duration: .7, ease: "power2.in", stagger: .08 }, "+=.8").to({}, { duration: .4 });
    return tl;
  }));

  /* ---------- D · Órbita ----------
     Una vuelta completa del anillo dura 48 s y contiene cuatro rondas de los cuatro datos, así el
     bucle no salta. El tramo del anillo del dato activo se ilumina. */
  register("numbers", "D", (root, ux) => run(root, ux, () => {
    const txt = ux.$(".num-d__txt", root), spans = ux.$$(".num-d__txt tspan", root);
    const f = ux.$(".num-d__fig", root), l = ux.$(".num-d__lab", root);
    const set = i => { f.innerHTML = fig(DATA[i]); l.textContent = DATA[i].l; spans.forEach((s, k) => s.classList.toggle("is-on", k === i)); };
    set(0);
    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo(txt, { rotation: 0 }, { rotation: -360, svgOrigin: "300 300", duration: 48, ease: "none" }, 0);
    for (let k = 1; k <= 16; k++) {
      const i = k % 4, at = k * 3 - 1;
      tl.to([f, l], { autoAlpha: 0, filter: "blur(8px)", y: -10, duration: .4, ease: "power2.in" }, at)
        .add(() => set(i), at + .4)
        .fromTo([f, l], { autoAlpha: 0, filter: "blur(8px)", y: 12 }, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: .6, ease: "expo.out", stagger: .06, immediateRender: false }, at + .42);
    }
    return tl;
  }));

  /* ---------- E · Barrido ----------
     Cada dato aparece primero en contorno; la franja azul lo barre de izquierda a derecha y lo deja
     relleno; al retirarse (también hacia la derecha) descubre el siguiente dato en contorno. */
  register("numbers", "E", (root, ux) => run(root, ux, () => {
    const stage = ux.$(".num-e__stage", root), edge = ux.$(".num-e__edge", root), idx = ux.$(".num-e__idx", root);
    const [base, top] = ux.$$(".num-e__layer", root);
    const put = (layer, i) => { ux.$(".num-e__fig", layer).innerHTML = fig(DATA[i]); ux.$(".num-e__lab", layer).textContent = DATA[i].l; };
    const W = () => stage.clientWidth;
    put(base, 0); put(top, 0); idx.textContent = "01 / 04";
    const tl = gsap.timeline({ repeat: -1 });
    DATA.forEach((_, i) => {
      const next = (i + 1) % DATA.length;
      tl.add(() => { put(top, i); idx.textContent = `${pad2(i + 1)} / 04`; })
        .to({}, { duration: .9 })
        .fromTo(top, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" })
        .fromTo(edge, { x: -10 }, { x: () => W(), duration: 1.1, ease: "power3.inOut" }, "<")
        .add(() => put(base, next), "+=.1")
        .to({}, { duration: 1.5 })
        .fromTo(top, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 100%)", duration: 1, ease: "power3.inOut", immediateRender: false })
        .fromTo(edge, { x: -10 }, { x: () => W(), duration: 1, ease: "power3.inOut", immediateRender: false }, "<");
    });
    return tl;
  }));
})();
