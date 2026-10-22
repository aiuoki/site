import { isLocale, type Locale } from "../i18n/locales";

export const homePath = (lang: Locale) => `/${lang}/`;
export const subjectPath = (lang: Locale, subject: string) => `/${lang}/${subject}/`;
export const topicPath = (lang: Locale, subject: string, topic: string) =>
  `/${lang}/${subject}/${topic}/`;

export function switchLocale(pathname: string, lang: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  return `/${[lang, ...segments].join("/")}/`;
}

// Anchors of the old single-page site (danielceban.com/#complejos) and the
// path they live at now, without the language prefix.
export const LEGACY_HASHES: Readonly<Record<string, string>> = {
  trig: "calculo/trigonometria",
  suma: "calculo/suma-angulos",
  complejos: "calculo/complejos",
  estadistica: "estadistica",
  algebra: "algebra-lineal",
};
