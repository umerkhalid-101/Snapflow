"use client";

import { motion, useReducedMotion } from "motion/react";
import { roundedHexPath, wedgePath } from "./Hexagon";

const C = 200;
const R = 180;
const FACETS = [0.96, 0.84, 0.74, 0.8, 0.9, 1];

/**
 * The glass hexagon: six faceted wedges of dark glass, an inner bevel,
 * an inner hexagon and an accent glow at the core. Pure SVG and CSS layers.
 */
export function GlassHex({
  className = "",
  pulseKey,
  spinGlow = false,
  intensity = 1,
  uid = "gx",
}: {
  className?: string;
  pulseKey?: number | string;
  spinGlow?: boolean;
  intensity?: number;
  /** Stable id prefix for the SVG defs (must match on server and client). */
  uid?: string;
}) {
  const reduce = useReducedMotion();
  const id = (s: string) => `${s}-${uid}`;

  return (
    <svg viewBox="0 0 400 400" className={`island overflow-visible ${className}`} aria-hidden>
      <defs>
        <linearGradient id={id("body")} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" style={{ stopColor: "var(--surface-3)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--surface-2)" }} />
          <stop offset="1" style={{ stopColor: "var(--obsidian)" }} />
        </linearGradient>
        <linearGradient id={id("edge")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" style={{ stopColor: "var(--fg)", stopOpacity: 0.6 }} />
          <stop offset="0.5" style={{ stopColor: "var(--fg)", stopOpacity: 0.08 }} />
          <stop offset="1" style={{ stopColor: "var(--fg)", stopOpacity: 0.22 }} />
        </linearGradient>
        <radialGradient id={id("core")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--glow)", stopOpacity: 1 }} />
          <stop offset="0.45" style={{ stopColor: "var(--glow)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--glow)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={id("spec")} x1="0" y1="0" x2="0.7" y2="0.7">
          <stop offset="0" style={{ stopColor: "var(--fg)", stopOpacity: 0.32 }} />
          <stop offset="1" style={{ stopColor: "var(--fg)", stopOpacity: 0 }} />
        </linearGradient>
        <clipPath id={id("clip")} clipPathUnits="userSpaceOnUse">
          <path d={roundedHexPath(C, C, R, R * 0.16)} />
        </clipPath>
        <filter id={id("blur")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={id("soft")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* accent halo behind the glass */}
      <path
        d={roundedHexPath(C, C, R * 0.92, R * 0.2)}
        style={{ fill: "var(--glow)", opacity: 0.32 * intensity }}
        filter={`url(#${id("blur")})`}
        data-snap
      />

      {/* faceted body: six shards (the intro flies these in) */}
      <g>
        {FACETS.map((o, i) => (
          <path
            key={i}
            data-shard={i}
            d={wedgePath(C, C, R, i)}
            fill={`url(#${id("body")})`}
            clipPath={`url(#${id("clip")})`}
            style={{ opacity: o, transformBox: "view-box", transformOrigin: "200px 200px" }}
          />
        ))}
      </g>

      {/* facet seams */}
      <g style={{ stroke: "var(--fg)", strokeOpacity: 0.07 }} strokeWidth="1" data-shard-fx>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = ((-90 + 60 * i) * Math.PI) / 180;
          return <line key={i} x1={C} y1={C} x2={C + R * 0.97 * Math.cos(a)} y2={C + R * 0.97 * Math.sin(a)} />;
        })}
      </g>

      {/* bevel */}
      <path
        d={roundedHexPath(C, C, R - 6, (R - 6) * 0.16)}
        fill="none"
        stroke={`url(#${id("edge")})`}
        strokeWidth="1.5"
        data-shard-fx
      />
      <path d={roundedHexPath(C, C, R, R * 0.16)} fill="none" style={{ stroke: "var(--fg)", strokeOpacity: 0.12 }} strokeWidth="1" data-shard-fx />

      {/* core glow */}
      <motion.g
        key={pulseKey}
        style={{ transformBox: "view-box", transformOrigin: "200px 200px" }}
        initial={reduce || pulseKey === undefined ? false : { scale: 1.35, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        data-shard-fx
      >
        <circle cx={C} cy={C} r={92 * intensity} fill={`url(#${id("core")})`} filter={`url(#${id("soft")})`} data-snap />
      </motion.g>

      {/* inner hexagon */}
      <path
        d={roundedHexPath(C, C, 74, 14)}
        style={{ fill: "var(--obsidian)", fillOpacity: 0.35, stroke: "var(--fg)", strokeOpacity: 0.18 }}
        strokeWidth="1"
        data-shard-fx
      />
      <g
        style={
          spinGlow && !reduce
            ? { transformBox: "view-box", transformOrigin: "200px 200px", animation: "spin-slow 18s linear infinite" }
            : undefined
        }
        data-shard-fx
      >
        <path
          d={roundedHexPath(C, C, 34, 7)}
          fill="none"
          style={{ stroke: "var(--glow)" }}
          strokeWidth="5"
          data-snap
        />
      </g>

      {/* specular highlight */}
      <path
        d={`M${C - R * 0.86},${C - R * 0.36} L${C},${C - R * 0.98} L${C + R * 0.2},${C - R * 0.86} L${C - R * 0.7},${C - R * 0.2} Z`}
        fill={`url(#${id("spec")})`}
        clipPath={`url(#${id("clip")})`}
        data-shard-fx
      />
    </svg>
  );
}
