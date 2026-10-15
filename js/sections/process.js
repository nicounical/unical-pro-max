/* Cómo trabajamos (#proceso)
   A (ronda 5): estática, solo la entrada .rv del núcleo.
   B–F (ronda 8): la misma A con la fase activa avanzando sola, en bucle.
   La fase avanza solo con la sección en pantalla y la pestaña visible; se para con el ratón
   o el foco encima de las columnas y con el botón de pausa. Al pasar el ratón por una
   columna, esa pasa a ser la activa. Con prefers-reduced-motion se añade .is-static
   (la A tal cual, sin movimiento). */
(() => {
  const { register } = UX;
  const pad = n => String(n + 1).padStart(2, "0");

  /* Motor común: `onGo(i, prev, items)` al cambiar de fase y `onTick(i, p, items)` en cada
     fotograma con p = avance 0–1 del tiempo de la fase activa (1 si está retenida). */
  function phases(root, ux, { delay = 3.6, onGo, onTick } = {}) {
    const row = ux.$(".process-row", root), items = ux.$$(":scope > li", row);
    const num = ux.$(".process-foot__n", root), btn = ux.$(".process-pause", root);
    const ac = new AbortController(), on = { signal: ac.signal };
    let i = -1, inView = false, user = false, hold = 0, started = false;
    const go = n => {
      const prev = i;
      i = (n + items.length) % items.length;
      items.forEach((li, k) => { li.classList.toggle("is-on", k === i); li.classList.toggle("is-done", k < i); });
      num.textContent = pad(i);
      onGo && onGo(i, prev, items);
    };
    // tween vacío (no delayedCall): su progress() sí avanza de 0 a 1 durante la fase
    const timer = gsap.to({}, { duration: delay, ease: "none", paused: true, onComplete() { go(i + 1); timer.restart(); sync(); } });
    const sync = () => { (inView && !user && !hold && !document.hidden) ? timer.resume() : timer.pause(); };
    const tick = () => { if (started && onTick) onTick(i, hold ? 1 : timer.progress(), items); };
    gsap.ticker.add(tick);

    row.classList.add("is-run");
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !started) { started = true; go(0); timer.restart(); }
      sync();
    }, { threshold: .4 });
    io.observe(row);
    document.addEventListener("visibilitychange", sync, on);
    row.addEventListener("pointerleave", () => { hold &= ~1; timer.restart(); sync(); }, on);
    items.forEach((li, k) => li.addEventListener("pointerenter", e => {
      if (e.pointerType !== "mouse") return;
      hold |= 1; if (k !== i) go(k); sync();
    }, on));
    root.addEventListener("focusin", () => { hold |= 2; sync(); }, on);
    root.addEventListener("focusout", e => { if (!root.contains(e.relatedTarget)) { hold &= ~2; sync(); } }, on);
    btn.addEventListener("click", () => {
      user = !user;
      btn.setAttribute("aria-pressed", user);
      ux.$(".process-pause__t", btn).textContent = user ? "Reanudar" : "Pausar";
      sync();
    }, { signal: ac.signal });

    return () => {
      timer.kill(); io.disconnect(); ac.abort(); gsap.ticker.remove(tick);
      row.classList.remove("is-run");
      items.forEach(li => li.classList.remove("is-on", "is-done"));
    };
  }
  const staticMode = root => { root.classList.add("is-static"); return () => root.classList.remove("is-static"); };

  /* ---------- B · Línea de progreso: la barra de la fase activa se llena con el tiempo ---------- */
  register("process", "B", (root, ux) => {
    if (ux.reduce) return staticMode(root);
    const bars = ux.$$(".process-b__bar", root);
    const set = (i, p) => bars.forEach((b, k) => { b.style.transform = `scaleX(${k < i ? 1 : k === i ? p : 0})`; });
    const stop = phases(root, ux, { delay: 3.4, onTick: set });
    return () => { stop(); bars.forEach(b => (b.style.transform = "")); };
  });

  /* ---------- C · Número que se llena de abajo arriba ---------- */
  register("process", "C", (root, ux) => {
    if (ux.reduce) return staticMode(root);
    const fg = ux.$$(".process-c__fg", root);
    const set = (i, p) => fg.forEach((f, k) => {
      const v = k < i ? 1 : k === i ? gsap.parseEase("power1.inOut")(p) : 0;
      f.style.clipPath = `inset(${(1 - v) * 100}% 0 0 0)`;
    });
    const stop = phases(root, ux, { delay: 3.4, onTick: set });
    return () => { stop(); fg.forEach(f => (f.style.clipPath = "")); };
  });

  /* ---------- D · Columna que se abre (el ancho y el despliegue van por CSS) ---------- */
  register("process", "D", (root, ux) => {
    if (ux.reduce) return staticMode(root);
    return phases(root, ux, { delay: 4 });
  });

  /* ---------- E · Foco: la lámina se desliza hasta la columna activa ---------- */
  register("process", "E", (root, ux) => {
    if (ux.reduce) return staticMode(root);
    const row = ux.$(".process-row", root), spot = ux.$(".process-e__spot", root);
    let cur = -1;
    const place = (i, animate) => {
      const li = ux.$$(":scope > li", row)[i]; if (!li) return;
      const vars = { x: li.offsetLeft, y: li.offsetTop, width: li.offsetWidth, height: li.offsetHeight, opacity: 1 };
      animate ? gsap.to(spot, { ...vars, duration: .85, ease: "power3.inOut", overwrite: true }) : gsap.set(spot, vars);
    };
    const stop = phases(root, ux, { delay: 3.4, onGo: (i, prev) => { place(i, prev >= 0); cur = i; } });
    const ro = new ResizeObserver(() => cur >= 0 && place(cur, false));
    ro.observe(row);
    return () => { stop(); ro.disconnect(); gsap.set(spot, { clearProps: "all" }); };
  });

  /* ---------- F · Fase que se escribe: el texto activo aparece letra a letra ---------- */
  register("process", "F", (root, ux) => {
    if (ux.reduce) return staticMode(root);
    const paras = ux.$$(".process-f__row li p", root);
    const orig = paras.map(p => p.textContent);
    // texto completo para lectores de pantalla; las letras animadas van aparte y ocultas
    const chars = paras.map(p => {
      const t = p.textContent;
      p.innerHTML = `<span class="sr-only"></span><span aria-hidden="true">${[...t].map(c => `<span class="c">${c}</span>`).join("")}</span>`;
      p.firstChild.textContent = t;
      return [...p.lastChild.children];
    });
    let tw;
    const stop = phases(root, ux, {
      delay: 4.2,
      onGo: i => {
        tw && tw.kill();
        chars.forEach(cs => gsap.set(cs, { opacity: 1 }));
        const cs = chars[i];
        tw = gsap.fromTo(cs, { opacity: 0 }, { opacity: 1, duration: .05, ease: "none", stagger: Math.min(.03, 1.8 / cs.length) });
      }
    });
    return () => { stop(); tw && tw.kill(); paras.forEach((p, k) => { p.textContent = orig[k]; }); };
  });
})();
