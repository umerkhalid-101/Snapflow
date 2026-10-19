import { siAngular, siReact, siVuedotjs } from "simple-icons";

export type LogoId = "claude" | "claudecode" | "cursor" | "codex" | "antigravity" | "figma" | "react" | "vue" | "angular";

const FRAMEWORK = { react: siReact, vue: siVuedotjs, angular: siAngular } as const;
const NAMES: Record<LogoId, string> = {
  claude: "Claude",
  claudecode: "Claude Code",
  cursor: "Cursor",
  codex: "Codex",
  antigravity: "Antigravity",
  figma: "Figma",
  react: "React",
  vue: "Vue",
  angular: "Angular",
};

/** Official marks (LobeHub icons for AI tools, Simple Icons for frameworks). */
export function Logo({ id, size = 24, className = "", label = false }: { id: LogoId; size?: number; className?: string; label?: boolean }) {
  const a11y = label ? { role: "img", "aria-label": NAMES[id] } : { "aria-hidden": true as const };
  if (id === "react" || id === "vue" || id === "angular") {
    const icon = FRAMEWORK[id];
    const fill = id === "angular" ? "currentColor" : `#${icon.hex}`;
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...a11y}>
        <path d={icon.path} fill={fill} />
      </svg>
    );
  }
  if (id === "cursor") {
    /* Cursor's mark is one color: it follows the text color so it works in both modes. */
    return (
      <span
        className={`inline-block bg-current ${className}`}
        style={{ width: size, height: size, mask: "url(/logos/cursor.svg) center / contain no-repeat", WebkitMask: "url(/logos/cursor.svg) center / contain no-repeat" }}
        {...a11y}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/logos/${id}.svg`} width={size} height={size} alt={label ? NAMES[id] : ""} className={className} />;
}
