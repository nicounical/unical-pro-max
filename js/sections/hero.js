/* Portada · A «HUD sin láser» (única desde la ronda 8; antes C) */
(() => {
  const { register } = UX;

  const introIn = (ux, els) => {
    if (ux.reduce) return;
    gsap.set(els, { autoAlpha: 0, y: 34 });
    ux.onIntro(() => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .08, ease: "expo.out", delay: .2 }));
  };

  /* ---------- A · HUD sin láser: el vídeo se revela de arriba abajo una vez ---------- */
  // Recorte 1:1 nativo en móvil, 1440p en pantallas grandes o densas, 1080p en el resto; WebM (VP9) si se puede.
  const heroSrc = (vid, mob) => {
    const webm = vid.canPlayType('video/webm; codecs="vp9"') ? "webm" : "mp4";
    if (mob) return "assets/video/hero-coche-m." + webm;
    if (webm === "webm" && innerWidth * Math.min(devicePixelRatio || 1, 2) > 2200) return "assets/video/hero-coche-1440.webm";
    return "assets/video/hero-coche." + webm;
  };
  const heroLite = () => { const n = navigator.connection || {}; return !!n.saveData || /(^|-)2g$/.test(n.effectiveType || ""); };
  const isMob = () => matchMedia("(max-width:700px) and (orientation:portrait)").matches;
  register("hero", "A", (root, ux) => {
    const vids = ux.$$("video", root), pct = ux.$(".hero-hud__pct", root);
    const offs = [];
    const lite = heroLite(), mob = isMob(), src = heroSrc(vids[0], mob);
    vids.forEach(v => { v.muted = true; v.poster = "assets/video/hero-coche" + (mob ? "-m" : "") + ".webp"; if (!lite) { v.preload = "auto"; v.src = src; } });
    // Los vídeos aparecen sobre el póster solo cuando ya hay imagen: sin fundido a negro.
    let ready = 0;
    const onReady = () => { if (++ready === vids.length) root.classList.add("is-ready"); };
    vids.forEach(v => v.readyState >= 3 ? onReady() : v.addEventListener("canplay", onReady, { once: true }));
    const play = () => { if (lite) return; vids[0].currentTime = vids[1].currentTime = 0; vids.forEach(v => v.play().catch(() => {})); };
    // Mantiene los dos vídeos alineados
    const sync = setInterval(() => { if (Math.abs(vids[0].currentTime - vids[1].currentTime) > .12) vids[1].currentTime = vids[0].currentTime; }, 1000);
    offs.push(() => { clearInterval(sync); vids.forEach(v => v.pause()); });
    // Entrada: el titular sube por máscara línea a línea; el resto llega después, escalonado.
    const lines = ux.$$(".hero-hud__ln > span", root);
    if (!ux.reduce) {
      gsap.set(lines, { yPercent: 110 });
      ux.onIntro(() => gsap.to(lines, { yPercent: 0, duration: 1.25, stagger: .12, ease: "expo.out", delay: .35 }));
    }
    introIn(ux, ux.$$(".hero-hud__kicker, .hero-hud__sub, .hero-hud .hero-ctas, .hero-hud__data", root));
    if (ux.reduce) { root.style.setProperty("--scan", "100%"); pct.textContent = "100%"; play(); return () => offs.forEach(f => f()); }
    const s = { scan: 0, l: 0 };
    const paint = () => { root.style.setProperty("--scan", s.scan + "%"); root.style.setProperty("--l", s.l + "%"); pct.textContent = String(Math.round(s.scan)).padStart(3, "0") + "%"; };
    paint();
    ux.onIntro(() => {
      play();
      gsap.timeline({ onUpdate: paint })
        .to(s, { scan: 100, l: 100, duration: 3.2, ease: "power2.inOut", delay: .3 })
        .to(s, { l: 0, duration: 3.6, ease: "sine.inOut", onUpdate: paint });
    });
    gsap.to(ux.$(".hero-hud__copy", root), { yPercent: -18, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(ux.$(".hero-hud__media", root), { scale: 1.12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    return () => offs.forEach(f => f());
  });
})();
