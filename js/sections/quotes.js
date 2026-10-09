/* ===== 09 · Opiniones (A–E) ===== */
(() => {
  const { register, $, $$ } = UX;
  const Q = [
    { q: "La rotulación de nuestra flota fue impecable. Coordinaron más de 30 vehículos en diferentes ubicaciones con un resultado uniforme y profesional.", n: "Jordi Puig", e: "Toyota España", img: "proyectos/jpujol", photo: "Rotulación de flota J.Pujol", logo: "toyota" },
    { q: "Montaron nuestro stand para el MWC en tiempo récord. El diseño y la calidad de producción superaron todas nuestras expectativas.", n: "Pedro Fernández", e: "AstraZeneca", img: "proyectos/eversense", photo: "Stand Eversense" },
    { q: "Llevamos 5 años confiando en Unical para todos nuestros proyectos de producción visual. Calidad excepcional y siempre cumplen, incluso con plazos imposibles.", n: "Laura Martínez", e: "Agencia Creativa Bloom", img: "proyectos/3cat", photo: "Mural corporativo 3cat" },
    { q: "Desde la publicidad exterior hasta la decoración interior de nuestros restaurantes, Unical entiende perfectamente nuestras necesidades de marca.", n: "Ana García", e: "Five Guys Spain", img: "proyectos/five-guys", photo: "Interior Five Guys" },
    { q: "Excelente trabajo en la señalética y decoración de nuestro hotel. Profesionalidad, cumplimiento de plazos y un resultado impecable. Repetiremos seguro.", n: "Marc Solà", e: "Hotel Majestic", img: "servicios/hoteles", photo: "Renovación de hoteles" }
  ];
  const ini = n => n.split(" ").map(w => w[0]).join("").slice(0, 2);
  const pad = n => String(n).padStart(2, "0");
  const stars = "★★★★★";

  /* ---------- Contenido (se pinta al cargar, para que exista aunque no haya JS de animación) ---------- */
  const render = {
    a: el => el.innerHTML = Q.map((o, i) => `<figure class="quotes-a__q${i ? "" : " on"}"><blockquote>“${o.q}”</blockquote><figcaption><b>${o.n}</b> · ${o.e}</figcaption></figure>`).join(""),
    b: el => el.innerHTML = Q.map(o => `<figure class="quotes-b__card"><span class="quotes-b__stars" aria-label="5 estrellas">${stars}</span><blockquote>“${o.q}”</blockquote><figcaption class="quotes-b__who"><span class="quotes-b__av" aria-hidden="true">${ini(o.n)}</span><span><b>${o.n}</b><span>${o.e}</span></span></figcaption></figure>`).join(""),
    c: el => {
      const card = (o, big) => `<figure class="quotes-c__card${big ? " quotes-c__card--big" : ""}"><span class="s" aria-label="5 estrellas">${stars}</span><blockquote>“${o.q}”</blockquote><b>${o.n}</b><span>${o.e}</span></figure>`;
      const rot = k => Q.slice(k).concat(Q.slice(0, k));
      el.innerHTML = [0, 2, 4].map((k, c) => {
        const cards = rot(k).map((o, i) => card(o, (i + c) % 3 === 0)).join("");
        return `<div class="quotes-c__col" data-dir="${c === 1 ? 1 : -1}">${cards}<div class="quotes-c__dup" aria-hidden="true" style="display:contents">${cards}</div></div>`;
      }).join("");
    },
    d: el => el.innerHTML = Q.map((o, i) => `<figure class="quotes-d__slide${i ? "" : " on"}"><img class="bg" src="assets/img/${o.img}.webp" alt="" loading="lazy"><div class="quotes-d__body">${o.logo ? `<img class="quotes-d__logo" src="assets/img/clientes/${o.logo}.png" alt="${o.e}">` : ""}<blockquote>“${o.q}”</blockquote><figcaption><b>${o.n}</b> · ${o.e}</figcaption></div><p class="quotes-d__photo mono">En la imagen: ${o.photo}</p></figure>`).join("")
  };
  $$("#opiniones [data-q-render]").forEach(el => render[el.dataset.qRender](el));
  // D: puntos · E: barras
  $(".quotes-d__dots").innerHTML = Q.map((o, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-label="Opinión de ${o.n}"><i></i></button>`).join("");
  $(".quotes-e [data-bars]").innerHTML = Q.map((o, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-label="Opinión de ${o.n}"><i></i></button>`).join("");
  // E: estado inicial legible
  $(".quotes-e [data-type]").textContent = `${Q[0].q}`;
  $(".quotes-e [data-who]").innerHTML = `<b>${Q[0].n}</b> · ${Q[0].e}`;

  /* ---------- A · Cita grande ---------- */
  register("quotes", "A", (root, ux) => {
    const qs = $$(".quotes-a__q", root), label = $("[data-count-label]", root);
    qs.forEach(q => { const b = $("blockquote", q); if (!b.dataset.w) { b.innerHTML = b.textContent.split(/\s+/).map(w => `<span class="qw"><span>${w}</span></span>`).join(" "); b.dataset.w = 1; } });
    let i = 0, timer;
    const set = n => {
      const prev = qs[i]; i = (n + qs.length) % qs.length; const cur = qs[i];
      label.textContent = `${pad(i + 1)} / ${pad(qs.length)}`;
      if (ux.reduce) { qs.forEach(q => q.classList.toggle("on", q === cur)); return; }
      if (prev !== cur) gsap.to($$(".qw > span", prev), { yPercent: -110, duration: .45, stagger: .008, ease: "power3.in", onComplete: () => { prev.classList.remove("on"); gsap.set($$(".qw > span", prev), { yPercent: 0 }); } });
      cur.classList.add("on");
      gsap.fromTo($$(".qw > span", cur), { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: .018, ease: "expo.out", delay: prev !== cur ? .4 : 0 });
      gsap.fromTo($("figcaption", cur), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .6, delay: .8 });
    };
    const auto = () => { clearInterval(timer); if (!ux.reduce) timer = setInterval(() => set(i + 1), 7000); };
    $$("[data-dir]", root).forEach(b => b.onclick = () => { set(i + +b.dataset.dir); auto(); });
    qs.forEach((q, k) => q.classList.toggle("on", k === 0));
    if (!ux.reduce) ScrollTrigger.create({ trigger: root, start: "top 70%", once: true, onEnter: () => { set(0); auto(); } });
    return () => clearInterval(timer);
  });

  /* ---------- B · Baraja ---------- */
  register("quotes", "B", (root, ux) => {
    const deck = $(".quotes-b__deck", root), label = $("[data-count-label]", root);
    let order = $$(".quotes-b__card", deck), shown = 0;
    const layout = (instant) => {
      order.forEach((c, k) => {
        c.style.zIndex = order.length - k;
        c.setAttribute("aria-hidden", k ? "true" : "false");
        const props = { x: 0, y: k * 14, scale: 1 - k * .05, rotate: k === 0 ? 0 : (k % 2 ? 3 : -3) * Math.min(k, 2), opacity: k > 3 ? 0 : 1 };
        ux.reduce || instant ? gsap.set(c, props) : gsap.to(c, { ...props, duration: .6, ease: "expo.out" });
      });
      label.textContent = `${pad((shown % Q.length) + 1)} / ${pad(Q.length)}`;
    };
    const fling = dir => {
      const top = order[0];
      const done = () => { order.push(order.shift()); shown++; layout(); };
      if (ux.reduce) return done();
      gsap.to(top, { x: dir * (innerWidth * .7), rotate: dir * 24, opacity: 0, duration: .55, ease: "power2.in", onComplete: () => { gsap.set(top, { opacity: 0 }); done(); gsap.to(top, { opacity: order.indexOf(top) > 3 ? 0 : 1, duration: .4, delay: .2 }); } });
    };
    layout(true);
    if (!ux.reduce) gsap.from(order, { y: 120, opacity: 0, rotate: 8, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: deck, start: "top 80%" } });
    $$("[data-throw]", root).forEach(b => b.onclick = () => fling(+b.dataset.throw));
    // Arrastre
    let sx = 0, dx = 0, dragging = false, card = null;
    const down = e => { card = e.target.closest(".quotes-b__card"); if (!card || card !== order[0]) return; dragging = true; sx = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); };
    const move = e => { if (!dragging) return; dx = e.clientX - sx; gsap.set(card, { x: dx, rotate: dx * .06 }); };
    const up = () => {
      if (!dragging) return; dragging = false;
      if (Math.abs(dx) > 110) fling(Math.sign(dx));
      else gsap.to(card, { x: 0, rotate: 0, duration: .7, ease: "elastic.out(1,.5)" });
    };
    deck.addEventListener("pointerdown", down); deck.addEventListener("pointermove", move);
    deck.addEventListener("pointerup", up); deck.addEventListener("pointercancel", up);
    const key = e => { if (!root.contains(document.activeElement)) return; if (e.key === "ArrowLeft") fling(-1); if (e.key === "ArrowRight") fling(1); };
    document.addEventListener("keydown", key);
    return () => { deck.removeEventListener("pointerdown", down); deck.removeEventListener("pointermove", move); deck.removeEventListener("pointerup", up); deck.removeEventListener("pointercancel", up); document.removeEventListener("keydown", key); };
  });

  /* ---------- C · Muro ---------- */
  register("quotes", "C", (root, ux) => {
    const cols = $$(".quotes-c__col", root), btn = $("[data-pause]", root);
    if (ux.reduce) { btn.hidden = true; $$(".quotes-c__dup", root).forEach(d => d.remove()); $(".quotes-c__wall", root).style.height = "auto"; return; }
    let paused = false, hover = false;
    const pos = cols.map(() => 0);
    const tick = () => {
      if (paused || hover) return;
      cols.forEach((c, k) => {
        const h = c.scrollHeight / 2; if (!h) return;
        pos[k] += .45 * +c.dataset.dir * (k === 1 ? 1.25 : 1);
        if (pos[k] <= -h) pos[k] += h; if (pos[k] > 0) pos[k] -= h;
        c.style.transform = `translate3d(0,${pos[k]}px,0)`;
      });
    };
    cols.forEach((c, k) => { if (+c.dataset.dir > 0) pos[k] = -c.scrollHeight / 4; });
    gsap.ticker.add(tick);
    const wall = $(".quotes-c__wall", root);
    const enter = () => (hover = true), leave = () => (hover = false);
    wall.addEventListener("pointerenter", enter); wall.addEventListener("pointerleave", leave);
    btn.onclick = () => { paused = !paused; btn.setAttribute("aria-pressed", paused); btn.textContent = paused ? "Reanudar movimiento" : "Pausar movimiento"; };
    gsap.from(cols, { y: 80, opacity: 0, stagger: .12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: wall, start: "top 85%" } });
    return () => { gsap.ticker.remove(tick); wall.removeEventListener("pointerenter", enter); wall.removeEventListener("pointerleave", leave); };
  });

  /* ---------- D · Pantalla completa ---------- */
  register("quotes", "D", (root, ux) => {
    const slides = $$(".quotes-d__slide", root), dots = $$(".quotes-d__dots button", root);
    const DUR = 6;
    root.style.setProperty("--t", DUR + "s");
    let i = 0, timer, visible = false;
    const set = n => {
      const prev = slides[i]; n = (n + slides.length) % slides.length; if (n === i && prev.classList.contains("on")) { restart(); return; }
      i = n; const cur = slides[i];
      dots.forEach((d, k) => { d.setAttribute("aria-selected", k === i); d.classList.toggle("done", k < i); });
      // reiniciar la animación de la barra
      dots[i].querySelector("i").replaceWith(Object.assign(document.createElement("i")));
      if (ux.reduce) { slides.forEach(s => s.classList.toggle("on", s === cur)); return; }
      slides.forEach(s => s.classList.remove("prev"));
      prev.classList.remove("on"); prev.classList.add("prev");
      cur.classList.add("on");
      gsap.fromTo(cur, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.1, ease: "expo.inOut", onComplete: () => prev.classList.remove("prev") });
      gsap.fromTo($("img.bg", cur), { scale: 1.25 }, { scale: 1.06, duration: 2.2, ease: "expo.out" });
      gsap.fromTo($$(".quotes-d__body > *", cur), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .1, ease: "expo.out", delay: .45 });
      restart();
    };
    const restart = () => { clearTimeout(timer); if (!ux.reduce && visible) timer = setTimeout(() => set(i + 1), DUR * 1000); };
    dots.forEach((d, k) => d.onclick = () => set(k));
    if (!ux.reduce) {
      ScrollTrigger.create({ trigger: root, start: "top 60%", end: "bottom 40%", onToggle: s => { visible = s.isActive; root.classList.toggle("is-paused", !visible); if (visible) restart(); else clearTimeout(timer); } });
      gsap.to($$("img.bg", root), { yPercent: 6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    }
    return () => clearTimeout(timer);
  });

  /* ---------- E · Valoración + máquina de escribir ---------- */
  register("quotes", "E", (root, ux) => {
    const out = $("[data-type]", root), who = $("[data-who]", root), bars = $$("[data-bars] button", root), score = $("[data-score]", root);
    const starsI = $$(".quotes-e__stars i", root);
    let i = 0, typing, wait, visible = false;
    const show = n => {
      i = (n + Q.length) % Q.length; const o = Q[i];
      bars.forEach((b, k) => b.setAttribute("aria-selected", k === i));
      clearInterval(typing); clearTimeout(wait);
      who.innerHTML = `<b>${o.n}</b> · ${o.e}`;
      if (ux.reduce) { out.textContent = o.q; return; }
      gsap.fromTo(who, { opacity: 0 }, { opacity: 1, duration: .5 });
      let k = 0; out.textContent = "";
      typing = setInterval(() => {
        k += 2; out.textContent = o.q.slice(0, k);
        if (k >= o.q.length) { clearInterval(typing); if (visible) wait = setTimeout(() => show(i + 1), 3800); }
      }, 28);
    };
    bars.forEach((b, k) => b.onclick = () => show(k));
    if (ux.reduce) { show(0); return; }
    gsap.set(starsI, { scaleX: 0 });
    const tl = gsap.timeline({ paused: true });
    const o = { v: 0 };
    tl.to(o, { v: 4.9, duration: 1.8, ease: "power3.out", onUpdate: () => (score.textContent = o.v.toFixed(1).replace(".", ",")) })
      .to(starsI, { scaleX: (k) => (k === 4 ? .9 : 1), duration: .5, stagger: .18, ease: "power2.out" }, .2)
      .from($(".quotes-e__type", root), { y: 60, opacity: 0, duration: 1.2, ease: "expo.out" }, 0);
    ScrollTrigger.create({ trigger: root, start: "top 65%", end: "bottom 30%",
      onEnter: () => { tl.play(); },
      onToggle: s => { visible = s.isActive; if (visible) show(i); else { clearInterval(typing); clearTimeout(wait); out.textContent = Q[i].q; } } });
    return () => { clearInterval(typing); clearTimeout(wait); };
  });
})();
