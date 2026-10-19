"use client";

import { ArrowRight, Building2, Cloud } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Heading } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { MQ, gsap, useGSAP } from "@/lib/gsap";
import { WHATSAPP, scrollToId } from "@/lib/site";

/* For one team or the whole company. Two lit vitrines: a glass cloud and a ring of glass cylinders. */
export function Enterprise() {
  const { t } = useTheme();
  const e = t.ent;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to("[data-cloud]", { y: -10, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-vitrines]", start: "top 70%" } })
          .from("[data-seat]", { scaleY: 0, transformOrigin: "bottom", stagger: 0.07, duration: 0.5, ease: "back.out(2)" })
          .from("[data-seat-bar]", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.out" }, 0.2)
          .from("[data-cyl]", { scaleY: 0, transformOrigin: "bottom", stagger: 0.12, duration: 0.9, ease: "expo.out" }, 0)
          .from("[data-team]", { y: 14, opacity: 0, stagger: 0.12, duration: 0.5, ease: "back.out(2)" }, 0.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section relative" aria-label={e.chip}>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <Heading chip={e.chip} line1={e.title1} line2={e.title2} />
        <div data-vitrines className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* SaaS */}
          <article data-reveal className="flex flex-col">
            <Vitrine>
              <div data-cloud className="relative h-[120px] w-[220px]">
                <span className="absolute bottom-0 left-[8%] size-[90px] rounded-full border border-tint/25 bg-tint/10 backdrop-blur-md" />
                <span className="absolute bottom-[10px] left-[34%] size-[120px] rounded-full border border-tint/30 bg-tint/[0.14] backdrop-blur-md" />
                <span className="absolute bottom-0 right-[6%] size-[80px] rounded-full border border-tint/25 bg-tint/10 backdrop-blur-md" />
                <span className="absolute inset-x-[8%] bottom-0 h-[40px] rounded-full bg-tint/[0.08] backdrop-blur-md" />
              </div>
              <div className="pane mt-6 w-[250px] rounded-xl bg-surface/70 p-3 backdrop-blur">
                <p className="flex items-center gap-2 text-[12.5px] text-fg">
                  <Cloud size={14} className="text-glow" /> {e.saas.project}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-fg-3">
                  {e.saas.seats}
                  <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-tint/10">
                    <span data-seat-bar className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-glow" />
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-end gap-1.5">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} data-seat className={`h-7 w-4 rounded-[4px] ${i < 5 ? "bg-tint/70" : "bg-tint/15"}`} />
                ))}
                <span data-seat className="ml-1 size-7 rotate-[30deg] rounded-[6px] bg-[#0b1017] ring-1 ring-tint/30" />
              </div>
            </Vitrine>
            <p className="mt-5 text-[13px] font-medium text-fg-3">{e.saas.tag}</p>
            <h3 className="mt-1.5 text-[26px] font-extralight tracking-[-0.02em] text-fg">{e.saas.title}</h3>
            <p className="mt-2 max-w-[440px] text-[15px] text-fg-2">{e.saas.body}</p>
            <div className="mt-5">
              <Pill
                href="#join"
                onClick={(ev) => {
                  ev.preventDefault();
                  scrollToId("join");
                }}
              >
                {e.saas.cta} <ArrowRight size={15} />
              </Pill>
            </div>
          </article>

          {/* Enterprise */}
          <article data-reveal className="flex flex-col">
            <Vitrine>
              <div className="relative flex h-[150px] items-end gap-4">
                {[110, 140, 120].map((h, i) => (
                  <span
                    key={i}
                    data-cyl
                    className="relative w-[64px] rounded-[32px/12px] border border-tint/25 bg-[linear-gradient(90deg,rgb(255_255_255/0.05),rgb(255_255_255/0.18),rgb(255_255_255/0.05))] backdrop-blur-sm"
                    style={{ height: h }}
                  >
                    <span className="absolute inset-x-0 top-0 h-[22px] rounded-[50%] border border-tint/30 bg-tint/10" />
                    {i === 1 && <span className="absolute bottom-6 left-1/2 size-7 -translate-x-1/2 rotate-[30deg] rounded-[6px] bg-[#0b1017] ring-1 ring-tint/30" />}
                  </span>
                ))}
              </div>
              <div className="h-3 w-[300px] rounded-[50%] bg-glow/30 blur-md" />
              <div className="pane mt-4 w-[270px] rounded-xl bg-surface/70 p-3 backdrop-blur">
                <p className="flex items-center gap-2 text-[12.5px] text-fg">
                  <Building2 size={14} className="text-glow" /> {e.company.label}
                </p>
                <div className="mt-2 flex gap-1.5">
                  {e.company.teams.map((tm) => (
                    <span key={tm} data-team className="rounded-md bg-tint/10 px-2 py-0.5 text-[11px] text-fg">
                      {tm}
                    </span>
                  ))}
                </div>
              </div>
            </Vitrine>
            <p className="mt-5 text-[13px] font-medium text-fg-3">{e.company.tag}</p>
            <h3 className="mt-1.5 text-[26px] font-extralight tracking-[-0.02em] text-fg">{e.company.title}</h3>
            <p className="mt-2 max-w-[440px] text-[15px] text-fg-2">{e.company.body}</p>
            <div className="mt-5">
              <Pill variant="ghost" href={WHATSAPP}>
                {e.company.cta}
              </Pill>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Vitrine({ children }: { children: React.ReactNode }) {
  return (
    <div data-tilt-card className="island relative flex aspect-[4/3] border border-edge shadow-[var(--stage-shadow)] flex-col items-center justify-center overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(255_255_255/0.10),transparent),radial-gradient(ellipse_70%_50%_at_50%_100%,color-mix(in_oklab,var(--glow)_14%,transparent),transparent),linear-gradient(180deg,#141b24,#07090d)]">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgb(255_255_255/0.03))]" />
      {children}
    </div>
  );
}
