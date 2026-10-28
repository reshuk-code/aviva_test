/** Pushes each pill away from the mouse with a soft spring, then lets it settle back. */
export function bindPillRepel(list: HTMLElement) {
  const motion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const area = list.closest("section") ?? list.parentElement ?? list;
  const RADIUS = 170, PUSH = 46, STIFFNESS = .09, DAMPING = .8;
  type Pill = { el: HTMLElement; angle: number; x: number; y: number; vx: number; vy: number };
  let pills: Pill[] = [];
  let mouseX = 0, mouseY = 0, active = false, frame = 0;

  const collect = () => {
    pills = Array.from(list.children as HTMLCollectionOf<HTMLElement>).map((el) => {
      const old = pills.find((pill) => pill.el === el);
      const rotate = parseFloat(getComputedStyle(el).rotate) || 0;
      return { el, angle: (rotate * Math.PI) / 180, x: old?.x ?? 0, y: old?.y ?? 0, vx: old?.vx ?? 0, vy: old?.vy ?? 0 };
    });
  };

  const tick = () => {
    frame = 0;
    let moving = false;
    for (const pill of pills) {
      let targetX = 0, targetY = 0;
      if (active) {
        const box = pill.el.getBoundingClientRect();
        // Where the pill would sit without the push, so the push doesn't feed back on itself.
        const dx = box.left + box.width / 2 - pill.x - mouseX;
        const dy = box.top + box.height / 2 - pill.y - mouseY;
        const reach = RADIUS + Math.max(box.width, box.height) / 2;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance < reach) {
          const strength = (1 - distance / reach) ** 2 * PUSH;
          targetX = (dx / distance) * strength;
          targetY = (dy / distance) * strength;
        }
      }
      pill.vx = (pill.vx + (targetX - pill.x) * STIFFNESS) * DAMPING;
      pill.vy = (pill.vy + (targetY - pill.y) * STIFFNESS) * DAMPING;
      pill.x += pill.vx;
      pill.y += pill.vy;
      const settled = Math.abs(pill.x) < .05 && Math.abs(pill.y) < .05 && Math.abs(pill.vx) < .05 && Math.abs(pill.vy) < .05;
      if (settled && !active) {
        pill.x = pill.y = pill.vx = pill.vy = 0;
        pill.el.style.removeProperty("transform");
        continue;
      }
      moving = true;
      // `transform` runs after the pill's own rotate, so undo that angle to push in screen space.
      const cos = Math.cos(-pill.angle), sin = Math.sin(-pill.angle);
      const localX = pill.x * cos - pill.y * sin, localY = pill.x * sin + pill.y * cos;
      pill.el.style.transform = `translate(${localX.toFixed(2)}px, ${localY.toFixed(2)}px) rotate(${(pill.vx * .6).toFixed(2)}deg)`;
    }
    if (moving) frame = requestAnimationFrame(tick);
  };
  const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

  const move = (event: PointerEvent) => {
    if (!motion.matches || event.pointerType !== "mouse") return;
    if (!active) { collect(); active = true; }
    mouseX = event.clientX; mouseY = event.clientY;
    wake();
  };
  const leave = () => { active = false; wake(); };
  const reset = () => {
    active = false; cancelAnimationFrame(frame); frame = 0;
    for (const pill of pills) pill.el.style.removeProperty("transform");
    pills = [];
  };

  area.addEventListener("pointermove", move, { passive: true });
  area.addEventListener("pointerleave", leave);
  window.addEventListener("resize", leave);
  motion.addEventListener("change", reset);
  return () => {
    reset();
    area.removeEventListener("pointermove", move);
    area.removeEventListener("pointerleave", leave);
    window.removeEventListener("resize", leave);
    motion.removeEventListener("change", reset);
  };
}
