"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ONBOARD } from "@/lib/site";

export function CopyChip({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const { locale } = useTheme();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ONBOARD);
    } catch {
      /* clipboard can be blocked */
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${locale === "es" ? "Copiar" : "Copy"}: ${ONBOARD}`}
      className={`inline-flex h-10 items-center gap-3 rounded-full pl-4 pr-1.5 font-mono text-[12.5px] transition-colors ${
        dark ? "bg-tint/10 text-white hover:bg-tint/15" : "bg-panel text-ink-2 hover:bg-panel-2"
      } ${className}`}
    >
      <span className="opacity-60">$</span>
      {ONBOARD}
      <span className={`grid size-7 place-items-center rounded-full ${copied ? "bg-teal text-white" : dark ? "bg-tint/10" : "bg-white"}`}>
        {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
      </span>
    </button>
  );
}
