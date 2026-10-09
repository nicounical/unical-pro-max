/* Unical Pro Max · v2 — GSAP + ScrollTrigger + Lenis */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const html = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  let lenis = null;

  /* ---------- Contenido generado ---------- */
  const CLIENTES = ["toyota","coca-cola","bankinter","generali","sony-music","monster-energy","philip-morris","mitsubishi-electric","otis","porcelanosa","rituals","wella","los40","rfef","cruz-roja","avoris","catai","csl-vifor","dial","elanco","fibratel","leo-pharma","longi","straumann","ucb"];
  const half = Math.ceil(CLIENTES.length / 2);
  $$("[data-logos]").forEach(t => {
    const list = t.dataset.logos === "a" ? CLIENTES.slice(0, half) : CLIENTES.slice(half);
    const one = list.map(n => `<div class="vlogo"><img src="assets/img/clientes/${n}.png" alt="${n.replace(/-/g, " ")}" loading="lazy"></div>`).join("");
    t.innerHTML = one + one.replace(/<div class="vlogo">/g, '<div class="vlogo" aria-hidden="true">');
  });

  // Dibujos de línea por servicio (idea del componente «Services Stack» de 21st.dev)
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
      <g data-s="4"><text x="150" y="208" style="font-size:44px;fill-opacity:1;font-family:Poppins,sans-serif;font-weight:600;letter-spacing:6px">OPEN</text></g>
      <g data-s="5"><circle class="accf" cx="110" cy="250" r="9"/><circle class="accf" cx="140" cy="262" r="6"/><circle class="accf" cx="320" cy="140" r="10"/><circle class="accf" cx="336" cy="166" r="6"/><circle class="accf" cx="300" cy="258" r="8"/></g>`
  };
  $$("[data-art]").forEach(el => {
    el.innerHTML = `<svg class="art" viewBox="0 0 640 320" role="img" aria-label="Ilustración animada del servicio">${ARTS[el.dataset.art]}</svg>`;
  });

  /* ---------- Formulario ---------- */
  const form = $("[data-form]");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach(i => {
      const bad = !i.value.trim();
      i.closest(".field").classList.toggle("bad", bad);
      i.setAttribute("aria-invalid", bad);
      if (bad && ok) { i.focus(); ok = false; }
    });
    if (!ok) return;
    const d = Object.fromEntries(new FormData(form));
    $(".form__ok", form).hidden = false;
    location.href = `mailto:nico@unical.es?subject=${encodeURIComponent("Solicitud de presupuesto")}&body=${encodeURIComponent(Object.entries(d).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n"))}`;
  });
  $$(".field input").forEach(i => i.addEventListener("input", () => i.closest(".field").classList.remove("bad")));

  /* ---------- Menú móvil ---------- */
  const menuBtn = $(".hd__menu"), mnav = $("#mnav");
  const setMenu = open => { menuBtn.setAttribute("aria-expanded", open); mnav.hidden = !open; };
  menuBtn.addEventListener("click", () => setMenu(mnav.hidden));
  $$("a", mnav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Modal del showreel ---------- */
  const modal = $(".modal"), mv = $(".modal__v");
  let lastFocus;
  const openModal = () => { lastFocus = document.activeElement; modal.hidden = false; mv.currentTime = 0; mv.play().catch(() => {}); $(".modal__x").focus(); lenis && lenis.stop(); };
  const closeModal = () => { mv.pause(); modal.hidden = true; lenis && lenis.start(); lastFocus && lastFocus.focus(); };
  $(".reel__play").addEventListener("click", openModal);
  $(".modal__x").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- Vídeos: solo se reproducen cuando se ven ---------- */
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); }
    else v.pause();
  }), { rootMargin: "200px" });
  $$("video[data-lazyplay], .reel__video, .hero__video, .pill video").forEach(v => vio.observe(v));

  /* ---------- Opiniones ---------- */
  const qs = $$(".q"), qc = $("[data-qc]");
  qs.forEach(q => {
    const b = $("blockquote", q);
    b.innerHTML = b.textContent.trim().split(/\s+/).map(w => `<span class="ww"><span>${w}</span></span>`).join(" ");
  });
  let qi = 0, qTimer;
  const showQ = n => {
    const prev = qs[qi]; qi = (n + qs.length) % qs.length; const cur = qs[qi];
    qc.textContent = `${String(qi + 1).padStart(2, "0")} / ${String(qs.length).padStart(2, "0")}`;
    if (!hasGsap || reduce) { qs.forEach(q => q.classList.toggle("on", q === cur)); return; }
    gsap.to($$(".ww > span", prev), { yPercent: -110, duration: .5, stagger: .01, ease: "power3.in", onComplete: () => prev.classList.remove("on") });
    cur.classList.add("on");
    gsap.fromTo($$(".ww > span", cur), { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .02, ease: "expo.out", delay: .45 });
    gsap.fromTo($("figcaption", cur), { opacity: 0 }, { opacity: 1, duration: .6, delay: .9 });
  };
  const autoQ = () => { clearInterval(qTimer); if (!reduce) qTimer = setInterval(() => showQ(qi + 1), 7000); };
  $$("[data-q]").forEach(b => b.addEventListener("click", () => { showQ(qi + +b.dataset.q); autoQ(); }));
  autoQ();

  /* ---------- Sin GSAP o con movimiento reducido: todo visible ---------- */
  const finishLoader = () => { html.classList.remove("is-loading"); $(".loader").classList.add("done"); };
  if (!hasGsap || reduce) {
    finishLoader();
    $$("[data-count]").forEach(el => (el.textContent = fmt(+el.dataset.count)));
    return;
  }

  /* =================== GSAP =================== */
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  // Enlaces internos con scroll suave
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href"); const t = id.length > 1 && $(id);
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: "smooth" });
  }));

  // Partir texto en letras (respeta <em>)
  const splitChars = el => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach(ch => {
          if (ch === " ") { frag.append(" "); return; }
          const s = document.createElement("span"); s.className = "char"; s.textContent = ch; frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
    return $$(".char", el);
  };

  /* ---------- Precarga + entrada ---------- */
  const heroChars = $$(".hero__title .split").flatMap(splitChars);
  gsap.set(heroChars, { yPercent: 115 });
  gsap.set([".hero__kicker", ".hero__lead", ".btn-round", ".hero__ticker", ".hd"], { autoAlpha: 0, y: 20 });
  const prog = { v: 0 };
  const ready = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(r => { const v = $(".hero__video"); if (v.readyState >= 3) r(); else { v.addEventListener("canplay", r, { once: true }); setTimeout(r, 3500); } })
  ]);
  const loadTween = gsap.to(prog, { v: 90, duration: 1.4, ease: "power2.out", onUpdate: paint });
  function paint() { $(".loader__n").textContent = Math.round(prog.v); $(".loader__bar").style.setProperty("--p", prog.v / 100); }
  ready.then(() => {
    loadTween.kill();
    gsap.timeline()
      .to(prog, { v: 100, duration: .4, ease: "power1.out", onUpdate: paint })
      .to(".loader__in", { autoAlpha: 0, duration: .35 })
      .to(".loader__panels i", { yPercent: -100, duration: 1, stagger: .07, ease: "expo.inOut" }, "<")
      .add(() => { finishLoader(); lenis && lenis.start(); ScrollTrigger.refresh(); })
      .to(".hero__video", { scale: 1, duration: 2.2, ease: "expo.out" }, "-=.9")
      .to(heroChars, { yPercent: 0, duration: 1.2, stagger: .028, ease: "expo.out" }, "<.1")
      .to([".hd", ".hero__kicker", ".hero__lead", ".btn-round", ".hero__ticker"], { autoAlpha: 1, y: 0, duration: 1, stagger: .08, ease: "expo.out" }, "<.5");
  });

  /* ---------- Cursor + magnéticos ---------- */
  if (fine) {
    html.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), lab = $(".cursor__label");
    const dx = gsap.quickTo(dot, "x", { duration: .08 }), dy = gsap.quickTo(dot, "y", { duration: .08 });
    const rx = gsap.quickTo(ring, "x", { duration: .45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: .45, ease: "power3" });
    addEventListener("pointermove", e => { cur.classList.add("live"); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.addEventListener("pointerleave", () => cur.classList.remove("live"));
    document.addEventListener("pointerover", e => {
      const lbl = e.target.closest("[data-cursor]");
      const hov = e.target.closest("a,button,input,textarea,.vlogo");
      cur.classList.toggle("is-label", !!lbl); lab.textContent = lbl ? lbl.dataset.cursor : "";
      cur.classList.toggle("is-hover", !lbl && !!hov);
    });
    $$("[data-magnetic]").forEach(m => {
      const xTo = gsap.quickTo(m, "x", { duration: .6, ease: "elastic.out(1,.4)" }), yTo = gsap.quickTo(m, "y", { duration: .6, ease: "elastic.out(1,.4)" });
      m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .3); });
      m.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- 01 · Portada al hacer scroll ---------- */
  gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } })
    .to(".hero__media", { clipPath: "inset(6% 5% 18% 5% round 28px)", ease: "none" }, 0)
    .to(".hero__video", { yPercent: 12, ease: "none" }, 0)
    .to(".hero__title", { yPercent: -35, ease: "none" }, 0)
    .to([".hero__foot", ".hero__kicker"], { autoAlpha: 0, y: -40, ease: "none" }, 0);

  /* ---------- Manifiesto: palabras que se iluminan ---------- */
  const mt = $("[data-words]");
  [...mt.childNodes].forEach(n => {
    if (n.nodeType !== 3 || !n.textContent.trim()) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(w => {
      if (!w.trim()) { frag.append(w); return; }
      const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.append(s);
    });
    n.replaceWith(frag);
  });
  gsap.to($$(".w", mt), { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: mt, start: "top 80%", end: "bottom 45%", scrub: true } });
  gsap.from(".pill", { width: 0, duration: 1, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: mt, start: "top 75%" } });

  /* ---------- Contadores ---------- */
  const counter = (el, opts = {}) => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2.2, ease: "power3.out", onUpdate: () => (el.textContent = fmt(o.v)), scrollTrigger: { trigger: el, start: "top 85%", once: true, ...opts } });
  };
  $$(".manifesto [data-count]").forEach(el => counter(el));

  /* ---------- 02 · Showreel: expansión con scroll (adaptado de «Scroll media expansion hero», 21st.dev) ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 0px)", () => {
    const frame = $(".reel__frame");
    gsap.timeline({ scrollTrigger: { trigger: ".reel", start: "top top", end: "bottom bottom", scrub: .8 } })
      .fromTo(frame, { width: () => Math.min(300, innerWidth * .6), height: () => Math.min(400, innerHeight * .55), borderRadius: 20 },
        { width: () => innerWidth, height: () => innerHeight, borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
      .to(".reel__w--l", { xPercent: -140, ease: "power2.in", duration: .8 }, 0)
      .to(".reel__w--r", { xPercent: 140, ease: "power2.in", duration: .8 }, 0)
      .to(".reel__hint-l", { x: () => -innerWidth * .5, autoAlpha: 0, duration: .6 }, 0)
      .to(".reel__hint-r", { x: () => innerWidth * .5, autoAlpha: 0, duration: .6 }, 0)
      .to(".reel__bg", { autoAlpha: 0, duration: .8 }, 0)
      .to(".reel__veil", { opacity: 0, duration: .6 }, .4)
      .to({}, { duration: .35 });
  });

  /* ---------- 03 · Servicios: paneles apilados (adaptado de «Services Stack», 21st.dev) ---------- */
  const panels = $$("[data-panel]"), cards = panels.map(p => $(".svc__card", p));
  const bgs = $$(".svc__sticky > img"), titles = $$(".svc__titles span"), count = $(".svc__count b");
  let active = -1;
  const setActive = i => {
    if (i === active) return; active = i;
    bgs.forEach((b, j) => b.classList.toggle("on", j === i));
    titles.forEach((t, j) => t.classList.toggle("on", j === i));
    count.textContent = String(i + 1).padStart(2, "0");
  };
  setActive(0);
  ScrollTrigger.create({
    trigger: ".svc", start: "top bottom", end: "bottom top",
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
  // Animación de cada dibujo + chips sincronizadas
  $$(".svc__card").forEach(card => {
    const svg = $("svg", card), chips = $$(".chips li", card), groups = $$("[data-s]", svg);
    const strokes = $$(".ink,.hair,.acc", svg).filter(e => e.tagName !== "text" && e.tagName !== "g");
    strokes.forEach(s => { s.setAttribute("pathLength", 1); s.style.strokeDasharray = "1 1"; s.style.strokeDashoffset = 1; });
    const fills = $$(".inkf,.accf,text", svg);
    gsap.set(fills, { opacity: 0, scale: .4, transformOrigin: "50% 50%", transformBox: "fill-box" });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: .4, paused: true });
    groups.forEach((g, i) => {
      const at = i * 1.35;
      tl.call(() => chips.forEach((c, j) => c.classList.toggle("on", j === i)), null, at);
      const gs = $$(".ink,.hair,.acc", g).filter(e => e.tagName !== "text");
      if (gs.length) tl.to(gs, { strokeDashoffset: 0, duration: 1, stagger: .08, ease: "power2.inOut" }, at);
      const gf = $$(".inkf,.accf,text", g);
      if (gf.length) tl.to(gf, { opacity: (k, el) => +(el.getAttribute("opacity") || 1), scale: 1, duration: .6, stagger: .06, ease: "back.out(2)" }, at + .4);
      const mv = $$("[data-x]", g).concat(g.hasAttribute("data-x") ? [g] : []);
      mv.forEach(m => {
        const x = +m.dataset.x;
        if (m === g) tl.fromTo(m, { x: 160 }, { x: x, duration: 1.1, ease: "power3.out" }, at);
        else tl.fromTo(m, { x: 0 }, { x, duration: 1.2, ease: "power1.inOut" }, at + .1);
      });
    });
    tl.to({}, { duration: 1.6 });
    tl.call(() => chips.forEach(c => c.classList.remove("on")));
    tl.to(svg, { opacity: 0, duration: .5 });
    tl.set(strokes, { strokeDashoffset: 1 }); tl.set(fills, { opacity: 0, scale: .4 }); tl.set(svg, { opacity: 1 });
    ScrollTrigger.create({ trigger: card, start: "top 85%", end: "bottom 10%", onToggle: s => (s.isActive ? tl.play() : tl.pause()) });
  });

  /* ---------- Cifras en horizontal ---------- */
  const track = $(".hz__track");
  const hzTween = gsap.to(track, {
    x: () => -(track.scrollWidth - innerWidth), ease: "none",
    scrollTrigger: { trigger: ".hz", start: "top top", end: () => "+=" + (track.scrollWidth - innerWidth), pin: ".hz__pin", scrub: .6, invalidateOnRefresh: true,
      onUpdate: s => $(".hz__progress").style.setProperty("--p", s.progress) }
  });
  $$(".hz [data-count]").forEach(el => counter(el, { containerAnimation: hzTween, start: "left 85%" }));
  $$(".hz__clip").forEach(c => gsap.from(c, { yPercent: 18, rotate: 4, ease: "none", scrollTrigger: { trigger: c, containerAnimation: hzTween, start: "left right", end: "right left", scrub: true } }));

  /* ---------- 04 · Proyectos: lista con media flotante ---------- */
  if (fine) {
    const fl = $(".work__float"), fin = $(".work__float-in");
    const fx = gsap.quickTo(fl, "x", { duration: .6, ease: "power3" }), fy = gsap.quickTo(fl, "y", { duration: .6, ease: "power3" });
    const list = $(".work__list");
    let curSrc = "";
    list.addEventListener("pointermove", e => { fx(e.clientX); fy(e.clientY); });
    list.addEventListener("pointerover", e => {
      const a = e.target.closest("a[data-media]"); if (!a || a.dataset.media === curSrc) return;
      curSrc = a.dataset.media;
      const isV = a.dataset.type === "video";
      const m = document.createElement(isV ? "video" : "img");
      m.src = curSrc; if (isV) { m.muted = true; m.loop = true; m.playsInline = true; m.autoplay = true; } else m.alt = "";
      m.style.opacity = 0; fin.append(m);
      requestAnimationFrame(() => (m.style.opacity = 1));
      while (fin.children.length > 2) fin.firstChild.remove();
      fl.classList.add("on");
    });
    list.addEventListener("pointerleave", () => { fl.classList.remove("on"); curSrc = ""; });
  }
  gsap.from(".work__list li", { yPercent: 60, opacity: 0, duration: 1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".work__list", start: "top 80%" } });
  // Galería con parallax de profundidad
  mm.add("(min-width: 701px)", () => {
    $$(".g").forEach((g, i) => {
      const speed = [-.25, .15, -.1, .2, -.18][i];
      gsap.to(g, { yPercent: speed * 100, ease: "none", scrollTrigger: { trigger: ".gallery", start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  $$(".g__m img").forEach(img => gsap.fromTo(img, { yPercent: -15 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  $$(".g__m").forEach(m => gsap.from(m, { clipPath: "inset(100% 0 0 0 round 14px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: m, start: "top 85%" } }));

  // Titulares grandes: entrada por líneas
  $$(".big, .cta__title").forEach(h => gsap.from(h, { yPercent: 30, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } }));

  /* ---------- 05 · Proceso: el trazo del logo se dibuja ---------- */
  const wave = $(".proc__wave path");
  wave.setAttribute("pathLength", 1);
  gsap.fromTo(wave, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".proc__wrap", start: "top 70%", end: "bottom 70%", scrub: true } });
  $$(".proc__steps li").forEach(li => gsap.from(li.children, { y: 50, opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 80%" } }));

  /* ---------- Clientes: marquesina que reacciona a la velocidad ---------- */
  const rows = $$("[data-velocity]").map((r, i) => ({ el: $(".vmarquee__track", r), x: 0, dir: i % 2 ? 1 : -1 }));
  let vel = 0;
  if (lenis) lenis.on("scroll", e => (vel = e.velocity || 0));
  gsap.ticker.add(() => {
    const boost = Math.min(Math.abs(vel) * .35, 18);
    rows.forEach(r => {
      const w = r.el.scrollWidth / 2; if (!w) return;
      r.x += (0.6 + boost) * r.dir * (vel < 0 ? -1 : 1);
      if (r.x <= -w) r.x += w; if (r.x > 0) r.x -= w;
      r.el.style.transform = `translate3d(${r.x}px,0,0) skewX(${gsap.utils.clamp(-8, 8, -vel * .25)}deg)`;
    });
    vel *= .92;
  });

  /* ---------- 06 · Contacto: el titular se rellena ---------- */
  $$("[data-fill]").forEach((f, i) => gsap.to(f, { backgroundPosition: "0% 0", ease: "none", scrollTrigger: { trigger: ".cta__title", start: `top ${80 - i * 10}%`, end: `top ${35 - i * 10}%`, scrub: true } }));
  gsap.fromTo(".cta__video", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom bottom", scrub: true } });
  gsap.from(".ft__logo", { yPercent: 60, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".ft__logo", start: "top 95%" } });

  /* ---------- Cabecera: fondo al hacer scroll y logo según el fondo ---------- */
  const hd = $(".hd");
  ScrollTrigger.create({ start: 80, end: "max", onToggle: s => hd.classList.toggle("scrolled", s.isActive) });
  $$(".work, .proc, .clients").forEach(sec => ScrollTrigger.create({
    trigger: sec, start: "top 40px", end: "bottom 40px",
    onToggle: s => { if (s.isActive) hd.classList.add("on-light"); else if (!$$(".work, .proc, .clients").some(x => { const r = x.getBoundingClientRect(); return r.top <= 40 && r.bottom > 40; })) hd.classList.remove("on-light"); }
  }));

  /* ---------- Índice de capítulos ---------- */
  const chs = $$(".chapters a"), chNav = $(".chapters");
  $$("[data-chapter]").forEach(sec => ScrollTrigger.create({
    trigger: sec, start: "top 50%", end: "bottom 50%",
    onToggle: s => { if (s.isActive) chs.forEach(a => a.classList.toggle("on", a.dataset.ch === sec.dataset.chapter)); }
  }));
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => { $(".chapters__bar").style.setProperty("--p", s.progress); chNav.classList.toggle("show", s.scroll() > innerHeight * .6); } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
