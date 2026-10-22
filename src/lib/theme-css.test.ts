import { describe, expect, it } from "vitest";
import { cssVarName, declarations, themeCss } from "./theme-css";

describe("cssVarName", () => {
  it("prefixes simple tokens", () => {
    expect(cssVarName("bg")).toBe("--bg");
  });

  it("converts camelCase and trailing digits to kebab-case", () => {
    expect(cssVarName("coffeeFg")).toBe("--coffee-fg");
    expect(cssVarName("surface2")).toBe("--surface-2");
  });
});

describe("declarations", () => {
  it("joins every token as a CSS custom property", () => {
    expect(declarations({ bg: "#000", surface2: "#111" })).toBe("--bg:#000;--surface-2:#111;");
  });
});

describe("themeCss", () => {
  const themes = {
    dark: { bg: "#000", a: "#f00" },
    light: { bg: "#fff", a: "#0f0" },
  };
  const css = themeCss(themes, { z: "a" });

  it("uses the dark palette as the default on :root", () => {
    expect(css).toContain(":root{--bg:#000;--a:#f00;--z:var(--a);color-scheme:dark}");
  });

  it("follows prefers-color-scheme when no theme is stored", () => {
    expect(css).toContain(
      '@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){--bg:#fff;--a:#0f0;color-scheme:light}}',
    );
  });

  it("lets an explicit light choice win", () => {
    expect(css).toContain(':root[data-theme="light"]{--bg:#fff;--a:#0f0;color-scheme:light}');
  });
});
