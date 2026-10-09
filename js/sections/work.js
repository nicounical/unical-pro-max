/* ===== 06 · Proyectos (5 versiones) ===== */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Índice flotante + galería con profundidad ---------- */
  register("work", "A", (root, ux) => {
    if (ux.reduce) return;
    gsap.from($$(".work-a__list li", root), { yPercent: 60, opacity: 0, duration: 1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: $(".work-a__list", root), start: "top 80%" } });
    gsap.from($(".work-a__head .big", root), { yPercent: 30, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 701px)", () => {
      $$(".work-a__g", root).forEach((g, i) => {
        gsap.to(g, { yPercent: [-.25, .15, -.1, .2, -.18][i] * 100, ease: "none", scrollTrigger: { trigger: $(".work-a__gallery", root), start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    $$(".work-a__m img", root).forEach(img => gsap.fromTo(img, { yPercent: -15 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
    $$(".work-a__m", root).forEach(m => gsap.from(m, { clipPath: "inset(100% 0 0 0 round 14px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: m, start: "top 88%" } }));

    let off = () => {};
    if (ux.fine) {
      const fl = $(".work-a__float", root), fin = $(".work-a__float-in", root), list = $(".work-a__list", root);
      const fx = gsap.quickTo(fl, "x", { duration: .6, ease: "power3" }), fy = gsap.quickTo(fl, "y", { duration: .6, ease: "power3" });
      let cur = "";
      const move = e => { fx(e.clientX); fy(e.clientY); };
      const over = e => {
        const a = e.target.closest("a[data-media]"); if (!a || a.dataset.media === cur) return;
        cur = a.dataset.media;
        const isV = a.dataset.type === "video";
        const m = document.createElement(isV ? "video" : "img");
        if (isV) { m.muted = true; m.loop = true; m.playsInline = true; m.autoplay = true; m.setAttribute("aria-hidden", "true"); } else m.alt = "";
        m.src = cur; m.style.opacity = 0; fin.append(m);
        requestAnimationFrame(() => (m.style.opacity = 1));
        while (fin.children.length > 2) fin.firstChild.remove();
        fl.classList.add("on");
      };
      const leave = () => { fl.classList.remove("on"); cur = ""; };
      list.addEventListener("pointermove", move); list.addEventListener("pointerover", over); list.addEventListener("pointerleave", leave);
      off = () => { list.removeEventListener("pointermove", move); list.removeEventListener("pointerover", over); list.removeEventListener("pointerleave", leave); leave(); fin.innerHTML = ""; };
    }
    return () => { mm.revert(); off(); };
  });

  /* ---------- B · Galería horizontal fijada ---------- */
  register("work", "B", (root, ux) => {
    const track = $(".work-b__track", root), pin = $(".work-b__pin", root), count = $(".work-b__count b", root);
    const titles = $$(".work-b__t", root);
    if (ux.reduce) return;
    const chars = titles.map(t => ux.splitChars(t));
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tw = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: .7, invalidateOnRefresh: true,
          onUpdate: s => { pin.querySelector(".work-b__bar").style.setProperty("--p", s.progress); count.textContent = String(Math.min(6, 1 + Math.floor(s.progress * 6.3))).padStart(2, "0"); } }
      });
      $$(".work-b__frame img", root).forEach(img => gsap.fromTo(img, { xPercent: -23 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tw, start: "left right", end: "right left", scrub: true } }));
      chars.forEach((cs, i) => {
        const anim = { yPercent: 0, opacity: 1, duration: .8, stagger: .025, ease: "expo.out" };
        // Las tarjetas que ya se ven al fijar la galería se animan al entrar en la sección
        if (titles[i].closest(".work-b__card").offsetLeft < innerWidth * .8) gsap.fromTo(cs, { yPercent: 110, opacity: 0 }, { ...anim, delay: i * .12, scrollTrigger: { trigger: root, start: "top 60%" } });
        else gsap.fromTo(cs, { yPercent: 110, opacity: 0 }, { ...anim, scrollTrigger: { trigger: titles[i], containerAnimation: tw, start: "left 85%", toggleActions: "play none none reverse" } });
      });
      $$(".work-b__frame", root).forEach(f => gsap.from(f, { clipPath: "inset(0 0 0 100% round 16px)", ease: "none", scrollTrigger: { trigger: f, containerAnimation: tw, start: "left right", end: "left 55%", scrub: true } }));
    });
    mm.add("(max-width: 760px)", () => {
      chars.forEach((cs, i) => gsap.from(cs, { yPercent: 110, opacity: 0, duration: .8, stagger: .025, ease: "expo.out", scrollTrigger: { trigger: titles[i], start: "top 92%" } }));
    });
    gsap.from($(".work-b__h", root), { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => mm.revert();
  });

  /* ---------- C · Filtros con transición FLIP ---------- */
  register("work", "C", (root, ux) => {
    const items = $$(".work-c__item", root), btns = $$(".work-c__filters button", root), live = $(".work-c__live", root);
    if (!ux.reduce) gsap.from(items, { y: 60, opacity: 0, duration: 1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: $(".work-c__grid", root), start: "top 85%" } });
    let busy = false;
    const apply = async f => {
      if (busy) return; busy = true;
      const match = it => f === "*" || it.dataset.s === f;
      const leaving = items.filter(it => !it.hidden && !match(it));
      if (!ux.reduce && leaving.length) await gsap.to(leaving, { opacity: 0, scale: .9, duration: .25, ease: "power2.in" });
      const first = new Map(items.filter(it => !it.hidden).map(it => [it, it.getBoundingClientRect()]));
      items.forEach(it => { it.hidden = !match(it); gsap.set(it, { clearProps: "opacity,scale,transform" }); });
      const shown = items.filter(it => !it.hidden);
      live.textContent = `${shown.length} proyectos`;
      if (!ux.reduce) {
        shown.forEach(it => {
          const a = first.get(it), b = it.getBoundingClientRect();
          if (a) gsap.from(it, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: "0 0", duration: .8, ease: "expo.inOut" });
          else gsap.from(it, { opacity: 0, scale: .85, duration: .6, delay: .25, ease: "expo.out" });
        });
      }
      ScrollTrigger.refresh();
      busy = false;
    };
    const onClick = e => {
      const b = e.target.closest("button"); if (!b) return;
      btns.forEach(x => x.setAttribute("aria-pressed", x === b));
      apply(b.dataset.f);
    };
    const bar = $(".work-c__filters", root);
    bar.addEventListener("click", onClick);
    return () => { bar.removeEventListener("click", onClick); items.forEach(it => (it.hidden = false)); btns.forEach((x, i) => x.setAttribute("aria-pressed", i === 0)); };
  });

  /* ---------- D · Caso destacado con cortina ---------- */
  const CASES = [
    { id: "lexus", t: "Lexus", video: "assets/video/hero-lexus.mp4", poster: "assets/video/hero-lexus.jpg", thumb: "assets/img/proyectos/lexus.webp",
      cliente: "Lexus", servicio: "Car wrapping integral", reto: "Vestir coches de exposición con la estética de Black Panther: Wakanda Forever.", hicimos: "Diseño adaptado a cada modelo, impresión, laminado y aplicación del vinilo pieza a pieza." },
    { id: "cirsa", t: "CIRSA", video: "assets/video/evento-cirsa.mp4", poster: "assets/video/evento-cirsa.jpg", thumb: "assets/video/evento-cirsa.jpg",
      cliente: "CIRSA", servicio: "Eventos · photocall", reto: "Un fondo de escenario para «La ilusión une» que funcionase en directo y en foto.", hicimos: "Producción e instalación del photocall con iluminación integrada." },
    { id: "tke", t: "TK Elevator", img: "assets/img/proyectos/tke.webp", thumb: "assets/img/proyectos/tke.webp",
      cliente: "TKE – TK Elevator", servicio: "Rotulación de vehículos", reto: "Reproducir el degradado naranja-morado de su nueva identidad sin cortes, también sobre puertas, juntas y molduras.", hicimos: "Diseño, impresión y wrapping del vehículo corporativo con la nueva imagen global." },
    { id: "mcd", t: "McDonald’s", img: "assets/img/proyectos/mcdonalds.webp", thumb: "assets/img/proyectos/mcdonalds.webp",
      cliente: "McDonald’s", servicio: "Interiorismo y vinilos", reto: "Instalar gráfica decorativa en locales abiertos al público, con materiales para alta afluencia.", hicimos: "Murales, vinilos y paneles gráficos producidos e instalados en restaurantes en funcionamiento." },
    { id: "eversense", t: "Eversense", img: "assets/img/proyectos/eversense.webp", thumb: "assets/img/proyectos/eversense.webp",
      cliente: "Eversense", servicio: "Stand para congreso", reto: "Destacar en un congreso médico con un espacio claro y memorable.", hicimos: "Diseño, fabricación y montaje del stand llave en mano." },
    { id: "janssen", t: "Janssen", img: "assets/img/proyectos/janssen.webp", thumb: "assets/img/proyectos/janssen.webp",
      cliente: "Janssen Oncology", servicio: "Stand llave en mano", reto: "Un stand de oncología con presencia y orden para un congreso internacional.", hicimos: "Estructura, gráfica, iluminación, transporte y montaje." }
  ];
  register("work", "D", (root, ux) => {
    const media = $(".work-d__media", root), title = $(".work-d__title", root), thumbs = $(".work-d__thumbs", root), curtain = $(".work-d__curtain", root);
    thumbs.innerHTML = CASES.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-label="${c.t}" data-i="${i}"><img src="${c.thumb}" alt="" loading="lazy"><span>${c.t}</span></button>`).join("");
    let cur = -1, busy = false;
    const fill = i => {
      const c = CASES[i];
      media.innerHTML = c.video
        ? `<video src="${c.video}" poster="${c.poster}" muted loop playsinline autoplay aria-hidden="true"></video>`
        : `<img src="${c.img}" alt="">`;
      const v = $("video", media); if (v) { v.muted = true; v.play().catch(() => {}); }
      delete title.dataset.split; title.textContent = c.t;
      $$("[data-k]", root).forEach(dd => (dd.textContent = c[dd.dataset.k]));
      $$("button", thumbs).forEach((b, j) => b.setAttribute("aria-selected", j === i));
      cur = i;
    };
    const go = i => {
      if (i === cur || busy) return;
      if (ux.reduce) { fill(i); return; }
      busy = true;
      gsap.timeline({ onComplete: () => (busy = false) })
        .set(curtain, { transformOrigin: "bottom" })
        .to(curtain, { scaleY: 1, duration: .55, ease: "expo.in" })
        .add(() => fill(i))
        .set(curtain, { transformOrigin: "top" })
        .to(curtain, { scaleY: 0, duration: .7, ease: "expo.out" })
        .from(ux.splitChars(title), { yPercent: 110, opacity: 0, duration: .8, stagger: .03, ease: "expo.out" }, "-=.45")
        .from($$(".work-d__sheet > div", root), { y: 24, opacity: 0, duration: .6, stagger: .06, ease: "expo.out" }, "<.1")
        .fromTo($("video,img", media), { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "expo.out" }, "<-.3");
    };
    fill(0);
    ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onToggle: s => { const v = $("video", media); if (v) s.isActive ? v.play().catch(() => {}) : v.pause(); } });
    if (!ux.reduce) {
      ScrollTrigger.create({ trigger: root, start: "top 70%", once: true, onEnter: () => {
        gsap.from(ux.splitChars(title), { yPercent: 110, opacity: 0, duration: 1, stagger: .03, ease: "expo.out" });
        gsap.from($$(".work-d__sheet > div, .work-d__thumbs button", root), { y: 30, opacity: 0, duration: .8, stagger: .05, ease: "expo.out", delay: .2 });
      } });
    }
    const onClick = e => { const b = e.target.closest("button[data-i]"); if (b) go(+b.dataset.i); };
    const onKey = e => {
      if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const n = (cur + (e.key === "ArrowRight" ? 1 : -1) + CASES.length) % CASES.length;
      go(n); $$("button", thumbs)[n].focus();
    };
    thumbs.addEventListener("click", onClick); thumbs.addEventListener("keydown", onKey);
    return () => { thumbs.removeEventListener("click", onClick); thumbs.removeEventListener("keydown", onKey); media.innerHTML = ""; delete title.dataset.split; };
  });

  /* ---------- E · Cilindro 3D ---------- */
  register("work", "E", (root, ux) => {
    const pin = $(".work-e__pin", root), scene = $(".work-e__scene", root), ring = $(".work-e__ring", root);
    const panels = $$(".work-e__p", root), N = panels.length, step = 360 / N;
    const tEl = $(".work-e__t", root), sEl = $(".work-e__s", root);
    let R = 0, cur = 0, target = 0, scrollRot = 0, drag = 0, front = -1;
    const layout = () => {
      const w = innerWidth < 600 ? 150 : Math.min(280, Math.max(180, innerWidth * .17));
      ring.style.setProperty("--w", w + "px");
      R = Math.round((w / 2) / Math.tan(Math.PI / N) * 1.18);
      panels.forEach((p, i) => (p.style.transform = `rotateY(${i * step}deg) translateZ(${R}px)`));
    };
    const setFront = i => {
      if (i === front) return; front = i;
      tEl.textContent = panels[i].dataset.t; sEl.textContent = panels[i].dataset.s;
      if (!ux.reduce) gsap.fromTo(tEl, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: "expo.out", overwrite: true });
    };
    const render = () => {
      cur += (target - cur) * .09;
      ring.style.transform = `translateZ(${-R}px) rotateX(-4deg) rotateY(${-cur}deg)`;
      panels.forEach((p, i) => {
        let d = ((i * step - cur) % 360 + 540) % 360 - 180;
        p.style.setProperty("--dim", Math.min(.75, Math.abs(d) / 120).toFixed(2));
      });
      setFront(((Math.round(cur / step) % N) + N) % N);
    };
    layout(); render();
    if (ux.reduce) { cur = 0; render(); return; }
    const tick = () => { target = scrollRot + drag; render(); };
    gsap.ticker.add(tick);
    ScrollTrigger.create({ trigger: pin, start: "top top", end: "+=220%", pin: true, scrub: true, onUpdate: s => (scrollRot = s.progress * 360) });
    gsap.from(ring, { scale: .6, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
    let down = false, x0 = 0, d0 = 0;
    const pd = e => { down = true; x0 = e.clientX; d0 = drag; scene.setPointerCapture && scene.setPointerCapture(e.pointerId); };
    const pm = e => { if (down) drag = d0 - (e.clientX - x0) * .25; };
    const pu = () => { if (!down) return; down = false; drag = Math.round((drag + scrollRot) / step) * step - scrollRot; };
    scene.addEventListener("pointerdown", pd); scene.addEventListener("pointermove", pm);
    addEventListener("pointerup", pu); addEventListener("resize", layout);
    return () => { gsap.ticker.remove(tick); scene.removeEventListener("pointerdown", pd); scene.removeEventListener("pointermove", pm); removeEventListener("pointerup", pu); removeEventListener("resize", layout); };
  });
})();
