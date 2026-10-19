"use client";

import { CircleCheck, Quote, Search } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { useLoop } from "@/lib/useLoop";
import { ONBOARD } from "@/lib/site";
import { Bento } from "./Why";

export function Surfaces() {
  const { t } = useTheme();
  const c = t.surfaces.cards;
  return (
    <section className="section relative" aria-label={t.surfaces.chip}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Heading chip={t.surfaces.chip} line1={t.surfaces.title1} line2={t.surfaces.title2} sub={t.surfaces.sub} />
        <div className="mt-10 grid gap-4 md:grid-cols-6 lg:grid-cols-12">
          <Bento title={c[0].title} body={c[0].body} className="md:col-span-6 lg:col-span-7" visual="min-h-[280px]">
            <Ide />
          </Bento>
          <Bento title={c[1].title} body={c[1].body} className="md:col-span-6 lg:col-span-5" visual="min-h-[280px]">
            <Cli />
          </Bento>
          <Bento title={c[2].title} body={c[2].body} className="md:col-span-2 lg:col-span-4">
            <Web />
          </Bento>
          <Bento title={c[3].title} body={c[3].body} className="md:col-span-2 lg:col-span-4">
            <Plugin />
          </Bento>
          <Bento title={c[4].title} body={c[4].body} className="md:col-span-2 lg:col-span-4">
            <Playground />
          </Bento>
          <QuoteTile />
        </div>
      </div>
    </section>
  );
}

/* Agent in your IDE: the prompt types, then the checks resolve. */
function Ide() {
  const { t } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const text = t.surfaces.prompt;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    const obj = { n: 0 };
    tl.set(q("[data-chk]"), { opacity: 0, x: -6 })
      .set(obj, { n: 0 })
      .to(obj, {
        n: text.length,
        duration: text.length * 0.045,
        ease: "none",
        onUpdate: () => q("[data-typed]").forEach((el) => (el.textContent = text.slice(0, Math.round(obj.n)))),
      })
      .to(q("[data-chk]"), { opacity: 1, x: 0, duration: 0.35, stagger: 0.5, ease: "back.out(2)" }, "+=0.3")
      .to({}, { duration: 1.6 });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center p-6">
      <div className="w-full max-w-[250px] rounded-xl bg-card p-3.5 shadow-md">
        <p className="mb-2 flex items-center gap-1.5 border-b border-line pb-2">
          {(["claudecode", "cursor", "codex"] as const).map((id) => (
            <Logo key={id} id={id} size={14} className="text-ink" />
          ))}
        </p>
        <p className="min-h-[18px] font-mono text-[11.5px] text-ink-2">
          › <span data-typed />
          <span className="caret ml-0.5 !w-[1px] text-ink-2" />
        </p>
        {[t.surfaces.resolved, t.surfaces.generated].map((s) => (
          <p key={s} data-chk className="mt-2 flex items-center gap-1.5 text-[11.5px] text-body">
            <CircleCheck size={13} className="text-ok" /> {s}
          </p>
        ))}
      </div>
    </div>
  );
}

/* CLI: one command, connected. */
function Cli() {
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    const obj = { n: 0 };
    tl.set(q("[data-ok]"), { opacity: 0 })
      .set(obj, { n: 0 })
      .to(obj, {
        n: ONBOARD.length,
        duration: 1.3,
        ease: "none",
        onUpdate: () => q("[data-cmd]").forEach((el) => (el.textContent = ONBOARD.slice(0, Math.round(obj.n)))),
      })
      .to(q("[data-ok]"), { opacity: 1, duration: 0.2 }, "+=0.4")
      .to({}, { duration: 1.6 });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center p-6">
      <div className="w-full max-w-[250px] rounded-xl bg-card p-4 font-mono text-[11.5px] leading-[1.8] text-ink shadow-md ring-1 ring-line">
        <p>
          $ <span data-cmd />
        </p>
        <p data-ok className="text-muted">
          ✓ Snapflow connected
        </p>
      </div>
    </div>
  );
}

