// No imports here: astro.config.mjs and inline scripts read this file.
export const locales = ["es", "ca", "en", "fr", "de", "it", "pt", "ro", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";
export const langStorageKey = "trig-lang";

export const localeMeta: Record<Locale, { name: string; code: string; bcp47: string }> = {
  es: { name: "Español", code: "ES", bcp47: "es-ES" },
  ca: { name: "Català", code: "CA", bcp47: "ca-ES" },
  en: { name: "English", code: "EN", bcp47: "en-GB" },
  fr: { name: "Français", code: "FR", bcp47: "fr-FR" },
  de: { name: "Deutsch", code: "DE", bcp47: "de-DE" },
  it: { name: "Italiano", code: "IT", bcp47: "it-IT" },
  pt: { name: "Português", code: "PT", bcp47: "pt-PT" },
  ro: { name: "Română", code: "RO", bcp47: "ro-RO" },
  ru: { name: "Русский", code: "RU", bcp47: "ru-RU" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
