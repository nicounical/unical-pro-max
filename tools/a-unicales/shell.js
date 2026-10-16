/* Landing · diseños «Pro Max» (selección del 2026-10-16).
   Generado desde unical-pro-max: el código de cada sección es el mismo de js/sections/*.js de la Pro Max
   (con rutas y textos de interfaz adaptados). Aquí solo hay un núcleo mínimo que sustituye a su core.js:
   UX.register / ux.$ / ux.reduce / revelado .rv / contadores / vídeos data-autoplay / modal del showreel.
   index.tsx llama a initLanding(root, lang) al montar y en cada cambio de idioma; devuelve la limpieza. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const I18N = /*I18N*/;
let LANG = "es";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = typeof matchMedia === "function" && matchMedia("(hover: hover) and (pointer: fine)").matches;
const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const registry = {};

const splitBy = (cls, el) => {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.append(" "); return; }
        if (cls === "word") { const s = document.createElement("span"); s.className = "word"; s.textContent = w; frag.append(s); return; }
        const word = document.createElement("span"); word.style.display = "inline-block"; word.style.whiteSpace = "nowrap";
        [...w].forEach(ch => { const s = document.createElement("span"); s.className = "char"; s.textContent = ch; word.append(s); });
        frag.append(word);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && !n.classList.contains(cls)) walk(n);
  });
  if (!el.dataset.split) { walk(el); el.dataset.split = cls; }
  return $$("." + cls, el);
};

let openModal = () => {};
const UX = {
  $, $$, reduce, fine, fmt, lenis: null,
  splitChars: el => splitBy("char", el), splitWords: el => splitBy("word", el),
  register(sec, v, fn) { registry[`${sec}:${v}`] = fn; },
  onIntro(cb) { cb(); },                       // en la web no hay pantalla de precarga
  t: k => (I18N[LANG] && I18N[LANG][k]) || I18N.es[k] || k,
  counter(el, opts = {}) {
    const end = +el.dataset.count;
    if (reduce) { el.textContent = fmt(end); return; }
    const o = { v: 0 }; el.textContent = "0";
    gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: () => (el.textContent = fmt(o.v)), scrollTrigger: { trigger: el, start: "top 88%", once: true, ...opts } });
  },
  openReel() { openModal(); },
  refresh() { ScrollTrigger.refresh(); }
};

/*SECTIONS*/

/* ---------- Arranque / limpieza ---------- */
export function initLanding(root, lang = "es") {
  LANG = lang;
  const offs = [], cleanups = [];
  const on = (t, type, fn, o) => { t.addEventListener(type, fn, o); offs.push(() => t.removeEventListener(type, fn, o)); };

  // Modal del showreel
  const modal = $(".modal", root), mv = modal && $(".modal__v", modal); let lastFocus;
  const close = () => { if (!modal) return; mv.pause(); modal.hidden = true; lastFocus && lastFocus.focus(); };
  openModal = () => { if (!modal) return; lastFocus = document.activeElement; modal.hidden = false; mv.currentTime = 0; mv.play().catch(() => {}); $(".modal__x", modal).focus(); };
  if (modal) {
    on($(".modal__x", modal), "click", close);
    on(modal, "click", e => { if (e.target === modal) close(); });
    on(window, "keydown", e => { if (e.key === "Escape" && !modal.hidden) close(); });
  }
  on(root, "click", e => { if (e.target.closest("[data-reel]")) { e.preventDefault(); openModal(); } });

  // Cabecera de la web transparente sobre la portada hasta que se hace scroll
  const hd = document.querySelector(".uc-chrome-header");
  const overHero = () => hd && hd.classList.toggle("uc-over-hero", scrollY < 40);
  overHero(); on(window, "scroll", overHero, { passive: true });
  offs.push(() => hd && hd.classList.remove("uc-over-hero"));

  // Vídeos con data-autoplay: solo se reproducen mientras se ven
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
  }), { rootMargin: "150px" });
  $$("video[data-autoplay]", root).forEach(v => { v.muted = true; vio.observe(v); });
  offs.push(() => vio.disconnect());

  const ctx = gsap.context(() => {
    $$("[data-sec] > .variant", root).forEach(el => {
      const key = `${el.parentElement.dataset.sec}:${el.dataset.v}`;
      const rv = $$(".rv", el);
      if (!reduce && rv.length) ScrollTrigger.batch(rv, { start: "top 88%", once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: "expo.out" }) });
      else gsap.set(rv, { opacity: 1, y: 0 });
      $$("[data-count]:not([data-count-manual])", el).forEach(c => UX.counter(c));
      const fn = registry[key];
      if (fn) { try { const c = fn(el, UX); if (typeof c === "function") cleanups.push(c); } catch (err) { console.error("[landing]", key, err); } }
    });
  }, root);

  // Las fotos y los vídeos cambian la altura de la página: recalcular los disparadores al cargar
  const refresh = () => ScrollTrigger.refresh();
  on(window, "load", refresh);
  const t1 = setTimeout(refresh, 400), t2 = setTimeout(refresh, 1500);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  return () => {
    clearTimeout(t1); clearTimeout(t2);
    cleanups.forEach(c => { try { c(); } catch (e) { /* ya desmontado */ } });
    ctx.revert();
    offs.forEach(f => f());
    $$("video", root).forEach(v => v.pause());
    openModal = () => {};
  };
}
