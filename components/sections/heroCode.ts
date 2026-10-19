import { useMemo } from "react";

type Tok = { v: string; c: string };
const k = (v: string): Tok => ({ v, c: "text-code-kw" });
const tg = (v: string): Tok => ({ v, c: "text-code-tag" });
const st = (v: string): Tok => ({ v, c: "text-code-str" });
const p = (v: string): Tok => ({ v, c: "text-code-fg" });

/** The generated SignUp.tsx shown next to the composed screen. Built from kit components only. */
export function useBrandCode(): Tok[][] {
  return useMemo(
    () => [
      [k("import"), p(" { Card, Input, Button } "), k("from"), st(' "@acme/ui"'), p(";")],
      [],
      [k("export function"), p(" SignUp() {")],
      [p("  "), k("return"), p(" (")],
      [p("    "), tg("<Card"), p(" title="), st('"Create your account"'), tg(">")],
      [p("      "), tg("<Input"), p(" type="), st('"email"'), tg(" />")],
      [p("      "), tg("<Input"), p(" type="), st('"password"'), tg(" />")],
      [p("      "), tg("<Button"), p(" variant="), st('"primary"'), tg(">")],
      [p("        Create account")],
      [p("      "), tg("</Button>")],
      [p("    "), tg("</Card>")],
      [p("  );")],
      [p("}")],
    ],
    [],
  );
}
