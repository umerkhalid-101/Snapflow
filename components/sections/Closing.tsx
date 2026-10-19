"use client";

import { ArrowRight, ArrowUpRight, Check, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { CopyChip } from "@/components/ui/CopyChip";
import { GlassHand } from "@/components/ui/GlassHand";
import { HexObject } from "@/components/ui/HexObject";
import { LogoMark } from "@/components/ui/Hexagon";
import { Logo } from "@/components/ui/Logo";
import { Pill } from "@/components/ui/Pill";
import { Words } from "@/components/ui/Words";
import { MQ, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { EMAIL, WHATSAPP, live } from "@/lib/site";
import { LocaleToggle } from "./Chrome";

/* ------------------------------------------------------------------ */
/*  In production: a chrome prism turns inside a ring of the results.  */
/* ------------------------------------------------------------------ */
export function Production() {
  const { t } = useTheme();
  const p = t.prod;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-prod-ring]",
          { rotation: 0 },
          { rotation: 220, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
        root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const to = Number(el.dataset.count);
          const obj = { v: to === 0 ? 37 : 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(obj, { v: to, duration: 1.6, ease: "expo.out", onUpdate: () => (el.textContent = String(Math.round(obj.v))) }),
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section relative overflow-hidden" aria-label={p.chip}>
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="chip" data-reveal>
            {p.chip}
          </span>
          <p className="mt-6 max-w-[420px] text-[28px] font-extralight leading-[1.2] tracking-[-0.02em] text-fg md:text-[34px]" data-reveal>
            {p.lead}
          </p>
          <dl className="mt-10 grid gap-6">
            {p.stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-4 border-t border-edge pt-5" data-reveal>
                <dt className="sr-only">{s.label}</dt>
                <dd className="chrome-text min-w-[150px] text-[56px] font-extralight leading-none tracking-[-0.05em]">
                  {s.pre}
                  <span data-count={s.v}>{s.v}</span>
                  {s.post}
                </dd>
                <dd className="text-[15px] text-fg-2">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <svg data-prod-ring viewBox="0 0 400 400" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <path id="prod-ring" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
            </defs>
            <text style={{ fontSize: 15, letterSpacing: "0.16em", fontFamily: "var(--font-geist-mono)", fill: "var(--fg-2)" }}>
              <textPath href="#prod-ring" textLength="1062" lengthAdjust="spacing">
                {p.ring}
              </textPath>
            </text>
          </svg>
          <GlassHand className="absolute inset-[6%]" label="A glass hand that snaps its fingers" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  From the waitlist to your first governed screen: four steps, lit   */
/*  one after another as a line of light passes through them.          */
/* ------------------------------------------------------------------ */
export function Waitlist() {
  const { t } = useTheme();
  const w = t.wait;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 45%", scrub: 1 } });
        tl.fromTo("[data-path]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 3 }, 0);
        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]");
        gsap.utils.toArray<HTMLElement>("[data-wstep]").forEach((el, i) => {
          const q = gsap.utils.selector(el);
          if (nodes[i])
            tl.fromTo(
              nodes[i],
              { backgroundColor: "var(--page)", color: "var(--fg-3)", borderColor: "var(--edge-2)", scale: 1 },
              { backgroundColor: "var(--fg)", color: "var(--page)", borderColor: "var(--fg)", scale: 1.12, duration: 0.3 },
              i,
            );
          tl.fromTo(el, { opacity: 0.35 }, { opacity: 1, duration: 0.4 }, i)
            .fromTo(q("[data-act]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, i + 0.1);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section relative" aria-label={w.chip}>
      <div className="mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <span className="chip" data-reveal>
          {w.chip}
        </span>
        <h2 className="h2 mt-6" data-words>
          <Words text={w.title1} className="chrome-text block" />
          <Words text={w.title2} className="block text-fg-3" />
        </h2>
        <div data-steps className="relative mt-10">
          {/* the track: one node per step, joined by a line that fills as you scroll */}
          <div aria-hidden className="relative mb-6 hidden h-8 lg:block">
            <span className="absolute left-[12.5%] right-[12.5%] top-1/2 h-px -translate-y-1/2 bg-edge-2">
              <span data-path className="absolute inset-0 origin-left bg-glow" />
            </span>
            {w.steps.map((s, i) => (
              <span
                key={s.k}
                data-node
                className="absolute top-0 grid size-8 -translate-x-1/2 place-items-center rounded-full border border-edge-2 bg-page font-mono text-[11px] text-fg-3"
                style={{ left: `${12.5 + i * 25}%` }}
              >
                0{i + 1}
              </span>
            ))}
          </div>
          <ol className="relative grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
            {w.steps.map((s, i) => (
              <li key={s.k} data-wstep data-tilt-card className="pane flex flex-col rounded-[22px] p-5">
                <span className="text-[12.5px] font-medium text-fg-3">{s.k}</span>
                <p className="mt-1 text-[18px] font-light text-fg">{s.t}</p>
                <div className="mock my-5 grid min-h-[120px] place-items-center rounded-xl bg-tint/[0.03] p-3">
                  <StepArt i={i} />
                </div>
                <span className="mt-auto border-t border-edge pt-3 text-[12.5px] text-fg-3">{s.foot}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepArt({ i }: { i: number }) {
  const { t } = useTheme();
  const w = t.wait;
  if (i === 0)
    return (
      <div className="w-full rounded-lg bg-card p-2.5 text-ink shadow-sm ring-1 ring-line">
        <p className="text-[10px] text-muted">{w.email}</p>
        <p data-act className="mt-1 rounded-md border border-line bg-field px-2 py-1 text-[11px]">
          {w.emailPh}
        </p>
        <p data-act className="mt-1.5 rounded-md bg-ink py-1 text-center text-[11px] text-card">
          {w.notify}
        </p>
      </div>
    );
  if (i === 1)
    return (
      <div data-act className="flex w-full items-center gap-2.5 rounded-lg bg-card p-2.5 text-ink shadow-sm ring-1 ring-line">
        <span className="grid size-8 place-items-center rounded-lg bg-ink text-card">
          <Mail size={14} />
        </span>
        <span className="flex-1">
          <span className="block text-[11.5px] font-medium">{w.invited}</span>
          <span className="block text-[10px] text-muted">{w.ready}</span>
        </span>
        <span className="grid size-5 place-items-center rounded-full bg-ink-2 text-card">
          <Check size={11} strokeWidth={3} />
        </span>
      </div>
    );
  if (i === 2)
    return (
      <div className="w-full rounded-lg bg-card p-2.5 font-mono text-[10px] leading-[1.8] text-code-fg shadow-sm ring-1 ring-line">
        <p data-act>$ npx @snapflow-labs/onboard</p>
        <p data-act className="text-code-str">✓ Snapflow connected</p>
        <p data-act className="mt-1 flex items-center gap-2 text-code-str">
          ✓
          {(["claudecode", "cursor", "codex"] as const).map((id) => (
            <Logo key={id} id={id} size={14} className="text-ink" />
          ))}
        </p>
      </div>
    );
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span data-act className="flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-[11px] text-ink shadow-sm ring-1 ring-line">
        <Logo id="figma" size={12} /> Figma
      </span>
      <span data-act className="flex items-center gap-2 rounded-md bg-card px-2.5 py-1.5 text-ink shadow-sm ring-1 ring-line">
        <Logo id="react" size={14} />
        <Logo id="vue" size={14} />
        <Logo id="angular" size={14} />
      </span>
      <span data-act className="text-[10.5px] text-muted">
        {w.yours}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Access: Fifteen days free. The hexagon returns, glowing.           */
/* ------------------------------------------------------------------ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Access() {
  const { t } = useTheme();
  const a = t.access;
  const id = "join-email";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "done">("idle");

  return (
    <section id="join" className="section relative scroll-mt-20 overflow-hidden" aria-label={a.chip}>
      <div aria-hidden className="spot pointer-events-none absolute inset-0" />
      <div aria-hidden className="beam absolute inset-x-0 top-[46%]" />
      <div className="relative mx-auto flex max-w-[900px] flex-col items-center px-5 text-center">
        <div className="relative size-[240px] sm:size-[300px]" data-reveal>
          <div aria-hidden className="absolute inset-[24%] rounded-full bg-glow/20 blur-[60px]" />
          <HexObject className="relative size-full" label="The Snapflow mark in black glass" />
        </div>
        <span className="chip mt-8" data-reveal>
          {a.chip}
        </span>
        <h2 className="display mt-6 text-[44px] sm:text-[64px] lg:text-[80px]" data-words>
          <Words text={a.title} className="chrome-text" />
        </h2>
        <p className="mt-5 max-w-[520px] text-[16px] leading-[1.65] text-fg-2" data-reveal>
          {a.sub}
        </p>

        <div className="mt-9 w-full max-w-[520px]" data-reveal>
          {state === "done" ? (
            <p role="status" className="flex items-center justify-center gap-2.5 rounded-2xl border border-glow/40 bg-glow/10 px-5 py-4 text-[15px] text-fg">
              <Check size={17} className="text-glow" strokeWidth={3} />
              {a.success}
            </p>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                setState(EMAIL_RE.test(email.trim()) ? "done" : "invalid");
              }}
            >
              <div className="pane flex flex-col gap-2 rounded-2xl p-2 sm:flex-row">
                <label htmlFor={id} className="sr-only">
                  {a.label}
                </label>
                <input
                  id={id}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "invalid") setState("idle");
                  }}
                  placeholder={a.placeholder}
                  aria-invalid={state === "invalid"}
                  aria-describedby={state === "invalid" ? `${id}-err` : undefined}
                  className="h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-[15px] text-fg outline-none placeholder:text-fg-3"
                />
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-fg px-6 text-[14px] font-medium text-page transition-transform active:scale-[0.97]">
                  {a.cta} <ArrowRight size={15} />
                </button>
              </div>
              {state === "invalid" && (
                <p id={`${id}-err`} role="alert" className="mt-3 text-[13.5px] text-[#fda4af]">
                  {a.invalid}
                </p>
              )}
            </form>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3" data-reveal>
          <CopyChip dark />
          <Pill variant="ghost" size="sm" href={live(t.base, "pricing.html")}>
            {a.pricing} <ArrowUpRight size={14} />
          </Pill>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function Footer() {
  const { t } = useTheme();
  const f = t.footer;
  return (
    <footer className="relative overflow-hidden border-t border-edge pb-28 pt-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark size={26} />
              <span className="text-[18px] font-medium tracking-[-0.02em] text-fg">Snapflow</span>
            </div>
            <p className="mt-5 max-w-[360px] text-[14px] leading-[1.6] text-fg-2">{f.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={WHATSAPP} className="rounded-full border border-edge-2 px-3.5 py-2 text-[13px] text-fg-2 hover:text-fg">
                WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} aria-label={f.email} className="rounded-full border border-edge-2 px-3.5 py-2 text-[13px] text-fg-2 hover:text-fg">
                {EMAIL}
              </a>
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {f.groups.map((g) => (
              <div key={g.title}>
                <p className="text-[13px] font-medium text-fg-3">{g.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <a href={live(t.base, l.href)} className="text-[14px] text-fg-2 transition-colors hover:text-fg">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-edge pt-6 text-[12.5px] text-fg-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span>{f.company}</span>
            <span>{f.rights}</span>
          </div>
          <LocaleToggle dark />
        </div>
      </div>
      <p aria-hidden className="chrome-text pointer-events-none mt-16 select-none text-center text-[21vw] font-extralight leading-[0.78] tracking-[-0.06em] opacity-[0.12]">
        snapflow
      </p>
    </footer>
  );
}
