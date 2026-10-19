"use client";

import { Check, Search } from "lucide-react";
import { useBrandCode } from "./heroCode";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { GlassHex } from "@/components/ui/GlassHex";
import { Logo } from "@/components/ui/Logo";
import { Pill } from "@/components/ui/Pill";
import { Words } from "@/components/ui/Words";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Hero · Obsidian lab.                                               */
/*  Kit parts float in the dark over a lit floor around the obsidian   */
/*  hexagon. Scroll pulls every part into its core, and the finished   */
/*  sign-up screen rises out of it to face you. In a Snap.             */
/* ------------------------------------------------------------------ */

const P = 1300;
const C = P / 2;
type Piece = { id: string; x: number; y: number; w: number; h: number; z: number };

const PIECES: Piece[] = [
  { id: "code", x: 300, y: 470, w: 260, h: 160, z: 90 },
  { id: "tokens", x: 330, y: 880, w: 220, h: 118, z: 40 },
  { id: "spacing", x: 610, y: 210, w: 220, h: 70, z: 60 },
  { id: "dark", x: 900, y: 330, w: 200, h: 64, z: 80 },
  { id: "framework", x: 1010, y: 660, w: 210, h: 122, z: 40 },
  { id: "join", x: 820, y: 1000, w: 240, h: 60, z: 110 },
  { id: "search", x: 1130, y: 930, w: 240, h: 56, z: 60 },
  { id: "primary", x: 130, y: 680, w: 180, h: 50, z: 120 },
  { id: "stack", x: 520, y: 1110, w: 110, h: 110, z: 20 },
  { id: "avatars", x: 1110, y: 420, w: 200, h: 58, z: 40 },
  { id: "governed", x: 1180, y: 190, w: 170, h: 110, z: 60 },
  { id: "published", x: 250, y: 240, w: 230, h: 58, z: 100 },
  { id: "brand", x: 1130, y: 1170, w: 190, h: 64, z: 30 },
  { id: "gov", x: 220, y: 1100, w: 150, h: 48, z: 70 },
];

