import { describe, expect, it } from "vitest";
import { locales } from "../../i18n/locales";
import { notationFor } from "../../i18n";
import { renderTex } from "../../lib/katex";
import { trigDemoIds, trigDemoText, trigDemos, trigTopicDemos } from "./index";

describe("trig demonstrations", () => {
  it.each(locales)("%s has a text for every demo with one explanation per step", (lang) => {
    for (const id of trigDemoIds) {
      const text = trigDemoText[lang][id];
      expect(text, `${lang}:${id}`).toBeDefined();
      expect(text.title && text.use, `${lang}:${id}`).toBeTruthy();
      expect(text.steps, `${lang}:${id}`).toHaveLength(trigDemos[id].steps.length);
      for (const step of text.steps) expect(step, `${lang}:${id}`).toBeTruthy();
    }
  });

  it.each(locales)("every formula renders with the %s notation", (lang) => {
    const n = notationFor(lang);
    for (const id of trigDemoIds) {
      const { statement, steps } = trigDemos[id];
      for (const tex of [statement, ...steps]) expect(() => renderTex(tex, n), `${id}: ${tex}`).not.toThrow();
    }
  });

  it("every topic demo exists", () => {
    for (const ids of Object.values(trigTopicDemos)) for (const id of ids) expect(trigDemos[id]).toBeDefined();
  });

  it("every demo is reachable from a topic", () => {
    const reachable = new Set(Object.values(trigTopicDemos).flat());
    expect(trigDemoIds.filter((id) => !reachable.has(id))).toEqual([]);
  });
});
