import { describe, expect, it } from "vitest";
import { leftSide, withLeftSide } from "./chain";

const tex = String.raw;

describe("leftSide", () => {
  it("returns what is before the first equals sign", () => {
    expect(leftSide(tex`\overline{\overline{z}} = \overline{a + (-b)i} = a - (-b)i`)).toBe(tex`\overline{\overline{z}}`);
    expect(leftSide(tex`|zw|^2 = (ac - bd)^2`)).toBe("|zw|^2");
  });

  it("ignores equals signs inside braces", () => {
    expect(leftSide(tex`\frac{a=b}{c} = d`)).toBe(tex`\frac{a=b}{c}`);
  });

  it("uses the last chain after an implication", () => {
    expect(leftSide(tex`z = a + bi \;\Rightarrow\; \overline{z} = a - bi`)).toBe(tex`\overline{z}`);
  });

  it("gives up when there is no clear left side", () => {
    expect(leftSide(tex`z + w`)).toBeNull();
    expect(leftSide(tex`a, b = c`)).toBeNull();
    expect(leftSide(tex`x > 0,\ y > 0 \;\Rightarrow\; xy > 0`)).toBeNull();
    expect(leftSide(tex`= x`)).toBeNull();
  });
});

describe("withLeftSide", () => {
  it("adds the left side to steps that continue a chain", () => {
    expect(withLeftSide([tex`\overline{\overline{z}} = \overline{a + (-b)i}`, tex`= a + bi`, tex`= z`])).toEqual([
      tex`\overline{\overline{z}} = \overline{a + (-b)i}`,
      tex`\overline{\overline{z}} = a + bi`,
      tex`\overline{\overline{z}} = z`,
    ]);
  });

  it("starts a new chain at the next step without a leading equals", () => {
    expect(withLeftSide(["a = b", "= c", "d = e", "= f"])).toEqual(["a = b", "a = c", "d = e", "d = f"]);
  });

  it("leaves a continuation alone when the chain has no left side", () => {
    expect(withLeftSide(["z + w", "= 3"])).toEqual(["z + w", "= 3"]);
  });

  it("never changes steps that do not start with an equals sign", () => {
    const steps = ["a = b", "a \\to c"];
    expect(withLeftSide(steps)).toEqual(steps);
  });
});
