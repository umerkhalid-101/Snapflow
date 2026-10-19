"use client";

import { useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { HexObject } from "@/components/ui/HexObject";
import { Logo, type LogoId } from "@/components/ui/Logo";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

const TOOL_IDS: LogoId[] = ["claude", "cursor", "codex", "antigravity"];

/* Bring any model or tool: light travels from the system to each tool. */
export function Models() {
  const { t } = useTheme();
  const m = t.models;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-net]", start: "top 75%", end: "top 30%", scrub: 1 } })
          .from("[data-node]", { scale: 0, opacity: 0, ease: "back.out(2)" }, 0)
          .fromTo("[data-wire]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", stagger: 0.08 }, 0.1)
          .from("[data-tool]", { y: 30, opacity: 0, stagger: 0.08, ease: "power3.out" }, 0.4);
      });
    },
    { scope: root },
  );

  const xs = [12.5, 37.5, 62.5, 87.5];

  return (
    <section ref={root} className="section relative" aria-label={m.chip}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Heading chip={m.chip} line1={m.title1} line2={m.title2} sub={m.sub} />

        <div data-net className="relative mt-8">
          {/* wires from the system node to each tool */}
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-x-0 top-12 hidden h-[96px] w-full sm:block" aria-hidden>
            {xs.map((x, i) => (
              <g key={i}>
                <path
                  data-wire
                  d={`M50 0 C 50 16, ${x} 14, ${x} 30`}
                  pathLength={1}
                  strokeDasharray="1"
                  fill="none"
                  stroke="var(--glow)"
                  strokeOpacity="0.55"
                  strokeWidth="0.25"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeWidth: 1.2 }}
                />
                <circle r="0.7" fill="var(--glow)">
                  <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" path={`M50 0 C 50 16, ${x} 14, ${x} 30`} />
                </circle>
              </g>
            ))}
          </svg>
          <div className="relative flex justify-center">
            <span data-node className="relative z-10 block size-24">
              <span aria-hidden className="absolute inset-[20%] rounded-full bg-glow/25 blur-2xl" />
              <HexObject className="relative size-full" spin={0.6} tilt={0.5} />
            </span>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {m.tools.map((tool, i) => (
              <li key={tool} data-tool data-tilt-card className="pane group flex aspect-[5/4] flex-col items-center justify-center gap-4 rounded-[22px] transition-colors hover:border-edge-2">
                <Logo id={TOOL_IDS[i]} size={46} className="text-fg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                <span className="text-[15px] font-medium text-fg">{tool}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[14px] text-fg-2" data-reveal>
            {m.note}
          </p>
        </div>
      </div>
    </section>
  );
}
