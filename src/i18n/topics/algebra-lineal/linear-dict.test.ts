import { describe, expect, it } from "vitest";
import { linearDict, linearFile, linearFolders } from "./index";

describe("linear algebra dictionaries", () => {
  it.each(linearFolders)("%s has the same keys in Spanish and English, none empty", (folder) => {
    const es = linearFile(folder, "es");
    const en = linearFile(folder, "en");
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
    for (const [key, value] of [...Object.entries(es), ...Object.entries(en)]) expect(value, `${folder}.${key}`).toBeTruthy();
  });

  it("merges the common keys with the topic ones and falls back to English", () => {
    expect(linearDict("anything", "es").addRow).toBe("Añadir fila");
    expect(linearDict("anything", "de").addRow).toBe("Add row");
  });
});
