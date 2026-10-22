import katex from "katex";
import { expandNotation, type Notation, type Words } from "./notation";

// Shared by the Formula component and the MDX pipeline.
export const katexOptions = {
  macros: { "\\hl": "\\htmlClass{k}{#1}" },
  // Only \htmlClass is trusted, and only for the highlight macro.
  trust: (context: { command: string }) => context.command === "\\htmlClass",
  strict: "ignore" as const,
};

export function renderTex(tex: string, notation: Notation, displayMode = false, words: Words = {}): string {
  return katex.renderToString(expandNotation(tex, notation, words), {
    ...katexOptions,
    // Copy: KaTeX mutates the macros object when it sees \def.
    macros: { ...katexOptions.macros },
    displayMode,
    throwOnError: true,
  });
}
