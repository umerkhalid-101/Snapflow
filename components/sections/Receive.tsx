"use client";

import { useRef, useState } from "react";
import { DEFAULT_ACCENT, useTheme } from "@/components/theme/ThemeProvider";
import { Words } from "@/components/ui/Words";
import { MQ, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { contrast } from "@/lib/color";

/* ------------------------------------------------------------------ */
/*  You don't build it. You receive it.                                */
/*  Three objects, rebuilt in CSS: the glass case opens, the keypad    */
/*  brands the page (press a key), the screen lights up with code.     */
/* ------------------------------------------------------------------ */

const KEY_COLORS = ["#99adbd", "#c9d4df", "#c4b5fd", "#fda4af", "#1e3a5f"];
const STAGE = "#05070b";

export function Receive() {
  const { t } = useTheme();
  const r = t.receive;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        /* Case: lid lifts, parts rise. */
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-case]", start: "top 75%", end: "top 25%", scrub: 1 } })
          .to("[data-lid]", { rotationX: -105, ease: "power2.inOut" }, 0)
          .from("[data-chip-in]", { y: 30, opacity: 0, stagger: 0.05, ease: "back.out(2)" }, 0.3);
        /* Screen: lines type in, then UI lights up. */
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-screen]", start: "top 75%", end: "top 30%", scrub: 1 } })
          .from("[data-code-line]", { scaleX: 0, stagger: 0.08, transformOrigin: "left" }, 0)
          .from("[data-ui]", { opacity: 0, y: 20 }, 0.6)
          .to("[data-screen-glow]", { opacity: 1 }, 0.6);
        /* The sentence: "blue" gets struck and becomes a token. */
        const line = gsap.timeline({ paused: true });
        line
          .to("[data-blue-strike]", { scaleX: 1, duration: 0.4, ease: "power2.inOut" })
          .to("[data-blue]", { opacity: 0.35, duration: 0.3 }, "<")
          .fromTo("[data-token]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.inOut" })
          .fromTo("[data-token-ul]", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" }, "-=0.2");
        ScrollTrigger.create({ trigger: "[data-line]", start: "top 70%", onEnter: () => line.play() });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section relative overflow-hidden" aria-label={r.chip}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="chip" data-reveal>
              {r.chip}
            </span>
            <h2 className="h2 mt-6" data-words>
              <Words text={r.title1} className="block text-fg-3" />
              <Words text={r.title2} className="chrome-text block" />
            </h2>
          </div>
          <p className="max-w-[460px] text-[16px] leading-[1.65] text-fg-2 lg:justify-self-end" data-reveal>
            {r.sub}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Stage title={r.cards[0].title} body={r.cards[0].body}>
            <GlassCase />
          </Stage>
          <Stage title={r.cards[1].title} body={r.cards[1].body}>
            <Keypad />
          </Stage>
          <Stage title={r.cards[2].title} body={r.cards[2].body}>
            <Screen />
          </Stage>
        </div>

        <p data-line className="mx-auto mt-10 max-w-[980px] py-20 lg:py-28 text-center text-[30px] font-extralight leading-[1.2] tracking-[-0.025em] text-fg sm:text-[44px] lg:text-[54px]">
          {r.line[0]}
          <span className="relative inline-block">
            <span data-blue className="rounded-[0.2em] bg-[#2563eb] px-[0.25em] text-white">
              {r.line[1]}
            </span>
            <span data-blue-strike className="absolute left-0 top-1/2 h-[3px] w-full origin-left scale-x-0 bg-[#fda4af]" />
          </span>
          {r.line[2]}
          <span className="relative inline-block">
            <span data-token className="chrome-text inline-block">
              {r.line[3]}
            </span>
            <span data-token-ul className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-glow shadow-[0_0_14px_var(--glow)]" />
          </span>
          {r.line[4]}
        </p>
      </div>
    </section>
  );
}

function Stage({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <article data-reveal data-speed={0} className="flex flex-col">
      <div data-tilt-card className="island relative grid aspect-[4/3.4] border border-edge shadow-[var(--stage-shadow)] place-items-center overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,color-mix(in_oklab,var(--glow)_12%,transparent),transparent),linear-gradient(180deg,#0e141c,#080b10)]">
        <div aria-hidden className="absolute inset-x-[15%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-tint/25 to-transparent" />
        {children}
      </div>
      <h3 className="mt-5 text-[22px] font-light tracking-[-0.02em] text-fg">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-fg-2">{body}</p>
    </article>
  );
}

