// Texts of the linear algebra islands, only in Spanish and English. Each
// topic has its folder (<topic-slug>/{es,en}.json) with flat keys; "common"
// holds the keys shared by every topic (matrix editor and so on).
type Strings = Record<string, string>;

const files = import.meta.glob<Strings>("./*/*.json", { eager: true, import: "default" });

export const linearLocales = ["es", "en"] as const;
export type LinearLocale = (typeof linearLocales)[number];

const pick = (folder: string, lang: LinearLocale): Strings => files[`./${folder}/${lang}.json`] ?? {};

// Common keys plus the topic ones; English when the language is missing.
export function linearDict(topic: string, lang: string): Strings {
  const l: LinearLocale = lang === "es" ? "es" : "en";
  return { ...pick("common", l), ...pick(topic, l) };
}

// Folder names that have dictionaries, for tests.
export const linearFolders = [...new Set(Object.keys(files).map((path) => path.split("/")[1]!))];
export const linearFile = pick;
