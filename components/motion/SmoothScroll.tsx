"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { MQ, ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Lenis smooth scroll driven by the GSAP ticker, so every ScrollTrigger
 * scene stays in sync. Also runs the page-wide reveals:
 *   [data-reveal]  fades and lifts in
 *   [data-words]   splits into words that rise in one after another
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia(MQ.reduce).matches;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reduce) return;
      /* Reveals: rise out of a soft blur with a slight 3D tip. */
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals, { opacity: 0, y: 46, rotationX: -14, scale: 0.97, filter: "blur(10px)", transformPerspective: 900, transformOrigin: "50% 100%" });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.09,
            overwrite: true,
            clearProps: "filter",
          }),
      });

      /* Headings: words rise with a tilt and come into focus. */
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        const words = el.querySelectorAll<HTMLElement>(".w > span");
        gsap.set(words, { yPercent: 115, rotation: 6, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(words, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.045 }),
        });
      });

      /* Dark bands expand from an inset card to full bleed. */
      gsap.utils.toArray<HTMLElement>("[data-expand]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 5% 0% 5% round 36px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 25%", scrub: true } },
        );
      });

      /* Parallax depth. */
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = Number(el.dataset.speed) || 0;
        gsap.fromTo(el, { y: speed * 60 }, { y: speed * -60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });

    /* Cursor light: feed the pointer position to whichever glass panel is under it. */
    const onMove = (e: PointerEvent) => {
      const pane = (e.target as HTMLElement | null)?.closest?.(".pane") as HTMLElement | null;
      if (!pane) return;
      const r = pane.getBoundingClientRect();
      pane.style.setProperty("--mx", `${e.clientX - r.left}px`);
      pane.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* Glass panels tilt toward the cursor. */
    const tilts: (() => void)[] = [];
    if (!reduce && window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) {
      document.querySelectorAll<HTMLElement>("[data-tilt-card]").forEach((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 1000 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          rx(((e.clientY - r.top) / r.height - 0.5) * -8);
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        tilts.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    /* Magnetic primary buttons. */
    const magnets: (() => void)[] = [];
    if (!reduce && window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        magnets.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    /* Scramble: mono labels decode into place when they appear. */
    if (!reduce) {
      const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/<>";
      document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
        const final = el.textContent ?? "";
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            const obj = { p: 0 };
            gsap.to(obj, {
              p: 1,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                const n = Math.floor(obj.p * final.length);
                el.textContent =
                  final.slice(0, n) +
                  final
                    .slice(n)
                    .split("")
                    .map((c) => (c === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)]))
                    .join("");
              },
              onComplete: () => {
                el.textContent = final;
              },
            });
          },
        });
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
      magnets.forEach((off) => off());
      tilts.forEach((off) => off());
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return null;
}
