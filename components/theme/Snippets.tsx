"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Highlighted } from "@/lib/snippets";
import type { Framework } from "@/lib/tokens";

const SnippetsCtx = createContext<Highlighted | null>(null);

export function SnippetsProvider({ value, children }: { value: Highlighted; children: ReactNode }) {
  return <SnippetsCtx.Provider value={value}>{children}</SnippetsCtx.Provider>;
}

/** Pre-rendered (build time, Shiki) snippet for a framework. */
export function useSnippet(fw: Framework) {
  return useContext(SnippetsCtx)?.[fw] ?? "";
}
