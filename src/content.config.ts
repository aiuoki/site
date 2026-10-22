import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One entry per topic and language: src/content/<subject>/<topic>/<lang>.mdx
// The entry id is "<subject>/<topic>/<lang>".
const notes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content" }),
  schema: z.object({
    // Page header: eyebrow, title and intro (intro may contain inline HTML).
    title: z.string(),
    eyebrow: z.string(),
    intro: z.string(),
    // Plain text for the meta description.
    description: z.string(),
  }),
});

export const collections = { notes };
