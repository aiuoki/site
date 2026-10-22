import { describe, expect, it } from "vitest";
import { homePath, subjectPath, switchLocale, topicPath } from "./paths";

describe("path builders", () => {
  it("builds home, subject and topic paths with a trailing slash", () => {
    expect(homePath("es")).toBe("/es/");
    expect(subjectPath("en", "estadistica")).toBe("/en/estadistica/");
    expect(topicPath("fr", "calculo", "suma-angulos")).toBe("/fr/calculo/suma-angulos/");
  });
});

describe("switchLocale", () => {
  it("replaces the locale segment and keeps the rest of the path", () => {
    expect(switchLocale("/es/calculo/complejos/", "en")).toBe("/en/calculo/complejos/");
    expect(switchLocale("/ru/", "ca")).toBe("/ca/");
  });

  it("adds the locale when the path has none", () => {
    expect(switchLocale("/", "de")).toBe("/de/");
    expect(switchLocale("/calculo/", "it")).toBe("/it/calculo/");
  });

  it("always ends with a slash", () => {
    expect(switchLocale("/es/calculo", "pt")).toBe("/pt/calculo/");
  });
});
