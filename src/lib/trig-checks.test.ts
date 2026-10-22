import { describe, expect, it } from "vitest";
import { circleCheck, sumCheck, type CheckStrings } from "./trig-checks";

const s: CheckStrings = {
  r1: "no csc", r2: "no sec", r3: "no tan/cot", q1: "no tan", q2: "no cot", p2: "no tan sec", p3: "no cot csc",
  noTanA: "no tan a", noTan2A: "no tan 2a", luck: "luck", direct: "direct",
};
const names = { sin: "sin", cos: "cos", tan: "tan", rad: "rad" };

describe("circleCheck", () => {
  it("verifies the Pythagorean identity numerically", () => {
    expect(circleCheck("p1", 60, "en-GB", s)).toBe("0.7500 + 0.2500 = 1.0000");
  });

  it("explains when a ratio does not exist", () => {
    expect(circleCheck("r1", 0, "en-GB", s)).toBe("no csc");
    expect(circleCheck("q1", 90, "en-GB", s)).toBe("no tan");
  });

  it("wraps negative factors in parentheses", () => {
    expect(circleCheck("r2", 120, "en-GB", s)).toBe("−0.5000 · (−2.0000) = 1.0000");
  });
});

describe("sumCheck", () => {
  const st = { a: 45, b: 30, op: 1 as const, unit: "deg" as const };

  it("shows that the sine does not distribute", () => {
    const html = sumCheck("wrong", st, "en-GB", names, s);
    expect(html).toContain("sin 45° + sin 30° = ");
    expect(html).toContain("≠");
    expect(html).not.toContain("luck");
  });

  it("notes the coincidence when both sides match", () => {
    expect(sumCheck("wrong", { ...st, a: 0, b: 0 }, "en-GB", names, s)).toContain("luck");
  });

  it("reports a missing double-angle tangent", () => {
    expect(sumCheck("dbl", { ...st, a: 45 }, "en-GB", names, s)).toContain("no tan 2a");
    expect(sumCheck("dbl", { ...st, a: 90 }, "en-GB", names, s)).toContain("no tan a");
  });
});
