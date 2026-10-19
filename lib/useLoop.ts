"use client";

import type { RefObject } from "react";
import { MQ, ScrollTrigger, gsap, useGSAP } from "./gsap";

/**
 * A looping micro-story that only plays while its card is on screen.
 * Reduced motion: the timeline jumps to its end state and stays there.
 */
export function useLoop(scope: RefObject<HTMLElement | null>, build: (q: (sel: string) => Element[]) => gsap.core.Timeline) {
  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const tl = build(q);
      if (window.matchMedia(MQ.reduce).matches) {
        tl.progress(1).pause();
        return;
      }
      tl.pause();
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "bottom 10%",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
      return () => st.kill();
    },
    { scope },
  );
}
