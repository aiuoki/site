// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { defaultLocale, locales } from "./src/i18n/locales.ts";

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
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [svelte(), mdx()],
});
