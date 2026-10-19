"use client";

import { useEffect, useRef } from "react";

/**
 * Snapflow's glass hand (their own model, public/models/hand.glb), snapping its fingers.
 * The model is a WebXR-style hand: every joint is a direct child of the armature,
 * so a finger curl rotates each joint and everything after it around that joint's pivot.
 */
export function GlassHand({ className = "", label }: { className?: string; label?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const el = host.current;
      if (cancelled || !el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50);
      const glowColor = () => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--glow").trim() || "#99adbd");

      const glass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.08,
        transmission: 1,
        thickness: 0.06,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        attenuationColor: glowColor(),
        attenuationDistance: 0.25,
        envMapIntensity: 1.6,
        iridescence: 0.25,
        iridescenceIOR: 1.3,
      });

      /* White mode: black glass on white. Dark mode: white glass on black. */
      const obsidian = new THREE.MeshPhysicalMaterial({
        color: 0x0a0d12,
        metalness: 0.25,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.3,
        iridescence: 0.15,
      });
      const isLight = () => document.documentElement.getAttribute("data-mode") === "light";
      const meshes: InstanceType<typeof THREE.Mesh>[] = [];
      const applyMode = () => meshes.forEach((m) => (m.material = isLight() ? obsidian : glass));

      const gltf = await new GLTFLoader().loadAsync("/models/hand.glb");
      if (cancelled) {
        renderer.dispose();
        return;
      }
      const root = gltf.scene;
      root.traverse((o) => {
        const m = o as InstanceType<typeof THREE.SkinnedMesh>;
        if (m.isSkinnedMesh || (o as InstanceType<typeof THREE.Mesh>).isMesh) {
          meshes.push(m);
          m.frustumCulled = false;
        }
      });

      applyMode();

      /* Frame the hand. */
      const pivot = new THREE.Group();
      const base = new THREE.Group();
      base.rotation.z = Math.PI; // the model's fingers point down; stand it up
      base.add(root);
      pivot.add(base);
      scene.add(pivot);
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      root.position.sub(center);
      const radius = size.length() * 0.5;
      camera.position.set(0, 0, radius * 2.9);
      camera.near = radius / 50;
      camera.far = radius * 20;
      camera.updateProjectionMatrix();
      const YAW = Math.PI / 2 - 0.55; // palm turned three-quarters toward you
      pivot.rotation.set(0.15, YAW, 0);

      /* Lights: a cool key and the glow as rim. */
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(-1, 2, 2);
      const rim = new THREE.DirectionalLight(glowColor(), 3);
      rim.position.set(2, -1, -2);
      scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.3));

      /* A light pulse at the moment of the snap. */
      const flashMat = new THREE.MeshBasicMaterial({ color: glowColor(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
      const flash = new THREE.Mesh(new THREE.RingGeometry(radius * 0.08, radius * 0.1, 64), flashMat);
      scene.add(flash);

      /* Finger chains, rest pose. */
      type Joint = { bone: InstanceType<typeof THREE.Object3D>; p: InstanceType<typeof THREE.Vector3>; q: InstanceType<typeof THREE.Quaternion> };
      const byName = (n: string) => root.getObjectByName(n);
      const chain = (finger: string, thumb = false): Joint[] =>
        (thumb ? ["metacarpal", "phalanx-proximal", "phalanx-distal", "tip"] : ["phalanx-proximal", "phalanx-intermediate", "phalanx-distal", "tip"])
          .map((part) => byName(`${finger}-${part}`))
          .filter((b): b is InstanceType<typeof THREE.Object3D> => !!b)
          .map((bone) => ({ bone, p: bone.position.clone(), q: bone.quaternion.clone() }));
      const fingers = {
        thumb: chain("thumb", true),
        index: chain("index-finger"),
        middle: chain("middle-finger"),
        ring: chain("ring-finger"),
        pinky: chain("pinky-finger"),
      };

      const axis = new THREE.Vector3();
      const tmpQ = new THREE.Quaternion();
      const tmpV = new THREE.Vector3();
      /** Curl a chain: each joint bends by `angle` around its own local X, carrying the rest of the finger with it. */
      const curl = (joints: Joint[], angle: number, axisLocal = new THREE.Vector3(1, 0, 0)) => {
        const ps = joints.map((j) => j.p.clone());
        const qs = joints.map((j) => j.q.clone());
        for (let i = 0; i < joints.length - 1; i++) {
          axis.copy(axisLocal).applyQuaternion(qs[i]).normalize();
          tmpQ.setFromAxisAngle(axis, angle);
          for (let k = i; k < joints.length; k++) {
            if (k > i) {
              tmpV.copy(ps[k]).sub(ps[i]).applyQuaternion(tmpQ);
              ps[k].copy(ps[i]).add(tmpV);
            }
            qs[k].premultiply(tmpQ);
          }
        }
        joints.forEach((j, i) => {
          j.bone.position.copy(ps[i]);
          j.bone.quaternion.copy(qs[i]);
        });
      };

      /* The snap, as a loop: relax, press thumb to middle finger, flick, hold, release. */
      const LOOP = 3.2;
      const ease = (x: number) => 1 - Math.pow(1 - x, 3);
      const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
      const pose = (t: number) => {
        const press = ease(seg(t, 0.4, 1.2)) * (1 - ease(seg(t, 1.32, 1.4)));
        const flick = ease(seg(t, 1.32, 1.42)) * (1 - ease(seg(t, 2.4, 3.1)));
        /* index and middle rest together; ring and pinky tucked; thumb meets middle; middle flicks into the palm */
        curl(fingers.ring, 0.85 + 0.15 * flick);
        curl(fingers.pinky, 0.95 + 0.15 * flick);
        curl(fingers.index, 0.45 + 0.1 * press);
        curl(fingers.middle, 0.45 + 0.2 * press + 0.75 * flick);
        curl(fingers.thumb, 0.25 + 0.3 * press - 0.3 * flick, new THREE.Vector3(0.4, 1, 0).normalize());
        /* the pulse */
        const f = seg(t, 1.36, 2.0);
        flash.scale.setScalar(1 + f * 9);
        flashMat.opacity = f > 0 && f < 1 ? (1 - f) * 0.9 : 0;
        return flick;
      };

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

      const target = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
        target.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
      };
      if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

      const mo = new MutationObserver(() => {
        const c = glowColor();
        rim.color.copy(c);
        flashMat.color.copy(c);
        glass.attenuationColor.copy(c);
        applyMode();
        if (!running) renderer.render(scene, camera);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "data-mode"] });

      let running = false;
      let raf = 0;
      let clock = 0;
      let last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clock = (clock + dt) % LOOP;
        const flick = pose(clock);
        pivot.rotation.y += (YAW + target.x + Math.sin(now / 2400) * 0.12 - pivot.rotation.y) * 0.05;
        pivot.rotation.x += (0.15 + target.y - pivot.rotation.x) * 0.05;
        pivot.position.y = Math.sin(now / 1600) * radius * 0.03 - flick * radius * 0.02;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      if (reduce) {
        pose(1.5);
        renderer.render(scene, camera);
      } else {
        pose(0);
        renderer.render(scene, camera);
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          if (reduce) return;
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

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        mo.disconnect();
        window.removeEventListener("pointermove", onMove);
        glass.dispose();
        obsidian.dispose();
        flashMat.dispose();
        flash.geometry.dispose();
        root.traverse((o) => (o as InstanceType<typeof THREE.Mesh>).geometry?.dispose());
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
  }, []);

  return (
    <div
      ref={host}
      className={`[mask-image:linear-gradient(to_bottom,black_62%,transparent_92%)] ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
