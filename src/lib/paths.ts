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
