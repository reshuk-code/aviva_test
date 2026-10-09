/** Shared pointer response for portfolio cards and other homepage photos. */
export function bindImageTilt(element: HTMLElement) {
  const motion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  let frame = 0, x = .5, y = .5;
  const update = () => {
    frame = 0;
    element.style.setProperty("--tilt-x", `${(y - .5) * -5}deg`);
    element.style.setProperty("--tilt-y", `${(x - .5) * 5}deg`);
    element.style.setProperty("--shine-x", `${x * 100}%`);
    element.style.setProperty("--shine-y", `${y * 100}%`);
  };
  const move = (event: PointerEvent) => {
    if (!motion.matches || event.pointerType !== "mouse") return;
    const bounds = element.getBoundingClientRect();
    x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    if (!frame) frame = requestAnimationFrame(update);
  };
  const reset = () => {
    cancelAnimationFrame(frame); frame = 0;
    for (const property of ["--tilt-x", "--tilt-y", "--shine-x", "--shine-y"]) element.style.removeProperty(property);
  };
  element.addEventListener("pointermove", move, { passive: true });
  element.addEventListener("pointerleave", reset);
  element.addEventListener("blur", reset);
  motion.addEventListener("change", reset);
  return () => {
    reset(); element.removeEventListener("pointermove", move);
    element.removeEventListener("pointerleave", reset); element.removeEventListener("blur", reset);
    motion.removeEventListener("change", reset);
  };
}
