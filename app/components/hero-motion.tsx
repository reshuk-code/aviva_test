"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";

export function HeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const hero = ref.current;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          if (hero.getBoundingClientRect().top >= -100) {
            const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
            entrance.fromTo(hero.querySelectorAll(".hero-heading > span"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, stagger: .14 })
              .fromTo(hero.querySelector(".hero-sculpture"), { scale: .78, opacity: 0, rotate: -12 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.5 }, .15)
              .fromTo(hero.querySelector(".hero-office"), { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 1.1 }, .45)
              .fromTo(hero.querySelectorAll(".hero-note, .hero-scroll-cue"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .85, stagger: .1 }, .75);
          }
        }, hero);
        return () => context.revert();
      });
      media.add("(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const story = gsap.timeline({ scrollTrigger: {
            trigger: hero, start: "top top", end: () => `+=${Math.round(window.innerHeight * .65)}`,
            pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
          } });
          // Separate CSS translate from the entrance transforms so the timelines never compete.
          story.to(hero, {
            "--hero-heading-y": "-45px", "--hero-sculpture-y": "24px", "--hero-turn": "1",
            "--hero-corner-x": "100%", "--hero-corner-y": "0%", "--hero-photo-scale": "1.08",
            duration: 1, ease: "none",
          }, 0).to(hero, { "--hero-cue-opacity": "0", duration: .25 }, 0);
        }, hero);
        return () => context.revert();
      });
      media.add("(max-width: 1099px) and (prefers-reduced-motion: no-preference), (max-height: 699px) and (prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          gsap.to(hero, { "--hero-turn": "1", ease: "none", scrollTrigger: {
            trigger: hero, start: "top top", end: "bottom top", scrub: .65,
          } });
        }, hero);
        return () => context.revert();
      });
      revert = () => media.revert();
    });
    return () => { disposed = true; revert?.(); };
  }, []);

  return <section ref={ref} className="hero" aria-labelledby="hero-heading">{children}<a href="#about" className="hero-scroll-cue"><span>Scroll to explore</span><span className="scroll-cue-line" aria-hidden="true" /></a></section>;
}

