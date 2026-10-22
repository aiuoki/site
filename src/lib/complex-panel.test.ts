import { describe, expect, it } from "vitest";
import { cx } from "./complex";
import { complexCheck } from "./complex-checks";
import { fieldText, forms, readout, resultBlocks, resultPoints, type PanelStrings } from "./complex-panel";

const s = new Proxy({}, { get: (_, key) => `[${String(key)}]` }) as PanelStrings;
const en = "en-GB";

describe("readout", () => {
  it("shows modulus and argument of z", () => {
    const r = readout(cx(1, 1), "rad", en, s);
    expect(r.big).toContain("1 + <i>i</i>");
    expect(r.sub).toContain("√2");
    expect(r.sub).toContain("= π/4");
  });

  it("explains that 0 has no argument", () => {
    expect(readout(cx(0, 0), "rad", en, s).sub).toContain("[undefArg]");
  });
});

describe("forms", () => {
  it("lists the nine forms of z", () => {
    const rows = forms(cx(1, -1), "rad", en, { sin: "sin", cos: "cos" }, s);
    expect(rows).toHaveLength(9);
    expect(rows[5]!.value).toBe("√2<sub>−π/4</sub>");
    expect(rows[8]!.value).toBe("1 + <i>i</i>");
  });

  it("corrects arctan in the second quadrant", () => {
    const rows = forms(cx(-1.5, 1), "rad", en, { sin: "sin", cos: "cos" }, s);
    expect(rows[4]!.value).toBe("arctan(−2/3) + π");
  });
});

describe("resultBlocks", () => {
  const base = { z: cx(1, 1), w: cx(1, -1), n: 3, unit: "rad" as const };

  it("multiplies in binomial and polar form", () => {
    const blocks = resultBlocks({ ...base, op: "prod" }, en, s);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]!.kind === "fx" && blocks[0]!.r).toContain(">2<");
  });

  it("refuses to divide by zero", () => {
    expect(resultBlocks({ ...base, w: cx(0, 0), op: "quot" }, en, s)).toEqual([{ kind: "note", text: "[noDiv]", warn: true }]);
  });

  it("lists every root", () => {
    const [block] = resultBlocks({ ...base, z: cx(8, 0), op: "root" }, en, s);
    expect(block?.kind === "fx" && block.extra?.match(/k = /g)).toHaveLength(3);
  });

  it("notes when an angle is reduced to (−π, π]", () => {
    const [block] = resultBlocks({ ...base, z: cx(-1, 1), op: "pow", n: 2 }, en, s);
    expect(block?.kind === "fx" && block.r).toContain("[reduce]");
  });
});

describe("fieldText", () => {
  it("writes exact values for the inputs", () => {
    expect(fieldText(cx(0.5, Math.sqrt(3) / 2), 1, "bin", "rad", en)).toBe("√3/2");
    expect(fieldText(cx(-1, -1), 1, "pol", "rad", en)).toBe("-3π/4");
    expect(fieldText(cx(0, 2), 1, "pol", "deg", en)).toBe("90");
  });
});

describe("complexCheck", () => {
  const st = { z: cx(3, 4), w: cx(1, 0), n: 2, unit: "rad" as const };

  it("checks the triangle inequality", () => {
    expect(complexCheck("cx-tri", st, en, { noDiv: "x", undefArg: "y" })).toContain("|z + w| = 5.657 ≤ 5 + 1 = 6");
  });

  it("has no logarithm of 0", () => {
    expect(complexCheck("cx-log", { ...st, z: cx(0, 0) }, en, { noDiv: "x", undefArg: "y" })).toBe("log 0 ∄");
  });
});

describe("resultPoints", () => {
  it("returns the drawn result of each operation", () => {
    const base = { z: cx(5, 0), w: cx(5, 0), n: 3 };
    expect(resultPoints({ ...base, op: "sum" })).toEqual([{ re: 10, im: 0 }]);
    expect(resultPoints({ ...base, op: "root" })).toHaveLength(3);
    expect(resultPoints({ ...base, w: cx(0, 0), op: "quot" })).toEqual([]);
    expect(resultPoints({ ...base, op: "none" })).toEqual([]);
  });
});
