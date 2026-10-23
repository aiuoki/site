import { describe, expect, it } from "vitest";
import { jsonLd, metaDescription, sitemapExcludes, topicGraph, websiteGraph } from "./seo";

const site = { url: "https://danielceban.com", name: "danielceban.com", author: "Daniel Ceban" };

describe("websiteGraph", () => {
  const graph = websiteGraph(site);

  it("describes the author as a Person and the site as a WebSite", () => {
    const types = graph["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["Person", "WebSite"]);
    expect(graph["@graph"][0]).toMatchObject({ name: "Daniel Ceban", url: "https://danielceban.com/" });
  });

  it("names the website after the author, the same in every language", () => {
    expect(graph["@graph"][1]).toMatchObject({
      name: "Daniel Ceban",
      alternateName: "danielceban.com",
      author: { "@id": "https://danielceban.com/#person" },
    });
  });
});

describe("topicGraph", () => {
  it("describes a topic page as a learning resource by the author", () => {
    const node = topicGraph(site, { title: "Números complejos", description: "d", url: "https://danielceban.com/es/calculo/complejos/", bcp47: "es-ES" });
    expect(node).toMatchObject({
      "@type": "LearningResource",
      name: "Números complejos",
      inLanguage: "es-ES",
      author: { "@type": "Person", name: "Daniel Ceban" },
      isPartOf: { "@type": "WebSite", name: "Daniel Ceban" },
    });
  });
});

describe("jsonLd", () => {
  it("escapes '<' so the JSON can never close the script tag", () => {
    expect(jsonLd({ name: "</script><b>" })).not.toContain("</script>");
    expect(JSON.parse(jsonLd({ name: "</script>" }))).toEqual({ name: "</script>" });
  });
});

describe("sitemapExcludes", () => {
  const excluded = sitemapExcludes(site.url);

  it("leaves out the root redirect and the subject redirects", () => {
    expect(excluded.has("https://danielceban.com/")).toBe(true);
    expect(excluded.has("https://danielceban.com/es/calculo/")).toBe(true);
  });

  it("leaves out pages that show another language's notes", () => {
    expect(excluded.has("https://danielceban.com/de/calculo/complejos/")).toBe(true);
    expect(excluded.has("https://danielceban.com/ca/calculo/complejos/")).toBe(true);
  });

  it("leaves out the coming-soon placeholders", () => {
    expect(excluded.has("https://danielceban.com/es/estadistica/")).toBe(true);
  });

  it("keeps real pages", () => {
    expect(excluded.has("https://danielceban.com/en/calculo/complejos/")).toBe(false);
    expect(excluded.has("https://danielceban.com/de/calculo/trigonometria/")).toBe(false);
    expect(excluded.has("https://danielceban.com/es/")).toBe(false);
  });
});

describe("metaDescription", () => {
  it("keeps short texts", () => {
    expect(metaDescription("Short.")).toBe("Short.");
  });

  it("cuts long texts at the last full sentence that fits", () => {
    const text = `${"a".repeat(100)}. ${"b".repeat(100)}.`;
    expect(metaDescription(text)).toBe(`${"a".repeat(100)}.`);
  });

  it("otherwise cuts at a word and adds an ellipsis", () => {
    const out = metaDescription("word ".repeat(60));
    expect(out.length).toBeLessThanOrEqual(159);
    expect(out.endsWith("…")).toBe(true);
  });
});
