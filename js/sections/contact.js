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


  /* Lienzo nítido (DPR ≤ 2) + rAF que solo corre con la sección en pantalla */
  const canvasLoop = (root, cv, draw) => {
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, raf = 0, on = false; const t0 = performance.now();
    const size = () => { const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const frame = now => { if (!on) return; draw(ctx, W, H, now - t0); raf = requestAnimationFrame(frame); };
    const ro = new ResizeObserver(() => { size(); draw(ctx, W, H, performance.now() - t0); }); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) raf = requestAnimationFrame(frame); }, { rootMargin: "80px" });
    io.observe(root);
    size();
    return () => { on = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  };

  /* ---------- B · Consola HUD ---------- */
  register("contact", "B", (root, ux) => {
    if (ux.reduce) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%" } });
    tl.from($$(".contact-b__br", root), { scale: 3, opacity: 0, duration: .8, ease: "expo.out", stagger: .06 })
      .from($(".contact-b__panel", root), { clipPath: "inset(50% 0 50% 0)", duration: 1, ease: "expo.inOut" }, 0)
      .from($$(".contact-b__f, .contact-b__status, .contact-b__send", root), { x: 30, opacity: 0, stagger: .07, duration: .7, ease: "expo.out" }, .5)
      .from($$(".contact-b__mods li", root), { x: -40, opacity: 0, stagger: .1, duration: .8, ease: "expo.out" }, .2);
  });

  /* ---------- C · Portal ---------- */
  register("contact", "C", (root, ux) => {
    const cv = $(".contact-c__cv", root), portal = $(".contact-c__portal", root);
    const P = Array.from({ length: ux.reduce ? 0 : 220 }, () => ({ a: Math.random() * Math.PI * 2, r: .6 + Math.random() * 2.2, s: .4 + Math.random() * 1.2, v: .0015 + Math.random() * .003 }));
    let pull = 0, target = 0;
    const draw = (ctx, W, H) => {
      ctx.clearRect(0, 0, W, H);
      const pr = portal.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const cx = pr.left - cr.left + pr.width / 2, cy = pr.top - cr.top + pr.height / 2, R = pr.width / 2;
      pull += (target - pull) * .05;
      P.forEach(p => {
        p.a += p.v * (1 + pull * 3);
        p.r -= (.0012 + pull * .012) * p.r; if (p.r < .95) { p.r = 1.6 + Math.random() * 1.4; p.a = Math.random() * Math.PI * 2; }
        const x = cx + Math.cos(p.a) * p.r * R, y = cy + Math.sin(p.a) * p.r * R * .92;
        const al = Math.min(1, (2.8 - p.r) * .5) * (.35 + pull * .5);
        ctx.fillStyle = `rgba(153,196,228,${al})`; ctx.beginPath(); ctx.arc(x, y, p.s, 0, Math.PI * 2); ctx.fill();
      });
    };
    const stop = canvasLoop(root, cv, draw);
    const on = () => (target = 1), off = () => (target = 0);
    portal.addEventListener("pointerenter", on); portal.addEventListener("pointerleave", off); portal.addEventListener("focus", on); portal.addEventListener("blur", off);
    if (!ux.reduce) {
      gsap.from(portal, { scale: .3, opacity: 0, rotate: -120, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: portal, start: "top 85%" } });
      gsap.from(ux.splitWords($(".contact-c__title", root)), { yPercent: 100, opacity: 0, stagger: .05, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 70%" } });
    }
    return () => { stop(); portal.removeEventListener("pointerenter", on); portal.removeEventListener("pointerleave", off); portal.removeEventListener("focus", on); portal.removeEventListener("blur", off); };
  });

  /* ---------- D · Asistente ---------- */
  register("contact", "D", (root, ux) => {
    const log = $(".contact-d__log", root), chips = $(".contact-d__chips", root), bar = $(".contact-d__bar", root), input = $("input", bar);
    const data = {}; let step = 0, timers = [], started = false;
    const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const scroll = () => (log.scrollTop = log.scrollHeight);
    const bubble = (html, me) => { const d = document.createElement("div"); d.className = "contact-d__msg contact-d__msg--" + (me ? "me" : "bot"); d.innerHTML = html; log.appendChild(d); if (!ux.reduce) gsap.from(d, { y: 14, opacity: 0, scale: .96, duration: .45, ease: "expo.out", transformOrigin: me ? "100% 100%" : "0 100%" }); scroll(); return d; };
    const bot = (html, then) => {
      if (ux.reduce) { bubble(html); then && then(); return; }
      const t = bubble('<span class="contact-d__typing" aria-label="Escribiendo"><i></i><i></i><i></i></span>');
      timers.push(setTimeout(() => { t.innerHTML = html; scroll(); then && then(); }, 650 + Math.min(900, html.length * 12)));
    };
    const setChips = list => { chips.innerHTML = list.map(c => `<button type="button">${c}</button>`).join(""); };
    const steps = [
      { q: "Hola, soy el asistente de Unical. ¿Qué necesitas producir?", key: "servicio", chips: ["Rotulación", "Impresión gran formato", "Eventos y stands", "Otro"], ph: "O escríbelo tú…" },
      { q: "Perfecto. ¿Cómo te llamas?", key: "nombre", ph: "Tu nombre", req: true, ac: "name" },
      { q: "¿En qué email o teléfono te respondemos?", key: "contacto", ph: "Email o teléfono", req: true, ac: "email" },
      { q: "Último paso: cuéntanos el proyecto en una frase (medidas, fecha, ciudad…).", key: "mensaje", ph: "Opcional", chips: ["Lo hablamos por teléfono"] }
    ];
    const ask = () => {
      const s = steps[step];
      chips.innerHTML = "";
      bot(s.q, () => { if (s.chips) setChips(s.chips); input.placeholder = s.ph; input.setAttribute("autocomplete", s.ac || "off"); });
    };
    const finish = () => {
      chips.innerHTML = ""; bar.hidden = true;
      const body = `Servicio: ${data.servicio}\nNombre: ${data.nombre}\nContacto: ${data.contacto}${data.mensaje ? "\nProyecto: " + data.mensaje : ""}`;
      const mail = `mailto:nico@unical.es?subject=${encodeURIComponent("Solicitud de presupuesto · " + data.servicio)}&body=${encodeURIComponent(body)}`;
      const wa = `https://wa.me/34663512014?text=${encodeURIComponent("Hola, soy " + data.nombre + ". Necesito: " + data.servicio + (data.mensaje ? ". " + data.mensaje : ""))}`;
      bot(`Gracias, ${esc(data.nombre)}. Tu mensaje está listo:<div class="contact-d__sum"><a href="${mail}">Enviar por email</a><a href="${wa}" target="_blank" rel="noopener">Enviar por WhatsApp</a></div>`);
    };
    const answer = val => {
      const s = steps[step]; val = val.trim();
      if (!val && s.req) { input.setAttribute("aria-invalid", "true"); input.focus(); return; }
      input.removeAttribute("aria-invalid");
      data[s.key] = val; bubble(esc(val || "—"), true); input.value = "";
      step++; step < steps.length ? ask() : finish();
    };
    const sub = e => { e.preventDefault(); answer(input.value); };
    const chip = e => { const b = e.target.closest("button"); if (b) answer(b.textContent); };
    bar.addEventListener("submit", sub); chips.addEventListener("click", chip);
    const start = () => { if (started) return; started = true; ask(); };
    const st = ScrollTrigger.create({ trigger: $(".contact-d__app", root), start: "top 80%", once: true, onEnter: start });
    if (ux.reduce) start();
    return () => { timers.forEach(clearTimeout); st.kill(); bar.removeEventListener("submit", sub); chips.removeEventListener("click", chip); };
  });

  /* ---------- E · Mapa holográfico ---------- */
  register("contact", "E", (root, ux) => {
    if (ux.reduce) return;
    gsap.from($(".contact-e__beam", root), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
    gsap.from($(".contact-e__coord", root), { opacity: 0, x: -20, duration: 1, delay: .6, ease: "expo.out", scrollTrigger: { trigger: root, start: "top 60%" } });
    gsap.from($$(".contact-e__cards li", root), { y: 40, opacity: 0, stagger: .08, duration: .9, ease: "expo.out", scrollTrigger: { trigger: $(".contact-e__cards", root), start: "top 90%" } });
    if (!ux.fine) return;
    const world = $(".contact-e__world", root);
    const px = gsap.quickTo(world, "x", { duration: 1.2, ease: "power3" }), py = gsap.quickTo(world, "y", { duration: 1.2, ease: "power3" });
    const mv = e => { const r = root.getBoundingClientRect(); px(((e.clientX - r.left) / r.width - .5) * -30); py(((e.clientY - r.top) / r.height - .5) * -16); };
    root.addEventListener("pointermove", mv);
    return () => root.removeEventListener("pointermove", mv);
  });

  /* ---------- F · Onda (osciloscopio) ---------- */
  register("contact", "F", (root, ux) => {
    const cv = $(".contact-f__cv", root), num = $(".contact-f__num", root), digits = $("[data-num]", root);
    let amp = 0, ampT = .5, mx = .5;
    const draw = (ctx, W, H, t) => {
      ctx.clearRect(0, 0, W, H);
      amp += (ampT - amp) * .05;
      const cy = H * .52, layers = [[1, .9, 2], [.6, .45, 1.2], [.35, .25, 1]];
      layers.forEach(([k, al, lw], j) => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const u = x / W, env = Math.exp(-((u - mx) ** 2) / .08) * .85 + .15;
          const y = cy + Math.sin(u * 22 + t * .003 * (1 + j * .4) + j) * Math.sin(u * 5 - t * .0012) * H * .16 * amp * k * env;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = `rgba(153,196,228,${al * .55})`; ctx.lineWidth = lw; ctx.shadowColor = "#99C4E4"; ctx.shadowBlur = j ? 0 : 14; ctx.stroke();
      });
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(153,196,228,.08)";
      for (let x = 0; x < W; x += 48) ctx.fillRect(x, 0, 1, H);
    };
    const stop = canvasLoop(root, cv, ux.reduce ? (c, W, H) => { ampT = amp = .3; draw(c, W, H, 0); } : draw);
    const pm = e => { const r = root.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; };
    const hot = () => (ampT = 1), cold = () => (ampT = .5);
    root.addEventListener("pointermove", pm); num.addEventListener("pointerenter", hot); num.addEventListener("pointerleave", cold); num.addEventListener("focus", hot); num.addEventListener("blur", cold);
    let cancel = () => {};
    if (!ux.reduce) {
      const txt = digits.textContent;
      ScrollTrigger.create({ trigger: num, start: "top 85%", once: true, onEnter: () => {
        const t0 = performance.now(); let raf;
        const step = now => { const p = Math.min(1, (now - t0) / 1300), n = Math.floor(p * txt.length); digits.textContent = txt.slice(0, n) + [...txt.slice(n)].map(c => (c === " " ? " " : (Math.random() * 10) | 0)).join(""); if (p < 1) raf = requestAnimationFrame(step); };
        raf = requestAnimationFrame(step); cancel = () => cancelAnimationFrame(raf);
      } });
    }
    return () => { stop(); cancel(); root.removeEventListener("pointermove", pm); num.removeEventListener("pointerenter", hot); num.removeEventListener("pointerleave", cold); num.removeEventListener("focus", hot); num.removeEventListener("blur", cold); };
  });
})();
