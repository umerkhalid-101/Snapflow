import { clampChroma, converter, formatHex, parse, wcagContrast } from "culori";
import { INK, SURFACE, WHITE, type Mode } from "./tokens";

const toOklch = converter("oklch");

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const LIGHTNESS = [0.975, 0.95, 0.9, 0.84, 0.77, 0.7, 0.6, 0.5, 0.41, 0.33, 0.25];
const CHROMA = [0.22, 0.38, 0.62, 0.84, 1, 1, 1, 0.92, 0.82, 0.72, 0.6];

export function normalizeHex(input: string): string | null {
  const c = parse(input.trim());
  if (!c) return null;
  return formatHex(c).toUpperCase();
}

export function contrast(a: string, b: string): number {
  return wcagContrast(a, b);
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** Ink or white, whichever reads better on the accent. */
export function inkFor(accent: string): string {
  return contrast(accent, INK) >= contrast(accent, WHITE) ? INK : WHITE;
}

/** 50 to 950 in OKLCH: keep the hue, step the lightness, clamp chroma into sRGB. */
export function generateScale(hex: string): Record<string, string> {
  const base = toOklch(parse(hex));
  const out: Record<string, string> = {};
  if (!base) return out;
  const c = base.c ?? 0;
  const h = base.h ?? 0;
  SCALE_STEPS.forEach((step, i) => {
    const col = clampChroma({ mode: "oklch", l: LIGHTNESS[i], c: c * CHROMA[i], h }, "oklch");
    out[String(step)] = formatHex(col).toUpperCase();
  });
  return out;
}

/** A readable shade of the accent for text on the canvas (lime is a fill, never text on Frost). */
export function accentTextFor(scale: Record<string, string>, mode: Mode): string {
  const bg = SURFACE[mode].frost;
  const order = mode === "light" ? ["600", "700", "800", "900", "950"] : ["300", "200", "100", "50"];
  for (const k of order) if (scale[k] && contrast(scale[k], bg) >= 4.5) return scale[k];
  return SURFACE[mode].ink;
}

export type GuardResult = {
  hex: string;
  adjusted: boolean;
  before: number;
  after: number;
};

/**
 * The Governor: a custom accent must reach 3:1 against the canvas.
 * If it fails, walk the lightness (keeping hue and chroma) to the nearest passing shade.
 */
export function guardAccent(hex: string, mode: Mode, min = 3): GuardResult {
  const bg = SURFACE[mode].frost;
  const before = contrast(hex, bg);
  if (before >= min) return { hex, adjusted: false, before, after: before };
  const base = toOklch(parse(hex));
  if (!base) return { hex, adjusted: false, before, after: before };
  const dir = mode === "light" ? -1 : 1;
  let l = base.l;
  for (let i = 0; i < 100; i++) {
    l += dir * 0.01;
    if (l <= 0 || l >= 1) break;
    const cand = formatHex(clampChroma({ mode: "oklch", l, c: base.c ?? 0, h: base.h ?? 0 }, "oklch")).toUpperCase();
    const ratio = contrast(cand, bg);
    if (ratio >= min + 0.05) return { hex: cand, adjusted: true, before, after: ratio };
  }
  const fallback = SURFACE[mode].ink;
  return { hex: fallback, adjusted: true, before, after: contrast(fallback, bg) };
}

/** A random accent that passes the Governor in the current mode. */
export function randomPassingAccent(mode: Mode): string {
  const h = Math.floor(Math.random() * 360);
  const l = mode === "light" ? 0.58 + Math.random() * 0.08 : 0.72 + Math.random() * 0.1;
  const hex = formatHex(clampChroma({ mode: "oklch", l, c: 0.19 + Math.random() * 0.06, h }, "oklch")).toUpperCase();
  return guardAccent(hex, mode).hex;
}

/** All CSS variables the engine writes for an accent. */
export function accentVars(accent: string) {
  const scale = generateScale(accent);
  const ink = inkFor(accent);
  const vars: Record<string, string> = {
    "--accent": accent,
    "--accent-ink": ink,
    "--accent-text-light": accentTextFor(scale, "light"),
    "--accent-text-dark": accentTextFor(scale, "dark"),
  };
  for (const [k, v] of Object.entries(scale)) vars[`--accent-${k}`] = v;
  return { vars, scale: { ...scale, ink } };
}
