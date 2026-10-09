"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** A rounded, folded rainbow torus built as a lit 3D surface. */
export function HeroSculpture({ className }: { className: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let release = () => {};
    void import("three").then((THREE) => {
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
      scene.add(new THREE.HemisphereLight(0xffffff, 0x432447, 2));
      const key = new THREE.DirectionalLight(0xfff4df, 3);
      key.position.set(-3, 5, 6); scene.add(key);
      const rim = new THREE.DirectionalLight(0x99eaff, 2.7);
      rim.position.set(4, -1, 2); scene.add(rim);
      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [], colors: number[] = [], indices: number[] = [];
      const around = 192, across = 160;
      const stops = ["#61ddbd", "#ffee42", "#ff9c13", "#ff3b82", "#ba10d4", "#3033a8", "#0075a8", "#16cbd2", "#61ddbd"].map(c => new THREE.Color(c));
      for (let j = 0; j <= across; j++) {
        const v = j / across * Math.PI * 2;
        const fold = .025 * Math.cos(v * 16);
        const radius = 1.08 + (.43 + fold) * Math.cos(v);
        const twist = .48 * Math.sin(v) + .13 * Math.cos(v * 2);
        for (let i = 0; i <= around; i++) {
          const u = i / around * Math.PI * 2;
          const colorPosition = ((i / around + .045 * Math.sin(v) + 1) % 1) * (stops.length - 1);
          const color = stops[Math.floor(colorPosition)].clone().lerp(stops[Math.floor(colorPosition) + 1], colorPosition % 1);
          const square = Math.pow(Math.pow(Math.abs(Math.cos(u)), 4) + Math.pow(Math.abs(Math.sin(u)), 4), -.25);
          const x = radius * square * Math.cos(u), y = radius * square * Math.sin(u);
          const bend = twist + .12 * Math.sin(u * 2 + v);
          positions.push(x * Math.cos(bend) - y * Math.sin(bend), x * Math.sin(bend) + y * Math.cos(bend), (.72 + fold) * Math.sin(v) + .16 * Math.sin(u * 4 + v));
          colors.push(color.r, color.g, color.b);
          if (j < across && i < around) {
            const a = j * (around + 1) + i, b = a + around + 1;
            indices.push(a, b, a + 1, b, b + 1, a + 1);
          }
        }
      }
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(indices); geometry.computeVertexNormals();
      const material = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: .48, metalness: 0, clearcoat: .12, clearcoatRoughness: .5, side: THREE.DoubleSide });
      const sculpture = new THREE.Mesh(geometry, material); scene.add(sculpture);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      let targetX = 0, targetY = 0, visible = true, frame = 0, time = 0, last = 0;
      const move = (event: PointerEvent) => {
        if (reduced.matches || !pointer.matches) return;
        targetX = (event.clientY / window.innerHeight - .5) * .55;
        targetY = (event.clientX / window.innerWidth - .5) * .8;
      };
      const leave = () => { targetX = 0; targetY = 0; };
      const render = (now: number) => {
        const delta = Math.min((now - last) / 1000 || 0, .05); last = now;
        if (!reduced.matches) time += delta;
        const smoothing = 1 - Math.exp(-delta * 5);
        const drift = reduced.matches ? 0 : Math.sin(time * .3) * .07;
        sculpture.rotation.x += (-.16 + (reduced.matches ? 0 : targetX) - sculpture.rotation.x) * smoothing;
        sculpture.rotation.y += (-.3 + (reduced.matches ? 0 : targetY) + drift - sculpture.rotation.y) * smoothing;
        sculpture.rotation.z = -.12 + drift;
        sculpture.position.x += ((reduced.matches ? 0 : targetY * .18) - sculpture.position.x) * smoothing;
        sculpture.position.y += ((reduced.matches ? 0 : -targetX * .15) - sculpture.position.y) * smoothing;
        renderer.render(scene, camera);
        element.dataset.ready = "true";
        frame = 0;
        if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(render);
      };
      sculpture.rotation.set(-.16, -.3, -.12);
      const start = () => { cancelAnimationFrame(frame); frame = 0; last = performance.now(); if (visible && !document.hidden) frame = requestAnimationFrame(render); };
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
        window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave);
        reduced.removeEventListener("change", start); document.removeEventListener("visibilitychange", start);
        renderer.domElement.removeEventListener("webglcontextlost", lost); renderer.domElement.removeEventListener("webglcontextrestored", start);
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); delete element.dataset.ready;
      };
    }).catch(() => { /* The original artwork remains visible if WebGL is unavailable. */ });
    return () => { disposed = true; release(); };
  }, []);
  return <div ref={host} className={`${className} hero-sculpture`} role="img" aria-label="Interactive folded rainbow sculpture">
    <Image className="sculpture-fallback" src="/images/image-187.webp" alt="" fill sizes="(max-width: 700px) 160px, 28vw" />
    <svg className="sculpture-backdrop" viewBox="0 0 500 550" aria-hidden="true"><defs><linearGradient id="sculpture-berry" x2=".8" y2="1"><stop stopColor="#8d0938"/><stop offset="1" stopColor="#c51362"/></linearGradient></defs><path fill="url(#sculpture-berry)" d="M88 128C158 126 158 26 211 21C253 13 275 71 328 95C420 136 462 172 471 279C488 424 416 516 315 533C231 551 206 489 159 449C122 416 8 411 14 361C19 311 78 298 73 237C69 186 52 134 88 128Z"/><ellipse cx="117" cy="58" rx="26" ry="36" fill="#8d0938"/></svg>
  </div>;
}
