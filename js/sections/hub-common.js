/* Hubs (Rotulación · Impresión · Eventos): las mismas versiones para los tres prefijos. */
(() => {
  const { register } = UX;

  ["rot", "imp", "evt"].forEach(p => {
    /* ---------- Portada A · palabra con vídeo/foto dentro ---------- */
    register(`${p}-hero`, "A", (root, ux) => {
      const knock = ux.$(".hub-ha__knock", root), word = ux.$(".hub-ha__word", root);
      const media = ux.$(".hub-ha__media", root);
      // Ajusta la palabra al 90 % del ancho disponible
      const fit = () => {
        word.style.fontSize = "100px";
        const max = Math.min(innerWidth * .9, innerHeight * 2.4);
        word.style.fontSize = Math.max(48, 100 * max / word.scrollWidth) + "px";
      };
      fit();
      addEventListener("resize", fit);
      const copy = ux.$$(".hub-kicker, .hub-ha__h1, .hub-ha__lead, .hub-ctas", root);
      if (ux.reduce) return () => removeEventListener("resize", fit);
      gsap.set(word, { yPercent: 30, autoAlpha: 0 });
      gsap.set(copy, { y: 26, autoAlpha: 0 });
      const intro = gsap.timeline({ paused: true })
        .to(word, { yPercent: 0, autoAlpha: 1, duration: 1.4, ease: "expo.out" })
        .to(copy, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, "<.4");
      ux.onIntro(() => {
        if (media && media.tagName === "VIDEO") { media.currentTime = 0; media.play().catch(() => {}); }
        intro.play();
      });
      gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .6 } })
        .to(knock, { scale: 22, ease: "power2.in", duration: 1 }, 0)
        .to(knock, { autoAlpha: 0, duration: .15 }, .85)
        .to(ux.$(".hub-ha__hint", root), { autoAlpha: 0, duration: .2 }, 0)
        .to(ux.$(".hub-ha__copy", root), { y: -30, ease: "none", duration: 1 }, 0);
      if (media && media.tagName === "IMG") gsap.fromTo(media, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true } });
      return () => removeEventListener("resize", fit);
    });

    /* ---------- Portada B · partida + collage ---------- */
    register(`${p}-hero`, "B", (root, ux) => {
      const phs = ux.$$(".hub-hb__ph", root), txt = ux.$$(".hub-hb__txt > *", root);
      if (ux.reduce) return;
      gsap.set(phs, { clipPath: "inset(100% 0 0 0 round 18px)" });
      gsap.set(txt, { y: 40, autoAlpha: 0 });
      const tl = gsap.timeline({ paused: true })
        .to(phs, { clipPath: "inset(0% 0 0 0 round 18px)", duration: 1.3, stagger: .12, ease: "expo.inOut" })
        .to(txt, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: "expo.out" }, "<.3");
      ux.onIntro(() => tl.play());
      phs.forEach((ph, i) => gsap.to(ux.$("img", ph), { yPercent: [-6, 8, -10, 5][i] || 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } }));
    });

    /* ---------- Portada C · foto a sangre + cinta ---------- */
    register(`${p}-hero`, "C", (root, ux) => {
      const parts = ux.$$(".hub-hc__in > *", root);
      if (ux.reduce) return;
      gsap.set(parts, { y: 40, autoAlpha: 0 });
      const tl = gsap.timeline({ paused: true }).to(parts, { y: 0, autoAlpha: 1, duration: 1.1, stagger: .09, ease: "expo.out" });
      ux.onIntro(() => tl.play());
      gsap.to(ux.$(".hub-hc__bg", root), { yPercent: 14, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    });

    /* ---------- Subservicios A · lista con imagen que sigue al cursor ---------- */
    register(`${p}-subs`, "A", (root, ux) => {
      if (ux.reduce || !ux.fine) return;
      const list = ux.$(".hub-sa__list", root), fl = ux.$(".hub-sa__float", root);
      const fx = gsap.quickTo(fl, "x", { duration: .6, ease: "power3" }), fy = gsap.quickTo(fl, "y", { duration: .6, ease: "power3" });
      let cur = "";
      const move = e => { fx(e.clientX + 24); fy(e.clientY - fl.offsetHeight / 2); };
      const over = e => {
        const a = e.target.closest(".hub-sa__row"); if (!a || a.dataset.img === cur) return;
        cur = a.dataset.img;
        const im = new Image(); im.src = cur; im.alt = ""; fl.append(im);
        gsap.fromTo(im, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .45, ease: "power2.out" });
        while (fl.children.length > 2) fl.firstChild.remove();
        fl.classList.add("on");
      };
      const leave = () => { fl.classList.remove("on"); cur = ""; };
      list.addEventListener("pointermove", move); list.addEventListener("pointerover", over); list.addEventListener("pointerleave", leave);
      return () => { list.removeEventListener("pointermove", move); list.removeEventListener("pointerover", over); list.removeEventListener("pointerleave", leave); fl.innerHTML = ""; fl.classList.remove("on"); };
    });

    /* ---------- Trabajo A · cinta (pausa) / B · mosaico ---------- */
    register(`${p}-work`, "A", (root, ux) => {
      const btn = ux.$(".hub-w__pause", root);
      const toggle = () => {
        const on = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", on); btn.textContent = on ? "Reanudar movimiento" : "Pausar movimiento";
        root.classList.toggle("is-paused", on);
      };
      btn.addEventListener("click", toggle);
      return () => btn.removeEventListener("click", toggle);
    });
    register(`${p}-work`, "B", (root, ux) => {
      if (ux.reduce) return;
      ux.$$(".hub-w__tile", root).forEach((t, i) => gsap.from(t, { clipPath: "inset(100% 0 0 0 round 14px)", duration: 1.2, ease: "expo.inOut", delay: (i % 4) * .08, scrollTrigger: { trigger: t, start: "top 90%" } }));
    });

    /* ---------- Proceso · pasos con progreso automático ---------- */
    register(`${p}-proc`, "A", (root, ux) => {
      const tabs = ux.$$(".hub-p__tabs button", root), panels = ux.$$(".hub-p__panel", root);
      let i = 0, tw = null, visible = false, hover = false;
      const DUR = 5;
      const go = n => {
        i = (n + tabs.length) % tabs.length;
        tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.style.setProperty("--f", k < i ? 1 : 0); });
        panels.forEach((pn, k) => pn.classList.toggle("on", k === i));
        tw && tw.kill();
        if (ux.reduce) { tabs[i].style.setProperty("--f", 1); return; }
        const o = { f: 0 };
        tw = gsap.to(o, { f: 1, duration: DUR, ease: "none", paused: !visible || hover, onUpdate: () => tabs[i].style.setProperty("--f", o.f), onComplete: () => go(i + 1) });
      };
      const ac = new AbortController(), sig = { signal: ac.signal };
      tabs.forEach((t, k) => t.addEventListener("click", () => go(k), sig));
      const box = ux.$(".hub-p__panels", root).parentElement;
      box.addEventListener("pointerenter", () => { hover = true; tw && tw.pause(); }, sig);
      box.addEventListener("pointerleave", () => { hover = false; visible && tw && tw.play(); }, sig);
      if (!ux.reduce) ScrollTrigger.create({ trigger: root, start: "top 70%", end: "bottom 30%", onToggle: s => { visible = s.isActive; tw && (visible && !hover ? tw.play() : tw.pause()); } });
      go(0);
      return () => { tw && tw.kill(); ac.abort(); };
    });
  });
})();