export function Hero() {
  const { t } = useTheme();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.from(".hero-w > span > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.035, delay: 0.15 });
        gsap.from("[data-hero-fade]", { opacity: 0, y: 16, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.6 });
        gsap.from("[data-beam]", { scaleX: 0, opacity: 0, duration: 1.8, ease: "expo.out", delay: 0.3 });
        gsap.from("[data-hex]", { scale: 0.4, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.4 });
        gsap.from("[data-piece]", {
          z: "+=480",
          opacity: 0,
          duration: 1.5,
          ease: "back.out(1.3)",
          stagger: { each: 0.05, from: "random" },
          delay: 0.5,
        });
        gsap.to("[data-core-pulse]", { scale: 1.12, opacity: 0.55, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

        const tilt = root.current?.querySelector<HTMLElement>("[data-tilt]");
        if (tilt) {
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.4, ease: "power3.out" });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.4, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            rx((e.clientY / window.innerHeight - 0.5) * -6);
            ry((e.clientX / window.innerWidth - 0.5) * 9);
          };
          window.addEventListener("pointermove", move);
          return () => window.removeEventListener("pointermove", move);
        }
      });

      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 1 },
        });
        tl.to("[data-hero-copy]", { y: -160, opacity: 0, ease: "power2.in", duration: 0.3 }, 0)
          .to("[data-hero-hint]", { opacity: 0, duration: 0.1 }, 0)
          .to("[data-field]", { y: "-20vh", duration: 1, ease: "none" }, 0)
          .to(
            "[data-piece]",
            {
              x: (i: number) => C - PIECES[i].x,
              y: (i: number) => C - PIECES[i].y,
              z: 40,
              scale: 0.12,
              opacity: 0,
              ease: "power3.in",
              duration: 0.5,
              stagger: { each: 0.02, from: "edges" },
            },
            0.06,
          )
          .to("[data-shadow]", { opacity: 0, duration: 0.3 }, 0.2)
          .to("[data-hex-glow]", { scale: 1.8, opacity: 1, duration: 0.25, ease: "power2.out" }, 0.48)
          .to("[data-hex]", { scale: 0.7, opacity: 0.25, duration: 0.3, ease: "power2.inOut" }, 0.62)
          .fromTo("[data-rise]", { y: 120, scale: 0.4, opacity: 0, rotationX: 70 }, { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 0.38, ease: "back.out(1.4)" }, 0.6)
          .fromTo("[data-code-ln]", { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: 0.012, duration: 0.08 }, 0.78)
          .fromTo("[data-anno-line]", { scaleX: 0 }, { scaleX: 1, stagger: 0.03, duration: 0.08 }, 0.84)
          .fromTo("[data-anno-tag]", { opacity: 0, x: -6 }, { opacity: 1, x: 0, stagger: 0.03, duration: 0.08 }, 0.86)
          .fromTo("[data-export]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.02, duration: 0.08 }, 0.92);
      });
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="grain relative isolate h-[calc(100svh-40px)] min-h-[740px] overflow-hidden bg-page">
      {/* lights */}
      <div aria-hidden className="spot pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-floor pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[63%] h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--glow)_16%,transparent),transparent)]" />
      <div aria-hidden data-beam className="beam absolute inset-x-0 top-[58%] origin-center" />

      <div data-hero-copy className="relative z-20 mx-auto flex max-w-[1280px] flex-col items-center px-5 pt-[clamp(44px,7vh,88px)] text-center">
        <div data-hero-fade className="flex items-center gap-3 text-[13px] font-medium text-fg-2">
          <span className="flex -space-x-1.5">
            {(["react", "vue", "angular"] as const).map((id) => (
              <span key={id} className="grid size-7 place-items-center rounded-full border border-edge-2 bg-surface text-fg">
                <Logo id={id} size={14} />
              </span>
            ))}
          </span>
          {t.hero.eyebrow}
        </div>
        <h1 className="display mt-7 text-[38px] sm:text-[54px] lg:text-[clamp(56px,4.9vw,76px)]">
          <Words text={t.hero.line1} className="hero-w chrome-text block" />
          <Words text={t.hero.line2} className="hero-w block text-fg-3" />
        </h1>
        <p data-hero-fade className="mt-6 max-w-[620px] text-[16px] leading-[1.65] text-fg-2 md:text-[17px]">
          {t.hero.sub}
        </p>
        <div data-hero-fade className="mt-8 flex items-center gap-3">
          <Pill
            size="lg"
            href="#join"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("join");
            }}
          >
            {t.hero.cta}
          </Pill>
        </div>
        <p data-hero-fade className="mt-4 text-[12.5px] text-fg-3">
          {t.hero.micro}
        </p>
      </div>

      {/* the lab floor */}
      <div data-field className="pointer-events-none absolute inset-x-0 bottom-[-26%] top-[50%] z-10" style={{ perspective: 2400 }}>
        <div data-tilt className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: P,
              height: P,
              marginLeft: -C,
              marginTop: -C,
              transformStyle: "preserve-3d",
              transform: "rotateX(58deg) rotateZ(-42deg) scale(var(--field-scale, 1))",
            }}
          >
            <div aria-hidden className="floor-grid absolute inset-0 [mask-image:radial-gradient(closest-side,black_30%,transparent)]" />
            {/* the obsidian hexagon, lying on the floor */}
            <div className="absolute" style={{ left: C - 260, top: C - 260, width: 520, height: 520, transform: "translateZ(2px)" }}>
              <div data-hex-glow className="absolute inset-[18%] rounded-full bg-glow opacity-30 blur-[60px]" />
              <div data-core-pulse className="absolute inset-[30%] rounded-full bg-glow/40 blur-[40px]" />
              <div data-hex className="absolute inset-0">
                <GlassHex className="size-full" intensity={1.1} uid="hero" />
              </div>
            </div>
            {PIECES.map((p) => (
              <div
                key={`s-${p.id}`}
                data-shadow
                className="absolute rounded-[32px] bg-[rgb(var(--shade-rgb)/var(--shadow-a))] blur-[18px]"
                style={{ left: p.x - p.w / 2 + 10, top: p.y - p.h / 2 + 10, width: p.w * 0.9, height: p.h * 0.85 }}
              />
            ))}
            {PIECES.map((p, i) => (
              <div
                key={p.id}
                data-piece
                className="absolute"
                style={{ left: p.x - p.w / 2, top: p.y - p.h / 2, width: p.w, height: p.h, transform: `translateZ(${p.z}px)`, transformStyle: "preserve-3d" }}
              >
                <div className="size-full" style={{ animation: `bob 6s ${(i % 5) * 0.7}s ease-in-out infinite` } as CSSProperties}>
                  <Part id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* the finished screen rises out of the core: the page and its code, with spec redlines to the tokens */}
        <div className="absolute left-1/2 top-[8%] z-20 -translate-x-1/2" style={{ perspective: 1400 }}>
          <div data-rise className="w-[min(92vw,820px)] opacity-0">
            <Composed />
          </div>
        </div>
      </div>

      {/* soft hand-off into the next section: no hard edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[22%] bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--page)_60%,transparent)_60%,var(--page))]" />
      <p data-hero-hint className="absolute inset-x-0 bottom-6 z-20 hidden text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fg-3 lg:block">
        {t.hero.scroll} ↓
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating kit parts: dark glass with lit edges.                      */
/* ------------------------------------------------------------------ */

function Glass({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`iso-glass size-full text-fg ${className}`}>{children}</div>;
}

function Part({ id }: { id: string }) {
  const { t } = useTheme();
  const iso = t.hero.iso;
  switch (id) {
    case "code":
      return (
        <Glass className="p-4 font-mono text-[12px] leading-[1.75]">
          <div className="mb-2 flex gap-1.5">
            <span className="size-2 rounded-full bg-tint/15" />
            <span className="size-2 rounded-full bg-tint/15" />
            <span className="size-2 rounded-full bg-tint/15" />
          </div>
          <p className="text-glow-2">&lt;Button</p>
          <p className="pl-3">
            variant=<span className="text-glow">&quot;primary&quot;</span>
          </p>
          <p className="pl-3">
            size=<span className="text-glow">&quot;lg&quot;</span>
            <span className="text-glow-2">&gt;</span>
          </p>
          <p className="pl-1.5 text-fg-2">Create account</p>
        </Glass>
      );
    case "tokens":
      return (
        <Glass className="flex flex-col justify-center gap-2 px-4">
          {iso.tokens.map((l) => (
            <span key={l} className="flex items-center gap-2 text-[12.5px]">
              <span className="grid size-4 place-items-center rounded-[5px] bg-glow text-page">
                <Check size={10} strokeWidth={3} />
              </span>
              {l}
            </span>
          ))}
        </Glass>
      );
    case "spacing":
      return (
        <Glass className="flex items-center gap-3 px-4">
          <span className="text-[11px] text-fg-2">{iso.spacing}</span>
          <span className="relative h-1.5 flex-1 rounded-full bg-tint/10">
            <span className="absolute inset-y-0 left-0 w-3/5 rounded-full bg-glow" />
            <span className="absolute left-3/5 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-glow bg-page" />
          </span>
          <span className="font-mono text-[11px]">16 px</span>
        </Glass>
      );
    case "dark":
      return (
        <Glass className="flex items-center gap-3 px-4">
          <span className="flex h-6 w-11 items-center rounded-full bg-glow p-0.5">
            <span className="ml-auto size-5 rounded-full bg-page" />
          </span>
          <span className="text-[13px] font-medium">{iso.dark}</span>
        </Glass>
      );
    case "framework":
      return (
        <Glass className="flex flex-col gap-1.5 p-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">{iso.framework}</span>
          {(["react", "vue", "angular"] as const).map((id, k) => (
            <span key={id} className={`flex items-center gap-2 rounded-md px-2 py-1 text-[12px] capitalize ${k === 0 ? "bg-tint/10 text-fg" : "text-fg-2"}`}>
              <Logo id={id} size={13} />
              {id}
            </span>
          ))}
        </Glass>
      );
    case "join":
      return (
        <Glass className="flex items-center gap-2 !rounded-full px-2">
          <span className="rounded-full border border-tint/15 px-2 py-0.5 font-mono text-[10.5px] text-fg-2">v2.4</span>
          <span className="flex h-9 flex-1 items-center justify-center rounded-full bg-fg text-[13px] font-medium text-page">Publish</span>
        </Glass>
      );
    case "search":
      return (
        <Glass className="flex items-center gap-2 px-4 text-[13px] text-fg-2">
          <Search size={14} />
          {iso.search}
          <span className="ml-auto rounded bg-tint/10 px-1.5 font-mono text-[10px]">⌘K</span>
        </Glass>
      );
    case "primary":
      return (
        <Glass className="flex items-center justify-center gap-2 !rounded-full text-[12px] font-medium">
          <span className="size-2 rounded-full bg-glow shadow-[0_0_10px_var(--glow)]" />
          {iso.primary}
        </Glass>
      );
    case "stack":
      return (
        <div className="relative size-full" style={{ transformStyle: "preserve-3d" }}>
          {["bg-[#3d5266]", "bg-[#7d93a6]", "bg-[#c9d4df]"].map((c, k) => (
            <div key={c} className={`absolute inset-0 rounded-[12px] ${c} ring-1 ring-tint/20`} style={{ transform: `translateZ(${k * 12}px)` }} />
          ))}
        </div>
      );
    case "avatars":
      return (
        <Glass className="flex items-center gap-2 px-3">
          <span className="flex -space-x-2">
            {["bg-[#3d5266]", "bg-[#99adbd]", "bg-[#c9d4df]"].map((c) => (
              <span key={c} className={`size-7 rounded-full border-2 border-[#121a24] ${c}`} />
            ))}
          </span>
          <span className="text-[12px] text-fg-2">{iso.editing}</span>
        </Glass>
      );
    case "governed":
      return (
        <Glass className="flex flex-col justify-center px-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">{iso.tokensLabel}</span>
          <span className="chrome-text text-[40px] font-extralight leading-none tracking-[-0.04em]">218</span>
          <span className="mt-1 text-[11px] text-fg-2">{iso.governed}</span>
        </Glass>
      );
    case "published":
      return (
        <Glass className="flex items-center gap-2 px-4 text-[12px]">
          <span className="grid size-5 place-items-center rounded-full bg-glow text-page">
            <Check size={11} strokeWidth={3} />
          </span>
          {iso.published}
        </Glass>
      );
    case "brand":
      return (
        <Glass className="flex items-center gap-2 px-3">
          <span className="size-8 rounded-lg bg-glow shadow-[0_0_16px_color-mix(in_oklab,var(--glow)_50%,transparent)]" />
          <span className="flex flex-col">
            <span className="text-[10px] text-fg-3">{iso.brand}</span>
            <span className="font-mono text-[11px]">primary</span>
          </span>
        </Glass>
      );
    case "gov":
      return (
        <div className="flex size-full items-center justify-center rounded-full border border-glow/40 bg-glow/10 text-[12px] font-medium text-glow">
          {iso.gov}
        </div>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  The composed result: a real screen, its code, and the tokens       */
/*  every element resolves to. Redlines draw in as the snap lands.     */
/* ------------------------------------------------------------------ */
function Anno({ label, className, side = "right" }: { label: string; className: string; side?: "left" | "right" }) {
  return (
    <span className={`pointer-events-none absolute flex items-center ${side === "left" ? "flex-row-reverse" : ""} ${className}`}>
      <span className="size-1.5 shrink-0 rounded-full border border-ink-2 bg-field" />
      <span data-anno-line className={`h-px w-6 bg-ink-2/60 ${side === "left" ? "origin-right" : "origin-left"}`} />
      <span data-anno-tag className="whitespace-nowrap rounded-[4px] bg-field px-1.5 py-0.5 font-mono text-[10px] text-ink-2 ring-1 ring-line">
        {label}
      </span>
    </span>
  );
}

function Composed() {
  const { t } = useTheme();
  const lines = useBrandCode();
  return (
    <div className="overflow-hidden rounded-[20px] border border-edge-2 bg-surface shadow-[0_0_0_1px_rgb(var(--tint-rgb)/0.04),0_50px_140px_-30px_color-mix(in_oklab,var(--glow)_45%,transparent)]">
      <div className="flex items-center gap-2 border-b border-edge px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-tint/15" />
          <span className="size-2.5 rounded-full bg-tint/15" />
          <span className="size-2.5 rounded-full bg-tint/15" />
        </span>
        <span className="mx-auto rounded-md bg-tint/[0.06] px-3 py-0.5 font-mono text-[11px] text-fg-2">acme.app/signup</span>
      </div>
      <div className="mock grid md:grid-cols-[1.05fr_1fr]">
        {/* the page */}
        <div className="relative bg-card p-7 text-ink md:pr-[44%]">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-[12px] font-semibold text-card">A</span>
            <span className="text-[13px] font-medium">Acme</span>
          </div>
          <div className="relative mt-6">
            <p className="text-[24px] font-light leading-tight tracking-[-0.02em]">{t.hero.iso.create}</p>
            <Anno label="type.heading.lg" className="-right-3 top-2 translate-x-full max-md:hidden" />
          </div>
          <p className="mt-1 text-[12.5px] text-muted">{t.hero.iso.createSub}</p>
          <div className="relative mt-5">
            <span className="block h-10 rounded-[10px] border border-line bg-field px-3 text-[13px] leading-10 text-faint">you@company.com</span>
            <Anno label="radius.md" className="-right-3 top-3 translate-x-full max-md:hidden" />
          </div>
          <span className="mt-2.5 block h-10 rounded-[10px] border border-line bg-field" />
          <div className="relative mt-4">
            <span className="flex h-11 items-center justify-center rounded-[10px] bg-ink text-[14px] font-medium text-card">{t.hero.iso.createBtn}</span>
            <Anno label="color.action.primary" className="-right-3 top-3.5 translate-x-full max-md:hidden" />
          </div>
          <div className="relative mt-4 flex items-center gap-3 text-[11px] text-faint">
            <span className="h-px flex-1 bg-line" />
            space.4
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
        {/* its code */}
        <div className="hidden border-l border-line bg-panel p-5 font-mono text-[11.5px] leading-[1.75] md:block">
          <p className="mb-3 flex items-center gap-2 text-[11px] text-muted">
            <Logo id="react" size={13} /> SignUp.tsx
            <span className="ml-auto flex items-center gap-1 text-ink-2">
              <Check size={12} strokeWidth={3} /> lint · types
            </span>
          </p>
          {lines.map((l, i) => (
            <p key={i} data-code-ln className="whitespace-pre text-code-fg">
              <span className="mr-3 inline-block w-4 text-right text-code-dim">{i + 1}</span>
              {l.map((tok, k) => (
                <span key={k} className={tok.c}>
                  {tok.v}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-edge px-5 py-3 text-[12px] text-fg-2">
        <span data-export className="text-fg-3">
          {t.hero.exported}
        </span>
        {(["react", "vue", "angular", "figma"] as const).map((id) => (
          <span key={id} data-export className="flex items-center gap-1.5 capitalize text-fg">
            <Logo id={id} size={14} />
            {id}
          </span>
        ))}
        <span data-export className="ml-auto flex items-center gap-1.5 text-fg-3">
          <span className="size-1.5 rounded-full bg-glow" /> {t.hero.parts}
        </span>
      </div>
    </div>
  );
}
