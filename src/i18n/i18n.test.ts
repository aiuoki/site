import { describe, expect, it } from "vitest";
import { contentLocale, dictionaries, interpolate, lookup, t } from "./index";
import { locales } from "./locales";

function keysOf(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keysOf(v, prefix ? `${prefix}.${k}` : k));
}

describe("lookup", () => {
  it("reads nested keys with dot notation", () => {
    expect(lookup({ a: { b: "x" } }, "a.b")).toBe("x");
  });

  it("returns undefined for missing keys or non-string leaves", () => {
    expect(lookup({ a: { b: "x" } }, "a.c")).toBeUndefined();
    expect(lookup({ a: { b: "x" } }, "a")).toBeUndefined();
  });
});

describe("interpolate", () => {
  it("replaces {placeholders} and keeps unknown ones", () => {
    expect(interpolate("Hola {s}, {n}", { s: "Ana" })).toBe("Hola Ana, {n}");
  });
});

describe("t", () => {
  it("translates and interpolates", () => {
    expect(t("es", "subjects.calculo")).toBe("Cálculo");
    expect(t("en", "nav.soonText", { s: "Statistics" })).toContain("Statistics");
  });
});

describe("contentLocale", () => {
  it("uses the requested locale when the content exists", () => {
    expect(contentLocale("fr", ["es", "en", "fr"])).toEqual({ locale: "fr", fallback: false });
  });

  it("falls back to Spanish for Catalan", () => {
    expect(contentLocale("ca", ["es", "en"])).toEqual({ locale: "es", fallback: true });
  });

  it("falls back to English for the other locales", () => {
    expect(contentLocale("de", ["es", "en"])).toEqual({ locale: "en", fallback: true });
  });
});

describe("ui dictionaries", () => {
  const reference = keysOf(dictionaries.es).sort();

  it.each(locales)("%s has exactly the same keys as es", (lang) => {
    expect(keysOf(dictionaries[lang]).sort()).toEqual(reference);
  });

  it.each(locales)("%s has no empty texts", (lang) => {
    for (const key of reference) expect(lookup(dictionaries[lang], key), `${lang}:${key}`).toBeTruthy();
  });
});
