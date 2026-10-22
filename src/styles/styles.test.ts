import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const files = ["global.css", "components/interactive.css", "components/guide.css", "components/demo-dialog.css", "components/katex.css"];

// "a, b::-webkit-scrollbar { display: none }" hides the whole element a.
describe("scrollbar rules", () => {
  it.each(files)("%s applies ::-webkit-scrollbar to every selector of the list", (file) => {
    const css = readFileSync(`src/styles/${file}`, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const [, selectors] of css.matchAll(/([^{}]+)\{/g)) {
      const list = selectors!.split(",").map((s) => s.trim());
      if (list.some((s) => s.includes("::-webkit-scrollbar"))) {
        expect(list.filter((s) => !s.includes("::-webkit-scrollbar")), selectors).toEqual([]);
      }
    }
  });
});
