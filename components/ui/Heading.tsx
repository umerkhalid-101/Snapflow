import type { ReactNode } from "react";
import { Words } from "./Words";

/** Section head: a glowing chip, a thin chrome title with a dimmer second line, a quiet sub. */
export function Heading({
  chip,
  line1,
  line2,
  sub,
  align = "left",
  className = "",
  aside,
}: {
  chip: string;
  line1: string;
  line2?: string;
  sub?: string;
  align?: "left" | "center";
  className?: string;
  aside?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div className={`flex flex-col ${center ? "mx-auto items-center text-center" : "items-start"}`}>
        <span className="chip" data-reveal>
          {chip}
        </span>
        <h2 className="h2 mt-6 max-w-[860px] text-balance" data-words>
          <Words text={line1} className="chrome-text" />
          {line2 && (
            <>
              <br />
              <Words text={line2} className="text-fg-3" />
            </>
          )}
        </h2>
        {sub && (
          <p className={`mt-6 max-w-[560px] text-[16px] leading-[1.65] text-fg-2 md:text-[17px] ${center ? "mx-auto" : ""}`} data-reveal>
            {sub}
          </p>
        )}
      </div>
      {aside}
    </div>
  );
}
