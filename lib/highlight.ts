import "server-only";
import { createCssVariablesTheme, createHighlighter } from "shiki";
import { BUTTON_SNIPPET, type Highlighted } from "./snippets";
import { FRAMEWORKS } from "./tokens";

const theme = createCssVariablesTheme({ name: "snapflow", variablePrefix: "--shiki-", fontStyle: true });

/** Pre-rendered at build time. Colors resolve from tokens through --shiki-* variables. */
export async function highlightSnippets(): Promise<Highlighted> {
  const hl = await createHighlighter({ themes: [theme], langs: ["tsx", "vue", "angular-ts"] });
  const out = {} as Highlighted;
  for (const fw of FRAMEWORKS) {
    const s = BUTTON_SNIPPET[fw];
    out[fw] = hl.codeToHtml(s.code, { lang: s.lang, theme: "snapflow" });
  }
  hl.dispose();
  return out;
}
