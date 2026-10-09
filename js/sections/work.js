/* ===== 06 · Proyectos · A (favorita) + 5 futuristas ===== */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Filtros por sector (favorita) ---------- */
  register("work", "A", (root, ux) => {
    const items = $$(".work-a__item", root), btns = $$(".work-a__filters button", root), live = $(".work-a__live", root);
    if (!ux.reduce) gsap.from(items, { y: 60, opacity: 0, duration: 1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: $(".work-a__grid", root), start: "top 85%" } });
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
    const bar = $(".work-a__filters", root);
    bar.addEventListener("click", onClick);
    return () => { bar.removeEventListener("click", onClick); items.forEach(it => (it.hidden = false)); btns.forEach((x, i) => x.setAttribute("aria-pressed", i === 0)); };
  });


  /* Texto que se «decodifica» (glifos aleatorios → texto real) */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_";
  const decode = (el, text, dur = 700) => {
    const t0 = performance.now(); let raf;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), n = Math.floor(k * text.length);
      el.textContent = text.slice(0, n) + [...text.slice(n)].map(c => c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join("");
      if (k < 1) raf = requestAnimationFrame(step); else el.textContent = text;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); el.textContent = text; };
  };
  /* Foco de luz que sigue al ratón dentro de cada tarjeta */
  const spotlight = (cards, extra) => {
    const fns = cards.map(c => {
      const f = e => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); extra && extra(c, e, r); };
      c.addEventListener("pointermove", f); return f;
    });
    return () => cards.forEach((c, i) => c.removeEventListener("pointermove", fns[i]));
  };

  /* ---------- B · Archivo HUD ---------- */
  register("work", "B", (root, ux) => {
    const cards = $$(".work-b__card", root);
    const off = spotlight(cards);
    if (ux.reduce) return off;
    gsap.from(cards, { y: 50, opacity: 0, filter: "brightness(2.2)", duration: 1.1, stagger: .06, ease: "expo.out", clearProps: "transform,opacity,filter", scrollTrigger: { trigger: $(".work-b__grid", root), start: "top 85%" } });
    gsap.from($$(".work-b__stats div", root), { x: -20, opacity: 0, duration: .8, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    const ids = $$(".work-b__id", root); const stops = [];
    ScrollTrigger.create({ trigger: $(".work-b__grid", root), start: "top 80%", once: true, onEnter: () => ids.forEach((el, i) => setTimeout(() => stops.push(decode(el.firstChild, el.firstChild.textContent, 600)), i * 60)) });
    return () => { off(); stops.forEach(s => s()); };
  });

  /* ---------- C · Túnel 3D ---------- */
  register("work", "C", (root, ux) => {
    const pin = $(".work-c__pin", root), world = $(".work-c__world", root), cards = $$(".work-c__card", root);
    const count = $(".work-c__count b", root), name = $(".work-c__count span", root), floor = $(".work-c__floor", root);
    const names = cards.map(c => $(".work-c__cap b", c).textContent);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 760px)", () => {
      if (ux.reduce) { root.classList.add("is-flat"); return () => root.classList.remove("is-flat"); }
      const D = 700, N = cards.length;
      const pos = cards.map((c, i) => ({ x: (i % 2 ? 1 : -1) * (180 + (i % 3) * 70), y: ((i % 3) - 1) * 70 }));
      let last = -1;
      const render = p => {
        const cz = p * (N - 1) * D;
        cards.forEach((c, i) => {
          const z = -i * D + cz, w = c.offsetWidth, h = c.offsetHeight;
          const o = z > 500 ? 0 : z > 150 ? 1 - (z - 150) / 350 : z < -3600 ? 0 : z < -2400 ? 1 - (-2400 - z) / 1200 : 1;
          c.style.transform = `translate3d(${pos[i].x - w / 2}px,${pos[i].y - h / 2}px,${z}px) rotateY(${pos[i].x > 0 ? -12 : 12}deg)`;
          c.style.opacity = o; c.style.pointerEvents = o > .5 ? "" : "none";
          c.style.visibility = o <= 0 ? "hidden" : "";
        });
        const idx = Math.min(N - 1, Math.max(0, Math.round(p * (N - 1))));
        if (idx !== last) { last = idx; count.textContent = String(idx + 1).padStart(2, "0"); name.textContent = names[idx]; }
        floor.style.backgroundPosition = `0 ${p * 2400}px, 0 ${p * 2400}px`;
      };
      render(0);
      ScrollTrigger.create({ trigger: pin, start: "top top", end: "+=" + (N * 55) + "%", pin: true, scrub: .8, onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
      return () => cards.forEach(c => { c.style.transform = c.style.opacity = c.style.pointerEvents = c.style.visibility = ""; });
    });
    mm.add("(max-width: 759px)", () => { root.classList.add("is-flat"); return () => root.classList.remove("is-flat"); });
    return () => mm.revert();
  });

  /* ---------- D · Escáner ---------- */
  register("work", "D", (root, ux) => {
    const btns = $$(".work-d__list button", root), front = $(".work-d__img--front", root), back = $(".work-d__img--back", root);
    const laser = $(".work-d__laser", root), bar = $(".work-d__bar i", root), nm = $(".work-d__name", root), sc = $(".work-d__sec", root);
    const data = btns.map(b => ({ name: $("b", b).textContent, sec: $(".work-d__s", b).textContent, img: `assets/img/proyectos/${["eversense","mcdonalds","tke","janssen","venca","tibau","disney","five-guys","tibidabo","3cat","cava-pharma","lexus"][+b.dataset.i]}.webp` }));
    const alts = ["Stand de Eversense","Murales de McDonald's","Furgoneta de TK Elevator","Stand de Janssen","Pop-up de Venca","Camión de Tibau Team","Evento de Disney","Interior de Five Guys","Cubos corporativos del Tibidabo","Mural corporativo de 3cat","Stand de Cava Pharma","Imagen corporativa Lexus"];
    data.forEach(d => { const im = new Image(); im.src = d.img; }); // precarga
    let cur = 0, tl, timer, stopName, stopSec, visible = false;
    const go = i => {
      if (i === cur && tl) return;
      const prev = cur; cur = i;
      btns.forEach((b, k) => b.setAttribute("aria-pressed", k === i));
      tl && tl.kill(); stopName && stopName(); stopSec && stopSec();
      back.src = data[prev].img; front.src = data[i].img; front.alt = alts[i];
      if (ux.reduce) { nm.textContent = data[i].name; sc.textContent = data[i].sec; return; }
      stopName = decode(nm, data[i].name, 600); stopSec = decode(sc, data[i].sec, 500);
      tl = gsap.timeline()
        .fromTo(front, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power2.inOut" }, 0)
        .fromTo(laser, { top: "0%", opacity: 1 }, { top: "100%", duration: 1.1, ease: "power2.inOut" }, 0)
        .to(laser, { opacity: 0, duration: .2 }, 1.1);
      restart();
    };
    const restart = () => {
      if (ux.reduce) return;
      gsap.killTweensOf(bar); clearTimeout(timer);
      if (!visible) { gsap.set(bar, { scaleX: 0 }); return; }
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: "none" });
      timer = setTimeout(() => go((cur + 1) % data.length), 5000);
    };
    const onClick = e => { const b = e.target.closest("button"); if (b) go(+b.dataset.i); };
    const list = $(".work-d__list", root); list.addEventListener("click", onClick);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; restart(); }, { threshold: .35 });
    io.observe($(".work-d__stage", root));
    if (!ux.reduce) gsap.from($$(".work-d__list li", root), { x: -30, opacity: 0, duration: .8, stagger: .04, ease: "expo.out", scrollTrigger: { trigger: list, start: "top 85%" } });
    return () => { list.removeEventListener("click", onClick); io.disconnect(); clearTimeout(timer); tl && tl.kill(); stopName && stopName(); stopSec && stopSec(); };
  });

  /* ---------- E · Terminal ---------- */
  register("work", "E", (root, ux) => {
    const typed = $(".work-e__typed", root), out = $(".work-e__out", root), items = $$(".work-e__item", root), chips = $$(".work-e__chips button", root);
    let typing, busy = 0;
    const type = (txt, done) => {
      clearInterval(typing);
      if (ux.reduce) { typed.textContent = txt; return done(); }
      let i = 0; typed.textContent = "";
      typing = setInterval(() => { typed.textContent = txt.slice(0, ++i); if (i >= txt.length) { clearInterval(typing); done(); } }, 28);
    };
    const show = f => {
      const tok = ++busy;
      const cmd = f === "*" ? "unical ls proyectos" : `unical ls proyectos --sector=${f}`;
      out.textContent = "…";
      if (!ux.reduce) gsap.to(items.filter(it => !it.hidden), { opacity: 0, duration: .2 });
      type(cmd, () => {
        if (tok !== busy) return;
        items.forEach(it => { it.hidden = !(f === "*" || it.dataset.s === f); });
        const shown = items.filter(it => !it.hidden);
        out.textContent = `→ ${shown.length} resultado${shown.length === 1 ? "" : "s"} · ordenados por fecha`;
        if (!ux.reduce) gsap.fromTo(shown, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .05, ease: "expo.out" });
        else gsap.set(shown, { opacity: 1 });
        ScrollTrigger.refresh();
      });
    };
    const onClick = e => { const b = e.target.closest("button"); if (!b) return; chips.forEach(x => x.setAttribute("aria-pressed", x === b)); show(b.dataset.f); };
    const bar = $(".work-e__chips", root); bar.addEventListener("click", onClick);
    if (!ux.reduce) {
      gsap.set(items, { opacity: 0 }); typed.textContent = "";
      ScrollTrigger.create({ trigger: $(".work-e__win", root), start: "top 75%", once: true, onEnter: () => show("*") });
    }
    return () => { bar.removeEventListener("click", onClick); clearInterval(typing); busy++; items.forEach(it => { it.hidden = false; }); gsap.set(items, { clearProps: "opacity,transform" }); typed.textContent = "unical ls proyectos"; chips.forEach((x, i) => x.setAttribute("aria-pressed", i === 0)); };
  });

  /* ---------- F · Cristal holográfico ---------- */
  register("work", "F", (root, ux) => {
    const cards = $$(".work-f__card", root);
    const off = spotlight(cards, ux.fine && !ux.reduce ? (c, e, r) => {
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty("--ry", (px * 14) + "deg"); c.style.setProperty("--rx", (-py * 14) + "deg");
    } : null);
    const reset = e => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };
    cards.forEach(c => c.addEventListener("pointerleave", reset));
    // Campo de puntos que respira y se aparta del ratón
    const cv = $(".work-f__field", root), ctx = cv.getContext("2d");
    let W, H, dots = [], raf = 0, run = false, mx = -1e4, my = -1e4;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1); W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = []; const g = W < 700 ? 34 : 42;
      for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) dots.push({ x, y, p: Math.random() * 6.28 });
    };
    const draw = t => {
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy), push = Math.max(0, 1 - dist / 180);
        const a = .12 + .1 * Math.sin(t / 900 + d.p + d.y / 140) + push * .6;
        ctx.fillStyle = `rgba(153,196,228,${a})`;
        ctx.beginPath(); ctx.arc(d.x + (dist ? dx / dist : 0) * push * 14, d.y + (dist ? dy / dist : 0) * push * 14, 1.1 + push * 1.6, 0, 6.283); ctx.fill();
      }
      if (run) raf = requestAnimationFrame(draw);
    };
    size();
    const io = new IntersectionObserver(([en]) => { run = en.isIntersecting && !ux.reduce; cancelAnimationFrame(raf); if (run) raf = requestAnimationFrame(draw); else draw(0); });
    io.observe(root);
    const pm = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    root.addEventListener("pointermove", pm);
    const ro = new ResizeObserver(size); ro.observe(cv);
    if (!ux.reduce) gsap.from(cards, { y: 80, rotateX: -25, opacity: 0, duration: 1.2, stagger: .06, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: $(".work-f__grid", root), start: "top 85%" } });
    return () => { off(); cards.forEach(c => c.removeEventListener("pointerleave", reset)); io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); run = false; root.removeEventListener("pointermove", pm); };
  });
})();

