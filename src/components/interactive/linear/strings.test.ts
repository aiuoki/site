import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { linearDict } from "../../../i18n/topics/algebra-lineal";

// Each island folder and the dictionary topic it reads.
const islands: Record<string, { files: string[]; topic: string }> = {
  types: { files: ["TypesLab.svelte"], topic: "tipos-matrices" },
  product: { files: ["ProductLab.svelte"], topic: "operaciones-matrices" },
  rank: { files: ["RankLab.svelte"], topic: "rango-inversa" },
  system: { files: ["SystemLab.svelte"], topic: "sistemas-pseudoinversa" },
};

const dir = "src/components/interactive/linear";
const sources = (folder: string, files: string[]) => {
  const inFolder = readdirSync(join(dir, folder)).filter((f) => f.endsWith(".svelte")).map((f) => join(dir, folder, f));
  const shared = readdirSync(join(dir, "shared")).filter((f) => f.endsWith(".svelte")).map((f) => join(dir, "shared", f));
  return [...files.map((f) => join(dir, f)), ...inFolder, ...shared].filter((p) => statSync(p).isFile());
};

// Literal keys read as s.key or s["key"]; dynamic keys are covered by their own tests.
const usedKeys = (code: string) => [...code.matchAll(/\bs(?:\.(\w+)|\["(\w+)"\])/g)].map((m) => m[1] ?? m[2]!);

describe("linear algebra islands", () => {
  it.each(Object.entries(islands))("%s only reads keys that exist in Spanish and English", (folder, { files, topic }) => {
    const keys = new Set(sources(folder, files).flatMap((p) => usedKeys(readFileSync(p, "utf8"))));
    for (const lang of ["es", "en"]) {
      const dict = linearDict(topic, lang);
      const missing = [...keys].filter((k) => !(k in dict));
      expect(missing, `${folder} (${lang})`).toEqual([]);
    }
  });
});
