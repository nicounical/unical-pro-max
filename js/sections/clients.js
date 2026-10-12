/* ===== 08 · Clientes (A = muro de estadio; B–F nuevas, ronda Selección 3) ===== */
(() => {
  const { register, $, $$ } = UX;
  const ALL = ["toyota","coca-cola","bankinter","generali","sony-music","monster-energy","philip-morris","mitsubishi-electric","otis","porcelanosa","rituals","wella","los40","rfef","cruz-roja","avoris","catai","csl-vifor","dial","elanco","fibratel","leo-pharma","longi","straumann","ucb"];
  const NAMES = { toyota: "Toyota", "coca-cola": "Coca-Cola", bankinter: "Bankinter", generali: "Generali", "sony-music": "Sony Music", "monster-energy": "Monster Energy", "philip-morris": "Philip Morris", "mitsubishi-electric": "Mitsubishi Electric", otis: "Otis", porcelanosa: "Porcelanosa", rituals: "Rituals", wella: "Wella", los40: "LOS40", rfef: "RFEF", "cruz-roja": "Cruz Roja", avoris: "Ávoris", catai: "Catai", "csl-vifor": "CSL Vifor", dial: "Dial", elanco: "Elanco", fibratel: "Fibratel", "leo-pharma": "LEO Pharma", longi: "LONGi", straumann: "Straumann", ucb: "UCB" };
  const name = n => NAMES[n] || n;
  // Los PNG disponibles son favicons de 16–128 px: usamos el nombre como marca tipográfica.
  const word = (n, decorative) => `<span class="clients-word"${decorative ? ' aria-hidden="true"' : ""}>${name(n)}</span>`;
  const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const listText = "Algunos de nuestros clientes: " + ALL.map(name).join(", ") + ".";
  const fillList = root => $$("[data-clients-list]", root).forEach(p => (p.textContent = listText));
  const seeded = s => () => ((s = (s * 9301 + 49297) % 233280) / 233280);

  /* ---------- A · Muro de estadio ---------- */
  register("clients", "A", (root, ux) => {
    fillList(root);
    const wall = $(".clients-a__wall", root);
    const rot = (a, n) => a.slice(n).concat(a.slice(0, n));
    wall.innerHTML = [0, 6, 12, 18].map(s => {
      const cells = rot(ALL, s).map(n => `<div class="clients-a__cell">${word(n, true)}</div>`).join("");
      return `<div class="clients-a__row">${cells}${cells}</div>`;
    }).join("");
    if (ux.reduce) return;
    const rows = $$(".clients-a__row", root).map((el, i) => ({ el, x: -i * 120, sp: (.45 + i * .12) * (i % 2 ? 1 : -1) }));
    const tick = () => {
      if (!onScreen(root)) return;
      rows.forEach(r => {
        const w = r.el.scrollWidth / 2; if (!w) return;
        r.x += r.sp; if (r.x <= -w) r.x += w; if (r.x > 0) r.x -= w;
        r.el.style.transform = `translate3d(${r.x}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    gsap.fromTo(wall, { rotateX: 58, scale: 1.3 }, { rotateX: 24, scale: 1.05, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    return () => gsap.ticker.remove(tick);
  });


  const SECTOR = { toyota: "automoción", "coca-cola": "bebidas", bankinter: "banca", generali: "seguros", "sony-music": "música", "monster-energy": "bebidas", "philip-morris": "gran consumo", "mitsubishi-electric": "climatización", otis: "ascensores", porcelanosa: "cerámica", rituals: "cosmética", wella: "belleza", los40: "radio", rfef: "deporte", "cruz-roja": "ONG", avoris: "viajes", catai: "viajes", "csl-vifor": "farma", dial: "radio", elanco: "salud animal", fibratel: "telecom", "leo-pharma": "farma", longi: "energía solar", straumann: "salud dental", ucb: "farma" };
  const pad2 = n => String(n).padStart(2, "0");
  const isDesk = () => matchMedia("(min-width: 861px)").matches;
  // Ejecuta fn solo mientras la sección está en pantalla (para bucles e intervalos)
  const whileVisible = (root, on, off) => {
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? on() : off()), { rootMargin: "60px" });
    io.observe(root);
    return () => { io.disconnect(); off(); };
  };

  /* ---------- B · Frase viva: «Trabajamos para ___» ---------- */
  register("clients", "B", (root, ux) => {
    const slot = $(".clients-b__slot", root), list = $(".clients-b__all", root);
    const n = $(".clients-b__n", root), sec = $(".clients-b__sec", root);
    list.innerHTML = ALL.map((c, i) => `<li><button type="button" data-i="${i}">${name(c)}</button></li>`).join("");
    const btns = $$("button", list);
    let cur = 0, timer = 0, hold = 0;
    const show = (i, animate = !ux.reduce) => {
      if (i === cur && slot.querySelector(".clients-b__word")) return;
      const old = slot.querySelector(".clients-b__word:last-child");
      const nw = document.createElement("span"); nw.className = "clients-b__word"; nw.textContent = name(ALL[i]);
      slot.appendChild(nw);
      slot.style.width = nw.offsetWidth + "px";
      btns.forEach((b, j) => b.setAttribute("aria-current", j === i));
      n.textContent = pad2(i + 1); sec.textContent = SECTOR[ALL[i]];
      cur = i;
      if (!animate || !old) { if (old) old.remove(); return; }
      gsap.fromTo(nw, { yPercent: 110 }, { yPercent: 0, duration: .7, ease: "expo.out" });
      gsap.to(old, { yPercent: -110, duration: .6, ease: "expo.inOut", onComplete: () => old.remove() });
    };
    slot.innerHTML = "";
    show(0, false);
    const next = () => { if (Date.now() < hold) return; show((cur + 1) % ALL.length); };
    const pick = e => { const b = e.target.closest("button"); if (!b) return; hold = Date.now() + 6000; show(+b.dataset.i); };
    list.addEventListener("click", pick);
    list.addEventListener("focusin", pick);
    list.addEventListener("pointerover", pick);
    const ro = new ResizeObserver(() => { const w = slot.querySelector(".clients-b__word:last-child"); if (w) slot.style.width = w.offsetWidth + "px"; });
    ro.observe(root);
    const stop = ux.reduce ? () => {} : whileVisible(root, () => { clearInterval(timer); timer = setInterval(next, 1900); }, () => clearInterval(timer));
    return () => { stop(); ro.disconnect(); list.removeEventListener("click", pick); list.removeEventListener("focusin", pick); list.removeEventListener("pointerover", pick); };
  });

  /* ---------- C · Acreditaciones: tarjetas colgadas que se balancean ---------- */
  register("clients", "C", (root, ux) => {
    const rail = $(".clients-c__rail", root), view = $(".clients-c__view", root);
    rail.innerHTML = ALL.map((c, i) => `<li class="clients-c__badge"><i class="clients-c__strap" aria-hidden="true"></i><i class="clients-c__clip" aria-hidden="true"></i><div class="clients-c__card"><span class="clients-c__kind" aria-hidden="true">Cliente</span><span class="clients-c__name">${name(c)}</span><span class="clients-c__sec">${SECTOR[c]}</span><span class="clients-c__foot" aria-hidden="true"><img src="assets/img/logo/logo-unical.png" alt="" width="800" height="98" loading="lazy"><span>Nº ${pad2(i + 1)}</span></span></div></li>`).join("");
    if (ux.reduce) return;
    const badges = $$(".clients-c__badge", root).map((el, i) => ({ el, a: 0, w: 0, k: .8 + ((i * 37) % 10) / 25 }));
    let push = 0, lastX = view.scrollLeft;
    if (isDesk()) {
      gsap.to(rail, { x: () => Math.min(0, innerWidth - rail.scrollWidth), ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: .6, invalidateOnRefresh: true, onUpdate: s => { push += gsap.utils.clamp(-6, 6, s.getVelocity() / 260); } } });
    }
    const onSwipe = () => { push += gsap.utils.clamp(-6, 6, (view.scrollLeft - lastX) / 6); lastX = view.scrollLeft; };
    view.addEventListener("scroll", onSwipe, { passive: true });
    const nudge = e => { const b = badges.find(x => x.el === e.target.closest(".clients-c__badge")); if (b) b.w += (e.movementX || 1) > 0 ? 1.6 : -1.6; };
    rail.addEventListener("pointerover", nudge);
    // Péndulo sencillo: muelle hacia 0 + amortiguación; el scroll aporta el empujón
    const tick = () => {
      const f = push; push *= .6;
      badges.forEach(b => { b.w += -b.a * .035 - f * .12 * b.k; b.w *= .93; b.a += b.w; b.el.style.transform = `rotate(${b.a.toFixed(2)}deg)`; });
    };
    const stop = whileVisible(root, () => gsap.ticker.add(tick), () => gsap.ticker.remove(tick));
    gsap.from($$(".clients-c__card", root), { y: -40, rotate: () => gsap.utils.random(-12, 12), autoAlpha: 0, duration: 1.1, ease: "elastic.out(1,.45)", stagger: .04, scrollTrigger: { trigger: view, start: "top 80%" } });
    return () => { stop(); view.removeEventListener("scroll", onSwipe); rail.removeEventListener("pointerover", nudge); };
  });

  /* ---------- D · Columnas en movimiento ---------- */
  register("clients", "D", (root, ux) => {
    fillList(root);
    const cols = $(".clients-d__cols", root);
    const groups = [[], [], []]; ALL.forEach((c, i) => groups[i % 3].push(c));
    const item = c => `<div class="clients-d__item"><b>${name(c)}</b><span>${SECTOR[c]}</span></div>`;
    cols.innerHTML = groups.map(g => `<div class="clients-d__col">${g.map(item).join("")}${g.map(item).join("")}</div>`).join("");
    if (ux.reduce) return;
    $$(".clients-d__col", root).forEach((c, i) => {
      const up = i % 2 === 0;
      gsap.fromTo(c, { yPercent: up ? 0 : -42 }, { yPercent: up ? -42 : 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: .4 + i * .25 } });
    });
  });

  /* ---------- E · Una a una: la marca ocupa la pantalla ---------- */
  const FEATURED_E = ["toyota", "coca-cola", "bankinter", "generali", "sony-music", "monster-energy", "porcelanosa", "rituals", "rfef", "cruz-roja", "leo-pharma", "straumann"];
  register("clients", "E", (root, ux) => {
    fillList(root);
    const stage = $(".clients-e__stage", root), n = $(".clients-e__n", root), sec = $(".clients-e__sec", root), bar = $(".clients-e__track b", root);
    stage.innerHTML = FEATURED_E.map(c => `<div class="clients-e__name"><span>${name(c)}</span></div>`).join("");
    const rows = $$(".clients-e__name", root), spans = rows.map(r => r.firstElementChild);
    if (ux.reduce || !isDesk() && innerHeight < 560) { root.classList.add("clients-e--static"); return () => root.classList.remove("clients-e--static"); }
    // Cada nombre a su tamaño máximo: ancho de pantalla con margen, sin pasar del 70 % del alto disponible
    const fit = () => {
      const W = stage.clientWidth - 2 * parseFloat(getComputedStyle(rows[0]).paddingLeft || 0), H = stage.clientHeight;
      rows.forEach(r => { r.style.fontSize = "100px"; const w = r.firstElementChild.offsetWidth || 1; r.style.fontSize = Math.min((W * .96) / w * 100, H * .7) + "px"; });
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(stage);
    gsap.set(spans.slice(1), { yPercent: 110 });
    const steps = spans.length - 1;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6, onUpdate: s => {
      const i = Math.min(steps, Math.round(s.progress * steps));
      n.textContent = pad2(i + 1); sec.textContent = SECTOR[FEATURED_E[i]]; bar.style.transform = `scaleX(${(i + 1) / spans.length})`;
    } } });
    for (let i = 1; i < spans.length; i++) tl.to(spans[i - 1], { yPercent: -110, ease: "power2.in", duration: .5 }, i - 1).to(spans[i], { yPercent: 0, ease: "power2.out", duration: .5 }, i - .55);
    bar.style.transform = `scaleX(${1 / spans.length})`;
    return () => ro.disconnect();
  });

  /* ---------- F · Roll-ups que se despliegan ---------- */
  const FEATURED_F = ["toyota", "coca-cola", "bankinter", "sony-music", "porcelanosa", "rituals", "rfef", "leo-pharma"];
  register("clients", "F", (root, ux) => {
    const row = $(".clients-f__row", root), more = $(".clients-f__more", root);
    row.innerHTML = FEATURED_F.map((c, i) => `<li class="clients-f__unit"><div class="clients-f__banner"><span class="clients-f__k" aria-hidden="true">Cliente ${pad2(i + 1)}</span><span class="clients-f__name">${name(c)}</span><span class="clients-f__sec">${SECTOR[c]}</span><i class="clients-f__band" aria-hidden="true"></i></div><i class="clients-f__base" aria-hidden="true"></i><i class="clients-f__feet" aria-hidden="true"></i></li>`).join("");
    const rest = ALL.filter(c => !FEATURED_F.includes(c)).map(name);
    more.innerHTML = `Y también ${rest.slice(0, -1).join(", ")} y ${rest[rest.length - 1]}. <strong>+3.000 proyectos</strong> para marcas que vuelven.`;
    if (ux.reduce) return;
    const banners = $$(".clients-f__banner", root), texts = $$(".clients-f__k, .clients-f__name, .clients-f__sec", root);
    gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%" } })
      .from(banners, { scaleY: 0, duration: 1.1, ease: "power4.out", stagger: { each: .08, from: "center" } })
      .from(texts, { autoAlpha: 0, y: 14, duration: .5, stagger: .02 }, .5);
  });
})();
