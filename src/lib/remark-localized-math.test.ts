import { describe, expect, it } from "vitest";
import { remarkLocalizedMath } from "./remark-localized-math";
import type { Notation } from "./notation";

const es = { sin: "sen" } as Notation;
const tree = () => ({ type: "root", children: [{ type: "paragraph", children: [{ type: "inlineMath", value: String.raw`\Sin x` }] }] });

describe("remarkLocalizedMath", () => {
  it("uses the notation of the file language", () => {
    const t = tree();
    remarkLocalizedMath({ notations: { es } })(t, { path: "/x/src/content/calculo/trig/es.mdx" });
    expect(t.children[0]!.children[0]!.value).toBe(String.raw`\operatorname{sen} x`);
  });

  it("leaves files without a known language untouched", () => {
    const t = tree();
    remarkLocalizedMath({ notations: { es } })(t, { path: "/x/README.md" });
    expect(t.children[0]!.children[0]!.value).toBe(String.raw`\Sin x`);
  });
});
