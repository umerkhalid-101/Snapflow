import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "glow";

const V: Record<Variant, string> = {
  primary: "bg-fg text-page hover:bg-fg/85 hover:-translate-y-px shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_10px_40px_-10px_color-mix(in_oklab,var(--glow)_45%,transparent)]",
  ghost: "border border-edge-2 bg-tint/[0.03] text-fg hover:border-fg-3 hover:bg-tint/[0.08]",
  glow: "bg-glow text-page hover:brightness-110",
};

export function Pill({
  variant = "primary",
  children,
  className = "",
  size = "md",
  ...rest
}: { variant?: Variant; children: ReactNode; className?: string; size?: "sm" | "md" | "lg" } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const s = size === "sm" ? "h-9 px-4 text-[13px]" : size === "lg" ? "h-12 px-7 text-[15px]" : "h-11 px-5 text-[14px]";
  return (
    <a
      data-magnetic={variant === "primary" && size !== "sm" ? "" : undefined}
      className={`group ${/\bhidden\b/.test(className) ? "" : "inline-flex"} items-center whitespace-nowrap justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-300 active:scale-[0.97] ${V[variant]} ${s} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