/* Proyectos · G–K: impacto editorial, sin recursos tecnológicos */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- G · Pliegos apilados ---------- */
  register("work", "G", (root, ux) => {
    const sheets = $$(".work-g__sheet", root);
    if (ux.reduce) return;
    sheets.forEach((s, i) => {
      const next = sheets[i + 1];
      if (next) gsap.to(s, { scale: .93, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: () => "top " + (parseFloat(getComputedStyle(next).top) || 96) + "px", scrub: true, invalidateOnRefresh: true } });
      gsap.from($("img", s), { scale: 1.18, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "top 30%", scrub: true } });
    });
  });

  /* ---------- H · Zoom a sangre ---------- */
  register("work", "H", (root, ux) => {
    const pin = $(".work-h__pin", root), tiles = $$(".work-h__t", root), center = $(".work-h__t--c", root);
    if (ux.reduce) { root.classList.add("is-static"); return () => root.classList.remove("is-static"); }
    const gap = () => Math.max(10, innerWidth * .012);
    const off = (t, k) => { const i = +t.dataset.i, c = i % 3 - 1, r = Math.floor(i / 3) - 1; return { x: c * (t.offsetWidth + gap()) * k, y: r * (t.offsetHeight + gap()) * k }; };
    tiles.forEach(t => gsap.set(t, off(t, 1)));
    const cover = () => Math.max(pin.offsetWidth / center.offsetWidth, pin.offsetHeight / center.offsetHeight) * 1.02;
    const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: "+=170%", pin: true, scrub: .7, invalidateOnRefresh: true,
      onRefresh: () => tiles.forEach(t => t !== center && gsap.set(t, off(t, 1))) } });
    tl.to($(".work-h__head", root), { autoAlpha: 0, y: -40, duration: .25 }, 0)
      .to(tiles.filter(t => t !== center), { x: (i, t) => off(t, 3.2).x, y: (i, t) => off(t, 3.2).y, autoAlpha: 0, duration: .7, ease: "power2.in" }, 0)
      .to(center, { scale: cover, y: () => pin.offsetHeight * .5 - (center.offsetTop + center.offsetHeight / 2), borderRadius: 0, duration: .8, ease: "power2.inOut" }, .05)
      .to($(".work-h__shade", root), { opacity: 1, duration: .3 }, .6)
      .fromTo($(".work-h__over", root), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .3 }, .7);
    gsap.from($(".work-h__grid", root), { scale: .9, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: pin, start: "top 75%" } });
  });

  /* ---------- I · Collage recortado ---------- */
  register("work", "I", (root, ux) => {
    const cuts = $$(".work-i__cut", root);
    if (ux.reduce) return;
    gsap.from(cuts, { y: 90, rotate: (i) => (i % 2 ? 8 : -8), opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", clearProps: "opacity", scrollTrigger: { trigger: $(".work-i__board", root), start: "top 80%" } });
    const mm = gsap.matchMedia();
    mm.add("(min-width:801px)", () => {
      cuts.forEach((c, i) => {
        const s = [.6, -.4, 1, -.7, .3, .9, -.5, .5][i] || .4;
        gsap.fromTo(c, { yPercent: s * 14 }, { yPercent: -s * 14, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.fromTo($(".work-i__bg", root), { xPercent: -42 }, { xPercent: -58, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  });

  /* ---------- J · Doble marquesina ---------- */
  register("work", "J", (root, ux) => {
    const rows = $$(".work-j__row", root).map(r => ({ r, t: $(".work-j__track", r), set: $(".work-j__set", r), dir: +r.dataset.dir, x: 0, hold: false }));
    if (ux.reduce) { rows.forEach(o => { o.r.style.overflowX = "auto"; }); return () => rows.forEach(o => { o.r.style.overflowX = ""; }); }
    let vel = 0, on = false;
    const st = ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onUpdate: s => { vel = Math.min(Math.abs(s.getVelocity()) / 250, 8); } });
    const ent = [], lv = [];
    rows.forEach(o => {
      const a = () => o.hold = true, b = () => o.hold = false;
      o.r.addEventListener("pointerenter", a); o.r.addEventListener("pointerleave", b);
      o.r.addEventListener("focusin", a); o.r.addEventListener("focusout", b);
      ent.push([o.r, a, b]);
    });
    const tick = (t, dt) => {
      if (!on) return;
      vel *= .92;
      rows.forEach((o, i) => {
        const w = o.set.offsetWidth; if (!w) return;
        const base = o.r.classList.contains("work-j__row--type") ? .9 : .55;
        const sp = o.hold ? 0 : base * (1 + vel) * (dt / 16.7);
        o.x = (o.x + o.dir * sp) % w;
        const x = o.dir < 0 ? o.x : o.x - w;
        o.t.style.transform = `translate3d(${x}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    const io = new IntersectionObserver(([e]) => on = e.isIntersecting); io.observe(root);
    return () => { gsap.ticker.remove(tick); io.disconnect(); st.kill(); ent.forEach(([r, a, b]) => { r.removeEventListener("pointerenter", a); r.removeEventListener("pointerleave", b); r.removeEventListener("focusin", a); r.removeEventListener("focusout", b); }); };
  });

  /* ---------- K · Muro editorial ---------- */
  register("work", "K", (root, ux) => {
    if (ux.reduce) return;
    gsap.from($(".work-k__head", root), { opacity: 0, y: 40, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 75%" } });
    $$(".work-k__ph", root).forEach(ph => {
      gsap.timeline({ scrollTrigger: { trigger: ph, start: "top 90%" } })
        .fromTo(ph, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" })
        .fromTo($("img", ph), { scale: 1.3, transition: "none" }, { scale: 1, duration: 1.6, ease: "expo.out", clearProps: "transform,transition" }, .1);
    });
    $$(".work-k__q", root).forEach(q => gsap.from(q.children.length ? q.firstElementChild : q, { yPercent: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: q, start: "top 85%" } }));
  });
})();
