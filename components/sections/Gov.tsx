"use client";

import { ArrowRight, ArrowUpRight, AudioLines, Map, Monitor, Palette, Plus, Sparkles, Accessibility } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { GlassHex } from "@/components/ui/GlassHex";
import { Pill } from "@/components/ui/Pill";
import { Words } from "@/components/ui/Words";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { live, scrollToId } from "@/lib/site";

const ORBIT_ICONS = [Map, Palette, Monitor, Accessibility];

export function Gov() {
  const { t } = useTheme();
  const g = t.gov;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        /* Orbit turns with scroll; each card counter-rotates so it stays readable. */
        const st = { trigger: "[data-stage]", start: "top bottom", end: "bottom top", scrub: 1 };
        gsap.fromTo("[data-orbit]", { rotation: -40 }, { rotation: 140, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-orbit-card]", { rotation: 40 }, { rotation: -140, ease: "none", scrollTrigger: st });
        gsap.to("[data-ring]", { rotation: 360, duration: 24, ease: "none", repeat: -1 });
        gsap.from("[data-gov-hex]", {
          scale: 0.6,
          opacity: 0,
          ease: "expo.out",
          duration: 1.6,
          scrollTrigger: { trigger: "[data-stage]", start: "top 75%" },
        });
        gsap.from("[data-avatar]", {
          scale: 0,
          opacity: 0,
          ease: "back.out(2.5)",
          duration: 0.5,
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-stage]", start: "top 60%" },
        });
        gsap.from("[data-side]", {
          y: 40,
          opacity: 0,
          ease: "expo.out",
          duration: 1.2,
          stagger: 0.15,
          scrollTrigger: { trigger: "[data-stage]", start: "top 70%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section relative overflow-hidden" aria-label={g.chip}>
      <div aria-hidden className="spot pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <span className="chip" data-reveal>
          {g.chip}
        </span>
        <h2 className="display mt-6 text-[40px] sm:text-[60px] lg:text-[76px]" data-words>
          <Words text={g.title1} className="chrome-text block" />
          <Words text={g.title2} className="block text-fg-3" />
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-[1.65] text-fg-2 md:text-[17px]" data-reveal>
          {g.sub}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3" data-reveal>
          <Pill
            href="#join"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("join");
            }}
          >
            {g.cta} <ArrowRight size={15} />
          </Pill>
          <Pill variant="ghost" href={live(t.base, "pricing.html")}>
            {g.pricing} <ArrowUpRight size={15} />
          </Pill>
        </div>

        {/* stage */}
        <div data-stage className="relative mx-auto mt-10 grid max-w-[1200px] items-center gap-10 lg:mt-12 lg:grid-cols-[1fr_520px_1fr]">
          {/* left */}
          <div data-side className="order-2 flex flex-col items-start gap-6 text-left lg:order-1">
            <div className="pane max-w-[300px] rounded-2xl p-5">
              <AudioLines size={18} className="text-glow" />
              <p className="mt-3 text-[17px] font-light text-fg">{g.left.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-fg-2">{g.left.body}</p>
            </div>
            <p className="max-w-[260px] text-[13px] leading-[1.55] text-fg-3">{g.built}</p>
            <Team labels={["DS", "FE", "PM"]} />
          </div>

          {/* center */}
          <div className="relative order-1 mx-auto aspect-square w-full max-w-[520px] [container-type:inline-size] lg:order-2">
            <div aria-hidden className="absolute inset-[22%] rounded-full bg-glow/25 blur-[70px]" />
            <div data-gov-hex className="absolute inset-[16%]">
              <GlassHex className="size-full" spinGlow intensity={1.2} uid="gov" />
            </div>
            <div data-orbit className="absolute inset-0">
              {g.orbit.map((label, i) => {
                const Icon = ORBIT_ICONS[i];
                const a = (i / g.orbit.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <div
                    key={label}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `translate(-50%, -50%) translate(${Math.cos(a) * 46}cqw, ${Math.sin(a) * 46}cqw)` }}
                  >
                    <div data-orbit-card className="pane flex items-center gap-2 whitespace-nowrap rounded-xl bg-surface/80 px-3 py-2 backdrop-blur">
                      <Icon size={14} className="text-glow" />
                      <span className="text-[12.5px] text-fg">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* right */}
          <div data-side className="order-3 flex flex-col items-start gap-6 text-left lg:items-end lg:text-right">
            <RingBadge text={g.ring} />
            <div className="pane max-w-[300px] rounded-2xl p-5">
              <Team labels={["UX", "DE", "QA"]} />
              <p className="mt-4 text-[17px] font-light text-fg">{g.right.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-fg-2">{g.right.body}</p>
            </div>
            <p className="flex items-center gap-2 text-[13px] text-fg-2">
              <Sparkles size={14} className="text-glow" />
              <span>
                {g.less[0]} <span className="text-fg-3">{g.less[1]}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Team({ labels }: { labels: string[] }) {
  return (
    <div className="flex items-center -space-x-2">
      {labels.map((l, i) => (
        <span
          key={l}
          data-avatar
          className="grid size-9 place-items-center rounded-full border-2 border-page text-[11px] font-semibold text-page"
          style={{ background: ["#99adbd", "#c9d4df", "#c4b5fd"][i] }}
        >
          {l}
        </span>
      ))}
      <span data-avatar className="grid size-9 place-items-center rounded-full border-2 border-page bg-surface-3 text-fg-2">
        <Plus size={14} />
      </span>
    </div>
  );
}

function RingBadge({ text }: { text: string }) {
  return (
    <div className="relative size-[132px]">
      <svg data-ring viewBox="0 0 132 132" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <path id="gov-ring" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
        </defs>
        <text className="fill-fg-2" style={{ fontSize: 8.6, letterSpacing: "0.18em", fontFamily: "var(--font-geist-mono)" }}>
          <textPath href="#gov-ring" textLength="324" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[38%] grid place-items-center rounded-full bg-glow/15 text-glow">
        <Sparkles size={16} />
      </span>
    </div>
  );
}
