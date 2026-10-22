import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { SSRManifest } from "astro";
import { beforeAll, describe, expect, it } from "vitest";
import { defaultLocale, locales } from "../../i18n";
import { figures, type FigureId } from "./index";

const ids = Object.keys(figures) as FigureId[];
const wideIds: FigureId[] = ["dist", "notables"];

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
  it("registers the 21 legacy figures", () => {
    expect(ids).toHaveLength(21);
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

  it.each(ids)("%s has the wide class only when legacy did", async (id) => {
    const html = await render(id);
    expect(/class="mfig wide"/.test(html)).toBe(wideIds.includes(id));
  });

  it("localizes the notation by page language", async () => {
    expect(await render("pyth")).toContain("sen θ");
    expect(await render("pyth", "http://localhost/en/calculus")).toContain("sin θ");
  });

  it("keeps marker ids prefixed", async () => {
    const html = await render("dist");
    expect(html).toContain('id="fig-dist-arrow"');
    expect(html).toContain("url(#fig-dist-arrow)");
  });
});
