import { describe, expect, it } from "vitest";
import { notationFor } from "../../i18n";
import { complexDict, complexLocales } from "../../i18n/topics/complejos";
import { renderTex } from "../../lib/katex";
import { complexDemoIds, complexDemoText, complexDemos } from "./index";

function keysOf(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keysOf(v, prefix ? `${prefix}.${k}` : k));
}

describe("complex number demonstrations", () => {
  it("has the 29 demonstrations of the notes", () => {
    expect(complexDemoIds).toHaveLength(29);
  });

  it.each(complexLocales)("%s has a text for every demo with one explanation per step", (lang) => {
    for (const id of complexDemoIds) {
      const text = complexDemoText[lang][id];
      expect(text, `${lang}:${id}`).toBeDefined();
      expect(text.title && text.use && text.summary, `${lang}:${id}`).toBeTruthy();
      expect(text.steps, `${lang}:${id}`).toHaveLength(complexDemos[id].steps.length);
    }
  });

  it.each(complexLocales)("every formula renders in %s", (lang) => {
    const n = notationFor(lang);
    const words = complexDict(lang).words;
    for (const id of complexDemoIds) {
      for (const tex of [complexDemos[id].statement, ...complexDemos[id].steps]) {
        const html = renderTex(tex, n, false, words);
        expect(html, `${id}: ${tex}`).not.toContain("\\W");
      }
    }
  });

  it("Spanish and English dictionaries have the same keys", () => {
    expect(keysOf(complexDict("es")).sort()).toEqual(keysOf(complexDict("en")).sort());
  });
});
