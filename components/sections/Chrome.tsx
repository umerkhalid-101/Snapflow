"use client";

import { Menu, MessageCircle, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LogoMark } from "@/components/ui/Hexagon";
import { Pill } from "@/components/ui/Pill";
import { LOGIN, PORTFOLIO, WHATSAPP, live, scrollToId } from "@/lib/site";

export function TopBar() {
  const { t } = useTheme();
  return (
    <a
      href="#join"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("join");
      }}
      className="group relative flex h-10 items-center justify-center gap-2 border-b border-edge bg-page px-4 text-[13px] text-fg-2 transition-colors hover:text-fg"
    >
      <span className="size-1.5 rounded-full bg-glow" aria-hidden />
      <span className="truncate">
        <span className="font-medium text-fg">{t.topbar.lead}</span> <span className="hidden sm:inline">{t.topbar.rest}</span>
      </span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
    </a>
  );
}

export function LocaleToggle({}: { dark?: boolean }) {
  const { locale, setLocale } = useTheme();
  return (
    <div role="group" aria-label="Language" className={`inline-flex rounded-full p-0.5 text-[11px] font-semibold bg-tint/[0.05] ring-1 ring-edge`}>
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          onClick={() => setLocale(l)}
          className={`h-7 rounded-full px-2.5 uppercase transition-colors ${
            locale === l ? "bg-fg text-page" : "text-fg-3 hover:text-fg"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ModeToggle() {
  const { mode, toggleMode, locale } = useTheme();
  const light = mode === "light";
  const label = locale === "es" ? (light ? "Modo oscuro" : "Modo claro") : light ? "Dark mode" : "White mode";
  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-edge-2 bg-tint/[0.03] text-fg transition-colors hover:bg-tint/[0.08]"
    >
      <Sun size={15} className={`absolute transition-all duration-500 ${light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
      <Moon size={15} className={`absolute transition-all duration-500 ${light ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
    </button>
  );
}

export function Nav() {
  const { t } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const join = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId("join");
  };

  return (
    <header className="sticky top-0 z-50">
      <nav
        aria-label="Main"
        className={`relative transition-all duration-500 ${scrolled ? "bg-page/70 shadow-[0_1px_0_var(--edge)] backdrop-blur-xl" : "bg-transparent"}`}
      >
        <span
          ref={bar}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-glow shadow-[0_0_10px_var(--glow)]"
        />
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2" aria-label="Snapflow">
            <LogoMark size={24} />
            <span className="text-[19px] font-medium tracking-[-0.02em] text-fg">Snapflow</span>
          </a>
          <ul className="hidden items-center gap-9 lg:flex">
            {t.nav.items.map((i) => (
              <li key={i.href}>
                <a href={live(t.base, i.href)} className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-fg-2 transition-colors hover:text-fg">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <div className="hidden sm:block">
              <LocaleToggle />
            </div>
            <Pill variant="ghost" size="sm" href={LOGIN} className="hidden md:inline-flex">
              {t.nav.login}
            </Pill>
            <Pill size="sm" href="#join" onClick={join} className="hidden sm:inline-flex">
              {t.nav.cta}
            </Pill>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-fg hover:bg-tint/5 lg:hidden"
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-edge bg-page/95 px-5 pb-5 backdrop-blur-xl lg:hidden">
            <ul className="flex flex-col py-2">
              {t.nav.items.map((i) => (
                <li key={i.href}>
                  <a href={live(t.base, i.href)} className="block py-3 text-[17px] text-fg">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-3">
              <LocaleToggle />
              <Pill size="sm" href="#join" onClick={join}>
                {t.nav.cta}
              </Pill>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export function FloatingBits() {
  const { t } = useTheme();
  return (
    <>
      <a
        href={PORTFOLIO}
        className="fixed bottom-4 left-4 z-[60] rounded-full border border-edge-2 bg-page/70 px-3 py-1.5 text-[11px] font-medium text-fg-2 backdrop-blur transition-colors hover:text-fg"
      >
        {t.badge}
      </a>
      <a
        href={WHATSAPP}
        aria-label={t.footer.whatsapp}
        className="fixed bottom-5 right-5 z-[60] grid size-12 place-items-center rounded-full bg-glow text-page shadow-[0_0_30px_color-mix(in_oklab,var(--glow)_40%,transparent)] transition-transform hover:scale-105"
      >
        <MessageCircle size={22} />
      </a>
    </>
  );
}
