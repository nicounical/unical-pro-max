/* Unical Pro Max · núcleo: variantes, selector, precarga, cursor, scroll suave.
   API para las secciones (js/sections/*.js):
     UX.register("hero", "A", (root, ux) => { ...; return () => {limpieza opcional} })
       - Se ejecuta dentro de gsap.context(root): todo ScrollTrigger/tween creado aquí
         se revierte solo al cambiar de versión.
       - Si ux.reduce es true: deja el contenido en su estado final legible, sin pin ni scrub.
     ux.onIntro(cb)      → cb cuando termina la precarga (al instante si ya terminó)
     ux.splitChars(el)   → array de <span class="char"> (respeta <em>, <span class="acc">…)
     ux.splitWords(el)   → array de <span class="word">
     ux.counter(el, stOpts) → cuenta hasta el[data-count] con formato 5.000
     ux.fmt(n), ux.lenis, ux.reduce, ux.fine, ux.openReel(), ux.$, ux.$$
   Automático en cada versión visible: .rv (entrada), [data-count] (salvo data-count-manual),
   <video data-autoplay> (play/pause según visibilidad), [data-magnetic], [data-cursor="Texto"].
*/
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const registry = {};
  const introQ = []; let introDone = false;

  const splitChars = el => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(" "); return; }
          const word = document.createElement("span"); word.style.display = "inline-block"; word.style.whiteSpace = "nowrap";
          [...w].forEach(ch => { const s = document.createElement("span"); s.className = "char"; s.textContent = ch; word.append(s); });
          frag.append(word);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("char")) walk(n);
    });
    if (!el.dataset.split) { walk(el); el.dataset.split = "c"; }
    return $$(".char", el);
  };
  const splitWords = el => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.append(" "); return; }
          const s = document.createElement("span"); s.className = "word"; s.textContent = w; frag.append(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("word")) walk(n);
    });
    if (!el.dataset.split) { walk(el); el.dataset.split = "w"; }
    return $$(".word", el);
  };

  const UX = window.UX = {
    $, $$, reduce, fine, fmt, splitChars, splitWords, lenis: null,
    register(sec, v, fn) { registry[`${sec}:${v}`] = fn; },
    onIntro(cb) { introDone ? cb() : introQ.push(cb); },
    counter(el, opts = {}) {
      const end = +el.dataset.count;
      if (reduce || !hasGsap) { el.textContent = fmt(end); return; }
      const o = { v: 0 }; el.textContent = "0";
      gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: () => (el.textContent = fmt(o.v)), scrollTrigger: { trigger: el, start: "top 88%", once: true, ...opts } });
    },
    openReel() { openModal(); },
    refresh() { hasGsap && ScrollTrigger.refresh(); }
  };

  /* ---------- Modal showreel ---------- */
  const modal = $(".modal"), mv = $(".modal__v"); let lastFocus;
  function openModal() { lastFocus = document.activeElement; modal.hidden = false; mv.currentTime = 0; mv.play().catch(() => {}); $(".modal__x").focus(); UX.lenis && UX.lenis.stop(); }
  function closeModal() { mv.pause(); modal.hidden = true; UX.lenis && UX.lenis.start(); lastFocus && lastFocus.focus(); }
  $(".modal__x").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
  document.addEventListener("click", e => { if (e.target.closest("[data-reel]")) { e.preventDefault(); openModal(); } });

  /* ---------- Menú móvil ---------- */
  const menuBtn = $(".hd__menu"), mnav = $("#mnav");
  const setMenu = open => { menuBtn.setAttribute("aria-expanded", open); mnav.hidden = !open; };
  menuBtn.addEventListener("click", () => setMenu(mnav.hidden));
  $$("a", mnav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Formularios (prueba: abren el correo) ---------- */
  document.addEventListener("submit", e => {
    const f = e.target.closest("form[data-form]"); if (!f) return;
    e.preventDefault();
    let ok = true;
    $$("[required]", f).forEach(i => { const bad = !i.value.trim(); (i.closest(".field") || i).classList.toggle("bad", bad); i.setAttribute("aria-invalid", bad); if (bad && ok) { i.focus(); ok = false; } });
    if (!ok) return;
    const d = Object.fromEntries(new FormData(f));
    const okEl = $("[data-ok]", f); if (okEl) okEl.hidden = false;
    location.href = `mailto:nico@unical.es?subject=${encodeURIComponent("Solicitud de presupuesto")}&body=${encodeURIComponent(Object.entries(d).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n"))}`;
  });
  document.addEventListener("input", e => { const f = e.target.closest(".field"); f && f.classList.remove("bad"); });

  /* ---------- Vídeos: reproducir solo si se ven ---------- */
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { rootMargin: "150px" });
  const watchVideos = root => $$("video[data-autoplay]", root).forEach(v => { v.muted = true; vio.observe(v); });

  /* ---------- Variantes ---------- */
  const secs = $$("[data-sec]");
  const state = {}; const ctxs = {}; const cleanups = {};
  const variantsOf = sec => $$(":scope > .variant", sec);

  function initVariant(sec, el) {
    const key = `${sec.dataset.sec}:${el.dataset.v}`;
    watchVideos(el);
    if (!hasGsap) return;
    ctxs[key] = gsap.context(() => {
      if (!reduce) {
        const rv = $$(".rv", el);
        if (rv.length) ScrollTrigger.batch(rv, { start: "top 88%", once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: "expo.out" }) });
      } else gsap.set($$(".rv", el), { opacity: 1, y: 0 });
      $$("[data-count]:not([data-count-manual])", el).forEach(c => UX.counter(c));
      const fn = registry[key];
      if (fn) { try { cleanups[key] = fn(el, UX); } catch (err) { console.error("[UX]", key, err); } }
    }, el);
  }
  function teardown(sec, el) {
    const key = `${sec.dataset.sec}:${el.dataset.v}`;
    if (typeof cleanups[key] === "function") { try { cleanups[key](); } catch (e) {} }
    cleanups[key] = null;
    ctxs[key] && ctxs[key].revert(); ctxs[key] = null;
    $$("video", el).forEach(v => v.pause());
  }
  function show(sec, v, user) {
    const vs = variantsOf(sec);
    if (!vs.some(x => x.dataset.v === v)) v = vs[0].dataset.v;
    const prev = state[sec.dataset.sec];
    if (prev === v && user) return;
    const before = sec.getBoundingClientRect().top;
    if (prev) { const old = vs.find(x => x.dataset.v === prev); old && teardown(sec, old); }
    state[sec.dataset.sec] = v;
    vs.forEach(x => (x.hidden = x.dataset.v !== v));
    const cur = vs.find(x => x.dataset.v === v);
    if (user) {
      ScrollTrigger.refresh();
      const absTop = sec.getBoundingClientRect().top + scrollY;
      const y = absTop - Math.max(before, 0);
      UX.lenis ? UX.lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
      if (!reduce) { cur.classList.remove("is-entering"); void cur.offsetWidth; cur.classList.add("is-entering"); }
    }
    initVariant(sec, cur);
    if (user) { requestAnimationFrame(() => ScrollTrigger.refresh()); syncURL(); }
    renderDock(); renderBoard();
  }
  function syncURL() {
    const p = new URLSearchParams(location.search);
    secs.forEach(s => { const k = s.dataset.sec; state[k] === "A" ? p.delete(k) : p.set(k, state[k]); });
    p.delete("nointro");
    const q = p.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
  }

  /* ---------- Dock ---------- */
  const dock = $(".dock"), dSec = $(".dock__sec"), dBtns = $(".dock__btns"), dName = $(".dock__name");
  let curSec = secs[0];
  function renderDock() {
    if (!curSec) return;
    const vs = variantsOf(curSec), v = state[curSec.dataset.sec];
    dSec.textContent = curSec.dataset.label;
    dBtns.setAttribute("aria-label", `Versión de ${curSec.dataset.label}`);
    dBtns.innerHTML = vs.map(x => `<button type="button" data-v="${x.dataset.v}" aria-pressed="${x.dataset.v === v}" title="${x.dataset.name}">${x.dataset.v}</button>`).join("");
    dName.textContent = vs.find(x => x.dataset.v === v)?.dataset.name || "";
  }
  dBtns.addEventListener("click", e => { const b = e.target.closest("button"); if (b) show(curSec, b.dataset.v, true); });
  const pickSection = () => {
    const mid = innerHeight * .5;
    const s = secs.find(x => { const r = x.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; }) || (scrollY < 50 ? secs[0] : null);
    if (s && s !== curSec) { curSec = s; renderDock(); }
  };
  const board = $(".board"), allBtn = $(".dock__all"), bList = $(".board__list");
  function renderBoard() {
    bList.innerHTML = secs.map(s => {
      const v = state[s.dataset.sec]; const n = variantsOf(s).find(x => x.dataset.v === v)?.dataset.name || "";
      return `<li><a href="#${s.id}" data-goto="${s.dataset.sec}">${s.dataset.label}<b>${v || ""} · ${n}</b></a></li>`;
    }).join("");
  }
  allBtn.addEventListener("click", () => { const o = board.hidden; board.hidden = !o; allBtn.setAttribute("aria-expanded", o); });
  $("[data-copy]").addEventListener("click", async e => { try { await navigator.clipboard.writeText(location.href); e.target.textContent = "¡Copiado!"; } catch { e.target.textContent = "Copia la URL"; } setTimeout(() => (e.target.textContent = "Copiar enlace"), 1800); });
  $("[data-clean]").addEventListener("click", () => {
    document.body.classList.add("no-dock"); board.hidden = true;
    const b = document.createElement("button"); b.className = "dock__all"; b.type = "button"; b.textContent = "Mostrar selector";
    b.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:142;background:rgba(16,16,29,.88);color:#fff";
    b.onclick = () => { document.body.classList.remove("no-dock"); b.remove(); }; document.body.append(b);
  });
  addEventListener("keydown", e => { if (e.key === "Escape" && !board.hidden) { board.hidden = true; allBtn.setAttribute("aria-expanded", false); allBtn.focus(); } });

  /* ---------- Sin GSAP: todo visible ---------- */
  if (!hasGsap) {
    html.classList.add("no-gsap"); html.classList.remove("is-loading"); $(".loader").classList.add("done");
    introDone = true;
    secs.forEach(s => { const v = (params.get(s.dataset.sec) || "A").toUpperCase(); variantsOf(s).forEach(x => (x.hidden = x.dataset.v !== v)); state[s.dataset.sec] = v; watchVideos(s); });
    $$(".rv").forEach(r => (r.style.cssText = "opacity:1;transform:none"));
    renderDock(); renderBoard();
    addEventListener("scroll", pickSection, { passive: true });
    return;
  }

  /* =================== GSAP =================== */
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !reduce) {
    UX.lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    UX.lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => UX.lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute("href"); const t = id.length > 1 && $(id); if (!t) return;
    e.preventDefault();
    UX.lenis ? UX.lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (a.dataset.goto) { board.hidden = true; }
  });

  /* ---------- Cursor y magnéticos (delegados) ---------- */
  if (fine && !reduce) {
    html.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), lab = $(".cursor__label");
    const dx = gsap.quickTo(dot, "x", { duration: .08 }), dy = gsap.quickTo(dot, "y", { duration: .08 });
    const rx = gsap.quickTo(ring, "x", { duration: .45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: .45, ease: "power3" });
    addEventListener("pointermove", e => { cur.classList.add("live"); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.addEventListener("pointerleave", () => cur.classList.remove("live"));
    document.addEventListener("pointerover", e => {
      const lbl = e.target.closest("[data-cursor]"), hov = e.target.closest("a,button,input,textarea,select,label");
      cur.classList.toggle("is-label", !!lbl); lab.textContent = lbl ? lbl.dataset.cursor : "";
      cur.classList.toggle("is-hover", !lbl && !!hov);
    });
    const mags = new WeakMap();
    document.addEventListener("pointermove", e => {
      const m = e.target.closest("[data-magnetic]"); if (!m) return;
      if (!mags.has(m)) {
        mags.set(m, [gsap.quickTo(m, "x", { duration: .6, ease: "elastic.out(1,.4)" }), gsap.quickTo(m, "y", { duration: .6, ease: "elastic.out(1,.4)" })]);
        m.addEventListener("pointerleave", () => { const q = mags.get(m); q[0](0); q[1](0); });
      }
      const [xTo, yTo] = mags.get(m), r = m.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .3);
    });
  }

  /* ---------- Cabecera: fondo y logo según el fondo de debajo ---------- */
  const hd = $(".hd");
  const themeUnderHeader = () => {
    const els = document.elementsFromPoint(innerWidth / 2, hd.offsetHeight / 2 + 2);
    const el = els.find(x => !x.closest(".hd,.dock,.board,.cursor,.progress"));
    const t = el && el.closest("[data-theme]");
    hd.classList.toggle("on-light", !!t && t.dataset.theme === "light");
    hd.classList.toggle("scrolled", scrollY > 80);
  };

  /* ---------- Bucle de scroll ---------- */
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false; pickSection(); themeUnderHeader();
      const max = document.documentElement.scrollHeight - innerHeight;
      $(".progress").style.setProperty("--p", max > 0 ? scrollY / max : 0);
    });
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    secs.forEach(s => show(s, (params.get(s.dataset.sec) || "A").toUpperCase(), false));
    const finish = () => {
      html.classList.remove("is-loading"); $(".loader").classList.add("done");
      introDone = true; introQ.splice(0).forEach(cb => { try { cb(); } catch (e) { console.error(e); } });
      ScrollTrigger.refresh(); onScroll();
    };
    if (reduce || params.has("nointro")) { finish(); return; }
    const prog = { v: 0 };
    const paint = () => { $(".loader__n").textContent = Math.round(prog.v); $(".loader__bar").style.setProperty("--p", prog.v / 100); };
    const firstVideo = $("[data-sec] > .variant:not([hidden]) video");
    const ready = Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(r => { if (!firstVideo || firstVideo.readyState >= 3) r(); else { firstVideo.addEventListener("canplay", r, { once: true }); setTimeout(r, 3500); } })
    ]);
    UX.lenis && UX.lenis.stop();
    const t = gsap.to(prog, { v: 90, duration: 1.3, ease: "power2.out", onUpdate: paint });
    ready.then(() => {
      t.kill();
      gsap.timeline()
        .to(prog, { v: 100, duration: .35, onUpdate: paint })
        .to(".loader__in", { autoAlpha: 0, duration: .3 })
        .to(".loader__panels i", { yPercent: -100, duration: .95, stagger: .07, ease: "expo.inOut" }, "<")
        .add(() => { UX.lenis && UX.lenis.start(); finish(); }, "-=.55");
    });
  });
  addEventListener("load", () => ScrollTrigger.refresh());
  addEventListener("resize", () => onScroll());
})();
