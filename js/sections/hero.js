/* Portada · A «HUD sin láser» + B «Cine», C «Titular partido», D «Revelado suave» (ronda 11) */
(() => {
  const { register } = UX;

  const introIn = (ux, els) => {
    if (ux.reduce) return;
    gsap.set(els, { autoAlpha: 0, y: 34 });
    ux.onIntro(() => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .08, ease: "expo.out", delay: .2 }));
  };

  /* ---------- Vídeo del Lexus ---------- */
  // Recorte 1:1 nativo en móvil, 1440p en pantallas grandes o densas, 1080p en el resto; WebM (VP9) si se puede.
  const heroSrc = (vid, mob) => {
    const webm = vid.canPlayType('video/webm; codecs="vp9"') ? "webm" : "mp4";
    if (mob) return "assets/video/hero-coche-m." + webm;
    if (webm === "webm" && innerWidth * Math.min(devicePixelRatio || 1, 2) > 2200) return "assets/video/hero-coche-1440.webm";
    return "assets/video/hero-coche." + webm;
  };
  const heroLite = () => { const n = navigator.connection || {}; return !!n.saveData || /(^|-)2g$/.test(n.effectiveType || ""); };
  const isMob = () => matchMedia("(max-width:700px) and (orientation:portrait)").matches;
  // Base común: vídeo(s) del Lexus + entrada del titular. opts.scan = revelado de color (A de arriba abajo, D de izquierda a derecha).
  const heroBase = (root, ux, opts = {}) => {
    const vids = ux.$$("video", root), pct = ux.$(".hero-hud__pct", root);
    const offs = [];
    const lite = heroLite(), mob = isMob(), src = heroSrc(vids[0], mob);
    vids.forEach(v => { v.muted = true; v.poster = "assets/video/hero-coche" + (mob ? "-m" : "") + ".webp"; if (!lite) { v.preload = "auto"; v.src = src; } });
    // Los vídeos aparecen sobre el póster solo cuando ya hay imagen: sin fundido a negro.
    let ready = 0;
    const onReady = () => { if (++ready === vids.length) root.classList.add("is-ready"); };
    vids.forEach(v => v.readyState >= 3 ? onReady() : v.addEventListener("canplay", onReady, { once: true }));
    const play = () => { if (lite) return; vids.forEach(v => { v.currentTime = 0; v.play().catch(() => {}); }); };
    if (vids.length > 1) { // mantiene los dos vídeos alineados
      const sync = setInterval(() => { if (Math.abs(vids[0].currentTime - vids[1].currentTime) > .12) vids[1].currentTime = vids[0].currentTime; }, 1000);
      offs.push(() => clearInterval(sync));
    }
    offs.push(() => vids.forEach(v => v.pause()));
    // Entrada: el titular sube por máscara línea a línea; el resto llega después, escalonado.
    const lines = ux.$$(".hero-hud__ln > span", root);
    if (!ux.reduce) {
      gsap.set(lines, { yPercent: 110 });
      ux.onIntro(() => gsap.to(lines, { yPercent: 0, duration: 1.25, stagger: .12, ease: "expo.out", delay: .35 }));
    }
    introIn(ux, ux.$$(".hero-hud__kicker, .hero-hud__sub, .hero-ctas, .hero-hud__data, .hero-hubs, .hero-split__tick, .hero-wipe__data", root));
    // Al salir: el texto sube y se apaga; el vídeo baja un poco (parallax sin escalar, para no perder nitidez)
    const copy = ux.$$(".hero-hud__copy, .hero-split__copy, .hero-split__h1", root);
    if (!ux.reduce) gsap.to(copy, { yPercent: -18, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    if (!ux.reduce) gsap.to(ux.$(".hero-hud__media", root), { yPercent: 12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    const s = { scan: opts.scan ? 0 : 100 };
    const paint = () => { root.style.setProperty("--scan", s.scan + "%"); if (pct) pct.textContent = String(Math.round(s.scan)).padStart(3, "0") + "%"; };
    if (ux.reduce || !opts.scan) { s.scan = 100; paint(); if (ux.reduce) play(); else ux.onIntro(play); return () => offs.forEach(f => f()); }
    paint();
    ux.onIntro(() => { play(); gsap.to(s, { scan: 100, duration: opts.dur || 3.2, ease: "power2.inOut", delay: .3, onUpdate: paint }); });
    return () => offs.forEach(f => f());
  };

  register("hero", "A", (root, ux) => heroBase(root, ux, { scan: true }));
  /* B · Cine: color desde el primer fotograma, sin HUD, accesos a los tres servicios */
  register("hero", "B", (root, ux) => heroBase(root, ux));
  /* C · Titular partido: las dos líneas del titular en esquinas opuestas */
  register("hero", "C", (root, ux) => heroBase(root, ux));
  /* D · Revelado suave: el color entra de izquierda a derecha con borde difuminado */
  register("hero", "D", (root, ux) => heroBase(root, ux, { scan: true, dur: 3.6 }));
})();
