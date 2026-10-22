import type { Locale } from "../i18n/locales";

// National flag colors are fixed data, not theme colors, so they live here
// instead of theme.ts. `{id}` is replaced with a unique id per rendered flag.
const vertical = (a: string, b: string, c: string) =>
  `<svg viewBox="0 0 3 2" preserveAspectRatio="none"><rect width="1" height="2" fill="${a}"/><rect x="1" width="1" height="2" fill="${b}"/><rect x="2" width="1" height="2" fill="${c}"/></svg>`;

const horizontal = (a: string, b: string, c: string) =>
  `<svg viewBox="0 0 3 3" preserveAspectRatio="none"><rect width="3" height="1" fill="${a}"/><rect y="1" width="3" height="1" fill="${b}"/><rect y="2" width="3" height="1" fill="${c}"/></svg>`;

const catalanStripes = [1, 3, 5, 7]
  .map((y) => `<rect y="${y}" width="9" height="1" fill="#DA121A"/>`)
  .join("");

export const flags: Record<Locale, string> = {
  es: `<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>`,
  ca: `<svg viewBox="0 0 9 9" preserveAspectRatio="none"><rect width="9" height="9" fill="#FCDD09"/>${catalanStripes}</svg>`,
  en: `<svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice"><clipPath id="{id}"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#{id})" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>`,
  fr: vertical("#0055A4", "#FFFFFF", "#EF4135"),
  de: horizontal("#000000", "#DD0000", "#FFCE00"),
  it: vertical("#009246", "#FFFFFF", "#CE2B37"),
  pt: `<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#FF0000"/><rect width="12" height="20" fill="#006600"/><circle cx="12" cy="10" r="4.2" fill="#FFCC00"/><circle cx="12" cy="10" r="2.6" fill="#FF0000"/><rect x="10.8" y="8.4" width="2.4" height="3" rx=".5" fill="#FFFFFF"/></svg>`,
  ro: vertical("#002B7F", "#FCD116", "#CE1126"),
  ru: horizontal("#FFFFFF", "#0039A6", "#D52B1E"),
};
