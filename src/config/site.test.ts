import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { subjects } from "./site";

// Topics whose notes are still being migrated. Empty this set when done.
const pending = new Set<string>();

describe("site registry", () => {
  const topics = subjects.flatMap((s) => s.topics.map((t) => ({ subject: s.slug, ...t })));

  it.each(topics.filter((t) => !pending.has(t.slug)))("$subject/$slug has notes for every declared locale", (topic) => {
    for (const lang of topic.locales) {
      const file = `src/content/${topic.subject}/${topic.slug}/${lang}.mdx`;
      expect(existsSync(file), file).toBe(true);
    }
  });

  it("available subjects have topics and soon subjects have none", () => {
    for (const s of subjects) expect(s.topics.length > 0, s.slug).toBe(s.status === "available");
  });
});
