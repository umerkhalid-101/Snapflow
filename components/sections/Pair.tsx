"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { MQ, gsap, useGSAP } from "@/lib/gsap";

/* The Playground shows, the web editor edits. They are linked: pick a component in one, it lights up in the other. */
const LINKS = ["Button", "Input", "Card"] as const;
const LAYER_OF: Record<(typeof LINKS)[number], string> = {
  Button: "CreateAccountButton",
  Input: "EmailField",
  Card: "SignUpCard",
};

export function Pair() {
  const { t } = useTheme();
  const p = t.pair;
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof LINKS)[number]>("Button");
  const [hovering, setHovering] = useState(false);

  /* Auto-cycle the link while nobody is pointing at it. */
  useEffect(() => {
    if (hovering) return;
    const id = setInterval(
      () => setActive((a) => LINKS[(LINKS.indexOf(a) + 1) % LINKS.length]),
      2200,
    );
    return () => clearInterval(id);
  }, [hovering]);

  /* The two windows start stacked like one, then slide apart as you scroll: one shows, the other edits. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-windows]",
              start: "top 85%",
              end: "top 25%",
              scrub: 1,
            },
          })
          .fromTo(
            "[data-win='0']",
            { xPercent: 52, rotationY: 18, scale: 0.92 },
            { xPercent: 0, rotationY: 0, scale: 1, ease: "power2.out" },
            0,
          )
          .fromTo(
            "[data-win='1']",
            { xPercent: -52, rotationY: -18, scale: 0.92 },
            { xPercent: 0, rotationY: 0, scale: 1, ease: "power2.out" },
            0,
          )
          .fromTo(
            "[data-link-line]",
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, ease: "none" },
            0.6,
          );
      });
    },
    { scope: root },
  );

  const layer = LAYER_OF[active];
  const tree = [
    "SignUp",
    "CenteredContent",
    "SignUpGroup",
    "BrandBlock",
    "SignUpCard",
    "CardHeader",
    "NameField",
    "EmailField",
    "CreateAccountButton",
  ];
  const depth = [0, 1, 2, 3, 3, 4, 4, 4, 4];

  return (
    <section
      ref={root}
      className="section relative overflow-hidden"
      aria-label={p.chip}
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Heading chip={p.chip} line1={p.title1} line2={p.title2} sub={p.sub} />

        <div
          data-windows
          className="relative mt-10 grid gap-6 lg:grid-cols-2"
          style={{ perspective: 1800 }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <span
            data-link-line
            aria-hidden
            className="beam absolute left-[46%] right-[46%] top-1/3 z-10 hidden !opacity-100 lg:block"
          />

          {/* Playground */}
          <div data-win="0" className="pane overflow-hidden rounded-[22px]">
            <WindowBar title="localhost:6011" />
            <div className="mock grid h-[340px] grid-cols-[104px_1fr] bg-card sm:grid-cols-[130px_1fr] text-ink">
              <ul className="flex flex-col gap-0.5 border-r border-line p-3 text-[12px]">
                <li className="mb-1 font-mono text-[9.5px] tracking-[0.12em] text-faint">
                  {p.playground.components.toUpperCase()}
                </li>
                {[
                  "Button",
                  "Badge",
                  "Input",
                  "Switch",
                  "Tabs",
                  "Avatar",
                  "Card",
                ].map((c) => {
                  const linked = (LINKS as readonly string[]).includes(c);
                  const on = active === c;
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        onMouseEnter={() =>
                          linked && setActive(c as (typeof LINKS)[number])
                        }
                        onFocus={() =>
                          linked && setActive(c as (typeof LINKS)[number])
                        }
                        className={`w-full rounded-md px-2 py-1.5 text-left transition-colors ${on ? "bg-ink text-card" : "text-body hover:bg-panel"}`}
                      >
                        {c}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="min-w-0 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium">
                    {p.playground.components}
                  </p>
                  <span className="hidden sm:flex items-center gap-1.5 rounded-md border border-line bg-field px-2 py-1 text-[11px] text-faint">
                    <Search size={11} /> {p.playground.search}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2.5">
                  {[
                    {
                      n: "Button",
                      v: 4,
                      el: (
                        <span className="rounded-md bg-ink px-2.5 py-1 text-[10px] text-card">
                          Save
                        </span>
                      ),
                    },
                    {
                      n: "Badge",
                      v: 3,
                      el: (
                        <span className="rounded-full bg-[#e3e9ef] px-2 py-0.5 text-[10px] text-[#3d5266]">
                          New
                        </span>
                      ),
                    },
                    {
                      n: "Switch",
                      v: 2,
                      el: (
                        <span className="flex h-4 w-7 items-center rounded-full bg-[#7d93a6] p-0.5">
                          <span className="ml-auto size-3 rounded-full bg-white" />
                        </span>
                      ),
                    },
                    {
                      n: "Input",
                      v: 3,
                      el: (
                        <span className="max-w-full truncate rounded border border-line px-1.5 py-0.5 text-[9px] text-faint">
                          you@team.co
                        </span>
                      ),
                    },
                    {
                      n: "Avatar",
                      v: 2,
                      el: <span className="size-6 rounded-full bg-[#99adbd]" />,
                    },
                    {
                      n: "Card",
                      v: 2,
                      el: (
                        <span className="h-6 w-10 rounded-md border border-line bg-field shadow-sm" />
                      ),
                    },
                  ].map((c) => (
                    <div
                      key={c.n}
                      className={`flex flex-col rounded-lg border p-2.5 transition-all duration-300 ${
                        active === c.n
                          ? "border-ink-2 bg-field shadow-[0_0_0_3px_rgb(11_16_23/0.08)]"
                          : "border-line"
                      }`}
                    >
                      <span className="flex h-9 items-center justify-center">
                        {c.el}
                      </span>
                      <span className="mt-1.5 text-[10.5px] font-medium">
                        {c.n}
                      </span>
                      <span className="text-[9.5px] text-faint">
                        {c.v} {p.playground.variants}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Web editor */}
          <div data-win="1" className="pane overflow-hidden rounded-[22px]">
            <WindowBar title="app.snapflow.design" />
            <div className="mock grid h-[340px] grid-cols-[112px_1fr] bg-card sm:grid-cols-[150px_1fr] text-ink">
              <div className="border-r border-line p-3">
                <div className="flex gap-3 text-[11px]">
                  <span className="font-medium">{p.editor.layers}</span>
                  <span className="text-faint">{p.editor.library}</span>
                </div>
                <ul className="mt-2 flex flex-col gap-0.5 font-mono text-[10px]">
                  {tree.map((l, k) => (
                    <li
                      key={l}
                      className={`truncate rounded px-1.5 py-1 transition-colors duration-300 ${l === layer ? "bg-ink text-card" : "text-body"}`}
                      style={{ marginLeft: depth[k] * 8 }}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col bg-panel p-3">
                <div className="flex items-center justify-between gap-2 text-[10.5px] text-faint">
                  <span className="min-w-0 truncate">
                    {p.editor.pages} / <span className="text-ink">SignUp</span>{" "}
                    · {p.editor.saved}
                  </span>
                  <span className="shrink-0 rounded-md bg-ink px-2 py-1 text-card">
                    {p.editor.publish}
                  </span>
                </div>
                <div className="grid flex-1 place-items-center">
                  <div
                    className={`w-full max-w-[200px] rounded-xl bg-field p-4 shadow-md ring-2 transition-all duration-300 ${layer === "SignUpCard" ? "ring-ink-2" : "ring-transparent"}`}
                  >
                    <p className="text-[9px] text-faint">{p.editor.kicker}</p>
                    <p className="text-[14px] font-medium">
                      {p.editor.heading}
                    </p>
                    <p className="text-[9px] text-faint">{p.editor.fill}</p>
                    <span className="mt-2 block text-[9px]">
                      {p.editor.name}
                    </span>
                    <span className="mt-0.5 block h-5 rounded border border-line" />
                    <span className="mt-1.5 block text-[9px]">
                      {p.editor.email}
                    </span>
                    <span
                      className={`mt-0.5 block h-5 rounded border transition-all duration-300 ${layer === "EmailField" ? "border-ink-2 ring-2 ring-ink-2/25" : "border-line"}`}
                    />
                    <span
                      className={`mt-2.5 flex h-6 items-center justify-center rounded bg-ink text-[9.5px] text-card transition-all duration-300 ${
                        layer === "CreateAccountButton"
                          ? "ring-2 ring-ink-2 ring-offset-2 ring-offset-[var(--field)]"
                          : ""
                      }`}
                    >
                      {p.editor.button}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {[p.playground, p.editor].map((side, si) => (
            <div key={side.title}>
              <div
                data-reveal
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1"
              >
                <h3 className="text-[26px] font-extralight tracking-[-0.02em] text-fg">
                  {side.title}
                </h3>
                <span className="text-[13px] font-medium text-fg-3">
                  {side.tag}
                </span>
                <p className="w-full text-[14.5px] text-fg-2">{side.body}</p>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {side.list.map((it, k) => (
                  <li
                    key={it.t}
                    data-reveal
                    data-tilt-card
                    className="pane group flex flex-col overflow-hidden rounded-[20px]"
                  >
                    <div className="relative grid h-[110px] place-items-center">
                      <Mini side={si} k={k} />
                    </div>
                    <div className="px-4 pb-4">
                      <p className="text-[14.5px] text-fg">{it.t}</p>
                      <p className="mt-0.5 text-[12.5px] leading-[1.5] text-fg-2">
                        {it.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WindowBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
      <span className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-tint/15" />
        <span className="size-2.5 rounded-full bg-tint/15" />
        <span className="size-2.5 rounded-full bg-tint/15" />
      </span>
      <span className="mx-auto rounded-full bg-tint/[0.06] px-3 py-0.5 font-mono text-[11px] text-fg-2">
        {title}
      </span>
    </div>
  );
}

/* Tiny visuals for each feature tile. Playground: catalog, pages, light/dark, responsive. Editor: layers, properties, widths, publish. */
function Mini({ side, k }: { side: number; k: number }) {
  if (side === 0 && k === 0)
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {[
          "bg-fg",
          "bg-glow",
          "bg-tint/20",
          "bg-tint/10",
          "bg-fg/70",
          "bg-glow/50",
        ].map((c, i) => (
          <span
            key={i}
            className={`h-5 w-9 rounded-md ${c} transition-transform duration-500 group-hover:scale-105`}
            style={{ transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    );
  if (side === 0 && k === 1)
    return (
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="flex h-16 w-11 flex-col gap-1 rounded-md border border-edge-2 bg-surface-2 p-1.5"
            style={{ transform: `translateY(${(i - 1) * -4}px)` }}
          >
            <span className="h-1 w-3/4 rounded-full bg-tint/30" />
            <span className="h-3 rounded-sm bg-tint/10" />
            <span className="mt-auto h-2 rounded-sm bg-glow/70" />
          </span>
        ))}
      </div>
    );
  if (side === 0 && k === 2)
    return (
      <div className="flex h-14 w-28 overflow-hidden rounded-lg border border-edge-2">
        <span className="flex flex-1 items-center justify-center bg-[#f4f6f9]">
          <span className="h-3 w-8 rounded bg-[#0b1017]" />
        </span>
        <span className="flex flex-1 items-center justify-center bg-[#0b1017]">
          <span className="h-3 w-8 rounded bg-[#f4f6f9]" />
        </span>
      </div>
    );
  if (side === 0 && k === 3)
    return (
      <div className="flex items-end gap-2">
        <span className="h-14 w-20 rounded-md border border-edge-2 bg-surface-2" />
        <span className="h-12 w-9 rounded-md border border-edge-2 bg-surface-2" />
        <span className="h-9 w-6 rounded-md border border-edge-2 bg-surface-2" />
        <span className="ml-1 grid size-7 place-items-center rounded-md border border-edge-2 bg-surface-2 font-mono text-[10px] text-fg-2 shadow-[0_2px_0_var(--edge-2)]">
          ⇥
        </span>
      </div>
    );
  if (side === 1 && k === 0)
    return (
      <ul className="flex flex-col gap-1 font-mono text-[9.5px] text-fg-2">
        {["SignUp", "SignUpCard", "EmailField", "Button"].map((l, i) => (
          <li
            key={l}
            className={`rounded px-1.5 py-0.5 ${i === 3 ? "bg-fg text-page" : ""}`}
            style={{ marginLeft: i * 8 }}
          >
            {l}
          </li>
        ))}
      </ul>
    );
  if (side === 1 && k === 1)
    return (
      <div className="flex w-32 flex-col gap-1.5 text-[10px] text-fg-2">
        {[
          ["variant", "primary"],
          ["size", "lg"],
        ].map(([a, b]) => (
          <span
            key={a}
            className="flex items-center justify-between rounded-md border border-edge-2 px-2 py-1"
          >
            {a} <span className="text-fg">{b} ▾</span>
          </span>
        ))}
        <span className="flex items-center justify-between rounded-md border border-edge-2 px-2 py-1">
          disabled
          <span className="flex h-3 w-5 items-center rounded-full bg-tint/15 p-0.5">
            <span className="size-2 rounded-full bg-fg-3" />
          </span>
        </span>
      </div>
    );
  if (side === 1 && k === 2)
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-1.5 font-mono text-[9px] text-fg-3">
          {[
            ["sm", 24],
            ["md", 34],
            ["lg", 46],
            ["xl", 58],
          ].map(([l, w]) => (
            <span
              key={l as string}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`h-8 rounded border ${l === "lg" ? "border-glow bg-glow/15" : "border-edge-2"}`}
                style={{ width: w as number }}
              />
              {l}
            </span>
          ))}
        </div>
        <span className="font-mono text-[9.5px] text-glow">lg · 1024 px</span>
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full border border-edge-2 px-2 py-0.5 font-mono text-[10px] text-fg-3">
        v2.4
      </span>
      <span className="flex h-8 items-center rounded-lg bg-fg px-3 text-[11.5px] font-medium text-page">
        Publish
      </span>
    </div>
  );
}
