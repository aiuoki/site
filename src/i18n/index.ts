import ca from "./ui/ca.json";
import de from "./ui/de.json";
import en from "./ui/en.json";
import es from "./ui/es.json";
import fr from "./ui/fr.json";
import it from "./ui/it.json";
import pt from "./ui/pt.json";
import ro from "./ui/ro.json";
import ru from "./ui/ru.json";
import { defaultLocale, isLocale, type Locale } from "./locales";
import type { Notation } from "../lib/notation";
import { interpolate, type Vars } from "../lib/text";

export * from "./locales";
export { interpolate } from "../lib/text";

export type UiDict = typeof es;

type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type UiKey = Leaves<UiDict>;

export const dictionaries: Record<Locale, unknown> = { es, ca, en, fr, de, it, pt, ro, ru };

export function lookup(dict: unknown, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

export function t(lang: Locale, key: UiKey, vars?: Vars): string {
  const text = lookup(dictionaries[lang], key) ?? lookup(dictionaries[defaultLocale], key) ?? key;
  return interpolate(text, vars);
}

export function useTranslations(lang: Locale) {
  return (key: UiKey, vars?: Vars) => t(lang, key, vars);
}

// Content that is not translated yet: Catalan reads Spanish, the rest English.
const contentFallbacks: Partial<Record<Locale, Locale[]>> = { ca: ["es", "en"] };
const defaultContentFallback: Locale[] = ["en", "es"];

export function contentLocale(
  lang: Locale,
  available: readonly Locale[],
): { locale: Locale; fallback: boolean } {
  if (available.includes(lang)) return { locale: lang, fallback: false };
  const chain = contentFallbacks[lang] ?? defaultContentFallback;
  const locale = chain.find((l) => available.includes(l)) ?? available[0] ?? defaultLocale;
  return { locale, fallback: true };
}

export function notationFor(lang: Locale): Notation {
  return (dictionaries[lang] as UiDict).notation;
}

// Astro.currentLocale is a plain string; narrow it for components.
export function pageLocale(current: string | undefined): Locale {
  return isLocale(current) ? current : defaultLocale;
}
