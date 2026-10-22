import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("katex.css", () => {
  it("keeps KaTeX's own font for the slash of negated relations (≠)", () => {
    const css = readFileSync("src/styles/components/katex.css", "utf8");
    expect(css).toMatch(/\.katex \.rlap[\s\S]*?font-family:\s*KaTeX_Main/);
  });
});
