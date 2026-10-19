import type { Transition } from "motion/react";

export const snap: Transition = { type: "spring", stiffness: 520, damping: 28 };
export const glide: Transition = { type: "spring", stiffness: 160, damping: 24 };
export const STAGGER = 0.04;

export const easeSnap = [0.34, 1.56, 0.64, 1] as const;
export const easeOut = [0.22, 1, 0.36, 1] as const;
