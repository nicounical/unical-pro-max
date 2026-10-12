/* 03 · Showreel — A (favorita «Subtítulos») + B–F, versiones mejoradas de la A */
(() => {
  const { register } = UX;

  /* Línea de tiempo fijada al scroll: una frase por paso (entra, se queda, sale salvo la última) */
  const pinTl = (pin, steps, extra = 0) => gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + innerHeight * (steps * .62 + extra), pin: true, scrub: .6, invalidateOnRefresh: true } });

  /* A · Subtítulos (favorita) */
  register("reel", "A", (root, ux) => {
    const lines = ux.$$(".reel-a__line", root), pin = ux.$(".reel-a__pin", root);
    if (ux.reduce) return;
    gsap.set(lines, { autoAlpha: 0, yPercent: 40 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + innerHeight * 2.4, pin: true, scrub: .6, invalidateOnRefresh: true } });
    lines.forEach((l, i) => {
      tl.to(l, { autoAlpha: 1, yPercent: 0, duration: .4, ease: "power2.out" }, i);
      if (i < lines.length - 1) tl.to(l, { autoAlpha: 0, yPercent: -40, duration: .35, ease: "power2.in" }, i + .65);
    });
    tl.to(ux.$(".reel-a__video video", root), { scale: 1.12, ease: "none", duration: lines.length }, 0);
  });

  /* B · Capítulos: palabras por máscara, barra por capítulo, código de tiempo y cierre con dos CTAs */
  register("reel", "B", (root, ux) => {
    const pin = ux.$(".reel-b__pin", root), lines = ux.$$(".reel-b__line", root);
    const caps = ux.$$(".reel-b__chapters li", root), end = ux.$(".reel-b__end", root), tc = ux.$(".reel-b__tc span", root);
    if (ux.reduce) { caps.forEach(c => { c.style.setProperty("--p", 1); c.classList.add("is-on"); }); return; }
    // Cada palabra dentro de una máscara (respetando el <span class="acc">)
    const words = lines.map(l => {
      const out = [];
      [...l.childNodes].forEach(n => {
        const acc = n.nodeType === 1, parts = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.append(" "); return; }
          const m = document.createElement("span"); m.className = "reel-b__wd";
          const s = document.createElement("span"); s.textContent = p; if (acc) s.className = "acc";
          m.append(s); frag.append(m); out.push(s);
        });
        n.replaceWith(frag);
      });
      return out;
    });
    gsap.set(lines.slice(1), { autoAlpha: 0 });
    gsap.set(words.slice(1).flat(), { yPercent: 110 });
    gsap.set(end, { autoAlpha: 0, y: 30 });
    const tl = pinTl(pin, lines.length, .6);
    const total = lines.length;
    lines.forEach((l, i) => {
      tl.set(l, { autoAlpha: 1 }, i);
      if (i) tl.to(words[i], { yPercent: 0, duration: .35, stagger: .06, ease: "power3.out" }, i);
      tl.fromTo(caps[i], { "--p": 0 }, { "--p": 1, duration: .95, ease: "none" }, i);
      tl.call(() => caps.forEach((c, k) => c.classList.toggle("is-on", k === i)), null, i + .01);
      if (i < total - 1) tl.to(words[i], { yPercent: -110, duration: .3, stagger: .03, ease: "power2.in" }, i + .7);
    });
    tl.to(end, { autoAlpha: 1, y: 0, duration: .4, ease: "power2.out" }, total - .3);
    tl.to(ux.$(".reel-b__video video", root), { scale: 1.1, ease: "none", duration: total + .3 }, 0);
    const st = tl.scrollTrigger;
    const tick = () => { const s = Math.round(st.progress * 37); tc.textContent = "00:" + String(s).padStart(2, "0"); };
    tl.eventCallback("onUpdate", tick);
  });

  /* C · Ventana que se abre: clip-path de ventana a pantalla completa mientras cambian las frases */
  register("reel", "C", (root, ux) => {
    const pin = ux.$(".reel-c__pin", root), win = ux.$(".reel-c__win", root), lines = ux.$$(".reel-c__line", root), btn = ux.$(".reel-c__btn", root);
    if (ux.reduce) return;
    const mob = innerWidth < 700;
    gsap.set(win, { "--cx": mob ? "8%" : "30%", "--cy": mob ? "34%" : "26%", "--cr": "18px", "--sh": .3 });
    gsap.set(lines.slice(1), { autoAlpha: 0, yPercent: 40 });
    gsap.set(btn, { autoAlpha: 0 });
    const tl = pinTl(pin, lines.length, .4);
    tl.to(win, { "--cx": "0%", "--cy": "0%", "--cr": "0px", "--sh": 1, duration: 2.2, ease: "power2.inOut" }, .3);
    lines.forEach((l, i) => {
      if (i) tl.to(l, { autoAlpha: 1, yPercent: 0, duration: .4, ease: "power2.out" }, i);
      if (i < lines.length - 1) tl.to(l, { autoAlpha: 0, yPercent: -40, duration: .35, ease: "power2.in" }, i + .7);
    });
    tl.to(btn, { autoAlpha: 1, duration: .3 }, lines.length - .6);
  });

  /* D · Vídeo en letras: cada cifra deja ver el reel a través de la tipografía; al final se abre del todo */
  register("reel", "D", (root, ux) => {
    const pin = ux.$(".reel-d__pin", root), knock = ux.$(".reel-d__knock", root);
    const ws = ux.$$(".reel-d__w", root), caps = ux.$$(".reel-d__cap", root), btn = ux.$(".reel-d__btn", root);
    if (ux.reduce) return;
    gsap.set([...ws.slice(1), ...caps.slice(1)], { autoAlpha: 0 });
    gsap.set(btn, { autoAlpha: 0 });
    const tl = pinTl(pin, ws.length, 1);
    ws.forEach((w, i) => {
      if (i) {
        tl.fromTo(w, { autoAlpha: 0, scale: .9 }, { autoAlpha: 1, scale: 1, duration: .4, ease: "power2.out" }, i);
        tl.fromTo(caps[i], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .4, ease: "power2.out" }, i + .1);
      }
      if (i < ws.length - 1) {
        tl.to(w, { autoAlpha: 0, scale: 1.08, duration: .35, ease: "power2.in" }, i + .65);
        tl.to(caps[i], { autoAlpha: 0, y: -16, duration: .3, ease: "power2.in" }, i + .65);
      }
    });
    // Cierre: las letras crecen hasta que el vídeo ocupa toda la pantalla
    const n = ws.length;
    tl.to(caps[n - 1], { autoAlpha: 0, duration: .3 }, n + .1);
    tl.to(knock, { scale: 26, duration: 1, ease: "power2.in" }, n + .2);
    tl.to(knock, { autoAlpha: 0, duration: .2 }, n + 1);
    tl.to(btn, { autoAlpha: 1, duration: .3 }, n + 1);
  });

  /* E · Cifras en pantalla: la cifra cuenta con el scroll y la barra de tiempo avanza */
  register("reel", "E", (root, ux) => {
    const pin = ux.$(".reel-e__pin", root), rows = ux.$$(".reel-e__row", root), bar = ux.$(".reel-e__time", root), btn = ux.$(".reel-e__btn", root);
    if (ux.reduce) return;
    gsap.set(rows.slice(1), { autoAlpha: 0 });
    const tl = pinTl(pin, rows.length, .4);
    rows.forEach((r, i) => {
      const b = r.querySelector("b"), txt = r.querySelector(":scope > span"), n = +b.dataset.n, pre = b.dataset.pre || "";
      if (i) tl.set(r, { autoAlpha: 1 }, i);
      if (i) tl.fromTo(txt, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: .35, ease: "power2.out" }, i + .1);
      if (n) {
        const o = { v: 0 };
        if (i) tl.fromTo(o, { v: 0 }, { v: n, duration: .5, ease: "power2.out", onUpdate: () => { b.textContent = pre + ux.fmt(Math.round(o.v)); } }, i);
      } else tl.fromTo(b, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: .4 }, i);
      if (i < rows.length - 1) tl.to(r, { autoAlpha: 0, yPercent: -20, duration: .3, ease: "power2.in" }, i + .7);
    });
    tl.fromTo(bar, { "--p": 0 }, { "--p": 1, duration: rows.length, ease: "none" }, 0);
    tl.fromTo(btn, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .3 }, rows.length - .5);
    tl.to(ux.$(".reel-e__video video", root), { scale: 1.1, ease: "none", duration: rows.length }, 0);
  });

  /* F · Pantalla partida: las frases se apilan a la izquierda y el vídeo acaba ocupando todo */
  register("reel", "F", (root, ux) => {
    const pin = ux.$(".reel-f__pin", root), vid = ux.$(".reel-f__video", root), panel = ux.$(".reel-f__panel", root);
    const lines = ux.$$(".reel-f__line", root), end = ux.$(".reel-f__end", root);
    if (ux.reduce) return;
    const mob = innerWidth < 700;
    gsap.set(lines.slice(1), { autoAlpha: 0, y: 40 });
    gsap.set(end, { autoAlpha: 0 });
    gsap.set(vid, { "--fx": "50%", "--fy": "52%", "--fd": 0 });
    const tl = pinTl(pin, lines.length, 1);
    lines.forEach((l, i) => {
      if (i) {
        tl.to(l, { autoAlpha: 1, y: 0, duration: .4, ease: "power2.out" }, i * .8);
        tl.to(lines.slice(0, i), { opacity: .28, duration: .3 }, i * .8);
      }
    });
    const t = lines.length * .8 + .2;
    tl.to(panel, mob ? { yPercent: 100, duration: .8, ease: "power2.inOut" } : { xPercent: -100, duration: .8, ease: "power2.inOut" }, t);
    tl.to(vid, mob ? { "--fy": "0%", "--fd": .45, duration: .8, ease: "power2.inOut" } : { "--fx": "0%", "--fd": .45, duration: .8, ease: "power2.inOut" }, t);
    tl.fromTo(end, { autoAlpha: 0, scale: .94 }, { autoAlpha: 1, scale: 1, duration: .4, ease: "power2.out" }, t + .6);
  });
})();
