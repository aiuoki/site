import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One entry per topic and language: src/content/<subject>/<topic>/<lang>.mdx
// The entry id is "<subject>/<topic>/<lang>".
const notes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { notes };
