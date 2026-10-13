"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** The rainbow layers model, lit and rendered in 3D; drag to spin it. */
export function HeroSculpture({ className }: { className: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let release = () => {};
    void Promise.all([import("three"), import("three/examples/jsm/loaders/GLTFLoader.js")]).then(async ([THREE, { GLTFLoader }]) => {
      const gltf = await new GLTFLoader().loadAsync("/models/rainbow-exact.glb");
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.append(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
      camera.position.set(0, 0, 6.9);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x432447, 1.15));
      const key = new THREE.DirectionalLight(0xfff4df, 1.9);
      key.position.set(-3, 5, 6); scene.add(key);
      const rim = new THREE.DirectionalLight(0x99eaff, 1.1);
      rim.position.set(4, -1, 2); scene.add(rim);
      // The supplied model keeps its authored pose; it is centred and scaled to fill the frame.
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model, true), size = bounds.getSize(new THREE.Vector3());
      model.position.sub(bounds.getCenter(new THREE.Vector3()));
      // The exported sheen is strong enough to wash the colours out under these lights.
      model.traverse((child) => { const mesh = child as InstanceType<typeof THREE.Mesh>; for (const surface of mesh.isMesh ? [mesh.material].flat() : []) if ("sheen" in surface) surface.sheen = .2; });
      const sculpture = new THREE.Group(); sculpture.add(model); const baseScale = 3.1 / Math.max(size.x, size.y); sculpture.scale.setScalar(baseScale); scene.add(sculpture);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      let targetX = 0, targetY = 0, tiltX = 0, tiltY = 0, visible = true, frame = 0, time = 0, last = 0;
      // Dragging spins the sculpture freely; on release it coasts, then eases back to rest.
      let dragging = false, dragX = 0, dragY = 0, spinX = 0, spinY = 0, lastPointerX = 0, lastPointerY = 0, lastPointerTime = 0;
      const move = (event: PointerEvent) => {
        if (dragging) {
          const elapsed = Math.max((event.timeStamp - lastPointerTime) / 1000, .008);
          const stepY = (event.clientX - lastPointerX) * .01, stepX = (event.clientY - lastPointerY) * .01;
          dragY += stepY; dragX = Math.min(Math.max(dragX + stepX, -1.3), 1.3);
          spinY = stepY / elapsed; spinX = stepX / elapsed;
          lastPointerX = event.clientX; lastPointerY = event.clientY; lastPointerTime = event.timeStamp;
          return;
        }
        if (reduced.matches || !pointer.matches) return;
        targetX = (event.clientY / window.innerHeight - .5) * .55;
        targetY = (event.clientX / window.innerWidth - .5) * .8;
      };
      const leave = () => { targetX = 0; targetY = 0; };
      let hovered = false, lifted = 0;
      const enter = () => { hovered = true; start(); }, exit = () => { hovered = false; };
      const grab = (event: PointerEvent) => {
        dragging = true; spinX = 0; spinY = 0;
        lastPointerX = event.clientX; lastPointerY = event.clientY; lastPointerTime = event.timeStamp;
        element.setPointerCapture(event.pointerId); element.style.cursor = "grabbing"; start();
      };
      const drop = () => {
        if (!dragging) return;
        dragging = false; element.style.cursor = "grab";
        // Unwind by the shortest way round instead of replaying every turn.
        dragY = Math.atan2(Math.sin(dragY), Math.cos(dragY));
        spinX = Math.min(Math.max(spinX, -8), 8); spinY = Math.min(Math.max(spinY, -8), 8);
      };
      const render = (now: number) => {
        const delta = Math.min((now - last) / 1000 || 0, .05); last = now;
        if (!reduced.matches) time += delta;
        const smoothing = 1 - Math.exp(-delta * 5);
        // Entrance: the model spins up from small. Idle: layered slow sways, a float and a faint breath.
        const arrival = reduced.matches ? 1 : 1 - Math.pow(1 - Math.min(time / 1.6, 1), 4);
        const sway = reduced.matches ? 0 : 1;
        const yaw = sway * (Math.sin(time * .55) * .34 + Math.sin(time * .21) * .12) - (1 - arrival) * 2.6;
        const pitch = sway * Math.sin(time * .4 + 1) * .1, roll = sway * Math.sin(time * .33) * .06;
        lifted += ((hovered ? 1 : 0) - lifted) * (1 - Math.exp(-delta * 7));
        sculpture.scale.setScalar(baseScale * (.5 + .5 * arrival) * (1 + sway * .018 * Math.sin(time * 1.3)) * (1 + .07 * lifted));
        if (!dragging) {
          dragY += spinY * delta; dragX = Math.min(Math.max(dragX + spinX * delta, -1.3), 1.3);
          spinX *= Math.exp(-delta * 2.2); spinY *= Math.exp(-delta * 2.2);
          const home = 1 - Math.exp(-delta * .9);
          dragX -= dragX * home; dragY -= dragY * home;
        }
        tiltX += ((reduced.matches ? 0 : targetX) - tiltX) * smoothing;
        tiltY += ((reduced.matches ? 0 : targetY) - tiltY) * smoothing;
        sculpture.rotation.set(tiltX + dragX + pitch, tiltY + yaw + dragY, roll);
        sculpture.position.set(tiltY * .18, -tiltX * .15 + sway * Math.sin(time * .9) * .07, 0);
        renderer.render(scene, camera);
        element.dataset.ready = "true";
        frame = 0;
        const settling = dragging || lifted > .01 && lifted < .99 || Math.abs(spinX) + Math.abs(spinY) > .01 || Math.abs(dragX) + Math.abs(dragY) > .002;
        if (visible && !document.hidden && (!reduced.matches || settling)) frame = requestAnimationFrame(render);
      };
      const start = () => { cancelAnimationFrame(frame); frame = 0; last = performance.now(); if (visible && !document.hidden) frame = requestAnimationFrame(render); };
      element.style.cursor = "grab"; element.style.touchAction = "pan-y";
      element.addEventListener("pointerenter", enter); element.addEventListener("pointerleave", exit);
      element.addEventListener("pointerdown", grab); element.addEventListener("pointerup", drop); element.addEventListener("pointercancel", drop);
      const resize = new ResizeObserver(() => {
        const { width, height } = element.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); start();
      }); resize.observe(element);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }); observer.observe(element);
      const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); delete element.dataset.ready; };
      renderer.domElement.addEventListener("webglcontextlost", lost);
      renderer.domElement.addEventListener("webglcontextrestored", start);
      window.addEventListener("pointermove", move, { passive: true }); document.documentElement.addEventListener("pointerleave", leave);
      reduced.addEventListener("change", start); document.addEventListener("visibilitychange", start);
      release = () => {
        cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
        element.removeEventListener("pointerenter", enter); element.removeEventListener("pointerleave", exit);
        element.removeEventListener("pointerdown", grab); element.removeEventListener("pointerup", drop); element.removeEventListener("pointercancel", drop);
        element.style.cursor = ""; element.style.touchAction = "";
        window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave);
        reduced.removeEventListener("change", start); document.removeEventListener("visibilitychange", start);
        renderer.domElement.removeEventListener("webglcontextlost", lost); renderer.domElement.removeEventListener("webglcontextrestored", start);
        model.traverse((child) => { const mesh = child as InstanceType<typeof THREE.Mesh>; if (!mesh.isMesh) return; mesh.geometry.dispose(); for (const material of [mesh.material].flat()) material.dispose(); }); renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
      };
    }).catch(() => { /* The original artwork remains visible if WebGL or the model is unavailable. */ });
    return () => { disposed = true; release(); };
  }, []);
  return <div ref={host} className={`${className} hero-sculpture`} role="img" aria-label="Interactive folded rainbow sculpture, drag to rotate">
    <Image className="sculpture-fallback" src="/images/image-187.webp" alt="" fill sizes="(max-width: 700px) 160px, 28vw" />
    <svg className="sculpture-backdrop" viewBox="0 0 500 550" aria-hidden="true"><defs><linearGradient id="sculpture-berry" x2=".8" y2="1"><stop stopColor="#8d0938"/><stop offset="1" stopColor="#c51362"/></linearGradient></defs><path fill="url(#sculpture-berry)" d="M88 128C158 126 158 26 211 21C253 13 275 71 328 95C420 136 462 172 471 279C488 424 416 516 315 533C231 551 206 489 159 449C122 416 8 411 14 361C19 311 78 298 73 237C69 186 52 134 88 128Z"/><ellipse cx="117" cy="58" rx="26" ry="36" fill="#8d0938"/></svg>
  </div>;
}
