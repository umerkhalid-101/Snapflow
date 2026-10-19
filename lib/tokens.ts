export type Mode = "light" | "dark";
export type Framework = "react" | "vue" | "angular";
export type Locale = "en" | "es";

export type Theme = {
  accent: string; // #RRGGBB
  radius: number; // px
  density: number; // px, spacing unit
  shadow: number; // 0..2
  border: number; // px
  mode: Mode;
  framework: Framework;
  brandName: string;
  locale: Locale;
};

export const DEFAULT_THEME: Theme = {
  accent: "#D4FF3A",
  radius: 14,
  density: 4,
  shadow: 1,
  border: 1,
  mode: "light",
  framework: "react",
  brandName: "Acme",
  locale: "en",
};

export const LIMITS = {
  radius: { min: 0, max: 32, step: 1 },
  density: { min: 3, max: 6, step: 0.5 },
  shadow: { min: 0, max: 2, step: 0.1 },
  border: { min: 0.5, max: 2, step: 0.5 },
  brandName: 16,
} as const;

export type Swatch = { id: string; hex: string };

/** Presets are curated fills: they always pair with --accent-ink, so the Governor lets them through. */
export const SWATCHES: Swatch[] = [
  { id: "lime", hex: "#D4FF3A" },
  { id: "violet", hex: "#7C6CFF" },
  { id: "coral", hex: "#FF6B4A" },
  { id: "cyan", hex: "#35D6FF" },
  { id: "magenta", hex: "#FF4FD8" },
];

export const FRAMEWORKS: Framework[] = ["react", "vue", "angular"];
export const FRAMEWORK_LABEL: Record<Framework, string> = {
  react: "React",
  vue: "Vue",
  angular: "Angular",
};

/** Surface tokens per mode. Mirrors styles/globals.css, used by the color math. */
export const SURFACE = {
  light: { frost: "#F4F5F7", ink: "#0B0C10" },
  dark: { frost: "#0A0B0F", ink: "#F2F3F5" },
} as const;

export const INK = "#0B0C10";
export const WHITE = "#FFFFFF";

export const STORAGE_KEY = "snapflow-theme";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function slugify(name: string) {
  const s = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "acme";
}

export function sanitizeName(name: string) {
  return name.replace(/[<>{}`"\\]/g, "").slice(0, LIMITS.brandName);
}

/** Parse a theme from URL search params. Unknown or bad values are ignored. */
export function themeFromParams(params: URLSearchParams): Partial<Theme> {
  const out: Partial<Theme> = {};
  const accent = params.get("accent");
  if (accent && /^#?[0-9a-fA-F]{6}$/.test(accent)) out.accent = "#" + accent.replace("#", "").toUpperCase();
  const num = (key: string, lim: { min: number; max: number }) => {
    const v = params.get(key);
    if (v === null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? clamp(n, lim.min, lim.max) : undefined;
  };
  const r = num("radius", LIMITS.radius);
  if (r !== undefined) out.radius = r;
  const d = num("density", LIMITS.density);
  if (d !== undefined) out.density = d;
  const s = num("shadow", LIMITS.shadow);
  if (s !== undefined) out.shadow = s;
  const b = num("border", LIMITS.border);
  if (b !== undefined) out.border = b;
  const mode = params.get("mode");
  if (mode === "light" || mode === "dark") out.mode = mode;
  const fw = params.get("fw");
  if (fw === "react" || fw === "vue" || fw === "angular") out.framework = fw;
  const name = params.get("name");
  if (name) out.brandName = sanitizeName(name) || DEFAULT_THEME.brandName;
  const lang = params.get("lang");
  if (lang === "en" || lang === "es") out.locale = lang;
  return out;
}

/** Only non-default values go into the URL, so the default page stays clean. */
export function themeToParams(t: Theme): URLSearchParams {
  const p = new URLSearchParams();
  const d = DEFAULT_THEME;
  if (t.accent.toUpperCase() !== d.accent) p.set("accent", t.accent.replace("#", "").toUpperCase());
  if (t.radius !== d.radius) p.set("radius", String(t.radius));
  if (t.density !== d.density) p.set("density", String(t.density));
  if (t.shadow !== d.shadow) p.set("shadow", String(Math.round(t.shadow * 10) / 10));
  if (t.border !== d.border) p.set("border", String(t.border));
  if (t.mode !== d.mode) p.set("mode", t.mode);
  if (t.framework !== d.framework) p.set("fw", t.framework);
  if (t.brandName !== d.brandName) p.set("name", t.brandName);
  if (t.locale !== d.locale) p.set("lang", t.locale);
  return p;
}

/** The tokens.json shown in the TokensDrawer. */
export function tokensJson(t: Theme, scale: Record<string, string>) {
  return {
    $schema: "https://snapflow.design/schema/tokens.json",
    brand: { name: t.brandName },
    color: {
      action: {
        primary: t.accent.toUpperCase(),
        "primary-ink": scale.ink,
      },
      accent: Object.fromEntries(
        Object.entries(scale).filter(([k]) => /^\d+$/.test(k)),
      ),
    },
    radius: { md: `${t.radius}px`, lg: `${Math.round(Math.min(t.radius * 1.4, 40))}px` },
    space: { unit: `${t.density}px` },
    elevation: { strength: Math.round(t.shadow * 10) / 10 },
    border: { width: `${t.border}px` },
    mode: t.mode,
    framework: t.framework,
  };
}

/** Rainbow face of the custom color swatch. */
export const PICKER_GRADIENT =
  "conic-gradient(from 180deg, #ff4d4d, #ffb23e, #d4ff3a, #35d6ff, #7c6cff, #ff4fd8, #ff4d4d)";
