import { describe, expect, it } from "vitest";
import { aliases, themes } from "./theme";

describe("themes", () => {
  it("define the same tokens in dark and light", () => {
    expect(Object.keys(themes.light).sort()).toEqual(Object.keys(themes.dark).sort());
  });

  it("only use valid hex colors", () => {
    for (const palette of Object.values(themes)) {
      for (const [token, value] of Object.entries(palette)) expect(value, token).toMatch(/^#([0-9a-f]{6}|[0-9a-f]{8})$/i);
    }
  });

  it("aliases point to existing tokens", () => {
    for (const token of Object.values(aliases)) expect(themes.dark).toHaveProperty(token);
  });
});
