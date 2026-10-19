"use client";

import { ArrowLeftRight, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { Logo, type LogoId } from "@/components/ui/Logo";

/* ------------------------------------------------------------------ */
/*  What it does: one screen, five verbs. Every point stays readable;  */
/*  the stage walks through them and the same sign-up screen is       */
/*  generated, branded, written into your repo, exported and mirrored */
/*  in Figma. Hover a point to jump the stage to it.                   */
/* ------------------------------------------------------------------ */

const STEP_MS = 6000;
const TICK_MS = 700;

const BRANDS = [
  { name: "Slate", color: "#0b1017", font: "var(--font-geist-sans)", weight: 300, radius: 10 },
  { name: "Coral", color: "#e2553b", font: "Georgia, serif", weight: 400, radius: 999 },
  { name: "Violet", color: "#6d4aff", font: "var(--font-geist-sans)", weight: 600, radius: 4 },
];

const CODE: Record<"react" | "vue" | "angular", { file: string; lines: string[] }> = {
  react: {
    file: "SignUp.tsx",
    lines: ['import { Card, Input, Button } from "@acme/ui";', "", '<Card title="Create your account">', '  <Input type="email" />', '  <Button variant="primary">', "    Create account", "  </Button>", "</Card>"],
  },
  vue: {
    file: "SignUp.vue",
    lines: ["<template>", '  <Card title="Create your account">', '    <Input type="email" />', '    <Button variant="primary">', "      Create account", "    </Button>", "  </Card>", "</template>"],
  },
  angular: {
    file: "sign-up.component.html",
    lines: ['<sf-card title="Create your account">', '  <sf-input type="email" />', '  <sf-button variant="primary">', "    Create account", "  </sf-button>", "</sf-card>"],
  },
};

export function Does() {
  const { t } = useTheme();
  const c = t.does.cards;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % c.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, paused, cycle, c.length]);

  const pick = (i: number) => {
    setActive(i);
    setCycle((n) => n + 1);
  };

  return (
    <section className="section relative pt-0" aria-label={t.does.chip}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Heading chip={t.does.chip} line1={t.does.title1} line2={t.does.title2} sub={t.does.sub} />
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <ol
            data-reveal
            className="order-2 grid gap-1 sm:grid-cols-2 lg:order-1 lg:grid-cols-1"
            role="tablist"
            aria-label={t.does.chip}
            onMouseLeave={() => setPaused(false)}
          >
            {c.map((card, i) => {
              const on = i === active;
              return (
                <li key={card.title}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => pick(i)}
                    onMouseEnter={() => {
                      setPaused(true);
                      if (!on) pick(i);
                    }}
                    onFocus={() => pick(i)}
                    className={`relative w-full rounded-2xl py-3.5 pl-6 pr-4 text-left transition-colors duration-300 ${on ? "bg-tint/[0.045]" : "hover:bg-tint/[0.025]"}`}
                  >
                    <span aria-hidden className="absolute inset-y-3 left-0 w-[2px] overflow-hidden rounded-full bg-edge">
                      {on && (
                        <span
                          key={`${active}-${cycle}`}
                          className="block h-full w-full origin-top bg-glow"
                          style={{ animation: `does-progress-y ${STEP_MS}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                        />
                      )}
                    </span>
                    <span className={`block text-[18px] font-light tracking-[-0.015em] transition-colors duration-300 ${on ? "text-fg" : "text-fg-2"}`}>{card.title}</span>
                    <span className={`mt-1 block max-w-[420px] text-[13.5px] leading-[1.55] transition-colors duration-300 ${on ? "text-fg-2" : "text-fg-3"}`}>
                      {card.body}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div data-reveal className="order-1 lg:order-2">
            <Stage active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Stage({ active }: { active: number }) {
  const { t } = useTheme();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTick(99);
      return;
    }
    const id = setInterval(() => setTick((n) => n + 1), TICK_MS);
    return () => clearInterval(id);
  }, [active]);

  const brandStep = Math.min(2, Math.floor(tick / 2));
  const brand = active === 1 ? BRANDS[brandStep] : BRANDS[0];
  const fw = (["react", "vue", "angular"] as const)[Math.floor(tick / 3) % 3];
  const prompt = t.surfaces.prompt;
  const typed = active === 0 ? prompt.slice(0, Math.min(prompt.length, tick * 6)) : prompt;
  const show = (k: number) => active !== 0 || tick > 3 + k;
  const figmaRadius = active === 4 && Math.floor(tick / 3) % 2 === 1 ? 999 : brand.radius;
  const path = active === 4 ? "figma.com / Acme / SignUp" : active >= 2 ? `~/acme-app / ${active === 3 ? CODE[fw].file : "login.tsx"}` : "app.snapflow.design / SignUp";

  return (
    <div className="pane overflow-hidden rounded-[24px] shadow-[var(--stage-shadow)]">
      <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-tint/15" />
          <span className="size-2.5 rounded-full bg-tint/15" />
          <span className="size-2.5 rounded-full bg-tint/15" />
        </span>
        <span className="mx-auto flex items-center gap-2 rounded-md bg-tint/[0.06] px-3 py-0.5 font-mono text-[11px] text-fg-2">
          {active === 4 && <Logo id="figma" size={11} />}
          {path}
        </span>
      </div>

      <div className="mock relative h-[440px] overflow-hidden bg-surface-2/60 sm:h-[480px]">
        <div aria-hidden className="floor-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />

        {/* prompt (generate) */}
        <div
          className="absolute left-1/2 top-5 z-20 flex w-[min(86%,420px)] items-center gap-2 rounded-full bg-card px-4 py-2.5 font-mono text-[12px] text-ink shadow-lg ring-1 ring-line transition-all duration-500"
          style={{ opacity: active === 0 ? 1 : 0, transform: `translate(-50%, ${active === 0 ? 0 : -16}px)` }}
        >
          <Sparkles size={13} className="shrink-0 text-muted" />
          <span className="truncate">
            {typed}
            {active === 0 && typed.length < prompt.length && <span className="caret ml-0.5 !w-[1px]" />}
          </span>
        </div>

        {/* the screen */}
        <div
          className="absolute top-1/2 transition-all duration-700 ease-[var(--ease-out)]"
          style={{
            left: active === 0 ? "50%" : active === 1 ? "38%" : active === 4 ? "29%" : "27%",
            transform: `translate(-50%, ${active === 0 ? "-44%" : "-50%"}) scale(${active >= 2 ? 0.84 : 1})`,
          }}
        >
          <Screen brand={brand} show={show} label={active === 4 ? t.why.code : null} radius={active === 4 ? figmaRadius : brand.radius} />
        </div>

        {/* brand panel */}
        <Panel open={active === 1} className="right-5 top-1/2 w-[190px] -translate-y-1/2">
          <p className="text-[11px] font-medium text-muted">{t.does.cards[1].title}</p>
          <div className="mt-3 flex gap-2">
            {BRANDS.map((b) => (
              <span
                key={b.name}
                className={`size-7 rounded-full transition-all duration-300 ${brand.name === b.name ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-[var(--card)]" : ""}`}
                style={{ background: b.color }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-baseline justify-between text-ink">
            <span className="text-[26px] leading-none transition-all duration-300" style={{ fontFamily: brand.font, fontWeight: brand.weight }}>
              Aa
            </span>
            <span className="font-mono text-[10px] text-muted">radius {brand.radius === 999 ? "full" : `${brand.radius}px`}</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-panel-2">
            <span className="block h-full rounded-full bg-ink-2 transition-all duration-500" style={{ width: `${((brandStep + 1) / 3) * 100}%` }} />
          </div>
        </Panel>

        {/* code panel (codebase, export) */}
        <Panel open={active === 2 || active === 3} className="right-4 top-1/2 w-[min(54%,330px)] -translate-y-1/2 !p-0">
          <div className="flex items-center gap-1 border-b border-line px-3 py-2">
            {active === 3 ? (
              (["react", "vue", "angular"] as const).map((f) => (
                <span key={f} className={`flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10.5px] capitalize transition-colors ${f === fw ? "bg-panel text-ink" : "text-muted"}`}>
                  <Logo id={f as LogoId} size={12} className={f === "angular" ? "text-ink" : ""} />
                  {f}
                </span>
              ))
            ) : (
              <span className="flex items-center gap-1.5 px-1 font-mono text-[10.5px] text-body">
                <Logo id="react" size={12} /> login.tsx
              </span>
            )}
          </div>
          <pre className="px-3 py-3 font-mono text-[10.5px] leading-[1.75]">
            {(active === 3 ? CODE[fw] : CODE.react).lines.map((l, i) => (
              <div key={`${active}-${fw}-${i}`} className="whitespace-pre transition-opacity duration-300" style={{ opacity: active === 3 || tick > i ? 1 : 0 }}>
                <span className="mr-2 inline-block w-3 text-right text-code-dim">{i + 1}</span>
                <Colored line={l} />
              </div>
            ))}
          </pre>
          {active === 2 && (
            <div className="flex gap-3 border-t border-line px-3 py-2 font-mono text-[10.5px] text-body">
              {["lint", "types"].map((k, i) => (
                <span key={k} className="flex items-center gap-1 transition-opacity duration-300" style={{ opacity: tick > 8 + i ? 1 : 0.25 }}>
                  <Check size={11} strokeWidth={3} className="text-ink" /> {k} passed
                </span>
              ))}
            </div>
          )}
        </Panel>

        {/* Figma twin */}
        <div
          className="pointer-events-none absolute right-[5%] top-1/2 transition-all duration-700 ease-[var(--ease-out)]"
          style={{ opacity: active === 4 ? 1 : 0, transform: `translate(${active === 4 ? 0 : 40}px, -50%) scale(0.84)` }}
        >
          <Screen brand={brand} show={() => true} label="Figma" figma radius={figmaRadius} />
        </div>
        <div
          className="absolute left-1/2 top-1/2 z-10 grid size-10 place-items-center rounded-full bg-card text-ink shadow-md ring-1 ring-line transition-all duration-500"
          style={{ opacity: active === 4 ? 1 : 0, transform: `translate(-50%, -50%) rotate(${Math.floor(tick / 3) * 180}deg)` }}
        >
          <ArrowLeftRight size={15} />
        </div>
      </div>
    </div>
  );
}

function Panel({ open, className = "", children }: { open: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute z-10 rounded-2xl bg-card p-4 text-ink shadow-xl ring-1 ring-line transition-all duration-500 ease-[var(--ease-out)] ${className}`}
      style={{ opacity: open ? 1 : 0, translate: open ? "0 0" : "40px 0", pointerEvents: open ? "auto" : "none" }}
    >
      {children}
    </div>
  );
}

function Screen({
  brand,
  show,
  label,
  figma = false,
  radius,
}: {
  brand: (typeof BRANDS)[number];
  show: (k: number) => boolean;
  label: string | null;
  figma?: boolean;
  radius: number;
}) {
  const { t } = useTheme();
  const piece = (k: number) => ({
    opacity: show(k) ? 1 : 0,
    transform: show(k) ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
    transition: "all 500ms var(--ease-snap)",
  });
  return (
    <div className={`relative w-[270px] rounded-2xl bg-card p-6 text-ink shadow-[0_24px_60px_-20px_rgb(15_23_42/0.3)] ${figma ? "ring-2 ring-[#a259ff]/50" : "ring-1 ring-line"}`}>
      {label && (
        <span className="absolute -top-7 left-0 flex items-center gap-1.5 text-[11px] font-medium text-body">
          <Logo id={figma ? "figma" : "react"} size={12} />
          {label}
        </span>
      )}
      <div style={piece(0)} className="flex items-center gap-2">
        <span className="grid size-6 place-items-center text-[11px] font-bold text-white transition-all duration-500" style={{ background: brand.color, borderRadius: Math.min(radius, 8) }}>
          A
        </span>
        <span className="text-[12px] font-medium">Acme</span>
      </div>
      <p className="mt-4 text-[20px] leading-tight tracking-[-0.02em]" style={{ ...piece(1), fontFamily: brand.font, fontWeight: brand.weight }}>
        {t.hero.iso.create}
      </p>
      <p style={piece(1)} className="mt-1 text-[11.5px] text-muted">
        {t.hero.iso.createSub}
      </p>
      <span style={{ ...piece(2), borderRadius: Math.min(radius, 14) }} className="mt-4 block h-9 border border-line bg-field px-3 text-[11.5px] leading-9 text-faint">
        you@company.com
      </span>
      <span style={{ ...piece(3), background: brand.color, borderRadius: radius }} className="mt-3 flex h-10 items-center justify-center text-[12.5px] font-medium text-white">
        {t.hero.iso.createBtn}
      </span>
    </div>
  );
}

/** Minimal code coloring for the stage. */
function Colored({ line }: { line: string }) {
  const parts = line.split(/("[^"]*"|<\/?[\w-]+|\/?>|\bimport\b|\bfrom\b)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          className={
            p.startsWith('"') ? "text-code-str" : p.startsWith("<") || p.endsWith(">") ? "text-code-tag" : p === "import" || p === "from" ? "text-code-kw" : "text-code-fg"
          }
        >
          {p}
        </span>
      ))}
    </>
  );
}
