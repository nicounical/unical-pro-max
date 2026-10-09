/* Servicios · 5 versiones */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Paneles apilados (adaptado de «Services Stack», 21st.dev) ---------- */
  const ARTS = {
    print: `
      <g data-s="0"><path class="ink" d="M60 310V70h200v240"/><rect class="ink" x="90" y="95" width="140" height="130"/><path class="hair" d="M90 127h140M90 160h140M90 193h140M125 95v130M160 95v130M195 95v130"/></g>
      <g data-s="1"><path class="hair" d="M80 86h160"/><rect class="inkf" x="86" y="80" width="26" height="12" rx="2" data-x="118"/><path class="acc" d="M98 112h124"/><path class="acc" d="M98 145h96"/><path class="acc" d="M98 210h124"/></g>
      <g data-s="2"><rect class="ink" x="300" y="170" width="110" height="80" rx="4"/><path class="hair" d="M300 182Q355 198 410 182M300 238Q355 222 410 238"/><path class="ink" d="M318 250v56M392 250v56"/></g>
      <g data-s="3"><rect class="ink" x="436" y="232" width="56" height="74" rx="3"/><rect class="ink" x="466" y="214" width="56" height="92" rx="3"/></g>
      <g data-s="4"><path class="ink" d="M585 310V150"/><rect class="ink" x="530" y="58" width="100" height="92" rx="4"/><rect class="accf" x="542" y="70" width="48" height="30" rx="3"/></g>
      <g data-s="5"><path class="ink" d="M20 310V22h262"/><path class="hair" d="M250 22v52"/><circle class="acc" cx="250" cy="82" r="7"/></g>`,
    van: `
      <g data-s="0"><path class="hair" d="M120 296h392M120 286v20M512 286v20"/><text x="280" y="290">4,85 m</text></g>
      <g data-s="1"><path class="ink" d="M120 250V150q0-20 20-20h200l70 50h62q20 0 20 20v50z"/><path class="ink" d="M352 142l40 35h-62v-35z"/><circle class="ink" cx="190" cy="252" r="22"/><circle class="ink" cx="430" cy="252" r="22"/></g>
      <g data-s="2"><path class="acc" d="M126 222C220 178 300 252 400 204S500 196 486 206"/></g>
      <g data-s="3"><rect class="accf" x="124" y="186" width="200" height="56" rx="6" opacity=".18"/></g>
      <g data-s="4"><path class="hair" d="M24 112V76q0-9 9-9h90l30 22h26q9 0 9 9v14z"/><path class="hair" d="M456 66V30q0-9 9-9h90l30 22h26q9 0 9 9v14z"/></g>
      <g data-s="5"><path class="inkf" d="M352 142l40 35h-62v-35z" opacity=".75"/></g>`,
    stand: `
      <g data-s="0"><path class="hair" d="M90 270L320 226L550 270L320 314Z"/></g>
      <g data-s="1"><path class="ink" d="M150 262V70M490 262V70M150 70H490M150 100H490"/></g>
      <g data-s="2"><rect class="ink" x="180" y="112" width="280" height="118" rx="3"/><circle class="accf" cx="320" cy="164" r="30"/><path class="acc" d="M200 212C262 182 380 240 440 200"/></g>
      <g data-s="3"><path class="hair" d="M220 100L192 156M220 100L248 156M420 100L392 156M420 100L448 156"/><circle class="inkf" cx="220" cy="100" r="6"/><circle class="inkf" cx="420" cy="100" r="6"/></g>
      <g data-s="4" data-x="-130"><path class="ink" d="M650 292v-50h62l26 26v24z"/><circle class="ink" cx="670" cy="294" r="9"/><circle class="ink" cx="718" cy="294" r="9"/></g>
      <g data-s="5"><circle class="acc" cx="566" cy="64" r="28"/><path class="ink" d="M552 64l10 11l18-20"/></g>`,
    store: `
      <g data-s="0"><path class="ink" d="M440 306V164h62v142M428 164h86"/><path class="hair" d="M440 206h62M440 248h62"/></g>
      <g data-s="1"><path class="ink" d="M60 306V92h320v214"/><path class="ink" d="M48 62h344l-22 30H70z"/><rect class="hair" x="82" y="112" width="276" height="170"/><path class="hair" d="M112 132l44 44M134 132l66 66"/></g>
      <g data-s="2"><rect class="ink" x="530" y="214" width="84" height="84"/><path class="ink" d="M530 214l20-20h84l-20 20M614 214l20-20v84l-20 20"/></g>
      <g data-s="3"><path class="hair" d="M220 0v18"/><rect class="ink" x="170" y="18" width="100" height="32" rx="6"/><path class="acc" d="M190 34h48M228 24l12 10l-12 10"/></g>
      <g data-s="4"><text x="150" y="208" style="font-size:44px;fill-opacity:1;font-family:Poppins,sans-serif;font-weight:800;letter-spacing:6px">OPEN</text></g>
      <g data-s="5"><circle class="accf" cx="110" cy="250" r="9"/><circle class="accf" cx="140" cy="262" r="6"/><circle class="accf" cx="320" cy="140" r="10"/><circle class="accf" cx="336" cy="166" r="6"/><circle class="accf" cx="300" cy="258" r="8"/></g>`
  };

  register("services", "A", (root, ux) => {
    $$("[data-art]", root).forEach(el => {
      if (!el.firstElementChild) el.innerHTML = `<svg class="art" viewBox="0 0 640 320" role="img" aria-label="Ilustración animada del servicio">${ARTS[el.dataset.art]}</svg>`;
    });
    const panels = $$("[data-panel]", root), cards = panels.map(p => $(".services-a__card", p));
    const bgs = $$(".services-a__sticky > img", root), titles = $$(".services-a__titles span", root), count = $(".services-a__count b", root);
    let active = -1;
    const setActive = i => {
      if (i === active) return; active = i;
      bgs.forEach((b, j) => b.classList.toggle("on", j === i));
      titles.forEach((t, j) => t.classList.toggle("on", j === i));
      count.textContent = String(i + 1).padStart(2, "0");
    };
    setActive(0);
    const arts = $$(".services-a__card", root).map(card => {
      const svg = $("svg", card), chips = $$(".services-a__chips li", card), groups = $$("[data-s]", svg);
      const strokes = $$(".ink,.hair,.acc", svg).filter(e => e.tagName !== "text" && e.tagName !== "g");
      const fills = $$(".inkf,.accf,text", svg);
      return { card, svg, chips, groups, strokes, fills };
    });
    if (ux.reduce) {
      arts.forEach(a => { a.strokes.forEach(s => { s.style.strokeDasharray = ""; s.style.strokeDashoffset = ""; }); gsap.set(a.fills, { opacity: (i, el) => +(el.getAttribute("opacity") || 1), scale: 1 }); });
      ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: () => { let idx = 0; panels.forEach((p, i) => { if (p.getBoundingClientRect().top <= innerHeight * .5) idx = i; }); setActive(idx); } });
      return;
    }
    ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      onUpdate: () => {
        const vh = innerHeight; let idx = 0;
        panels.forEach((p, i) => {
          if (p.getBoundingClientRect().top <= vh * .5) idx = i;
          const next = panels[i + 1];
          const covered = next ? Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh)) : 0;
          cards[i].style.opacity = Math.max(0, 1 - covered * 1.4);
          cards[i].style.transform = `scale(${1 - covered * .07}) translateY(${-covered * 50}px)`;
        });
        setActive(idx);
      }
    });
    arts.forEach(({ card, svg, chips, groups, strokes, fills }) => {
      strokes.forEach(s => { s.setAttribute("pathLength", 1); s.style.strokeDasharray = "1 1"; s.style.strokeDashoffset = 1; });
      gsap.set(fills, { opacity: 0, scale: .4, transformOrigin: "50% 50%", transformBox: "fill-box" });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: .4, paused: true });
      groups.forEach((g, i) => {
        const at = i * 1.35;
        tl.call(() => chips.forEach((c, j) => c.classList.toggle("on", j === i)), null, at);
        const gs = $$(".ink,.hair,.acc", g).filter(e => e.tagName !== "text");
        if (gs.length) tl.to(gs, { strokeDashoffset: 0, duration: 1, stagger: .08, ease: "power2.inOut" }, at);
        const gf = $$(".inkf,.accf,text", g);
        if (gf.length) tl.to(gf, { opacity: (k, el) => +(el.getAttribute("opacity") || 1), scale: 1, duration: .6, stagger: .06, ease: "back.out(2)" }, at + .4);
        $$("[data-x]", g).forEach(m => tl.fromTo(m, { x: 0 }, { x: +m.dataset.x, duration: 1.2, ease: "power1.inOut" }, at + .1));
        if (g.hasAttribute("data-x")) tl.fromTo(g, { x: 160 }, { x: +g.dataset.x, duration: 1.1, ease: "power3.out" }, at);
      });
      tl.to({}, { duration: 1.6 });
      tl.call(() => chips.forEach(c => c.classList.remove("on")));
      tl.to(svg, { opacity: 0, duration: .5 });
      tl.set(strokes, { strokeDashoffset: 1 }); tl.set(fills, { opacity: 0, scale: .4 }); tl.set(svg, { opacity: 1 });
      ScrollTrigger.create({ trigger: card, start: "top 85%", end: "bottom 10%", onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
    });
    return () => cards.forEach(c => { c.style.opacity = ""; c.style.transform = ""; });
  });

  /* ---------- B · Acordeón ---------- */
  register("services", "B", (root, ux) => {
    const cols = $$(".services-b__col", root);
    const ac = new AbortController(), sig = { signal: ac.signal };
    const set = i => cols.forEach((c, j) => { c.classList.toggle("on", j === i); c.setAttribute("aria-expanded", j === i); });
    cols.forEach((c, i) => {
      c.addEventListener("click", () => set(i), sig);
      c.addEventListener("focus", () => set(i), sig);
      if (ux.fine) c.addEventListener("pointerenter", () => set(i), sig);
    });
    if (!ux.reduce) {
      gsap.from(cols, { yPercent: 40, opacity: 0, clipPath: "inset(100% 0 0 0 round 18px)", duration: 1.3, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: $(".services-b__cols", root), start: "top 80%" } });
      gsap.from($(".services-b__head .big", root), { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    }
    return () => ac.abort();
  });

  /* ---------- C · Lista gigante con media que sigue al cursor ---------- */
  register("services", "C", (root, ux) => {
    const items = $$(".services-c__list li", root);
    if (!ux.reduce) {
      gsap.from($$(".services-c__t", root), { yPercent: 100, opacity: 0, duration: 1.1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: $(".services-c__list", root), start: "top 80%" } });
    }
    if (!ux.fine || ux.reduce) return;
    const ac = new AbortController(), sig = { signal: ac.signal };
    const fl = $(".services-c__float", root), fin = $(".services-c__float-in", root), list = $(".services-c__list", root);
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

  /* ---------- D · Carrusel 3D ---------- */
  register("services", "D", (root, ux) => {
    const ring = $(".services-d__ring", root), cards = $$(".services-d__card", root), stage = $(".services-d__stage", root);
    const n = cards.length, step = 360 / n;
    let radius = 0, scrollRot = 0, dragRot = 0, velo = 0;
    const layout = () => {
      const w = cards[0].offsetWidth;
      radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.18);
      cards.forEach((c, i) => (c.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`));
      render();
    };
    const render = () => {
      const rot = scrollRot + dragRot;
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`;
      cards.forEach((c, i) => {
        const a = ((i * step + rot) % 360 + 540) % 360 - 180; // -180..180, 0 = de frente
        c.style.opacity = Math.max(.25, Math.cos(a * Math.PI / 180) * .9 + .1).toFixed(3);
        c.style.filter = `brightness(${(.55 + .45 * Math.max(0, Math.cos(a * Math.PI / 180))).toFixed(3)})`;
      });
    };
    layout();
    const ac = new AbortController(), sig = { signal: ac.signal };
    addEventListener("resize", layout, sig);
    // Arrastrar
    let down = false, sx = 0, base = 0;
    stage.addEventListener("pointerdown", e => { down = true; sx = e.clientX; base = dragRot; stage.setPointerCapture(e.pointerId); stage.style.cursor = "grabbing"; }, sig);
    stage.addEventListener("pointermove", e => { if (!down) return; const nv = base + (e.clientX - sx) * .25; velo = nv - dragRot; dragRot = nv; render(); }, sig);
    const up = () => {
      if (!down) return; down = false; stage.style.cursor = "";
      if (ux.reduce) return;
      const target = dragRot + velo * 12;
      const snap = Math.round((target + scrollRot) / step) * step - scrollRot;
      gsap.to({ v: dragRot }, { v: snap, duration: 1.1, ease: "expo.out", onUpdate() { dragRot = this.targets()[0].v; render(); } });
    };
    stage.addEventListener("pointerup", up, sig); stage.addEventListener("pointercancel", up, sig);
    stage.addEventListener("keydown", e => { if (e.key === "ArrowRight") { dragRot -= step; render(); } if (e.key === "ArrowLeft") { dragRot += step; render(); } }, sig);
    stage.tabIndex = 0; stage.setAttribute("aria-label", "Carrusel de servicios: usa las flechas para girar");
    if (!ux.reduce) {
      ScrollTrigger.create({
        trigger: $(".services-d__pin", root), start: "top top", end: "+=160%", pin: true, scrub: true,
        onUpdate: s => { scrollRot = -s.progress * 360 * .875; render(); }
      });
      gsap.from(ring, { scale: .6, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    }
    return () => ac.abort();
  });

  /* ---------- E · Bento ---------- */
  register("services", "E", (root, ux) => {
    if (ux.reduce) return;
    const cells = $$(".services-e__cell", root);
    gsap.set(cells, { clipPath: "inset(100% 0% 0% 0% round 18px)" });
    ScrollTrigger.batch(cells, {
      start: "top 88%", once: true,
      onEnter: b => gsap.to(b, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.3, stagger: .1, ease: "expo.inOut" })
    });
    gsap.from($(".services-e__head .big", root), { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
  });
})();
