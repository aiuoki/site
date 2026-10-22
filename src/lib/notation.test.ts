import { describe, expect, it } from "vitest";
import { expandNotation, expandText, type Notation } from "./notation";
import { renderTex } from "./katex";

const es: Notation = {
  sin: "sen", cos: "cos", tan: "tan", cot: "cot", sec: "sec", csc: "csc",
  hyp: "hipotenusa", opp: "cateto opuesto", adj: "cateto contiguo", rad: "rad",
};

describe("expandNotation", () => {
  it("replaces function macros with localized operator names", () => {
    expect(expandNotation(String.raw`\Sin^2\theta + \Cos^2\theta`, es)).toBe(
      String.raw`\operatorname{sen}^2\theta + \operatorname{cos}^2\theta`,
    );
  });

  it("replaces word macros with text", () => {
    expect(expandNotation(String.raw`\dfrac{\Opp}{\Hyp}`, es)).toBe(
      String.raw`\dfrac{\text{cateto opuesto}}{\text{hipotenusa}}`,
    );
  });

  it("does not touch longer commands that share a prefix", () => {
    expect(expandNotation(String.raw`\Sinh x`, es)).toBe(String.raw`\Sinh x`);
  });
});

describe("expandText", () => {
  it("replaces §name markers in plain text", () => {
    expect(expandText("§sin θ = 0: §hyp", es)).toBe("sen θ = 0: hipotenusa");
  });

  it("keeps unknown markers", () => {
    expect(expandText("§foo", es)).toBe("§foo");
  });
});

describe("renderTex", () => {
  it("renders localized formulas to KaTeX HTML", () => {
    const html = renderTex(String.raw`\Sin\theta = y`, es);
    expect(html).toContain("katex");
    expect(html).toContain("sen");
  });

  it("supports highlighted terms", () => {
    expect(renderTex(String.raw`\hl{x}`, es)).toContain('class="enclosing k"');
  });

  it("throws on invalid TeX so the build fails", () => {
    expect(() => renderTex(String.raw`\frac{1`, es)).toThrow();
  });
});
