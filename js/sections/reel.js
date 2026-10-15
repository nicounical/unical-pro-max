/* ===== 03 · Showreel — A «Ventana editorial» (única desde la ronda 8) =====
   Ventana que crece con el scroll, sin pin, con el vídeo nuevo.
   El vídeo no tiene audio: solo play/pausa. Empieza en silencio, se pausa fuera de pantalla, nunca bloquea
   el scroll. En móvil carga la versión 720p. Con reduced-motion no hay autoplay. */
(() => {
  const { register, $, $$ } = UX;

  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h4.2v15H6zM13.8 4.5H18v15h-4.2z"/></svg>'
  };
  const mmss = s => { s = Math.max(0, Math.floor(s || 0)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };

  /* Reproductor accesible compartido.
     o.auto (por defecto true): se reproduce solo, en silencio, al entrar en pantalla.
     Con o.auto=false solo arranca cuando el usuario pulsa. Siempre se pausa al salir de pantalla. */
  function player(root, ux, o = {}) {
    const host = $("[data-player]", root), v = $("video", host);
    if (v.dataset.srcM && matchMedia("(max-width: 767px)").matches) v.src = v.dataset.srcM;
    v.muted = true;
    const bPlay = $$("[data-play]", root), tc = $$("[data-tc]", root), dur = $$("[data-dur]", root), prog = $$("[data-prog]", root);
    let userPaused = ux.reduce || o.auto === false, inView = false;
    const play = () => { if (v.preload === "none") v.preload = "auto"; const pr = v.play(); pr && pr.catch(() => {}); };
    const render = () => {
      const on = !v.paused;
      bPlay.forEach(b => (b.innerHTML = (on ? ICON.pause : ICON.play) + `<span>${on ? "Pausar" : "Reproducir"}</span>`));
      root.classList.toggle("is-playing", on);
    };
    const toggle = () => { if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); } };
    const start = () => { userPaused = false; play(); o.onStart && o.onStart(); };
    const time = () => {
      const p = v.duration ? v.currentTime / v.duration : 0;
      tc.forEach(t => (t.textContent = mmss(v.currentTime)));
      prog.forEach(el => (el.style.transform = `scaleX(${p})`));
    };
    const meta = () => dur.forEach(d => (d.textContent = mmss(Math.round(v.duration))));
    const ended = () => o.onEnd && o.onEnd();
    // Al abrir el showreel a pantalla completa, este vídeo se detiene
    const toModal = e => { if (e.target.closest("[data-reel]")) { userPaused = true; v.pause(); } };
    bPlay.forEach(b => b.addEventListener("click", toggle));
    root.addEventListener("click", toModal);
    ["play", "pause"].forEach(t => v.addEventListener(t, render));
    v.addEventListener("timeupdate", time);
    v.addEventListener("loadedmetadata", meta);
    v.addEventListener("ended", ended);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) { if (!userPaused) play(); } else v.pause();
    }, { threshold: .25 });
    io.observe(host);
    render();
    return {
      v, start,
      destroy() {
        io.disconnect(); v.pause();
        bPlay.forEach(b => b.removeEventListener("click", toggle));
        root.removeEventListener("click", toModal);
        ["play", "pause"].forEach(t => v.removeEventListener(t, render));
        v.removeEventListener("timeupdate", time);
        v.removeEventListener("loadedmetadata", meta);
        v.removeEventListener("ended", ended);
      }
    };
  }

  /* A · Ventana editorial: la ventana crece dentro de la retícula a medida que entra (scrub, sin pin) */
  register("reel", "A", (root, ux) => {
    const p = player(root, ux);
    const mm = gsap.matchMedia();
    if (!ux.reduce) mm.add("(min-width: 768px)", () => {
      const st = { trigger: $(".reel-a__stage", root), start: "top 94%", end: "top 16%", scrub: .5 };
      gsap.fromTo($(".reel-a__frame", root), { scale: .54, borderRadius: 30 }, { scale: 1, borderRadius: 8, ease: "none", scrollTrigger: st });
      gsap.fromTo($(".reel-a__frame video", root), { scale: 1.22 }, { scale: 1, ease: "none", scrollTrigger: { ...st } });
      gsap.fromTo($(".reel-a__title", root), { x: 0 }, { x: () => -innerWidth * .03, ease: "none", scrollTrigger: { ...st } });
    });
    return () => { mm.revert(); p.destroy(); };
  });
})();
