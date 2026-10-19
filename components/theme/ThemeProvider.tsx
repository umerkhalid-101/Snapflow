"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Dict } from "@/content/en";
import { es } from "@/content/es";
import { contrast } from "@/lib/color";
import type { Framework, Locale } from "@/lib/tokens";

export type Mode = "dark" | "light";
type State = { locale: Locale; accent: string; framework: Framework; mode: Mode };
type Ctx = State & {
  t: Dict;
  setLocale: (l: Locale) => void;
  setAccent: (hex: string) => void;
  setFramework: (f: Framework) => void;
  toggleMode: () => void;
};

export const DEFAULT_ACCENT = "#99adbd";
export const MODE_KEY = "snapflow-mode";
const DICTS: Record<Locale, Dict> = { en, es };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ locale: "en", accent: DEFAULT_ACCENT, framework: "react", mode: "dark" });

  /* URL ?lang= beats the browser language. */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("lang");
    const locale: Locale = p === "es" || p === "en" ? p : navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
    let mode: Mode = "dark";
    try {
      mode = window.localStorage.getItem(MODE_KEY) === "light" ? "light" : "dark";
    } catch {
      /* storage can be blocked */
    }
    if (locale !== "en" || mode !== "dark") setState((s) => ({ ...s, locale, mode }));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", state.mode);
    try {
      window.localStorage.setItem(MODE_KEY, state.mode);
    } catch {
      /* ignore */
    }
  }, [state.mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = state.locale;
    root.style.setProperty("--accent", state.accent);
    if (state.accent === DEFAULT_ACCENT) root.style.removeProperty("--glow");
    else root.style.setProperty("--glow", state.accent);
    root.style.setProperty("--accent-ink", contrast(state.accent, "#ffffff") >= 4.5 ? "#ffffff" : "#020617");
    document.title = DICTS[state.locale].meta.title;
  }, [state.locale, state.accent]);

  const setLocale = useCallback((locale: Locale) => {
    setState((s) => ({ ...s, locale }));
    try {
      const url = new URL(window.location.href);
      if (locale === "en") url.searchParams.delete("lang");
      else url.searchParams.set("lang", locale);
      window.history.replaceState(window.history.state, "", url);
    } catch {
      /* ignore */
    }
  }, []);
  const setAccent = useCallback((accent: string) => setState((s) => ({ ...s, accent })), []);
  const setFramework = useCallback((framework: Framework) => setState((s) => ({ ...s, framework })), []);
  const toggleMode = useCallback(() => setState((s) => ({ ...s, mode: s.mode === "dark" ? "light" : "dark" })), []);

  const value = useMemo(
    () => ({ ...state, t: DICTS[state.locale], setLocale, setAccent, setFramework, toggleMode }),
    [state, setLocale, setAccent, setFramework, toggleMode],
  );
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}

export const useT = () => useTheme().t;
