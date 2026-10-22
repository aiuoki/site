import { describe, expect, it } from "vitest";
import { withLeftSide } from "../lib/chain";
import { complexDemos } from "./complex";
import { trigDemos } from "./trig";

const all = { ...trigDemos, ...complexDemos } as Record<string, { steps: readonly string[] }>;

describe("demonstration steps", () => {
  it("never show a bare '=' at the start of a step", () => {
    const bare: string[] = [];
    for (const [id, demo] of Object.entries(all)) {
      withLeftSide(demo.steps).forEach((step, i) => {
        if (step.trimStart().startsWith("=")) bare.push(`${id}#${i + 1}`);
      });
    }
    expect(bare).toEqual([]);
  });
});
