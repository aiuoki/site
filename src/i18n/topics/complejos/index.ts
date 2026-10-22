import en from "./en.json";
import es from "./es.json";

// Complex numbers are written only in Spanish and English; other pages use
// contentLocale() to pick one of these.
export const complexLocales = ["es", "en"] as const;
export type ComplexLocale = (typeof complexLocales)[number];
export type ComplexDict = typeof es;

const dicts: Record<ComplexLocale, ComplexDict> = { es, en };

export const isComplexLocale = (lang: string): lang is ComplexLocale => lang === "es" || lang === "en";

export function complexDict(lang: string): ComplexDict {
  return dicts[isComplexLocale(lang) ? lang : "en"];
}