export function HeroSculpture() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 700px)");
    let disposed = false;
    let release: (() => void) | undefined;
    let generation = 0;

    const configure = async () => {
      const current = ++generation;
      release?.();
      release = undefined;
      delete host.dataset.ready;
      // Keep the original artwork on small screens and for reduced motion.
      if (preference.matches || compact.matches) return;
      try {
        const THREE = await import("three");
        const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
        if (disposed || current !== generation) return;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = .95;
        const scene = new THREE.Scene();
        const environment = new RoomEnvironment();
        const generator = new THREE.PMREMGenerator(renderer);
        const lighting = generator.fromScene(environment, .04);
        scene.environment = lighting.texture;
        scene.environmentIntensity = .18;
        environment.dispose();
        generator.dispose();
        const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
        camera.position.set(0, 0, 5.8);
        const sculpture = new THREE.Group();
        const geometry = new THREE.TorusGeometry(1, .105, 16, 160);
        const positions = geometry.getAttribute("position");
        const colors = new Float32Array(positions.count * 3);
        const gradient = ["#06cbd5", "#087ebf", "#6516bf", "#da1596", "#ff6620", "#ffcb0a"].map((color) => new THREE.Color(color));
        const shade = new THREE.Color();
        // Fold each ring into three flowing lobes, then layer the ribbons in depth.
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i), y = positions.getY(i);
          const angle = Math.atan2(y, x);
          const fold = 1 + .25 * Math.cos(angle * 3);
          positions.setXYZ(i, x * fold, y * fold, positions.getZ(i) + .38 * Math.sin(angle * 3));
          const colorPosition = (Math.sin(angle) + 1) / 2 * (gradient.length - 1);
          const stop = Math.min(gradient.length - 2, Math.floor(colorPosition));
          shade.copy(gradient[stop]).lerp(gradient[stop + 1], colorPosition - stop);
          shade.toArray(colors, i * 3);
        }
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        const materials: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
        const layers = 16;
        Array.from({ length: layers }, (_, index) => {
          const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true, metalness: .12, roughness: .42, clearcoat: .22, clearcoatRoughness: .35, envMapIntensity: .35 });
          materials.push(material);
          const ribbon = new THREE.Mesh(geometry, material);
          ribbon.position.z = (index - (layers - 1) / 2) * .105;
          ribbon.rotation.z = (index - (layers - 1) / 2) * .025;
          ribbon.scale.setScalar(1 + .09 * Math.sin(index / (layers - 1) * Math.PI));
          sculpture.add(ribbon);
        });
        sculpture.rotation.set(.68, -.7, -.22);
        scene.add(sculpture, new THREE.AmbientLight(0xffffff, .15));
        const key = new THREE.DirectionalLight(0xfff3da, 1.2);
        key.position.set(3, 4, 5);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0x7adfff, .8);
        rim.position.set(-3, -1, 2);
        scene.add(rim);
        renderer.domElement.setAttribute("aria-hidden", "true");
        host.appendChild(renderer.domElement);

        let frame = 0, visible = true, previous = 0;
        let pointerX = 0, pointerY = 0, turn = 0;
        const hero = host.closest<HTMLElement>(".hero");
        const render = (time: number) => {
          frame = 0;
          if (!visible || document.hidden) return;
          const delta = previous ? Math.min((time - previous) / 1000, .05) : .016;
          previous = time;
          const blend = 1 - Math.exp(-5 * delta);
          const targetTurn = Number(hero ? getComputedStyle(hero).getPropertyValue("--hero-turn") : 0) || 0;
          turn += (targetTurn - turn) * blend;
          const idle = time * .00018;
          sculpture.rotation.x += (.68 + pointerY * .18 + Math.sin(idle) * .06 - sculpture.rotation.x) * blend;
          sculpture.rotation.y += (-.7 + turn * 1.5 + pointerX * .3 + Math.sin(idle * .7) * .12 - sculpture.rotation.y) * blend;
          sculpture.rotation.z = -.22 + Math.sin(idle) * .04;
          renderer.render(scene, camera);
          host.dataset.ready = "true";
          frame = requestAnimationFrame(render);
        };
        const start = () => { if (!frame && visible && !document.hidden) { previous = 0; frame = requestAnimationFrame(render); } };
        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          renderer.setSize(width, height, false);
          camera.aspect = width / Math.max(height, 1);
          camera.updateProjectionMatrix();
          start();
        };
        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const bounds = hero?.getBoundingClientRect();
          if (!bounds) return;
          pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
          pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
        };
        const leave = () => { pointerX = 0; pointerY = 0; };
        const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else start(); };
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; }
        }, { rootMargin: "60px" });
        observer.observe(host);
        const resizer = new ResizeObserver(resize);
        resizer.observe(host);
        hero?.addEventListener("pointermove", move, { passive: true });
        hero?.addEventListener("pointerleave", leave);
        document.addEventListener("visibilitychange", visibility);
        const lost = (event: Event) => { event.preventDefault(); delete host.dataset.ready; cancelAnimationFrame(frame); frame = 0; visible = false; };
        renderer.domElement.addEventListener("webglcontextlost", lost);
        resize();
        release = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          resizer.disconnect();
          hero?.removeEventListener("pointermove", move);
          hero?.removeEventListener("pointerleave", leave);
          document.removeEventListener("visibilitychange", visibility);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          geometry.dispose();
          materials.forEach((material) => material.dispose());
          lighting.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        // The server-rendered artwork stays visible if WebGL is unavailable.
        delete host.dataset.ready;
      }
    };
    void configure();
    const change = () => { void configure(); };
    preference.addEventListener("change", change);
    compact.addEventListener("change", change);
    return () => {
      disposed = true;
      generation++;
      release?.();
      preference.removeEventListener("change", change);
      compact.removeEventListener("change", change);
      delete host.dataset.ready;
    };
  }, []);

  return <span ref={ref} className="art hero-sculpture" aria-hidden="true"><Image src="/images/image-187.webp" alt="" fill sizes="(max-width: 700px) 153px, 28vw" className="object-contain sculpture-fallback" /></span>;
}