/* An acrylic case with a hinged lid, full of kit parts. */
function GlassCase() {
  return (
    <div data-case className="relative h-[150px] w-[230px]" style={{ perspective: 900 }}>
      <div className="absolute inset-0" style={{ transform: "rotateX(52deg)", transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-[14px] border border-tint/25 bg-tint/[0.06] shadow-[inset_0_0_30px_rgb(255_255_255/0.06)]">
          <div className="grid size-full grid-cols-4 gap-2 p-3">
            {["#99adbd", "#e2e8f0", "#c9d4df", "#3d5266", "#e2e8f0", "#c4b5fd", "#e2e8f0", "#99adbd"].map((c, i) => (
              <span key={i} data-chip-in className="rounded-md shadow-[0_6px_10px_rgb(var(--shade-rgb)/0.5)]" style={{ background: c, transform: "translateZ(10px)" }} />
            ))}
          </div>
        </div>
        <div
          data-lid
          className="absolute inset-0 origin-top rounded-[14px] border border-tint/30 bg-[linear-gradient(160deg,rgb(255_255_255/0.22),rgb(255_255_255/0.04))] backdrop-blur-[2px]"
          style={{ transform: "translateZ(28px)" }}
        >
          <span className="absolute left-1/2 top-2 size-3 -translate-x-1/2 rounded-full bg-[#0b1017] ring-1 ring-tint/40" />
        </div>
      </div>
    </div>
  );
}

/* A keypad that brands the page. The yellow key fails contrast and gets rejected. */
function Keypad() {
  const { t, accent, setAccent } = useTheme();
  const [pressed, setPressed] = useState<number | null>(null);
  const [rejected, setRejected] = useState(false);

  const press = (i: number) => {
    setPressed(i);
    setTimeout(() => setPressed(null), 180);
    const c = KEY_COLORS[i];
    if (contrast(c, STAGE) < 3) {
      setRejected(true);
      setTimeout(() => setRejected(false), 1600);
      return;
    }
    setAccent(accent === c ? DEFAULT_ACCENT : c);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-[18px] bg-[linear-gradient(180deg,#1b2430,#0d1218)] p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_20px_40px_rgb(var(--shade-rgb)/0.6)]">
        <div className="grid grid-cols-5 gap-2">
          {t.receive.keys.map((k, i) => (
            <button
              key={k}
              type="button"
              onClick={() => press(i)}
              aria-label={`${k}`}
              className="group flex h-14 w-[46px] flex-col items-center justify-end rounded-[10px] pb-1.5 text-[8.5px] font-medium text-[#0b1017] transition-transform duration-100"
              style={{
                background: `linear-gradient(180deg, #f4f6f9, #c9d1dc)`,
                boxShadow: pressed === i ? "0 1px 0 #8a96a6, inset 0 2px 4px rgb(0 0 0/0.2)" : "0 5px 0 #8a96a6, 0 8px 14px rgb(0 0 0/0.5)",
                transform: pressed === i ? "translateY(4px)" : undefined,
              }}
            >
              <span className="mb-auto mt-1.5 size-3 rounded-full ring-1 ring-black/10" style={{ background: KEY_COLORS[i] }} />
              {k}
            </button>
          ))}
        </div>
      </div>
      <p className="h-5 font-mono text-[11px] text-fg-3">
        {rejected ? <span className="text-[#fda4af]">✕ {t.receive.rejected} · {contrast(KEY_COLORS[4], STAGE).toFixed(1)}:1</span> : `↑ ${t.receive.tryIt}`}
      </p>
    </div>
  );
}

/* A glowing monitor: code types, then the screen appears. */
function Screen() {
  return (
    <div data-screen className="relative" style={{ perspective: 800 }}>
      <div data-screen-glow className="absolute -inset-10 rounded-full bg-glow/25 opacity-0 blur-3xl" />
      <div className="relative flex h-[150px] w-[240px] gap-2 rounded-[12px] border border-tint/15 bg-[#06090d] p-3 shadow-[0_0_0_6px_#151c26,0_30px_50px_rgb(var(--shade-rgb)/0.7)]" style={{ transform: "rotateY(-14deg) rotateX(6deg)" }}>
        <div className="flex w-1/2 flex-col gap-1.5 pt-1">
          {[70, 50, 85, 40, 65, 55].map((w, i) => (
            <span key={i} data-code-line className="h-1.5 rounded-full" style={{ width: `${w}%`, background: i % 3 === 0 ? "#c9d4df" : i % 3 === 1 ? "#99adbd" : "#475569" }} />
          ))}
        </div>
        <div data-ui className="flex flex-1 flex-col gap-1.5 rounded-md bg-white p-2">
          <span className="h-1.5 w-2/3 rounded-full bg-[#0b1017]" />
          <span className="h-3.5 rounded border border-[#e2e8f0]" />
          <span className="h-3.5 rounded border border-[#e2e8f0]" />
          <span className="mt-auto h-4 rounded bg-accent" />
        </div>
      </div>
    </div>
  );
}
