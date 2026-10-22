// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { unified } from "@astrojs/markdown-remark";
import { defaultLocale, locales } from "./src/i18n/locales.ts";
import { notationFor } from "./src/i18n/index.ts";
import { katexOptions } from "./src/lib/katex.ts";
import { remarkLocalizedMath } from "./src/lib/remark-localized-math.ts";

const notations = Object.fromEntries(locales.map((lang) => [lang, notationFor(lang)]));

export default defineConfig({
  site: "https://danielceban.com",
  output: "static",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: true,
      // The root page picks the stored language on the client.
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, [remarkLocalizedMath, { notations }]],
      rehypePlugins: [[rehypeKatex, katexOptions]],
    }),
  },
  integrations: [svelte(), mdx()],
});
