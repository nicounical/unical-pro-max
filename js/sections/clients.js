/* ===== 08 · Clientes — A «Puente a contacto» (única desde la ronda 8; antes E) =====
   Una sola línea infinita: la lista se duplica (copia oculta a lectores de pantalla) y la pista se desplaza
   el 50 % en bucle por CSS. Velocidad constante según el ancho real; pausa al pasar el ratón, con el foco
   y fuera de pantalla. Con reduced-motion no hay copia ni movimiento (CSS muestra la lista en varias líneas). */
(() => {
  const { register, $ } = UX;
  const PX_S = 42; // velocidad de la cinta en px/s

  register("clients", "A", (root, ux) => {
    const belt = $(".clients-a__belt", root), row = $(".clients-a__row", root);
    if (ux.reduce) return;
    const track = document.createElement("div");
    track.className = "clients-a__track";
    const copy = row.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.removeAttribute("aria-label");
    row.before(track); track.append(row, copy);
    const speed = () => track.style.setProperty("--dur", (row.offsetWidth / PX_S).toFixed(1) + "s");
    speed();
    const ro = new ResizeObserver(speed); ro.observe(row);
    const io = new IntersectionObserver(([e]) => root.classList.toggle("is-off", !e.isIntersecting));
    io.observe(root);
    gsap.fromTo($(".clients-a__next i", root), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: $(".clients-a__next", root), start: "top 95%", end: "bottom 70%", scrub: .5 } });
    return () => { ro.disconnect(); io.disconnect(); copy.remove(); track.before(row); track.remove(); root.classList.remove("is-off"); };
  });
})();
