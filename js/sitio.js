/* Unical Pro Max — comportamiento del sitio. Sin dependencias. */
(() => {
  const D = window.UNICAL;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;
  const icon = id => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const img = (p, alt = "", extra = "") => `<img src="${D.img}${p}.webp" alt="${alt}" loading="lazy" decoding="async" ${extra}>`;
  const logo = n => `<img class="logo-img" src="${D.img}clientes/${n}.png" alt="${n.replace(/-/g, " ")}" loading="lazy" height="34">`;
  const initials = n => n.split(" ").map(w => w[0]).join("").slice(0, 2);
  const stars = `<span class="stars" aria-label="5 de 5 estrellas">${icon("star").repeat(5)}</span>`;
  const onShow = {}; // callbacks por sección/variante al mostrarse

  /* ---------- Render de contenido ---------- */
  // Clientes A: dos marquesinas (la pista se duplica para el bucle continuo)
  const half = Math.ceil(D.clientes.length / 2);
  $$("[data-logos]").forEach(m => {
    const list = m.dataset.logos === "0" ? D.clientes.slice(0, half) : D.clientes.slice(half);
    const track = `<div class="marquee__track">${list.map(logo).join("")}</div>`;
    m.innerHTML = track + track.replace('class="marquee__track"', 'class="marquee__track" aria-hidden="true"');
  });
  // Clientes B: rejilla
  $("[data-lgrid]").innerHTML = D.clientes.slice(0, 20).map(n => `<div>${logo(n)}</div>`).join("");
  // Clientes C: huecos que van cambiando de logo
  const slots = $("[data-slots]");
  slots.innerHTML = D.clientes.slice(0, 8).map(n => `<div class="slot">${logo(n)}</div>`).join("");

  // Servicios A: bento
  const bento = D.servicios.slice(0, 9).map(s => `
    <a class="tile rv ${s.size ? "tile--" + s.size : ""}" href="#contacto">
      ${img(s.img, s.t)}<span class="tile__go">${icon("arrow")}</span>
      <h3>${s.t}</h3><p>${s.d}</p></a>`).join("");
  $("[data-bento]").innerHTML = bento + `
    <a class="tile tile--cta rv" href="#contacto"><span class="tile__go">${icon("arrow")}</span>
      <h3>¿No ves tu proyecto?<br>Lo producimos igual.</h3><p>Cuéntanoslo y te proponemos solución en 24 h.</p></a>`;
  // Servicios B: lista tipográfica
  $("[data-slist]").innerHTML = D.servicios.map((s, i) => `
    <li><a href="#contacto" data-img="${D.img}${s.img}.webp">
      <span class="slist__n">${String(i + 1).padStart(2, "0")}</span>
      ${img(s.img, "", 'class="slist__thumb"')}
      <span class="slist__t">${s.t}</span><span class="slist__d">${s.d}</span></a></li>`).join("");
  // Servicios C: tarjetas en horizontal
  $("[data-htrack]").insertAdjacentHTML("beforeend", D.servicios.map((s, i) => `
    <a class="hcard" href="#contacto">${img(s.img, s.t)}
      <span class="hcard__n">${String(i + 1).padStart(2, "0")}</span><h3>${s.t}</h3><p>${s.d}</p></a>`).join(""));

  // Por qué A / B / C
  $("[data-reasons]").innerHTML = D.motivos.map((m, i) => `
    <div class="reason rv" style="--d:${i * .08}s"><div class="reason__ico">${icon(m.i)}</div><h3>${m.t}</h3><p>${m.d}</p></div>`).join("");
  $("[data-scards]").innerHTML = D.motivos.map((m, i) => `
    <article class="scard" style="--i:${i}"><span class="scard__n">${String(i + 1).padStart(2, "0")}</span>
      <div><h3>${m.t}</h3><p>${m.d}</p></div></article>`).join("");
  $("[data-accmedia]").insertAdjacentHTML("afterbegin", D.motivos.map((m, i) => img(m.img, m.t, i === 0 ? 'class="on"' : "")).join(""));
  $("[data-acc]").innerHTML = D.motivos.map((m, i) => `
    <div class="acc__item ${i === 0 ? "open" : ""}">
      <button type="button" aria-expanded="${i === 0}" aria-controls="acc-${i}" id="accb-${i}"><span class="n">0${i + 1}</span>${m.t}<i aria-hidden="true"></i></button>
      <div class="acc__panel" id="acc-${i}" role="region" aria-labelledby="accb-${i}"><div><p>${m.d}</p></div></div></div>`).join("");

  // Proyectos A: masonry + filtros
  const sectores = ["Todos", ...new Set(D.proyectos.map(p => p.s))];
  $("[data-filters]").innerHTML = sectores.map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-f="${s}">${s}</button>`).join("");
  $("[data-masonry]").innerHTML = D.proyectos.map(p => `
    <a class="pcard rv" href="#contacto" data-s="${p.s}">${img(p.img, p.t, `width="${p.w}" height="${p.h}"`)}
      <div class="pcard__cap"><span class="chip">${p.s}</span><h3>${p.t}</h3></div></a>`).join("");
  // Proyectos B: carrusel
  $("[data-drag]").innerHTML = D.proyectos.map(p => `
    <a class="dcard" href="#contacto"><div class="dcard__img">${img(p.img, p.t)}</div>
      <div class="dcard__meta"><h3>${p.c}</h3><span class="chip">${p.s}</span></div></a>`).join("");
  // Proyectos C: destacado
  const feat = D.proyectos.slice(0, 7);
  $("[data-fstage]").insertAdjacentHTML("afterbegin", feat.map((p, i) => img(p.img, p.t, i === 0 ? 'class="on"' : "")).join(""));
  $("[data-flist]").innerHTML = feat.map((p, i) => `<li><button type="button" aria-pressed="${i === 0}" data-i="${i}"><b>${p.c}</b><span>${p.s}</span></button></li>`).join("");

  // Proceso A / B / C
  $("[data-tl]").insertAdjacentHTML("beforeend", D.pasos.map((p, i) => `
    <div class="tl__step rv" style="--d:${i * .1}s"><span class="tl__dot">0${i + 1}</span><h3>${p.t}</h3><p>${p.d}</p></div>`).join(""));
  $("[data-hacc]").innerHTML = D.pasos.map((p, i) => `
    <button type="button" class="hacc__p ${i === 0 ? "on" : ""}" aria-expanded="${i === 0}">${img(p.img, "")}
      <span class="hacc__n">0${i + 1}</span><span class="hacc__body"><h3>${p.t}</h3><p>${p.d}</p></span></button>`).join("");
  const story = $("[data-story]");
  $(".story__bars", story).innerHTML = D.pasos.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 0}"><i></i>${p.t}</button>`).join("");
  $(".story__media", story).innerHTML = D.pasos.map((p, i) => img(p.img, p.t, i === 0 ? 'class="on"' : "")).join("");

  // Opiniones A / B / C
  $(".quote__slides").innerHTML = D.opiniones.map((o, i) => `
    <figure class="quote__s ${i === 0 ? "on" : ""}" style="margin:0"><blockquote>${o.q}</blockquote>
      <figcaption class="quote__who"><span class="quote__av" aria-hidden="true">${initials(o.n)}</span><span><b>${o.n}</b><span>${o.e}</span></span>${stars}</figcaption></figure>`).join("");
  const tcard = o => `<figure class="tcard" style="margin:0">${stars}<p>“${o.q}”</p><b>${o.n}</b><span>${o.e}</span></figure>`;
  const rot = (a, k) => a.slice(k).concat(a.slice(0, k));
  $("[data-wall]").innerHTML = [0, 2, 4].map((k, c) => {
    const cards = rot(D.opiniones, k).map(tcard).join("");
    return `<div class="wall__col ${c === 1 ? "wall__col--rev" : ""}" style="--dur:${32 + c * 6}s">${cards}${cards.replace(/class="tcard"/g, 'class="tcard" aria-hidden="true"')}</div>`;
  }).join("");
  $("[data-rate]").innerHTML = D.opiniones.slice(1, 5).map(o => tcard(o).replace('class="tcard"', 'class="tcard rv"')).join("");

  /* ---------- Selector de opciones por sección ---------- */
  const params = new URLSearchParams(location.search);
  const secs = $$("[data-sec]");
  const state = {};
  const boardList = $("[data-board-list]");

  function show(sec, v, animate) {
    const key = sec.dataset.sec;
    const variants = $$(":scope > .variant", sec);
    if (!variants.some(x => x.dataset.v === v)) v = variants[0].dataset.v;
    state[key] = v;
    variants.forEach(x => {
      const on = x.dataset.v === v;
      x.hidden = !on;
      if (on && animate && !reduce) { x.classList.remove("is-entering"); void x.offsetWidth; x.classList.add("is-entering"); }
    });
    $$(".switch button", sec).forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v));
    const cb = onShow[key + v]; if (cb) requestAnimationFrame(cb);
    if (animate) syncURL();
    renderBoard();
    refreshLayout();
  }
  function syncURL() {
    const p = new URLSearchParams(location.search);
    secs.forEach(s => { const k = s.dataset.sec; state[k] === "A" ? p.delete(k) : p.set(k, state[k]); });
    const q = p.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
  }
  function renderBoard() {
    boardList.innerHTML = secs.map(s => {
      const v = state[s.dataset.sec];
      const name = $(`:scope > .variant[data-v="${v}"]`, s)?.dataset.name || "";
      return `<li><a href="#${s.id}">${s.dataset.label} <b>${v} · ${name}</b></a></li>`;
    }).join("");
  }
  secs.forEach(sec => {
    const sw = $(".switch", sec);
    sw.innerHTML = `<span class="switch__label">${sec.dataset.label}</span>` + $$(":scope > .variant", sec).map(v =>
      `<button type="button" data-v="${v.dataset.v}" aria-pressed="false" title="${v.dataset.name}">${v.dataset.v}<span class="switch__name"> · ${v.dataset.name}</span></button>`).join("");
    sw.addEventListener("click", e => { const b = e.target.closest("button"); if (b) show(sec, b.dataset.v, true); });
  });

  // Panel
  const board = $("[data-board]"), boardBtn = $(".board__btn", board), boardPanel = $(".board__panel", board);
  boardBtn.addEventListener("click", () => {
    const open = boardPanel.hidden; boardPanel.hidden = !open; boardBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !boardPanel.hidden) { boardPanel.hidden = true; boardBtn.setAttribute("aria-expanded", false); boardBtn.focus(); } });
  $("[data-copy]").addEventListener("click", async e => {
    try { await navigator.clipboard.writeText(location.href); e.target.textContent = "¡Copiado!"; }
    catch { e.target.textContent = "Copia la URL"; }
    setTimeout(() => (e.target.textContent = "Copiar enlace"), 1800);
  });
  $("[data-clean]").addEventListener("click", () => {
    document.body.classList.add("hide-switch");
    const back = document.createElement("button");
    back.className = "board__btn"; back.type = "button"; back.innerHTML = icon("layers") + "Mostrar opciones";
    back.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:71";
    back.onclick = () => { document.body.classList.remove("hide-switch"); back.remove(); };
    document.body.append(back);
  });

  /* ---------- Cabecera ---------- */
  const nav = $("#nav"), burger = $(".nav__burger");
  let lastY = 0;
  const onScrollNav = () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 60);
    nav.classList.toggle("is-hidden", y > 400 && y > lastY && !nav.classList.contains("is-open"));
    lastY = y;
  };
  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", open);
  });
  $$("#navlinks a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }));

  /* ---------- Entradas al hacer scroll y contadores ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  $$(".rv,[data-wave]").forEach(el => io.observe(el));

  const fmt = n => n.toLocaleString("es-ES");
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count; cio.unobserve(el);
    if (reduce) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1600;
    const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- Portada ---------- */
  // Titular palabra a palabra (sin tocar el bloque que rota)
  $$("[data-split]").forEach(h => {
    let i = 0;
    [...h.childNodes].forEach(n => {
      if (n.nodeType !== 3 || !n.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w.trim()) { frag.append(w); return; }
        const s = document.createElement("span"); s.className = "word";
        s.innerHTML = `<span style="--i:${i++}">${w}</span>`; frag.append(s);
      });
      n.replaceWith(frag);
    });
  });
  // Palabra que cambia
  $$("[data-cycle]").forEach(c => {
    const items = $$(":scope > span", c); let k = 0;
    if (reduce) return;
    setInterval(() => { if (c.offsetParent === null) return; items[k].classList.remove("on"); k = (k + 1) % items.length; items[k].classList.add("on"); }, 2600);
  });
  // A · parallax
  const par = $("[data-parallax]");
  // B · abanico
  onShow.heroB = () => { const f = $("[data-fan]"); f.classList.remove("is-open"); setTimeout(() => f.classList.add("is-open"), reduce ? 0 : 250); };
  // C · linterna
  const spot = $("[data-spot]");
  let spotAuto = true, spotT = 0;
  spot.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    spotAuto = false; const r = spot.getBoundingClientRect();
    spot.style.setProperty("--mx", e.clientX - r.left + "px"); spot.style.setProperty("--my", e.clientY - r.top + "px");
  });
  spot.addEventListener("pointerleave", () => (spotAuto = true));
  let spotIn = false;
  new IntersectionObserver(([e]) => (spotIn = e.isIntersecting)).observe(spot);
  const spotLoop = () => {
    if (!spot.hidden && spotIn && spotAuto && !reduce) {
      spotT += .008; const r = spot.getBoundingClientRect();
      spot.style.setProperty("--mx", r.width * (.55 + .3 * Math.sin(spotT)) + "px");
      spot.style.setProperty("--my", r.height * (.45 + .2 * Math.sin(spotT * 1.7)) + "px");
    }
    requestAnimationFrame(spotLoop);
  };
  spot.style.setProperty("--rad", Math.max(180, Math.min(innerWidth * .22, 320)) + "px");
  requestAnimationFrame(spotLoop);

  /* ---------- Clientes ---------- */
  $("[data-mq-toggle]").addEventListener("click", e => {
    const p = e.target.getAttribute("aria-pressed") !== "true";
    e.target.setAttribute("aria-pressed", p); e.target.textContent = p ? "Reanudar movimiento" : "Pausar movimiento";
    $$("#clientes .marquee").forEach(m => m.classList.toggle("is-paused", p));
  });
  $("[data-lgrid]").addEventListener("pointermove", e => {
    const c = e.target.closest("[data-lgrid] > div"); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
  });
  if (!reduce) {
    let pool = D.clientes.slice(8), slotI = 0;
    setInterval(() => {
      if (slots.offsetParent === null) return;
      const box = slots.children[(slotI = (slotI + 3) % 8)], old = $("img", box);
      const name = pool.shift(); pool.push(old.getAttribute("src").split("/").pop().replace(".png", ""));
      const nu = document.createElement("div"); nu.innerHTML = logo(name); const ni = nu.firstChild;
      ni.classList.add("pre"); box.append(ni); old.classList.add("out");
      requestAnimationFrame(() => requestAnimationFrame(() => ni.classList.remove("pre")));
      setTimeout(() => old.remove(), 700);
    }, 1500);
  }

  /* ---------- Servicios ---------- */
  // B · imagen que sigue al cursor
  const follow = $("[data-follow]");
  if (canHover) {
    let fx = 0, fy = 0, tx = 0, ty = 0, cur = "";
    const list = $("[data-slist]");
    list.addEventListener("pointerover", e => {
      const a = e.target.closest("a"); if (!a || a.dataset.img === cur) return;
      cur = a.dataset.img;
      const im = new Image(); im.src = cur; im.alt = ""; im.style.opacity = 0;
      follow.append(im); requestAnimationFrame(() => (im.style.opacity = 1));
      while (follow.children.length > 2) follow.firstChild.remove();
      follow.classList.add("on");
    });
    list.addEventListener("pointerleave", () => { follow.classList.remove("on"); cur = ""; });
    let running = false;
    const loop = () => {
      fx += (tx - fx) * .14; fy += (ty - fy) * .14;
      follow.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;
      running = follow.classList.contains("on") || Math.abs(tx - fx) + Math.abs(ty - fy) > .5;
      if (running) requestAnimationFrame(loop);
    };
    list.addEventListener("pointermove", e => {
      tx = e.clientX; ty = e.clientY;
      if (!running) { if (!follow.classList.contains("on")) { fx = tx; fy = ty; } running = true; requestAnimationFrame(loop); }
    }, { passive: true });
  }
  // C · scroll horizontal
  const hs = $("[data-hscroll]"), htrack = $("[data-htrack]"), hbar = $("[data-hbar]");
  const hsMeasure = () => {
    if (hs.offsetParent === null || innerWidth <= 820) { hs.style.removeProperty("--h"); htrack.style.transform = ""; return; }
    const dist = htrack.scrollWidth - innerWidth;
    hs.style.setProperty("--h", dist + innerHeight + "px"); hs.dataset.dist = dist;
  };
  const hsScroll = () => {
    if (hs.offsetParent === null || innerWidth <= 820) return;
    const r = hs.getBoundingClientRect(), dist = +hs.dataset.dist || 0;
    const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1);
    htrack.style.transform = `translate3d(${-dist * p}px,0,0)`; hbar.parentElement.style.setProperty("--p", p);
  };
  onShow.serviciosC = () => { hsMeasure(); hsScroll(); };

  /* ---------- Por qué C · acordeón ---------- */
  const accImgs = $$("[data-accmedia] img");
  $$("[data-acc] .acc__item").forEach((it, i, all) => {
    $("button", it).addEventListener("click", () => {
      all.forEach((o, j) => { o.classList.toggle("open", j === i); $("button", o).setAttribute("aria-expanded", j === i); });
      accImgs.forEach((im, j) => im.classList.toggle("on", j === i));
    });
  });

  /* ---------- Proyectos ---------- */
  $("[data-filters]").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("[data-filters] button").forEach(x => x.setAttribute("aria-pressed", x === b));
    $$("[data-masonry] .pcard").forEach(c => {
      const hide = b.dataset.f !== "Todos" && c.dataset.s !== b.dataset.f;
      c.classList.toggle("is-out", hide);
      if (!hide && !reduce) { c.classList.add("in"); c.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.16,1,.3,1)" }); }
    });
  });
  // B · arrastrar
  const drag = $("[data-drag]"), dbar = $("[data-drag-bar]");
  let down = false, sx = 0, sl = 0, moved = 0;
  drag.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = 0; sx = e.clientX; sl = drag.scrollLeft; });
  addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; moved = Math.abs(dx); if (moved > 4) drag.classList.add("is-drag"); drag.scrollLeft = sl - dx; });
  addEventListener("pointerup", () => { down = false; setTimeout(() => drag.classList.remove("is-drag"), 0); });
  drag.addEventListener("click", e => { if (moved > 4) e.preventDefault(); }, true);
  const dstep = () => (drag.firstElementChild?.offsetWidth || 300) + 18;
  $("[data-drag-prev]").addEventListener("click", () => drag.scrollBy({ left: -dstep(), behavior: reduce ? "auto" : "smooth" }));
  $("[data-drag-next]").addEventListener("click", () => drag.scrollBy({ left: dstep(), behavior: reduce ? "auto" : "smooth" }));
  drag.addEventListener("keydown", e => { if (e.key === "ArrowRight") drag.scrollBy({ left: dstep() }); if (e.key === "ArrowLeft") drag.scrollBy({ left: -dstep() }); });
  const dprog = () => { const max = drag.scrollWidth - drag.clientWidth; dbar.style.width = (max > 0 ? 15 + 85 * drag.scrollLeft / max : 100) + "%"; };
  drag.addEventListener("scroll", dprog, { passive: true });
  onShow.proyectosB = dprog;
  // C · destacado
  const fImgs = $$("[data-fstage] img"), fBtns = $$("[data-flist] button");
  let fCur = 0, fTimer;
  const fSet = i => {
    if (i === fCur) return;
    fImgs.forEach(im => im.classList.remove("was"));
    fImgs[fCur].classList.replace("on", "was"); fImgs[i].classList.add("on");
    fBtns.forEach((b, j) => b.setAttribute("aria-pressed", j === i));
    $("[data-fcap]").textContent = feat[i].t; $("[data-fchip]").textContent = feat[i].s; fCur = i;
  };
  $("[data-fcap]").textContent = feat[0].t; $("[data-fchip]").textContent = feat[0].s;
  fBtns.forEach((b, i) => { b.addEventListener("click", () => { fSet(i); clearInterval(fTimer); }); if (canHover) b.addEventListener("pointerenter", () => { fSet(i); clearInterval(fTimer); }); });
  onShow.proyectosC = () => { clearInterval(fTimer); if (!reduce) fTimer = setInterval(() => { if (fBtns[0].offsetParent) fSet((fCur + 1) % feat.length); }, 4000); };

  /* ---------- Proceso ---------- */
  const tl = $("[data-tl]"), tlSteps = $$(".tl__step", tl);
  const tlScroll = () => {
    if (tl.offsetParent === null) return;
    const r = tl.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * .75 - r.top) / (r.height + innerHeight * .2), 0), 1);
    tl.style.setProperty("--p", p);
    tlSteps.forEach((s, i) => s.classList.toggle("on", p >= i / tlSteps.length + .02));
  };
  const hacc = $$("[data-hacc] .hacc__p");
  hacc.forEach((p, i) => {
    const set = () => hacc.forEach((o, j) => { o.classList.toggle("on", j === i); o.setAttribute("aria-expanded", j === i); });
    p.addEventListener("click", set); p.addEventListener("focus", set);
    if (canHover) p.addEventListener("pointerenter", set);
  });
  // C · historias
  const sBars = $$(".story__bars button", story), sImgs = $$(".story__media img", story), sSwap = $(".story__swap", story);
  let sCur = 0, sTimer, sVisible = false;
  const sDur = 5000;
  const sSet = i => {
    sCur = i;
    sBars.forEach((b, j) => { b.classList.toggle("on", j === i); b.classList.toggle("done", j < i); b.setAttribute("aria-selected", j === i); });
    sImgs.forEach((im, j) => im.classList.toggle("on", j === i));
    sSwap.classList.add("out");
    setTimeout(() => {
      $(".story__n", story).textContent = "0" + (i + 1);
      $(".story__txt h3", story).textContent = D.pasos[i].t; $(".story__txt p", story).textContent = D.pasos[i].d;
      sSwap.classList.remove("out");
    }, reduce ? 0 : 300);
    clearTimeout(sTimer);
    if (!reduce && sVisible) sTimer = setTimeout(() => sSet((sCur + 1) % D.pasos.length), sDur);
  };
  story.style.setProperty("--t", sDur + "ms");
  sBars.forEach((b, i) => b.addEventListener("click", () => sSet(i)));
  new IntersectionObserver(([e]) => { sVisible = e.isIntersecting; if (sVisible) sSet(sCur); else clearTimeout(sTimer); }, { threshold: .35 }).observe(story);
  sSet(0);

  /* ---------- Opiniones A ---------- */
  const qs = $$(".quote__s"), qCount = $("[data-q-count]");
  let qCur = 0, qTimer;
  const qSet = i => { qCur = (i + qs.length) % qs.length; qs.forEach((q, j) => q.classList.toggle("on", j === qCur)); qCount.textContent = `${String(qCur + 1).padStart(2, "0")} / ${String(qs.length).padStart(2, "0")}`; };
  const qAuto = () => { clearInterval(qTimer); if (!reduce) qTimer = setInterval(() => { if (qCount.offsetParent) qSet(qCur + 1); }, 7000); };
  $("[data-q-prev]").addEventListener("click", () => { qSet(qCur - 1); qAuto(); });
  $("[data-q-next]").addEventListener("click", () => { qSet(qCur + 1); qAuto(); });
  $("[data-quote]").addEventListener("pointerenter", () => clearInterval(qTimer));
  $("[data-quote]").addEventListener("pointerleave", qAuto);
  qSet(0); qAuto();
  $("[data-wall-toggle]").addEventListener("click", e => {
    const p = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", p); e.currentTarget.textContent = p ? "Reanudar" : "Pausar";
    $("[data-wall]").classList.toggle("is-paused", p);
  });

  /* ---------- Formularios (prueba: abren el correo) ---------- */
  const validate = scope => {
    let ok = true;
    $$("[required]", scope).forEach(inp => { const bad = !inp.value.trim(); inp.closest(".field").classList.toggle("bad", bad); inp.setAttribute("aria-invalid", bad); if (bad && ok) { inp.focus(); ok = false; } });
    return ok;
  };
  const sendMail = (data, form) => {
    const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
    form.classList.add("sent");
    location.href = `mailto:nico@unical.es?subject=${encodeURIComponent("Solicitud de presupuesto")}&body=${encodeURIComponent(body)}`;
  };
  $$("[data-form]").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault(); if (!validate(f)) return;
    sendMail(Object.fromEntries(new FormData(f)), f);
  }));
  $$("input,textarea").forEach(i => i.addEventListener("input", () => i.closest(".field")?.classList.remove("bad")));
  // Presupuesto por pasos
  const wiz = $("[data-wiz]"), panes = $$(".wiz__pane", wiz), wNext = $("[data-wiz-next]"), wBack = $("[data-wiz-back]");
  let wStep = 0;
  const wGo = n => {
    wStep = n; panes.forEach((p, i) => (p.hidden = i !== n));
    $$(".wiz__steps i", wiz).forEach((d, i) => d.classList.toggle("on", i <= n));
    $("[data-wiz-title]").textContent = `Paso ${n + 1} de ${panes.length}`;
    wBack.hidden = n === 0;
    wNext.innerHTML = n === panes.length - 1 ? `Enviar solicitud ${icon("arrow")}` : `Siguiente ${icon("arrow")}`;
    const first = $("input", panes[n]); if (first && n > 0) first.focus({ preventScroll: true });
  };
  wNext.addEventListener("click", () => {
    const pane = panes[wStep];
    if (wStep < panes.length - 1) {
      if (!$("input:checked", pane)) { pane.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], { duration: 250 }); return; }
      wGo(wStep + 1);
    } else if (validate(pane)) sendMail(Object.fromEntries(new FormData(wiz)), pane);
  });
  wBack.addEventListener("click", () => wGo(wStep - 1));
  $$(".pick input", wiz).forEach(i => i.addEventListener("change", () => { if (wStep < panes.length - 1) setTimeout(() => wGo(wStep + 1), reduce ? 0 : 280); }));

  // Botón magnético
  const mag = $("[data-magnet]");
  if (canHover && !reduce) {
    mag.parentElement.addEventListener("pointermove", e => {
      const r = mag.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      mag.style.transform = d < 220 ? `translate(${dx * .3}px,${dy * .3}px)` : "";
    });
    mag.parentElement.addEventListener("pointerleave", () => (mag.style.transform = ""));
  }

  /* ---------- Bucle de scroll ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      onScrollNav(); hsScroll(); tlScroll();
      if (par && !reduce && scrollY < innerHeight * 1.2) par.style.transform = `translate3d(0,${scrollY * +par.dataset.parallax}px,0)`;
      ticking = false;
    });
  };
  function refreshLayout() { hsMeasure(); hsScroll(); tlScroll(); }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", () => { spot.style.setProperty("--rad", Math.max(180, Math.min(innerWidth * .22, 320)) + "px"); refreshLayout(); });
  addEventListener("load", refreshLayout);

  // Estado inicial desde la URL (?hero=B&servicios=C …)
  secs.forEach(s => show(s, (params.get(s.dataset.sec) || "A").toUpperCase(), false));
  onScroll();
})();
