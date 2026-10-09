/* Servicios · 10 versiones (A–J) · contenido de la home v29 (6 servicios) */
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
    event: `
      <g data-s="0"><rect class="ink" x="150" y="60" width="340" height="200" rx="4"/><path class="ink" d="M172 260v44M468 260v44"/></g>
      <g data-s="1"><circle class="hair" cx="200" cy="105" r="10"/><circle class="hair" cx="260" cy="105" r="10"/><circle class="hair" cx="320" cy="105" r="10"/><circle class="hair" cx="380" cy="105" r="10"/><circle class="hair" cx="440" cy="105" r="10"/><circle class="hair" cx="230" cy="160" r="10"/><circle class="hair" cx="290" cy="160" r="10"/><circle class="hair" cx="350" cy="160" r="10"/><circle class="hair" cx="410" cy="160" r="10"/><circle class="accf" cx="320" cy="215" r="14"/></g>
      <g data-s="2"><path class="ink" d="M70 306V74M570 306V74"/><path class="accf" d="M74 78h40v86l-20-13-20 13z"/><path class="accf" d="M526 78h40v86l-20-13-20 13z"/></g>
      <g data-s="3"><path class="hair" d="M120 18L206 120M520 18L434 120"/><circle class="inkf" cx="120" cy="18" r="7"/><circle class="inkf" cx="520" cy="18" r="7"/></g>
      <g data-s="4"><circle class="ink" cx="292" cy="242" r="9"/><path class="ink" d="M278 290q14-34 28 0"/><circle class="ink" cx="348" cy="242" r="9"/><path class="ink" d="M334 290q14-34 28 0"/></g>
      <g data-s="5"><circle class="acc" cx="604" cy="40" r="24"/><path class="ink" d="M592 40l9 10l15-17"/></g>`,
    letters: `
      <g data-s="0"><path class="ink" d="M40 306V58h560v248"/><path class="hair" d="M40 104h560M40 262h560"/></g>
      <g data-s="1"><path class="ink" d="M150 136v92M212 136v92M150 182h62"/><rect class="ink" x="240" y="136" width="72" height="92" rx="36"/><path class="ink" d="M340 136v92h58"/><path class="ink" d="M418 228l34-92l34 92M430 196h44"/></g>
      <g data-s="2"><path class="hair" d="M159 145v92M221 145v92M159 191h62"/><rect class="hair" x="249" y="145" width="72" height="92" rx="36"/><path class="hair" d="M349 145v92h58"/><path class="hair" d="M427 237l34-92l34 92"/></g>
      <g data-s="3"><rect class="hair" x="128" y="118" width="386" height="132" rx="6"/></g>
      <g data-s="4"><path class="acc" d="M146 244h356"/><circle class="accf" cx="181" cy="252" r="4"/><circle class="accf" cx="276" cy="252" r="4"/><circle class="accf" cx="369" cy="252" r="4"/><circle class="accf" cx="452" cy="252" r="4"/></g>
      <g data-s="5"><rect class="ink" x="520" y="272" width="64" height="26" rx="4"/><path class="hair" d="M532 285h40"/></g>`,
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
    const set = i => cols.forEach((c, j) => { c.classList.toggle("on", j === i); $(".services-b__hit", c).setAttribute("aria-expanded", j === i); });
    cols.forEach((c, i) => {
      $(".services-b__hit", c).addEventListener("click", () => set(i), sig);
      c.addEventListener("focusin", () => set(i), sig);
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
    stage.addEventListener("pointerdown", e => { if (e.target.closest("a")) return; down = true; sx = e.clientX; base = dragRot; stage.setPointerCapture(e.pointerId); stage.style.cursor = "grabbing"; }, sig);
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
        onUpdate: s => { scrollRot = -s.progress * 360 * (n - 1) / n; render(); }
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

  /* ---------- F · Del boceto al resultado ---------- */
  const F_TABS = [
    { tab: "Impresión", href: "impresion.html", img: "assets/img/servicios/publicidad-exterior.webp", n: "Gran formato", t: "Impresión", d: "Vallas, lonas, telas y vinilo a cualquier tamaño con impresión UV de alta resolución.", chips: ["Vallas", "Lonas", "Telas", "Vinilo", "Impresión UV"], box: [26, 10, 108, 78], lw: "ANCHO", lh: "ALTO", ref: "REF · GRAN FORMATO" },
    { tab: "Rotulación", href: "rotulacion.html", img: "assets/img/proyectos/tke.webp", n: "Vehículos y flotas", t: "Rotulación", d: "Furgonetas, camiones y flotas corporativas con vinilos 3M y Avery, garantía de 5 a 7 años.", chips: ["Furgonetas", "Camiones", "Flotas", "Vinilos 3M y Avery"], box: [34, 18, 92, 66], lw: "LARGO", lh: "ALTO", ref: "REF · TKE" },
    { tab: "Stands", href: "eventos.html", img: "assets/img/proyectos/eversense.webp", n: "Ferias y congresos", t: "Stands", d: "Diseño, producción, transporte y montaje llave en mano para Fira Barcelona y toda España.", chips: ["Diseño", "Producción", "Transporte", "Montaje llave en mano"], box: [22, 12, 116, 70], lw: "FRENTE", lh: "ALTURA", ref: "REF · EVERSENSE" },
    { tab: "Eventos", href: "eventos.html", img: "assets/img/hubs/eventos/evento-neon.webp", n: "Ambientación y activaciones", t: "Eventos corporativos", d: "Photocalls, backdrops, banderolas y montaje integral para presentaciones y eventos de marca.", chips: ["Photocalls", "Backdrops", "Banderolas", "Montaje integral"], box: [24, 14, 110, 70], lw: "BACKDROP", lh: "ALTO", ref: "REF · EVENTO" },
    { tab: "Letras corpóreas", href: "rotulacion.html", img: "assets/img/hubs/rotulacion/letras-corporeas.webp", n: "Rótulos en volumen", t: "Letras corpóreas", d: "Letras en PVC, metacrilato y aluminio, con o sin retroiluminación led, para fachada e interior.", chips: ["PVC", "Metacrilato", "Aluminio", "Retroiluminación led"], box: [20, 22, 120, 46], lw: "RÓTULO", lh: "ALTO", ref: "REF · FACHADA" },
    { tab: "Retail", href: "impresion.html", img: "assets/img/proyectos/venca.webp", n: "PLV y punto de venta", t: "Retail", d: "Expositores, pop-up stores y material promocional para cadenas y grandes marcas.", chips: ["Expositores", "Pop-up stores", "Material promocional"], box: [30, 16, 100, 70], lw: "FACHADA", lh: "ALTURA", ref: "REF · VENCA" }
  ];
  const fLines = c => {
    const [x, y, w, h] = c.box, r = x + w, b = y + h;
    return `
      <rect class="l" x="${x}" y="${y}" width="${w}" height="${h}"/>
      <path class="d" d="M${x} ${y}L${r} ${b}M${r} ${y}L${x} ${b}M${x + w / 2} ${y - 4}V${b + 4}M${x - 4} ${y + h / 2}H${r + 4}"/>
      <path class="l" d="M${x} ${b + 7}H${r}M${x} ${b + 5}v4M${r} ${b + 5}v4"/>
      <path class="l" d="M${r + 7} ${y}V${b}M${r + 5} ${y}h4M${r + 5} ${b}h4"/>
      <circle class="l" cx="${x + w / 2}" cy="${y + h / 2}" r="5"/>
      <text x="${x + w / 2 - 6}" y="${b + 12.5}">${c.lw}</text>
      <text x="${r + 9}" y="${y + h / 2 + 1}">${c.lh}</text>
      <text x="6" y="94">${c.ref} · ESC 1:20 · UNICAL</text>`;
  };
  register("services", "F", (root, ux) => {
    const tabs = $(".services-f__tabs", root), cmp = $(".services-f__cmp", root), range = $(".services-f__range", root);
    const real = $(".services-f__real", root), bpImg = $(".services-f__bp img", root), svg = $(".services-f__lines", root);
    const n = $(".services-f__n", root), t = $(".services-f__t", root), d = $(".services-f__d", root), chips = $(".services-f__chips", root), go = $(".services-f__go", root);
    tabs.innerHTML = F_TABS.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-i="${i}">${c.tab}</button>`).join("");
    const setX = v => { cmp.style.setProperty("--x", v + "%"); range.value = v; };
    const drawLines = () => {
      if (ux.reduce) return;
      const els = $$("rect,path,circle", svg);
      els.forEach(e => e.setAttribute("pathLength", 1));
      gsap.fromTo(els, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: .06, ease: "power2.inOut" });
      gsap.fromTo($$("text", svg), { opacity: 0 }, { opacity: 1, duration: .6, delay: .8, stagger: .1 });
    };
    const show = (i, anim) => {
      const c = F_TABS[i];
      $$("button", tabs).forEach((b, j) => b.setAttribute("aria-selected", j === i));
      real.src = c.img; bpImg.src = c.img; svg.innerHTML = fLines(c);
      n.textContent = `${String(i + 1).padStart(2, "0")} / ${String(F_TABS.length).padStart(2, "0")} · ${c.n}`;
      go.href = c.href;
      t.textContent = c.t; d.textContent = c.d;
      chips.innerHTML = c.chips.map(x => `<li>${x}</li>`).join("");
      if (anim && !ux.reduce) {
        gsap.fromTo([t, d, chips], { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .06, ease: "expo.out" });
        drawLines();
        const o = { v: 82 }; gsap.to(o, { v: 50, duration: 1.2, ease: "expo.out", onUpdate: () => setX(o.v) });
      }
    };
    tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) show(+b.dataset.i, true); });
    tabs.addEventListener("keydown", e => {
      if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const bs = $$("button", tabs), i = bs.findIndex(b => b.getAttribute("aria-selected") === "true");
      const j = (i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length; bs[j].focus(); show(j, true);
    });
    range.addEventListener("input", () => setX(+range.value));
    show(0, false);
    if (ux.reduce) return;
    ScrollTrigger.create({ trigger: cmp, start: "top 75%", once: true, onEnter: () => { drawLines(); const o = { v: 92 }; gsap.to(o, { v: 50, duration: 1.8, ease: "expo.inOut", onUpdate: () => setX(o.v) }); } });
  });

  /* ---------- G · Vídeo controlado por el scroll ---------- */
  register("services", "G", (root, ux) => {
    const v = $(".services-g__video", root), caps = $$(".services-g__caps li", root), bar = $(".services-g__bar", root);
    const setCap = i => caps.forEach((c, j) => c.classList.toggle("on", j === i));
    const isStatic = ux.reduce || innerWidth < 760;
    if (isStatic) {
      root.classList.add("is-static");
      v.loop = true; v.preload = "auto";
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
      io.observe(v);
      return () => { io.disconnect(); root.classList.remove("is-static"); };
    }
    v.preload = "auto"; v.pause();
    let target = 0, cur = -1;
    setCap(0);
    gsap.set(caps, { opacity: 0 });
    gsap.set(caps[0], { opacity: 1 });
    ScrollTrigger.create({
      trigger: root, start: "top top", end: "bottom bottom",
      onUpdate: s => {
        const dur = v.duration || 0;
        target = dur ? s.progress * (dur - .1) : 0;
        bar.style.setProperty("--p", s.progress);
        const i = Math.min(caps.length - 1, Math.floor(s.progress * caps.length));
        if (i !== cur) {
          const prev = caps[cur]; cur = i; setCap(i);
          if (prev) gsap.to(prev, { opacity: 0, y: -30, duration: .4, ease: "power2.in" });
          gsap.fromTo(caps[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, ease: "expo.out" });
        }
      }
    });
    const tick = () => { if (!v.seeking && v.readyState >= 1 && Math.abs(v.currentTime - target) > .04) v.currentTime = target; };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  /* ---------- H · Taller isométrico ---------- */
  const H_ZONES = [
    { n: "Zona 01 · Gran formato", t: "Impresión", d: "Vallas, lonas, telas y vinilo a cualquier tamaño con impresión UV de alta resolución.", chips: ["Vallas", "Lonas", "Telas", "Vinilo"], img: "assets/img/servicios/gran-formato.webp", href: "impresion.html" },
    { n: "Zona 02 · Vehículos y flotas", t: "Rotulación", d: "Furgonetas, camiones y flotas corporativas con vinilos 3M y Avery, garantía de 5 a 7 años.", chips: ["Furgonetas", "Camiones", "Flotas", "3M y Avery"], img: "assets/img/proyectos/tke.webp", href: "rotulacion.html" },
    { n: "Zona 03 · Ferias y congresos", t: "Stands", d: "Diseño, producción, transporte y montaje llave en mano para Fira Barcelona y toda España.", chips: ["Diseño", "Producción", "Transporte", "Montaje"], img: "assets/img/proyectos/eversense.webp", href: "eventos.html" },
    { n: "Zona 04 · Ambientación y activaciones", t: "Eventos corporativos", d: "Photocalls, backdrops, banderolas y montaje integral para presentaciones y eventos de marca.", chips: ["Photocalls", "Backdrops", "Banderolas"], img: "assets/img/hubs/eventos/evento-neon.webp", href: "eventos.html" },
    { n: "Zona 05 · Rótulos en volumen", t: "Letras corpóreas", d: "Letras en PVC, metacrilato y aluminio, con o sin retroiluminación led, para fachada e interior.", chips: ["PVC", "Metacrilato", "Aluminio", "Led"], img: "assets/img/hubs/rotulacion/letras-corporeas.webp", href: "rotulacion.html" },
    { n: "Zona 06 · PLV y punto de venta", t: "Retail", d: "Expositores, pop-up stores y material promocional para cadenas y grandes marcas.", chips: ["Expositores", "Pop-up stores", "Material promocional"], img: "assets/img/proyectos/venca.webp", href: "impresion.html" }
  ];
  const ISO = { ox: 500, oy: 160, s: 39, h: 680 };
  const P = (x, y, z) => [ISO.ox + (x - y) * ISO.s * .866, ISO.oy + (x + y) * ISO.s * .5 - z * ISO.s];
  const pts = a => a.map(p => P(...p).map(n => n.toFixed(1)).join(",")).join(" ");
  const box = (x, y, z, w, d, h, acc) => {
    const top = [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]];
    const lf = [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]];
    const rt = [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]];
    const f = acc ? ` class="acc-f"` : "";
    return `<polygon${f || ' class="lf"'} points="${pts(lf)}"${acc ? ' opacity=".75"' : ""}/><polygon${f || ' class="rt"'} points="${pts(rt)}"${acc ? ' opacity=".9"' : ""}/><polygon${f || ' class="top"'} points="${pts(top)}"/>` +
      `<polygon class="edge" points="${pts(top)}"/><polyline class="edge" points="${pts([[x, y + d, z + h], [x, y + d, z], [x + w, y + d, z], [x + w, y, z], [x + w, y, z + h]])}"/><line class="edge" x1="${P(x + w, y + d, z)[0]}" y1="${P(x + w, y + d, z)[1]}" x2="${P(x + w, y + d, z + h)[0]}" y2="${P(x + w, y + d, z + h)[1]}"/>`;
  };
  const H_SCENE = [
    { anchor: [3.5, 1.7, 2.6], parts: [[1, 1, 0, 5, 1.4, 1.3], [1.4, 1.15, 1.3, 4.2, .7, .55, 1], [1, 2.6, 0, 5, 2.4, .06, 1]] },
    { anchor: [9.5, 2, 2.6], parts: [[7.4, 1, 0, 4, 1.9, 1.9], [11.4, 1, 0, 1, 1.9, 1.25], [7.4, 2.88, .55, 4, .05, .55, 1]] },
    { anchor: [3, 7, 3.2], parts: [[1, 6, 0, 4.2, 3.6, .15], [1, 6, .15, 4.2, .3, 2.6], [1.6, 6.3, .9, 3, .04, 1.3, 1], [4.9, 6.3, .15, .3, 3.3, .9]] },
    { anchor: [9.9, 11.3, 3], parts: [[8.2, 11, 0, 3, .25, 2.2], [8.4, 10.96, .5, 2.6, .04, 1.3, 1], [11.6, 11.7, 0, .14, .14, 2.5], [11.74, 11.7, 1.5, .7, .04, .9, 1]] },
    { anchor: [5.9, 11, 3.6], parts: [[5.8, 10.8, 0, .25, .25, 2.4], [5.2, 10.7, 2.2, 1.5, .18, .95, 1], [3.6, 11.2, 0, .9, .9, .9]] },
    { anchor: [8.8, 8, 3.2], parts: [[7.2, 6.4, 0, 3.4, 3.1, 2.3], [7.2, 9.5, 1.85, 3.4, .7, .14, 1], [7.6, 9.5, .25, 2.6, .04, 1.3, 1]] }
  ];
  register("services", "H", (root, ux) => {
    const svg = $(".services-h__svg", root), spots = $(".services-h__spots", root), map = $(".services-h__map", root);
    const fl = [[0, 0, 0], [12.5, 0, 0], [12.5, 12.5, 0], [0, 12.5, 0]];
    let grid = "";
    for (let k = 1; k < 12.5; k += 1.25) grid += `<line class="gr" x1="${P(k, 0, 0)[0]}" y1="${P(k, 0, 0)[1]}" x2="${P(k, 12.5, 0)[0]}" y2="${P(k, 12.5, 0)[1]}"/><line class="gr" x1="${P(0, k, 0)[0]}" y1="${P(0, k, 0)[1]}" x2="${P(12.5, k, 0)[0]}" y2="${P(12.5, k, 0)[1]}"/>`;
    const order = H_SCENE.map((z, i) => i).sort((a, b) => (H_SCENE[a].anchor[0] + H_SCENE[a].anchor[1]) - (H_SCENE[b].anchor[0] + H_SCENE[b].anchor[1]));
    svg.innerHTML = `<polygon class="fl" points="${pts(fl)}"/>${grid}` + order.map(i => `<g class="zone" data-z="${i}">${H_SCENE[i].parts.map(p => box(...p)).join("")}</g>`).join("");
    spots.innerHTML = H_SCENE.map((z, i) => { const [px, py] = P(...z.anchor); return `<button type="button" class="services-h__spot" data-n="${i + 1}" data-i="${i}" aria-pressed="false" aria-label="${H_ZONES[i].t}" style="left:${px / 10}%;top:${py / ISO.h * 100}%"></button>`; }).join("");
    const img = $(".services-h__img img", root), n = $(".services-h__n", root), t = $(".services-h__t", root), d = $(".services-h__d", root), chips = $(".services-h__chips", root), go = $(".services-h__go", root);
    let cur = -1;
    const set = (i, anim) => {
      if (i === cur) return; cur = i;
      const z = H_ZONES[i];
      map.classList.add("has-active");
      $$(".zone", svg).forEach(g => g.classList.toggle("on", +g.dataset.z === i));
      $$(".services-h__spot", spots).forEach((b, j) => b.setAttribute("aria-pressed", j === i));
      img.src = z.img; n.textContent = z.n; t.textContent = z.t; d.textContent = z.d; go.href = z.href;
      chips.innerHTML = z.chips.map(c => `<li>${c}</li>`).join("");
      if (anim && !ux.reduce) gsap.fromTo([img, t, d, chips], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .55, stagger: .05, ease: "expo.out" });
    };
    const pick = e => { const b = e.target.closest(".services-h__spot"); if (b) set(+b.dataset.i, true); };
    spots.addEventListener("click", pick); spots.addEventListener("focusin", pick);
    if (ux.fine) spots.addEventListener("pointerover", pick);
    set(0, false);
    if (ux.reduce) { map.classList.add("ready"); return; }
    gsap.fromTo($$(".zone", svg), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .12, ease: "expo.out", clearProps: "opacity", onComplete: () => map.classList.add("ready"), scrollTrigger: { trigger: map, start: "top 75%" } });
    gsap.from($$(".services-h__spot", spots), { scale: 0, duration: .6, stagger: .1, delay: .8, ease: "back.out(2)", scrollTrigger: { trigger: map, start: "top 75%" } });
  });

  /* ---------- I · Pósters cinéticos ---------- */
  register("services", "I", (root, ux) => {
    const pin = $(".services-i__pin", root), track = $(".services-i__track", root), posters = $$(".services-i__poster", root), count = $(".services-i__count b", root);
    if (ux.reduce || innerWidth <= 760) {
      root.classList.add("is-static");
      if (!ux.reduce) posters.forEach(p => gsap.fromTo($(".services-i__knock span", p), { scale: 1.3 }, { scale: .95, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } }));
      return () => root.classList.remove("is-static");
    }
    const dist = () => track.scrollWidth - innerWidth;
    const tw = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: .6, invalidateOnRefresh: true,
        onUpdate: s => { count.textContent = String(Math.round(s.progress * (posters.length - 1)) + 1).padStart(2, "0"); } }
    });
    posters.forEach((p, i) => {
      const word = $(".services-i__knock span", p), media = $(".services-i__media", p), meta = $(".services-i__meta", p);
      if (i === 0) { gsap.fromTo(word, { scale: 1.4 }, { scale: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top bottom", end: "top top", scrub: true } }); return; }
      gsap.fromTo(word, { scale: 1.6, xPercent: 18 }, { scale: 1, xPercent: 0, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tw, start: "left right", end: "left left", scrub: true } });
      gsap.fromTo(media, { xPercent: -12 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tw, start: "left right", end: "left left", scrub: true } });
      gsap.from(meta, { y: 50, opacity: 0, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tw, start: "left 60%", end: "left 10%", scrub: true } });
    });
  });

  /* ---------- J · Elige tu proyecto ---------- */
  const J_TIPOS = [
    { k: "Impresión", href: "impresion.html", img: "assets/img/servicios/gran-formato.webp", esc: ["Una pieza", "Varias piezas", "Campaña completa"], mats: ["Vallas y lonas", "Telas", "Vinilo", "Impresión UV de alta resolución"], plazo: "Depende del tamaño y de la cantidad: te lo concretamos en el presupuesto." },
    { k: "Rotulación", href: "rotulacion.html", img: "assets/img/proyectos/tke.webp", esc: ["1 vehículo", "2–10 vehículos", "Flota de más de 10"], mats: ["Vinilos 3M y Avery", "Garantía de 5 a 7 años", "Furgonetas y camiones"], plazo: "Un vehículo suele estar listo en 7–10 días laborables desde el primer contacto. Para flotas te damos calendario en el presupuesto." },
    { k: "Stand", href: "eventos.html", img: "assets/img/proyectos/eversense.webp", esc: ["Hasta 18 m²", "18–50 m²", "Más de 50 m²"], mats: ["Diseño", "Producción y transporte", "Montaje llave en mano"], plazo: "Depende del tamaño y de la fecha de la feria: te lo concretamos en el presupuesto." },
    { k: "Evento corporativo", href: "eventos.html", img: "assets/img/hubs/eventos/evento-neon.webp", esc: ["Un espacio", "Varios espacios", "Varios eventos"], mats: ["Photocalls y backdrops", "Banderolas", "Montaje integral"], plazo: "Coordinamos producción y montaje con la fecha del evento: te lo concretamos en el presupuesto." },
    { k: "Letras corpóreas", href: "rotulacion.html", img: "assets/img/hubs/rotulacion/letras-corporeas.webp", esc: ["Interior", "Fachada", "Fachada con retroiluminación led"], mats: ["PVC", "Metacrilato", "Aluminio", "Led opcional"], plazo: "Depende del tamaño y de la instalación: te lo concretamos en el presupuesto." },
    { k: "Retail", href: "impresion.html", img: "assets/img/proyectos/venca.webp", esc: ["1 local", "2–10 locales", "Cadena de más de 10"], mats: ["Expositores", "Pop-up stores", "Material promocional"], plazo: "Coordinamos producción e instalación con la fecha de apertura: te lo concretamos en el presupuesto." }
  ];
  register("services", "J", (root, ux) => {
    const gT = $('[data-group="tipo"]', root), gE = $('[data-group="escala"]', root), frame = $(".services-j__frame", root);
    const mats = $(".services-j__mats", root), plazo = $(".services-j__plazo", root), sum = $(".services-j__summary", root), wa = $(".services-j__wa", root), go = $(".services-j__go", root), hub = $(".services-j__hub", root);
    let ti = 0, ei = 0;
    const msg = () => `Hola, quiero presupuesto para: ${J_TIPOS[ti].k} · ${J_TIPOS[ti].esc[ei]}.`;
    const chips = (el, arr, sel) => (el.innerHTML = arr.map((x, i) => `<button type="button" aria-pressed="${i === sel}" data-i="${i}">${x}</button>`).join(""));
    const swapImg = src => {
      const old = $("img.on", frame); if (old && old.getAttribute("src") === src) return;
      const im = document.createElement("img"); im.src = src; im.alt = ""; im.className = "on"; frame.append(im);
      if (old) old.classList.remove("on");
      if (ux.reduce) { old && old.remove(); return; }
      gsap.fromTo(im, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1, ease: "expo.inOut", onComplete: () => $$("img:not(.on)", frame).forEach(x => x.remove()) });
    };
    const render = anim => {
      const c = J_TIPOS[ti];
      chips(gT, J_TIPOS.map(x => x.k), ti); chips(gE, c.esc, ei);
      mats.innerHTML = c.mats.map(m => `<li>${m}</li>`).join(""); plazo.textContent = c.plazo;
      sum.textContent = `${c.k} · ${c.esc[ei]} — ${c.mats[0]}`;
      wa.href = `https://wa.me/34663512014?text=${encodeURIComponent(msg())}`;
      hub.href = c.href;
      swapImg(c.img);
      if (anim && !ux.reduce) gsap.fromTo([mats, plazo], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5, stagger: .06 });
    };
    gT.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; ti = +b.dataset.i; ei = 0; render(true); });
    gE.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; ei = +b.dataset.i; render(true); });
    // Al ir a contacto, rellena el mensaje si la versión de contacto visible tiene formulario
    go.addEventListener("click", () => {
      const ta = document.querySelector('#contacto .variant:not([hidden]) textarea[name="mensaje"]');
      if (ta && !ta.value) { ta.value = msg(); ta.dispatchEvent(new Event("input", { bubbles: true })); }
    });
    render(false);
  });
})();
