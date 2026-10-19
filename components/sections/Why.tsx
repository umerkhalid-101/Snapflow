"use client";

import { ArrowLeftRight, Check, MousePointer2 } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";
import { gsap } from "@/lib/gsap";
import { useLoop } from "@/lib/useLoop";

/* Your design and your code, mirrored. Each card acts out its sentence. */
export function Why() {
  const { t } = useTheme();
  return (
    <section className="section relative" aria-label={t.why.chip}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Heading chip={t.why.chip} line1={t.why.title1} line2={t.why.title2} sub={t.why.sub} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card title={t.why.cards[0].title} body={t.why.cards[0].body}>
            <MirrorDemo />
          </Card>
          <Card title={t.why.cards[1].title} body={t.why.cards[1].body}>
            <FigmaDemo />
          </Card>
          <Card title={t.why.cards[2].title} body={t.why.cards[2].body}>
            <EditorDemo />
          </Card>
        </div>
      </div>
    </section>
  );
}

export function Card({ title, body, children, className = "" }: { title: string; body: string; children: ReactNode; className?: string }) {
  return (
    <article data-reveal className={`group flex flex-col ${className}`}>
      <div data-tilt-card className="pane relative aspect-[4/3] overflow-hidden rounded-[22px] transition-[border-color] duration-500 group-hover:-translate-y-1 group-hover:border-edge-2">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,color-mix(in_oklab,var(--glow)_10%,transparent),transparent)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mock absolute inset-0">{children}</div>
      </div>
      <h3 className="mt-5 text-[21px] font-light tracking-[-0.02em] text-fg">{title}</h3>
      <p className="mt-2 max-w-[340px] text-[14.5px] leading-[1.6] text-fg-2">{body}</p>
    </article>
  );
}

/* 1. One token change lands in Figma and in code at the same instant. */
function MirrorDemo() {
  const { t } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    const states = [
      { r: 999, c: "#3d5266", label: "radius.full · teal" },
      { r: 4, c: "#334155", label: "radius.sm · slate" },
      { r: 10, c: "#475569", label: "radius.md · slate" },
    ];
    states.forEach((s) => {
      tl.to(q("[data-sync]"), { rotation: "+=180", duration: 0.5, ease: "power2.inOut" })
        .to(q("[data-btn]"), { borderRadius: s.r, backgroundColor: s.c, duration: 0.55, ease: "back.out(1.6)" }, "<0.1")
        .call(() => q("[data-val]").forEach((el) => (el.textContent = s.label)), [], "<")
        .fromTo(q("[data-val]"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, "<")
        .to({}, { duration: 1.1 });
    });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
      <div className="flex items-center gap-3">
        {[t.why.figma, t.why.code].map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            {i === 1 && (
              <span data-sync className="grid size-8 place-items-center rounded-full bg-card text-body shadow-sm ring-1 ring-line">
                <ArrowLeftRight size={14} />
              </span>
            )}
            <div className="w-[118px] rounded-xl bg-card p-3 shadow-md">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
                {i === 0 ? <Logo id="figma" size={11} /> : <Logo id="react" size={11} />}
                {label}
              </p>
              <span data-btn className="mt-3 flex h-7 items-center justify-center rounded-[10px] bg-[#475569] text-[10px] font-medium text-white">
                Button
              </span>
            </div>
          </div>
        ))}
      </div>
      <span data-val className="rounded-full bg-card px-3 py-1 font-mono text-[10.5px] text-body shadow-sm ring-1 ring-line">
        radius.md · slate
      </span>
    </div>
  );
}

/* 2. The plugin connects to your Figma file. */
function FigmaDemo() {
  const { t } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.set(q("[data-status]"), { opacity: 0 })
      .set(q("[data-bar]"), { scaleX: 0 })
      .fromTo(q("[data-cursor]"), { x: 70, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "power3.out" })
      .to(q("[data-connect]"), { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 })
      .to(q("[data-bar]"), { scaleX: 1, duration: 0.9, ease: "power2.inOut" })
      .to(q("[data-status]"), { opacity: 1, duration: 0.3 })
      .fromTo(q("[data-dot]"), { scale: 0.6 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, "<")
      .to(q("[data-cursor]"), { opacity: 0, duration: 0.3 }, "+=1.4");
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center p-6">
      <div className="relative w-[230px] rounded-xl bg-card p-4 shadow-md">
        <div className="flex items-center gap-2">
          <Logo id="figma" size={18} />
          <span className="text-[13px] font-medium text-ink">Snapflow</span>
          <span className="ml-auto rounded-md bg-[#3d5266] px-1.5 py-0.5 text-[9.5px] font-bold text-white">MCP</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-panel-2">
          <span data-bar className="block h-full origin-left rounded-full bg-teal" />
        </div>
        <p className="mt-3 flex items-center gap-2 text-[11.5px] text-body">
          <span data-dot className="size-2 rounded-full bg-ok" />
          <span data-status>{t.why.connected}</span>
        </p>
        <span data-connect className="mt-3 flex h-7 items-center justify-center rounded-lg bg-panel text-[11px] font-medium text-ink-2">
          Sync
        </span>
        <MousePointer2 data-cursor size={20} className="absolute bottom-1 right-8 fill-ink text-white drop-shadow" />
      </div>
    </div>
  );
}

/* 3. No Figma: kit pieces drop into the web editor canvas. */
function EditorDemo() {
  const ref = useRef<HTMLDivElement>(null);
  useLoop(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.set(q("[data-block]"), { opacity: 0, y: -26, scale: 0.9 })
      .to(q("[data-block]"), { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(2)", stagger: 0.35 })
      .to(q("[data-ok]"), { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)" })
      .to({}, { duration: 1.4 })
      .to(q("[data-block]"), { opacity: 0, duration: 0.3 })
      .set(q("[data-ok]"), { opacity: 0, scale: 0.6 });
    return tl;
  });
  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center p-6">
      <div className="flex w-[250px] overflow-hidden rounded-xl bg-card shadow-md">
        <div className="flex w-14 flex-col gap-1.5 border-r border-line p-2">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="h-1.5 rounded-full bg-panel-2" style={{ width: `${80 - k * 12}%` }} />
          ))}
        </div>
        <div className="relative flex flex-1 flex-col gap-2 bg-panel/60 p-3">
          <span data-block className="block h-2.5 w-2/3 rounded-full bg-ink/70" />
          <span data-block className="block h-6 rounded-md border border-line bg-field" />
          <span data-block className="flex h-6 items-center justify-center rounded-md bg-ink text-[9px] text-card">
            Create account
          </span>
          <span data-ok className="absolute right-2 top-2 grid size-5 scale-[0.6] place-items-center rounded-full bg-ok text-white opacity-0">
            <Check size={11} strokeWidth={3} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Bento card: the visual fills the top, title and copy sit inside the card. */
export function Bento({
  title,
  body,
  children,
  className = "",
  visual = "min-h-[230px]",
}: {
  title: string;
  body: string;
  children: ReactNode;
  className?: string;
  visual?: string;
}) {
  return (
    <article data-reveal data-tilt-card className={`pane group flex flex-col overflow-hidden rounded-[24px] transition-[border-color] duration-500 hover:border-edge-2 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklab,var(--glow)_10%,transparent),transparent)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      <div className={`mock relative flex-1 ${visual}`}>{children}</div>
      <div className="relative px-6 pb-6">
        <h3 className="text-[20px] font-light tracking-[-0.02em] text-fg">{title}</h3>
        <p className="mt-1.5 max-w-[420px] text-[14px] leading-[1.6] text-fg-2">{body}</p>
      </div>
    </article>
  );
}
