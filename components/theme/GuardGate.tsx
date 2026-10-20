"use client";

import { useEffect, useState, type ReactNode } from "react";
import { isAllowedHost } from "@/lib/guard";

/**
 * In-browser copy guard. When someone reaches for the source, the whole page
 * unmounts (so there is nothing left to inspect or save) and shows "nice tryy".
 *
 * Catches: devtools shortcuts and an opened devtools panel, View Source, Save Page,
 * Print, copying page text, automated browsers (Puppeteer, Playwright, Selenium),
 * and saved or cloned copies running on another host or from a file.
 * Never blocks: typing in the waitlist field, or the copy-command button.
 *
 * Off in development unless the URL has ?guard=1, so building stays painless.
 */
export function GuardGate({ children }: { children: ReactNode }) {
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    const dev = process.env.NODE_ENV !== "production";
    if (dev && !new URLSearchParams(window.location.search).has("guard")) return;

    const catchIt = () => setCaught(true);
    const isField = (el: EventTarget | null) => {
      const n = el as HTMLElement | null;
      return !!n && (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.isContentEditable);
    };

    /* Running somewhere it shouldn't (a saved file, a cloned deploy) */
    if (window.location.protocol === "file:" || !isAllowedHost(window.location.hostname)) catchIt();

    /* Driven by automation */
    const w = window as unknown as Record<string, unknown>;
    if (
      navigator.webdriver ||
      /HeadlessChrome|Puppeteer|Playwright|PhantomJS/i.test(navigator.userAgent) ||
      w.callPhantom ||
      w._phantom ||
      w.__nightmare ||
      w.domAutomation ||
      document.documentElement.getAttribute("webdriver") !== null
    )
      catchIt();

    /* Shortcuts: devtools, view source, save, print */
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const code = e.code;
      const devtools =
        e.key === "F12" ||
        (mod && e.shiftKey && ["KeyI", "KeyJ", "KeyC", "KeyK"].includes(code)) ||
        (e.metaKey && e.altKey && ["KeyI", "KeyJ", "KeyC", "KeyU"].includes(code));
      const source = mod && !e.shiftKey && ["KeyU", "KeyS", "KeyP"].includes(code);
      if (devtools || source) {
        e.preventDefault();
        catchIt();
      }
    };

    /* Copying page content (fields stay usable) */
    const onCopy = (e: ClipboardEvent) => {
      if (isField(e.target)) return;
      e.preventDefault();
      catchIt();
    };
    const onContext = (e: MouseEvent) => {
      if (!isField(e.target)) e.preventDefault();
    };
    const onDrag = (e: DragEvent) => {
      if (!isField(e.target)) e.preventDefault();
    };

    /*
     * An opened devtools panel shrinks the page while the window stays the same size.
     * Window resizes, zoom changes and embedded views just reset the baseline.
     */
    const skipPanel = matchMedia("(pointer: coarse)").matches || window.top !== window;
    const snap = () => ({
      ow: window.outerWidth,
      oh: window.outerHeight,
      iw: window.innerWidth * (window.devicePixelRatio || 1),
      ih: window.innerHeight * (window.devicePixelRatio || 1),
    });
    let base = snap();
    const checkPanel = () => {
      if (skipPanel || !window.outerWidth) return;
      const now = snap();
      const sameWindow = now.ow === base.ow && now.oh === base.oh;
      const dpr = window.devicePixelRatio || 1;
      if (sameWindow && (base.iw - now.iw > 170 * dpr || base.ih - now.ih > 170 * dpr)) return catchIt();
      if (!sameWindow || now.iw > base.iw || now.ih > base.ih) base = now;
    };
    const timer = window.setInterval(checkPanel, 1000);

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("beforeprint", catchIt);
    window.addEventListener("resize", checkPanel);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCopy, true);
    document.addEventListener("contextmenu", onContext, true);
    document.addEventListener("dragstart", onDrag, true);
    document.documentElement.classList.add("guarded");

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("beforeprint", catchIt);
      window.removeEventListener("resize", checkPanel);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCopy, true);
      document.removeEventListener("contextmenu", onContext, true);
      document.removeEventListener("dragstart", onDrag, true);
      document.documentElement.classList.remove("guarded");
    };
  }, []);

  useEffect(() => {
    if (!caught) return;
    const root = document.documentElement;
    root.classList.add("caught");
    root.setAttribute("data-mode", "light");
    (window as unknown as { __lenis?: { destroy: () => void } }).__lenis?.destroy();
    window.scrollTo(0, 0);
  }, [caught]);

  if (caught) return <NiceTry />;
  return <>{children}</>;
}

function NiceTry() {
  return (
    <main id="nice-tryy" className="fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-5 bg-white text-[#0b1017]">
      <svg width="40" height="40" viewBox="-2 0 38 38" aria-hidden>
        <path
          fill="#0b1017"
          fillRule="evenodd"
          d="M18.6 1.155 31.054 8.345a4 4 0 0 1 2 3.464v14.382a4 4 0 0 1-2 3.464L18.6 36.845a4 4 0 0 1-4 0L2.146 29.655a4 4 0 0 1-2-3.464V11.809a4 4 0 0 1 2-3.464L14.6 1.155a4 4 0 0 1 4 0Zm0 8.6 5.007 2.89a4 4 0 0 1 2 3.464v5.782a4 4 0 0 1-2 3.464l-5.007 2.89a4 4 0 0 1-4 0l-5.007-2.89a4 4 0 0 1-2-3.464v-5.782a4 4 0 0 1 2-3.464l5.007-2.89a4 4 0 0 1 4 0Z"
        />
      </svg>
      <h1 className="text-[56px] font-extralight tracking-[-0.035em]">nice tryy</h1>
      <p className="text-[13px] text-[#8592a6]">Redesign concept by Umar Khalid</p>
    </main>
  );
}
