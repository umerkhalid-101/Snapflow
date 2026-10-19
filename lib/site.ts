export const ROOT = "https://www.snapflow.design/";
/** Live page in the visitor's language: EN lives under /en/, ES at the root. */
export const live = (base: string, path: string) => `${ROOT}${base}${path}`;
export const LOGIN = "https://app.snapflow.design/";
export const WHATSAPP = "https://wa.me/56966852551";
export const EMAIL = "carlos@snapflowlabs.com";
export const PORTFOLIO = "https://umerkhalid.co";
export const ONBOARD = "npx @snapflow-labs/onboard";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (id === "join") {
    setTimeout(() => (el.querySelector("input") as HTMLInputElement | null)?.focus({ preventScroll: true }), 900);
  }
}
