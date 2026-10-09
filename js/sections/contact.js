/* ===== 10 · Contacto (A–E) ===== */
(() => {
  const { register, $, $$ } = UX;

  /* ---------- A · Vídeo + formulario ---------- */
  register("contact", "A", (root, ux) => {
    const fills = $$(".contact-a__fill", root);
    if (ux.reduce) { fills.forEach(f => (f.style.backgroundPosition = "0 0")); return; }
    fills.forEach((f, i) => gsap.to(f, { backgroundPosition: "0% 0", ease: "none", scrollTrigger: { trigger: $(".contact-a__title", root), start: `top ${82 - i * 10}%`, end: `top ${38 - i * 10}%`, scrub: true } }));
    gsap.fromTo($(".contact-a__video", root), { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true } });
    gsap.from($$(".contact-f, .contact-a__send, .contact-a__ch a", root), { y: 40, opacity: 0, duration: 1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: $(".contact-a__grid", root), start: "top 85%" } });
  });

  /* ---------- B · Por pasos ---------- */
  register("contact", "B", (root, ux) => {
    const panes = $$("[data-pane]", root), bar = $(".contact-b__bar i", root), label = $("[data-step-label]", root);
    const next = $("[data-next]", root), back = $("[data-back]", root), submit = $("[data-submit]", root);
    let step = 0;
    const go = (n, dir = 1) => {
      const prev = panes[step]; step = n; const cur = panes[step];
      bar.style.transform = `scaleX(${(step + 1) / panes.length})`;
      label.textContent = `Paso ${step + 1} de ${panes.length}`;
      back.hidden = step === 0; next.hidden = step === panes.length - 1; submit.hidden = step !== panes.length - 1;
      if (prev === cur) return;
      const swap = () => { panes.forEach(p => (p.hidden = p !== cur)); const f = $("input", cur); if (step > 0 && f) f.focus({ preventScroll: true }); };
      if (ux.reduce) return swap();
      gsap.to(prev, { x: -60 * dir, opacity: 0, duration: .3, ease: "power2.in", onComplete: () => { swap(); gsap.set(prev, { x: 0, opacity: 1 }); gsap.fromTo(cur, { x: 60 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: .55, ease: "expo.out" }); gsap.from($$(".contact-b__pick, .contact-g", cur), { y: 24, opacity: 0, stagger: .05, duration: .6, ease: "expo.out" }); } });
    };
    const shake = el => ux.reduce || gsap.fromTo(el, { x: -8 }, { x: 0, duration: .5, ease: "elastic.out(1,.3)" });
    next.onclick = () => { if (!$("input:checked", panes[step])) return shake(panes[step]); go(step + 1, 1); };
    back.onclick = () => go(step - 1, -1);
    $$(".contact-b__pick input", root).forEach(i => i.addEventListener("change", () => { if (step < panes.length - 1) setTimeout(() => go(step + 1, 1), ux.reduce ? 0 : 320); }));
    go(0);
    if (!ux.reduce) gsap.from($(".contact-b__wiz", root), { y: 80, opacity: 0, rotate: 1.5, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
  });

  /* ---------- C · Botón gigante ---------- */
  register("contact", "C", (root, ux) => {
    const btn = $(".contact-c__btn", root), title = $(".contact-c__title", root);
    if (ux.reduce) return;
    const chars = ux.splitChars(title);
    gsap.from(chars, { yPercent: 110, opacity: 0, duration: 1, stagger: .012, ease: "expo.out", scrollTrigger: { trigger: title, start: "top 80%" } });
    gsap.from(btn, { scale: 0, rotate: -90, duration: 1.4, ease: "elastic.out(1,.55)", scrollTrigger: { trigger: btn, start: "top 90%" } });
    gsap.from($$(".contact-c__ch a", root), { y: 50, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: $(".contact-c__ch", root), start: "top 90%" } });
    if (!ux.fine) return;
    // Imán fuerte: el botón persigue al cursor dentro de un radio amplio
    const xTo = gsap.quickTo(btn, "x", { duration: .8, ease: "elastic.out(1,.4)" }), yTo = gsap.quickTo(btn, "y", { duration: .8, ease: "elastic.out(1,.4)" });
    const move = e => {
      const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2 - gsap.getProperty(btn, "x"), cy = r.top + r.height / 2 - gsap.getProperty(btn, "y");
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), R = r.width * 1.3;
      if (d < R) { xTo(dx * .4); yTo(dy * .4); } else { xTo(0); yTo(0); }
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    return () => root.removeEventListener("pointermove", move);
  });

  /* ---------- D · Mapa ---------- */
  register("contact", "D", (root, ux) => {
    const routes = $$(".contact-d__routes path", root), cities = $$(".contact-d__cities circle", root), labels = $$(".contact-d__labels text", root);
    if (ux.reduce) return;
    routes.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; p.style.strokeDashoffset = L; p.dataset.l = L; });
    const tl = gsap.timeline({ scrollTrigger: { trigger: $(".contact-d__map", root), start: "top 75%" } });
    tl.from($$(".contact-d__land", root), { opacity: 0, scale: .96, transformOrigin: "50% 50%", duration: 1.2, ease: "expo.out" })
      .from($$(".contact-d__home, .contact-d__here", root), { scale: 0, opacity: 0, transformOrigin: "50% 50%", transformBox: "fill-box", duration: .8, ease: "back.out(3)" }, .3)
      .to(routes, { strokeDashoffset: 0, duration: 1.2, stagger: .12, ease: "power2.inOut" }, .6)
      .from(cities, { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box", duration: .5, stagger: .12, ease: "back.out(3)" }, 1.4)
      .from(labels, { opacity: 0, y: 8, duration: .5, stagger: .12 }, 1.5)
      .add(() => routes.forEach(p => { p.style.strokeDasharray = "4 6"; p.style.strokeDashoffset = 0; }))
      .to(routes, { strokeDashoffset: -40, duration: 2, ease: "none", repeat: -1 });
    gsap.from($$(".contact-d__form-wrap > *", root), { y: 40, opacity: 0, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: $(".contact-d__form-wrap", root), start: "top 80%" } });
  });

  /* ---------- E · Chat ---------- */
  register("contact", "E", (root, ux) => {
    const log = $("[data-log]", root), form = $("[data-chat-form]", root), input = $("#ce-in", root), inLabel = $("[data-input-label]", root);
    const data = {}; let started = false, alive = true; const timers = [];
    const wait = ms => new Promise(r => timers.push(setTimeout(r, ux.reduce ? 0 : ms)));
    const scroll = () => { log.scrollTop = log.scrollHeight; };
    const add = (html, cls) => {
      const el = document.createElement("div"); el.className = cls; el.innerHTML = html; log.append(el);
      if (!ux.reduce) gsap.from(el, { y: 16, opacity: 0, scale: .96, transformOrigin: cls.includes("me") ? "100% 100%" : "0 100%", duration: .45, ease: "back.out(2)" });
      scroll(); return el;
    };
    const bot = async (text, ms = 700) => {
      if (!alive) return;
      const t = add("<i></i><i></i><i></i>", "contact-e__typing"); t.setAttribute("aria-hidden", "true");
      await wait(ms); t.remove(); if (!alive) return; add(text, "contact-e__msg contact-e__msg--bot");
    };
    const me = text => add(text.replace(/</g, "&lt;"), "contact-e__msg contact-e__msg--me");
    const chips = opts => new Promise(res => {
      const box = add(opts.map(o => `<button type="button">${o}</button>`).join(""), "contact-e__chips");
      box.setAttribute("role", "group"); box.setAttribute("aria-label", "Respuestas rápidas");
      $$("button", box).forEach(b => b.onclick = () => { box.remove(); me(b.textContent); res(b.textContent); });
      const first = $("button", box); first && root.matches(":focus-within") && first.focus({ preventScroll: true });
    });
    const ask = (label, ph = "Escribe aquí…", optional = false) => new Promise(res => {
      form.hidden = false; inLabel.textContent = label; input.placeholder = ph; input.value = "";
      if (root.matches(":focus-within")) input.focus({ preventScroll: true });
      form.onsubmit = e => {
        e.preventDefault(); const v = input.value.trim();
        if (!v && !optional) { ux.reduce || gsap.fromTo(input, { x: -6 }, { x: 0, duration: .4, ease: "elastic.out(1,.3)" }); return; }
        form.hidden = true; me(v || "Nada más"); res(v);
      };
    });
    const run = async () => {
      await bot("Hola 👋 Somos el equipo de Unical.", 600);
      await bot("¿Qué quieres producir?", 800);
      data.servicio = await chips(["Vehículos y flotas", "Stand o evento", "Gran formato", "Retail o interiorismo", "Otra cosa"]);
      await bot(`¡Genial! Hacemos mucho de eso. ¿Para cuándo lo necesitas?`, 900);
      data.plazo = await chips(["Urgente", "2–4 semanas", "1–3 meses", "Sin fecha"]);
      await bot("¿Cómo te llamas?", 700);
      data.nombre = await ask("Tu nombre", "Tu nombre");
      await bot(`Encantados, ${data.nombre.replace(/</g, "&lt;")}. ¿Algún detalle más? Medidas, cantidad, ciudad… (puedes dejarlo vacío)`, 900);
      data.detalles = await ask("Detalles del proyecto", "Ej.: 6 furgonetas en Madrid", true);
      const resumen = `Hola, soy ${data.nombre}. Quiero presupuesto para: ${data.servicio}. Plazo: ${data.plazo}.${data.detalles ? " Detalles: " + data.detalles : ""}`;
      await bot("Perfecto. Te dejo el mensaje listo para enviar:", 800);
      add(`<b>Tu mensaje</b><br>${resumen.replace(/</g, "&lt;")}`, "contact-e__msg contact-e__msg--bot");
      const send = add(`<a href="https://wa.me/34663512014?text=${encodeURIComponent(resumen)}" target="_blank" rel="noopener">Enviar por WhatsApp</a><a href="mailto:nico@unical.es?subject=${encodeURIComponent("Solicitud de presupuesto")}&body=${encodeURIComponent(resumen)}">Enviar por email</a>`, "contact-e__send");
      send.setAttribute("role", "group");
      const again = await chips(["Empezar de nuevo"]);
      if (again && alive) { log.innerHTML = ""; run(); }
    };
    const start = () => { if (started) return; started = true; run(); };
    if (ux.reduce) start();
    else ScrollTrigger.create({ trigger: $(".contact-e__phone", root), start: "top 75%", once: true, onEnter: start });
    if (!ux.reduce) gsap.from($(".contact-e__phone", root), { y: 100, rotate: 3, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    return () => { alive = false; timers.forEach(clearTimeout); log.innerHTML = ""; form.hidden = true; };
  });
})();