/* Web editor: select a block, its properties appear. */
function Web() {
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.fromTo(q("[data-sel]"), { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.3 })
      .fromTo(q("[data-prop]"), { opacity: 0, x: 8 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.3 })
      .to(q("[data-btn]"), { backgroundColor: "#3d5266", duration: 0.4 }, "+=0.6")
      .to({}, { duration: 1.2 })
      .to(q("[data-btn]"), { backgroundColor: "#475569", duration: 0.4 })
      .to([...q("[data-sel]"), ...q("[data-prop]")], { opacity: 0, duration: 0.3 });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center p-6">
      <div className="flex w-full max-w-[260px] gap-2 rounded-xl bg-card p-2.5 shadow-md">
        <div className="flex flex-1 flex-col gap-2 rounded-lg bg-panel p-3">
          <span className="h-2 w-2/3 rounded-full bg-ink/60" />
          <span className="h-5 rounded-md border border-line bg-field" />
          <span className="relative">
            <span data-btn className="block h-6 rounded-md bg-ink" />
            <span data-sel className="absolute -inset-1 rounded-lg border-2 border-sky" />
          </span>
        </div>
        <div className="flex w-[70px] flex-col gap-1.5 py-1">
          {["variant", "size", "label"].map((p) => (
            <span key={p} data-prop className="rounded bg-panel px-1.5 py-1 font-mono text-[8.5px] text-muted">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Figma plugin: MCP connection pulses. */
function Plugin() {
  const { t } = useTheme();
  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="w-full max-w-[230px] rounded-xl bg-card p-4 shadow-md">
        <div className="flex items-center gap-2">
          <Logo id="figma" size={18} />
          <span className="text-[13px] font-medium text-ink">Snapflow</span>
          <span className="ml-auto rounded-md bg-[#3d5266] px-1.5 py-0.5 text-[9.5px] font-bold text-white">MCP</span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[11.5px] text-body">
          <span className="relative flex size-2">
            <span className="absolute inset-0 rounded-full bg-ok" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
            <span className="relative size-2 rounded-full bg-ok" />
          </span>
          {t.surfaces.connected}
        </p>
      </div>
    </div>
  );
}

/* Playground: the catalog cycles through components. */
function Playground() {
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1 });
    const rows = q("[data-row]");
    const previews = q("[data-pv]");
    rows.forEach((_, i) => {
      tl.to(rows, { backgroundColor: (k: number) => (k === i ? "var(--card)" : "transparent"), duration: 0.25 })
        .to(previews, { opacity: (k: number) => (k === i ? 1 : 0), scale: (k: number) => (k === i ? 1 : 0.9), duration: 0.35, ease: "back.out(2)" }, "<")
        .to({}, { duration: 1.1 });
    });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center p-6">
      <div className="flex w-full max-w-[250px] gap-3 rounded-xl bg-panel-2 p-2.5 shadow-md">
        <ul className="flex w-[80px] flex-col gap-1 text-[11px]">
          {["Button", "Badge", "Input"].map((c) => (
            <li key={c} data-row className="rounded-md px-2 py-1.5 text-ink-2">
              {c}
            </li>
          ))}
        </ul>
        <div className="relative flex-1 rounded-lg bg-card">
          <span data-pv className="absolute inset-0 m-auto flex h-7 w-20 items-center justify-center rounded-md bg-ink text-[10px] text-card">
            Save
          </span>
          <span data-pv className="absolute inset-0 m-auto flex h-5 w-12 items-center justify-center rounded-full bg-[#e3e9ef] text-[10px] text-[#3d5266] opacity-0">
            New
          </span>
          <span data-pv className="absolute inset-0 m-auto flex h-7 w-24 items-center gap-1 rounded-md border border-line px-2 text-[9px] text-faint opacity-0">
            <Search size={9} /> you@team.co
          </span>
        </div>
      </div>
    </div>
  );
}

/* The quote, revealed word by word as you scroll past it. */
function QuoteTile() {
  const { t } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ".qw",
          { opacity: 0.2 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 55%", scrub: true } },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} data-reveal className="pane relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[24px] p-8 text-fg md:col-span-6 md:flex-row md:items-end lg:col-span-12 lg:p-10">
      <Quote size={26} className="text-fg-3" />
      <p className="max-w-[900px] text-[34px] font-extralight leading-[1.1] tracking-[-0.025em] text-fg lg:text-[52px]">
        “
        {t.surfaces.quote.split(" ").map((w, i) => (
          <span key={i} className="qw">
            {w}{" "}
          </span>
        ))}
        ”
      </p>
    </div>
  );
}
