"use client";

import { useEffect, useRef } from "react";

type Variant = "obsidian" | "chrome";

/**
 * The Snapflow mark as a real 3D object (three.js): a thick, bevelled
 * black-glass hexagon with a lit inner ring, or a polished chrome one.
 * Lazy-loads three.js, renders only while on screen, tilts toward the
 * cursor, follows the --glow token and the white-mode toggle.
 */
export function HexObject({
  variant = "obsidian",
  className = "",
  spin = 0.35,
  tilt = 0.35,
  label,
}: {
  variant?: Variant;
  className?: string;
  /** radians per second around Y */
  spin?: number;
  /** how far it leans toward the cursor */
  tilt?: number;
  label?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const el = host.current;
      if (cancelled || !el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = variant === "chrome" ? 1.1 : 1;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0, 9.5);

      /* Rounded pointy-top hexagon, matching the 2D mark. */
      const hexShape = (r: number, corner: number) => {
        const s = new THREE.Shape();
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = ((-90 + 60 * i) * Math.PI) / 180;
          return new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r);
        });
        const k = Math.min(corner, r / 2) / r;
        pts.forEach((p, i) => {
          const prev = pts[(i + 5) % 6];
          const next = pts[(i + 1) % 6];
          const a = p.clone().lerp(prev, k);
          const b = p.clone().lerp(next, k);
          if (i === 0) s.moveTo(a.x, a.y);
          else s.lineTo(a.x, a.y);
          s.quadraticCurveTo(p.x, p.y, b.x, b.y);
        });
        s.closePath();
        return s;
      };

      const bodyGeo = new THREE.ExtrudeGeometry(hexShape(1.55, 0.3), {
        depth: 0.46,
        bevelEnabled: true,
        bevelThickness: 0.14,
        bevelSize: 0.12,
        bevelSegments: 8,
        curveSegments: 20,
      });
      bodyGeo.center();

      const ringShape = hexShape(0.72, 0.14);
      ringShape.holes.push(hexShape(0.5, 0.1));
      const ringGeo = new THREE.ExtrudeGeometry(ringShape, {
        depth: 0.04,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
        curveSegments: 16,
      });
      ringGeo.center();

      const bodyMat =
        variant === "chrome"
          ? new THREE.MeshPhysicalMaterial({ color: 0xe6ebf2, metalness: 1, roughness: 0.12, envMapIntensity: 1.4 })
          : new THREE.MeshPhysicalMaterial({
              color: 0x0a0e14,
              metalness: 0.35,
              roughness: 0.16,
              clearcoat: 1,
              clearcoatRoughness: 0.06,
              envMapIntensity: 1.35,
            });
      const glowColor = () => {
        const v = getComputedStyle(document.documentElement).getPropertyValue("--glow").trim() || "#99adbd";
        return new THREE.Color(v);
      };
      const ringMat =
        variant === "chrome"
          ? new THREE.MeshPhysicalMaterial({ color: 0x1a2028, metalness: 0.6, roughness: 0.3 })
          : new THREE.MeshStandardMaterial({ color: glowColor(), emissive: glowColor(), emissiveIntensity: 1.6, roughness: 0.3 });

      const group = new THREE.Group();
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      const front = new THREE.Mesh(ringGeo, ringMat);
      const back = new THREE.Mesh(ringGeo, ringMat);
      const half = 0.23 + 0.14;
      front.position.z = half + 0.01;
      back.position.z = -half - 0.01;
      back.rotation.y = Math.PI;
      group.add(body, front, back);
      group.rotation.set(-0.18, 0.6, 0);
      scene.add(group);

      const key = new THREE.DirectionalLight(0xffffff, variant === "chrome" ? 1.4 : 2.2);
      key.position.set(-3, 4, 5);
      const rim = new THREE.DirectionalLight(glowColor(), 2.4);
      rim.position.set(4, -2, -3);
      scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

      /* Size to the host box. */
      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      /* Lean toward the cursor. */
      const target = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * tilt;
        target.y = (e.clientY / window.innerHeight - 0.5) * tilt;
      };
      if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

      /* Follow the glow token and the white-mode toggle. */
      const mo = new MutationObserver(() => {
        const c = glowColor();
        rim.color.copy(c);
        if (variant !== "chrome") {
          (ringMat as InstanceType<typeof THREE.MeshStandardMaterial>).color.copy(c);
          (ringMat as InstanceType<typeof THREE.MeshStandardMaterial>).emissive.copy(c);
        }
        if (!running) renderer.render(scene, camera);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-mode"] });

      /* Render only while visible. */
      let running = false;
      let raf = 0;
      let last = performance.now();
      let spinY = 0.6;
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        spinY += spin * dt;
        group.rotation.y = spinY + target.x;
        group.rotation.x += (-0.18 + target.y - group.rotation.x) * 0.06;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(
        ([entry]) => {
          if (reduce) {
            renderer.render(scene, camera);
            return;
          }
          if (entry.isIntersecting && !running) {
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(frame);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { rootMargin: "120px" },
      );
      io.observe(el);
      renderer.render(scene, camera);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        mo.disconnect();
        window.removeEventListener("pointermove", onMove);
        bodyGeo.dispose();
        ringGeo.dispose();
        bodyMat.dispose();
        ringMat.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [variant, spin, tilt]);

  return <div ref={host} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
