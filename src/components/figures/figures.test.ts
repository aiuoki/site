import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { SSRManifest } from "astro";
import { beforeAll, describe, expect, it } from "vitest";
import { defaultLocale, locales } from "../../i18n";
import { figures, type FigureId } from "./index";

const ids = Object.keys(figures) as FigureId[];
// Ported from the legacy site, whose wide figures are known. Linear algebra
// figures (la-*) are new and choose their own width.
const legacyIds = ids.filter((id) => !id.startsWith("la-"));
const wideIds: FigureId[] = ["dist", "notables", "cx-exp", "cx-log"];

// The container only knows the page language through the manifest.
const i18nManifest = {
  i18n: { strategy: "pathname-prefix-always", defaultLocale, locales: [...locales] },
} as unknown as SSRManifest;

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create({ manifest: i18nManifest });
});

const render = (id: FigureId, url = "http://localhost/es/calculo") =>
  container.renderToString(figures[id], { request: new Request(url), routeType: "page" });

describe("figures", () => {
  it("registers the 21 trigonometry and 22 complex-number figures", () => {
    expect(legacyIds).toHaveLength(43);
    expect(ids.filter((id) => id.startsWith("cx-"))).toHaveLength(22);
  });

  it.each(ids)("renders %s as a clean SVG", async (id) => {
    const html = await render(id);
    expect(html).toContain("<svg");
    expect(html).toContain("mfig");
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("NaN");
    expect(html).not.toContain("undefined");
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(html).not.toContain("--c-");
  });

  it.each(legacyIds)("%s has the wide class only when legacy did", async (id) => {
    const html = await render(id);
    expect(/class="mfig wide"/.test(html)).toBe(wideIds.includes(id));
  });

  it("localizes the notation by page language", async () => {
    expect(await render("pyth")).toContain("sen θ");
    expect(await render("pyth", "http://localhost/en/calculus")).toContain("sin θ");
  });

  it("localizes the notation inside complex-number labels", async () => {
    expect(await render("cx-polar")).toContain("sen θ");
    expect(await render("cx-polar", "http://localhost/en/calculus")).toContain("sin θ");
    expect(await render("cx-polar", "http://localhost/en/calculus")).not.toContain("sen θ");
  });

  it("formats the principal argument with the locale decimal separator", async () => {
    expect(await render("cx-quad")).toContain("≈ −0,588");
    expect(await render("cx-quad", "http://localhost/en/calculus")).toContain("≈ −0.588");
  });

  it("renders real superscripts and subscripts", async () => {
    expect(await render("cx-exp")).toContain('baseline-shift="super"');
    expect(await render("cx-phasor-e")).toContain('baseline-shift="sub"');
    expect(await render("cx-prod-e")).not.toMatch(/\^\(|_\(/);
  });

  it("keeps the shared variants distinct", async () => {
    expect(await render("cx-phasor")).toContain("z = 1");
    expect(await render("cx-phasor-e")).toContain("e<tspan");
    expect(await render("cx-roots3")).toContain("120°");
    expect(await render("cx-roots")).toContain("2π/5");
  });

  it("keeps marker ids prefixed", async () => {
    const html = await render("dist");
    expect(html).toContain('id="fig-dist-arrow"');
    expect(html).toContain("url(#fig-dist-arrow)");
  });
});
