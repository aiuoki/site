import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Mascot from "./Mascot.astro";
import { MASCOT_POSES } from "./poses";

const container = await AstroContainer.create();
const render = (props: Record<string, unknown> = {}) => container.renderToString(Mascot, { props });

describe("Mascot", () => {
  it("draws every layer of the octopus", async () => {
    const html = await render();
    for (const layer of ["m-ground", "m-arms", "m-body", "m-badge", "m-face", "m-eyes", "m-mouth"]) {
      expect(html, layer).toContain(layer);
    }
    expect(html.match(/class="m-arm /g)).toHaveLength(5);
  });

  it.each(MASCOT_POSES)("supports the %s pose", async (pose) => {
    expect(await render({ pose })).toContain(`data-pose="${pose}"`);
  });

  it("is decorative unless it gets a label", async () => {
    expect(await render()).toContain('aria-hidden="true"');
    const labelled = await render({ label: "Pulpi" });
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain('aria-label="Pulpi"');
  });

  it("uses theme variables only, never hex colors", async () => {
    const html = await render();
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(html).toContain("var(--mascot-light)");
  });

  it("gives each mascot of a page its own gradient ids", async () => {
    const locals = {};
    const first = await container.renderToString(Mascot, { locals });
    const second = await container.renderToString(Mascot, { locals });
    expect(first).toContain('id="mascot-1-body"');
    expect(second).toContain('id="mascot-2-body"');
  });

  it("applies the requested size", async () => {
    expect(await render({ size: "6rem" })).toContain("--mascot-size: 6rem");
  });
});
