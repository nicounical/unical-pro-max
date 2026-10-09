/* ===== 08 · Clientes (5 versiones) ===== */
(() => {
  const { register, $, $$ } = UX;
  const ALL = ["toyota","coca-cola","bankinter","generali","sony-music","monster-energy","philip-morris","mitsubishi-electric","otis","porcelanosa","rituals","wella","los40","rfef","cruz-roja","avoris","catai","csl-vifor","dial","elanco","fibratel","leo-pharma","longi","straumann","ucb"];
  const NAMES = { toyota: "Toyota", "coca-cola": "Coca-Cola", bankinter: "Bankinter", generali: "Generali", "sony-music": "Sony Music", "monster-energy": "Monster Energy", "philip-morris": "Philip Morris", "mitsubishi-electric": "Mitsubishi Electric", otis: "Otis", porcelanosa: "Porcelanosa", rituals: "Rituals", wella: "Wella", los40: "LOS40", rfef: "RFEF", "cruz-roja": "Cruz Roja", avoris: "Ávoris", catai: "Catai", "csl-vifor": "CSL Vifor", dial: "Dial", elanco: "Elanco", fibratel: "Fibratel", "leo-pharma": "LEO Pharma", longi: "LONGi", straumann: "Straumann", ucb: "UCB" };
  const name = n => NAMES[n] || n;
  // Los PNG disponibles son favicons de 16–128 px: usamos el nombre como marca tipográfica.
  const img = (n, decorative) => `<span class="clients-word"${decorative ? ' aria-hidden="true"' : ""} data-n="${n}">${name(n)}</span>`;
  const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };

  /* ---------- A · Marquesina veloz ---------- */
  register("clients", "A", (root, ux) => {
    const half = Math.ceil(ALL.length / 2);
    const tracks = $$("[data-logos]", root);
    tracks.forEach(t => {
      const list = t.dataset.logos === "a" ? ALL.slice(0, half) : ALL.slice(half);
      t.innerHTML = list.map(n => `<div class="clients-a__tile">${img(n)}</div>`).join("") + list.map(n => `<div class="clients-a__tile" aria-hidden="true">${img(n, true)}</div>`).join("");
    });
    if (ux.reduce) return;
    gsap.from($(".clients-a__h", root), { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    const rows = tracks.map((el, i) => ({ el, x: i ? -200 : 0, dir: i % 2 ? 1 : -1 }));
    let vel = 0;
    const tick = () => {
      if (!onScreen(root)) return;
      const v = ux.lenis ? ux.lenis.velocity || 0 : 0;
      vel += (v - vel) * .2;
      const boost = Math.min(Math.abs(vel) * .35, 18), sign = vel < -0.05 ? -1 : 1;
      rows.forEach(r => {
        const w = r.el.scrollWidth / 2; if (!w) return;
        r.x += (.6 + boost) * r.dir * sign;
        if (r.x <= -w) r.x += w; if (r.x > 0) r.x -= w;
        r.el.style.transform = `translate3d(${r.x}px,0,0) skewX(${gsap.utils.clamp(-8, 8, -vel * .25)}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  /* ---------- B · Foco de luz ---------- */
  register("clients", "B", (root, ux) => {
    const list = ALL.slice(0, 20), stage = $(".clients-b__stage", root);
    $(".clients-b__grid--base", root).innerHTML = list.map(n => `<li>${img(n)}</li>`).join("");
    $(".clients-b__grid--lit", root).innerHTML = list.map(n => `<li>${img(n, true)}</li>`).join("");
    if (ux.reduce) { stage.style.setProperty("--r", "2000px"); return; }
    gsap.from($$(".clients-b__grid--base li", root), { opacity: 0, duration: .8, stagger: { each: .03, from: "random" }, scrollTrigger: { trigger: stage, start: "top 85%" } });
    const r = { v: 0 };
    const setR = v => gsap.to(r, { v, duration: .8, ease: "expo.out", overwrite: true, onUpdate: () => stage.style.setProperty("--r", r.v + "px") });
    const pos = { x: 50, y: 50 };
    const qx = gsap.quickTo(pos, "x", { duration: .35, ease: "power3", onUpdate: () => stage.style.setProperty("--mx", pos.x + "px") });
    const qy = gsap.quickTo(pos, "y", { duration: .35, ease: "power3", onUpdate: () => stage.style.setProperty("--my", pos.y + "px") });
    const move = e => { const b = stage.getBoundingClientRect(); qx(e.clientX - b.left); qy(e.clientY - b.top); };
    const enter = () => setR(Math.max(180, stage.offsetWidth * .16));
    const leave = () => setR(0);
    let auto = null;
    if (ux.fine) {
      stage.addEventListener("pointermove", move); stage.addEventListener("pointerenter", enter); stage.addEventListener("pointerleave", leave);
    } else {
      // Táctil: el foco se pasea solo mientras la rejilla está a la vista
      let t = 0;
      auto = () => {
        if (!onScreen(stage)) return;
        t += .012; const b = stage.getBoundingClientRect();
        stage.style.setProperty("--mx", b.width * (.5 + .4 * Math.sin(t)) + "px");
        stage.style.setProperty("--my", b.height * (.5 + .35 * Math.sin(t * 1.7)) + "px");
      };
      stage.style.setProperty("--r", Math.max(120, innerWidth * .3) + "px");
      gsap.ticker.add(auto);
    }
    return () => {
      stage.removeEventListener("pointermove", move); stage.removeEventListener("pointerenter", enter); stage.removeEventListener("pointerleave", leave);
      auto && gsap.ticker.remove(auto); stage.style.setProperty("--r", "0px");
    };
  });

  /* ---------- C · Contador + huecos que giran ---------- */
  register("clients", "C", (root, ux) => {
    const slotsL = $(".clients-c__slots--l", root), slotsR = $(".clients-c__slots--r", root);
    const shown = ALL.slice(0, 8), pool = ALL.slice(8);
    slotsL.innerHTML = shown.slice(0, 4).map(n => `<div class="clients-c__slot">${img(n, true)}</div>`).join("");
    slotsR.innerHTML = shown.slice(4).map(n => `<div class="clients-c__slot">${img(n, true)}</div>`).join("");
    if (ux.reduce) return;
    const slots = $$(".clients-c__slot", root);
    gsap.from(slots, { scale: .6, opacity: 0, duration: 1, stagger: { each: .06, from: "center" }, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    let k = 0;
    const id = setInterval(() => {
      if (!onScreen(root) || document.hidden) return;
      k = (k + 3) % slots.length;
      const im = $(".clients-word", slots[k]), next = pool.shift();
      pool.push(im.dataset.n);
      gsap.timeline()
        .to(im, { rotateX: 90, duration: .35, ease: "power2.in" })
        .add(() => { im.dataset.n = next; im.textContent = name(next); })
        .fromTo(im, { rotateX: -90 }, { rotateX: 0, duration: .55, ease: "back.out(1.8)" });
    }, 1400);
    return () => clearInterval(id);
  });

  /* ---------- D · Muro de estadio ---------- */
  register("clients", "D", (root, ux) => {
    const wall = $(".clients-d__wall", root);
    const rot = (a, n) => a.slice(n).concat(a.slice(0, n));
    wall.innerHTML = [0, 6, 12, 18].map(s => {
      const l = rot(ALL, s); const cells = l.map(n => `<div class="clients-d__cell">${img(n, true)}</div>`).join("");
      return `<div class="clients-d__row">${cells}${cells}</div>`;
    }).join("");
    if (ux.reduce) return;
    const rows = $$(".clients-d__row", root).map((el, i) => ({ el, x: -i * 120, sp: (.45 + i * .12) * (i % 2 ? 1 : -1) }));
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

  /* ---------- E · Por sector ---------- */
  register("clients", "E", (root, ux) => {
    const tabs = $$(".clients-e__tabs [role=tab]", root), panels = $$(".clients-e__panel", root);
    panels.forEach(p => (p.innerHTML = p.dataset.l.split(",").map(n => `<div class="clients-e__tile">${img(n)}</div>`).join("")));
    const select = (i, focus) => {
      tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
      panels.forEach((p, j) => (p.hidden = j !== i));
      if (focus) tabs[i].focus();
      if (!ux.reduce) gsap.fromTo($$(".clients-e__tile", panels[i]), { y: 30, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: .7, stagger: .05, ease: "expo.out" });
    };
    const bar = $(".clients-e__tabs", root);
    const onClick = e => { const t = e.target.closest("[role=tab]"); if (t) select(tabs.indexOf(t)); };
    const onKey = e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (map[e.key]) { e.preventDefault(); select((i + map[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    };
    bar.addEventListener("click", onClick); bar.addEventListener("keydown", onKey);
    if (!ux.reduce) ScrollTrigger.create({ trigger: root, start: "top 65%", once: true, onEnter: () => select(0) });
    return () => { bar.removeEventListener("click", onClick); bar.removeEventListener("keydown", onKey); };
  });
})();
