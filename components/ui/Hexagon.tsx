import type { SVGProps } from "react";

/** Pointy-top hexagon vertices. */
export function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Rounded hexagon path: each corner is a quadratic curve through the vertex. */
export function roundedHexPath(cx: number, cy: number, r: number, corner = r * 0.18) {
  const pts = hexPoints(cx, cy, r);
  const side = r; // side length of a regular hexagon equals its radius
  const t = Math.min(corner, side / 2) / side;
  let d = "";
  pts.forEach((p, i) => {
    const prev = pts[(i + 5) % 6];
    const next = pts[(i + 1) % 6];
    const a = [p[0] + (prev[0] - p[0]) * t, p[1] + (prev[1] - p[1]) * t];
    const b = [p[0] + (next[0] - p[0]) * t, p[1] + (next[1] - p[1]) * t];
    d += `${i === 0 ? "M" : "L"}${f(a[0])},${f(a[1])} Q${f(p[0])},${f(p[1])} ${f(b[0])},${f(b[1])} `;
  });
  return d + "Z";
}

/** One triangular wedge of the hexagon (center to edge i). Used by the intro shards. */
export function wedgePath(cx: number, cy: number, r: number, i: number) {
  const pts = hexPoints(cx, cy, r);
  const a = pts[i];
  const b = pts[(i + 1) % 6];
  return `M${f(cx)},${f(cy)} L${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} Z`;
}

/** Small solid hexagon used as bullet, loader and section marker. */
export function HexDot({
  size = 10,
  className,
  ...rest
}: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden className={className} {...rest}>
      <path d={roundedHexPath(10, 10, 9.5, 2.4)} fill="currentColor" />
    </svg>
  );
}

/** The Snapflow mark: black-glass rounded hexagon with an inner hexagon. Recreated, to be swapped for the official file. */
export function LogoMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={`island ${className ?? ""}`}>
      <defs>
        <linearGradient id="lm-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--surface-3)" }} />
          <stop offset="1" style={{ stopColor: "var(--obsidian)" }} />
        </linearGradient>
        <linearGradient id="lm-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--fg)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--fg)", stopOpacity: 0.05 }} />
        </linearGradient>
      </defs>
      <path d={roundedHexPath(16, 16, 15, 3.6)} fill="url(#lm-body)" style={{ stroke: "var(--fg)", strokeOpacity: 0.25 }} strokeWidth="0.8" />
      <path d={roundedHexPath(16, 16, 14.2, 3.3)} fill="none" stroke="url(#lm-edge)" strokeWidth="0.9" />
      <path
        d={roundedHexPath(16, 16, 6.6, 1.6)}
        fill="none"
        style={{ stroke: "var(--glow)" }}
        strokeWidth="2.2"
        data-snap
      />
    </svg>
  );
}
