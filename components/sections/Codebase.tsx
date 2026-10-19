"use client";

import { CircleCheck, FileText, Folder, FolderCode, LayoutGrid } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { MQ, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

export function Codebase() {
  const { t } = useTheme();
  const c = t.codebase;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* The two halves plug together. */
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-brings]", start: "top 80%", end: "top 40%", scrub: 1 } })
          .from("[data-bring='0']", { x: -80, opacity: 0 }, 0)
          .from("[data-bring='1']", { x: 80, opacity: 0 }, 0)
          .from("[data-plug]", { scaleX: 0 }, 0.4)
          .from("[data-plug-dot]", { scale: 0 }, 0.8);
      });

      /* Desktop: pinned horizontal walk through the five steps. */
      mm.add(MQ.desktop, () => {
        const track = root.current?.querySelector<HTMLElement>("[data-track]");
        const viewport = root.current?.querySelector<HTMLElement>("[data-viewport]");
        if (!track || !viewport) return;
        const distance = () => track.scrollWidth - viewport.clientWidth;
        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            start: "center center",
            end: () => `+=${distance() + 400}`,
            pin: root.current?.querySelector("[data-pin]"),
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: viewport, start: "center center", end: () => `+=${distance() + 400}`, scrub: 1 },
        });
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          const tl = stepTimeline(step);
          ScrollTrigger.create({
            trigger: step,
            containerAnimation: scrollTween,
            start: "left 70%",
            onEnter: () => tl.play(),
          });
          gsap.set(step, { opacity: 0.35 });
          gsap.to(step, {
            opacity: 1,
            scrollTrigger: { trigger: step, containerAnimation: scrollTween, start: "left 80%", end: "left 50%", scrub: true },
          });
        });
      });

      /* Below desktop: each step plays when it scrolls into view. */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          const tl = stepTimeline(step);
          ScrollTrigger.create({ trigger: step, start: "top 75%", onEnter: () => tl.play() });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-expand aria-label={c.chip} className="island relative overflow-hidden border-y border-edge bg-[linear-gradient(180deg,#0b1017_0%,#070a0f_100%)] text-fg">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8 lg:pt-28">
        <Heading chip={c.chip} line1={c.title1} line2={c.title2} sub={c.sub} />

        <div data-brings className="relative mt-10 grid gap-4 md:grid-cols-2 md:gap-10">
          {c.brings.map((b, i) => (
            <div key={b.label} data-bring={i} className="relative flex gap-4 pane rounded-2xl p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint/10">
                {i === 0 ? <LayoutGrid size={18} /> : <FolderCode size={18} />}
              </span>
              <div>
                <p className="text-[13px] font-medium text-fg-3">{b.label}</p>
                <p className="mt-1.5 text-[14.5px] leading-[1.55] text-on-navy">{b.body}</p>
              </div>
            </div>
          ))}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-10 -translate-x-1/2 md:block">
            <span data-plug className="block h-full origin-left bg-teal" />
            <span data-plug-dot className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal shadow-[0_0_20px_var(--teal)]" />
          </div>
        </div>
      </div>

      <div data-pin className="pb-24 pt-14 lg:pb-0 lg:pt-0">
        <div data-viewport className="relative lg:flex lg:h-screen lg:flex-col lg:justify-center">
          <div className="mx-auto mb-8 hidden w-full max-w-[1200px] items-center gap-4 px-8 lg:flex">
            <span className="font-mono text-[11px] text-on-navy-muted">01</span>
            <span className="relative h-px flex-1 bg-tint/10">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-glow shadow-[0_0_12px_var(--glow)]" />
            </span>
            <span className="font-mono text-[11px] text-on-navy-muted">05</span>
          </div>
          <ol
            data-track
            className="flex flex-col gap-4 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-6 lg:pl-[max(32px,calc((100vw-1200px)/2+32px))] lg:pr-[30vw]"
          >
            {c.steps.map((s, i) => (
              <li
                key={s.title}
                data-step={i}
                className="pane flex flex-col overflow-hidden rounded-[22px] lg:w-[440px] lg:shrink-0"
              >
                <div className="mock relative grid h-[230px] place-items-center bg-tint/[0.03] p-6">
                  <StepMock i={i} />
                </div>
                <div className="p-6">
                  <p className="font-mono text-[12px] text-glow">0{i + 1}</p>
                  <h3 className="mt-1 text-[22px] font-light tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-on-navy-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 max-w-[1200px] px-5 text-[22px] font-extralight tracking-[-0.02em] text-fg sm:px-8 lg:mt-12 lg:text-[30px]">
            {c.outro}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Each step's mock plays once when it reaches the reading position. */
function stepTimeline(step: HTMLElement) {
  const q = gsap.utils.selector(step);
  const i = Number(step.dataset.step);
  const tl = gsap.timeline({ paused: true });
  if (i === 0) {
    tl.to(q("[data-knob]"), { y: 36, duration: 0.5, ease: "back.out(2)", delay: 0.3 })
      ;
  } else if (i === 1) {
    tl.from(q("[data-file]"), { opacity: 0, x: -10, stagger: 0.12, duration: 0.3 }).to(q("[data-flag]"), {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(3)",
    });
  } else if (i === 2) {
    tl.to(q("[data-old]"), { opacity: 0.35, duration: 0.3, delay: 0.3 })
      .to(q("[data-strike]"), { scaleX: 1, duration: 0.35 }, "<")
      .from(q("[data-new]"), { opacity: 0, y: 8, duration: 0.4, ease: "back.out(2)" });
  } else if (i === 3) {
    tl.from(q("[data-t]"), { opacity: 0, duration: 0.2, stagger: 0.4 });
  } else {
    tl.fromTo(q("[data-over]"), { x: 70 }, { x: 0, duration: 0.9, ease: "power3.inOut", delay: 0.2 })
      .to(q("[data-over]"), { opacity: 0.55, duration: 0.2 })
      .from(q("[data-match]"), { opacity: 0, scale: 0.7, duration: 0.4, ease: "back.out(3)" });
  }
  if (window.matchMedia(MQ.reduce).matches) tl.progress(1);
  return tl;
}

function StepMock({ i }: { i: number }) {
  const { t } = useTheme();
  const c = t.codebase;
  if (i === 0)
    return (
      <div className="relative flex w-[220px] flex-col gap-1 rounded-xl bg-card p-1.5 text-[13px] shadow-lg ring-1 ring-line">
        <span data-knob className="absolute left-1.5 right-1.5 top-1.5 h-[34px] rounded-lg bg-field shadow-sm ring-1 ring-line" />
        {c.scope.map((s, k) => (
          <span key={s} data-opt={k} className="relative flex h-[34px] items-center gap-2 px-3 text-ink">
            <span className="size-3 rounded-full border-2 border-muted" />
            {s}
          </span>
        ))}
      </div>
    );
  if (i === 1)
    return (
      <ul className="w-[220px] rounded-xl bg-card p-3 font-mono text-[12px] text-ink-2 shadow-lg ring-1 ring-line">
        {[
          ["src/", 0],
          ["components/", 1],
          ["pages/", 1],
          ["AGENTS.md", 0],
          ["CLAUDE.md", 0],
        ].map(([f, ind], k) => (
          <li key={f as string} data-file className="flex items-center gap-2 py-0.5" style={{ paddingLeft: (ind as number) * 14 }}>
            {k < 3 ? <Folder size={13} className="text-muted" /> : <FileText size={13} className="text-muted" />}
            {f}
            {k === 4 && (
              <span data-flag className="ml-auto scale-50 rounded bg-amber/20 px-1.5 text-[10px] font-semibold text-[#b45309] opacity-0">
                ✓ rules
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  if (i === 2)
    return (
      <pre className="w-[250px] rounded-xl bg-card p-4 font-mono text-[12px] leading-[1.7] text-code-fg shadow-lg ring-1 ring-line">
        <span className="text-code-tag">&lt;Button</span>
        {"\n  "}variant=<span className="text-code-str">&quot;default&quot;</span>
        {"\n  "}className=
        {"\n  "}
        <span className="relative inline-block">
          <span data-old className="text-[#b42318]">&quot;bg-blue-500&quot;</span>
          <span data-strike className="absolute left-0 top-1/2 h-px w-full origin-left scale-x-0 bg-[#b42318]" />
        </span>
        {"\n  "}
        <span data-new className="inline-block text-code-str">&quot;bg-surface-base&quot;</span> <span className="text-code-tag">/&gt;</span>
      </pre>
    );
  if (i === 3)
    return (
      <div className="w-[230px] rounded-xl bg-card p-4 font-mono text-[12px] leading-[1.9] text-code-fg shadow-lg ring-1 ring-line">
        <p data-t>$ npm run lint</p>
        <p data-t className="text-code-str">✓ 0 problems</p>
        <p data-t>$ tsc --noEmit</p>
        <p data-t className="text-code-str">✓ no errors</p>
      </div>
    );
  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="relative h-[120px] w-[200px]">
        {[c.figma, c.code].map((label, k) => (
          <div
            key={label}
            data-over={k === 1 ? "" : undefined}
            className={`absolute inset-0 rounded-xl bg-card p-3 shadow-lg ${k === 1 ? "ring-2 ring-ink-2" : "ring-1 ring-line"}`}
          >
            <p className="text-[10px] font-semibold text-muted">{label}</p>
            <span className="mt-2 block h-2 w-2/3 rounded-full bg-ink/60" />
            <span className="mt-2 block h-5 rounded-md border border-line bg-field" />
            <span className="mt-2 block h-5 rounded-md bg-ink-2" />
          </div>
        ))}
      </div>
      <span data-match className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-card">
        <CircleCheck size={14} /> {c.matches}
      </span>
    </div>
  );
}
