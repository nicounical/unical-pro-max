/* ===== 10 · Contacto (A = botón gigante; B–F nuevas) ===== */
(() => {
  const { register, $, $$ } = UX;
  const requiredOk = form => $$("[required]", form).every(i => i.value.trim());

  /* ---------- A · Botón gigante ---------- */
  register("contact", "A", (root, ux) => {
    const btn = $(".contact-a__btn", root), title = $(".contact-a__title", root);
    if (ux.reduce) return;
    const chars = ux.splitChars(title);
    gsap.from(chars, { yPercent: 110, opacity: 0, duration: 1, stagger: .012, ease: "expo.out", scrollTrigger: { trigger: title, start: "top 80%" } });
    gsap.from(btn, { scale: 0, rotate: -90, duration: 1.4, ease: "elastic.out(1,.55)", scrollTrigger: { trigger: btn, start: "top 90%" } });
    gsap.from($$(".contact-a__ch a", root), { y: 50, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: $(".contact-a__ch", root), start: "top 90%" } });
    if (!ux.fine) return;
    // Imán fuerte: el botón persigue al cursor dentro de un radio amplio
    const xTo = gsap.quickTo(btn, "x", { duration: .8, ease: "elastic.out(1,.4)" }), yTo = gsap.quickTo(btn, "y", { duration: .8, ease: "elastic.out(1,.4)" });
    const move = e => {
      const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2 - gsap.getProperty(btn, "x"), cy = r.top + r.height / 2 - gsap.getProperty(btn, "y");
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), R = r.width * 1.3;
      if (d < R) { xTo(dx * .4); yTo(dy * .4); } else { xTo(0); yTo(0); }
    };
    const leave = () => { xTo(0); yTo(0); };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => { root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); };
  });

  /* ---------- B · Sobre que se abre ---------- */
  register("contact", "B", (root, ux) => {
    const today = $("[data-today]", root);
    today.textContent = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    const env = $(".contact-b__env", root), letter = $(".contact-b__letter", root), flap = $(".contact-b__flap", root);
    const desktop = matchMedia("(min-width: 901px)").matches;
    if (ux.reduce || !desktop) { gsap.set(letter, { zIndex: 5 }); return; }
    // Estado inicial: sobre cerrado y carta dentro (la parte que asoma por debajo se recorta)
    const LH = () => letter.offsetHeight, EH = () => env.offsetHeight;
    const inside = () => LH() * .62;
    gsap.set(flap, { rotateX: 0, zIndex: 4 });
    gsap.set(letter, { y: inside, clipPath: () => `inset(0 0 ${inside()}px 0)`, zIndex: 2 });
    const tl = gsap.timeline({ paused: true })
      .to(flap, { rotateX: 180, duration: .8, ease: "power2.inOut" })
      .set(flap, { zIndex: 1 })
      .to(letter, { y: () => -(LH() - EH() * .55), clipPath: "inset(0 0 0px 0)", duration: 1.2, ease: "expo.out" })
      .set(letter, { zIndex: 5 })
      .to(letter, { y: () => -(LH() - EH() * .95), duration: .7, ease: "back.out(1.6)" });
    ScrollTrigger.create({ trigger: env, start: "top 70%", once: true, onEnter: () => tl.play() });
    gsap.from(env, { y: 80, rotate: -4, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: env, start: "top 90%" } });
  });

  /* ---------- C · Tarjeta de visita 3D ---------- */
  register("contact", "C", (root, ux) => {
    const card = $(".contact-c__card", root), scene = $(".contact-c__scene", root);
    // vCard descargable con los datos reales
    const vcf = ["BEGIN:VCARD", "VERSION:3.0", "FN:Unical Graphic", "ORG:Unical Graphic S.L.", "TEL;TYPE=WORK,VOICE:+34937502304", "TEL;TYPE=CELL:+34663512014", "EMAIL:nico@unical.es", "ADR;TYPE=WORK:;;Passatge la Carola 2;Cabrera de Mar;Barcelona;08349;España", "URL:https://www.unical.es", "END:VCARD"].join("\r\n");
    $("[data-vcf]", root).href = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcf);
    let flipped = false;
    const ry = () => (flipped ? 180 : 0);
    const flip = () => { flipped = !flipped; gsap.to(card, { rotateY: ry(), duration: ux.reduce ? 0 : 1, ease: "back.out(1.4)" }); };
    const onCard = e => { if (!e.target.closest("a")) flip(); };
    card.addEventListener("click", onCard);
    const btn = $("[data-flip]", root); btn.addEventListener("click", flip);
    if (ux.reduce) return () => { card.removeEventListener("click", onCard); btn.removeEventListener("click", flip); };
    gsap.from(card, { rotateY: -70, rotateX: 25, y: 80, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: scene, start: "top 80%" } });
    let move = null, leave = null;
    if (ux.fine) {
      const rxTo = gsap.quickTo(card, "rotateX", { duration: .6, ease: "power3" });
      move = e => { const r = scene.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; rxTo(-py * 16); gsap.to(card, { rotateY: ry() + px * 22, duration: .6, ease: "power3", overwrite: "auto" }); };
      leave = () => { rxTo(0); gsap.to(card, { rotateY: ry(), duration: .8, ease: "power3" }); };
      scene.addEventListener("pointermove", move); scene.addEventListener("pointerleave", leave);
    }
    return () => { card.removeEventListener("click", onCard); btn.removeEventListener("click", flip); if (move) { scene.removeEventListener("pointermove", move); scene.removeEventListener("pointerleave", leave); } };
  });

  /* ---------- D · Orden de trabajo ---------- */
  register("contact", "D", (root, ux) => {
    const form = $(".contact-d__sheet", root), stamp = $(".contact-d__stamp", root), hidden = $('[name="trabajos"]', form);
    const d = new Date();
    $("[data-order]", root).textContent = `UG-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const sync = () => (hidden.value = $$("[data-trabajo]:checked", form).map(c => c.value).join(", "));
    form.addEventListener("change", sync);
    // El sello aparece si la orden está completa (el envío lo gestiona el núcleo)
    const onSubmit = () => {
      sync();
      if (!requiredOk(form)) return;
      gsap.fromTo(stamp, { opacity: 0, scale: 2.2, rotate: -24 }, { opacity: .9, scale: 1, rotate: -14, duration: ux.reduce ? 0 : .45, ease: "back.out(2.5)" });
    };
    form.addEventListener("submit", onSubmit);
    if (!ux.reduce) gsap.from(form, { y: 120, rotate: 3, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: form, start: "top 90%" } });
    return () => { form.removeEventListener("change", sync); form.removeEventListener("submit", onSubmit); };
  });

  /* ---------- E · Teléfono gigante + abierto ahora ---------- */
  register("contact", "E", (root, ux) => {
    const status = $("[data-status]", root), down = $("[data-count-down]", root);
    // Hora de Barcelona; horario L–V 8:00–18:00
    const madrid = () => {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map(x => [x.type, x.value]));
      const days = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
      return { day: days[p.weekday], min: +p.hour * 60 + +p.minute };
    };
    const fmt = m => (m >= 1440 ? `${Math.floor(m / 1440)} d ${Math.floor((m % 1440) / 60)} h` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`);
    const update = () => {
      const { day, min } = madrid(), work = day >= 1 && day <= 5, open = work && min >= 480 && min < 1080;
      root.classList.toggle("is-open", open);
      if (open) { status.textContent = "Abierto ahora · te atendemos al teléfono"; down.textContent = `Cerramos en ${fmt(1080 - min)}`; return; }
      // Minutos hasta el próximo día laborable a las 8:00
      let wait = 0, d = day, m = min;
      if (work && m < 480) wait = 480 - m;
      else { wait = 1440 - m + 480; d = (d + 1) % 7; while (d === 0 || d === 6) { wait += 1440; d = (d + 1) % 7; } }
      status.textContent = "Cerrado ahora · escríbenos y te respondemos al abrir";
      down.textContent = `Abrimos en ${fmt(wait)}`;
    };
    update();
    const timer = setInterval(update, 30000);
    if (!ux.reduce) gsap.from($$(".contact-e__phone span", root), { yPercent: 100, opacity: 0, duration: 1.2, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: $(".contact-e__phone", root), start: "top 85%" } });
    return () => clearInterval(timer);
  });

  /* ---------- F · Formulario en una frase ---------- */
  register("contact", "F", (root, ux) => {
    const form = $(".contact-s__form", root), wa = $("[data-wa]", root);
    const inputs = $$(".contact-s__slot input", root);
    // Los huecos crecen con lo que se escribe
    const grow = i => (i.size = Math.max(i.placeholder.length - 2, Math.min(28, i.value.length + 1)));
    const onInput = e => { if (e.target.matches(".contact-s__slot input")) grow(e.target); };
    inputs.forEach(grow);
    form.addEventListener("input", onInput);
    const sentence = () => {
      const v = n => (form.elements[n].value || "").trim();
      return `Hola, soy ${v("nombre") || "…"}${v("empresa") ? " de " + v("empresa") : ""} y necesito ${v("servicio")} para ${v("plazo")}. Podéis escribirme a ${v("contacto") || "…"}.`;
    };
    const onWa = () => (wa.href = "https://wa.me/34663512014?text=" + encodeURIComponent(sentence()));
    wa.addEventListener("click", onWa);
    if (!ux.reduce) {
      const p = $(".contact-s__sentence", root);
      gsap.from(p, { y: 60, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 85%" } });
      gsap.from($$(".contact-s__slot", root), { scaleX: 0, transformOrigin: "0 50%", duration: .9, stagger: .12, ease: "expo.out", delay: .3, scrollTrigger: { trigger: p, start: "top 85%" } });
    }
    return () => { form.removeEventListener("input", onInput); wa.removeEventListener("click", onWa); };
  });
})();
