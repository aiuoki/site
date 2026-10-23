import { describe, expect, it } from "vitest";
import { notationFor } from "../../i18n";
import { renderTex } from "../../lib/katex";
import { linearDemoText, linearDemos } from "./index";

const ids = Object.keys(linearDemos);

describe("linear algebra demonstrations", () => {
  it.each(["es", "en"] as const)("%s has a text for every demo with one explanation per step", (lang) => {
    for (const id of ids) {
      const text = linearDemoText(id, lang);
      expect(text, `${lang}:${id}`).toBeTruthy();
      expect(text!.title && text!.use && text!.summary, `${lang}:${id}`).toBeTruthy();
      expect(text!.steps, `${lang}:${id}`).toHaveLength(linearDemos[id]!.steps.length);
    }
  });

  it.each(["es", "en"] as const)("every formula renders in %s", (lang) => {
    for (const id of ids) {
      for (const tex of [linearDemos[id]!.statement, ...linearDemos[id]!.steps]) {
        expect(() => renderTex(tex, notationFor(lang)), `${id}: ${tex}`).not.toThrow();
      }
    }
  });

  it("uses ids prefixed with la-", () => {
    for (const id of ids) expect(id).toMatch(/^la-/);
  });
});
