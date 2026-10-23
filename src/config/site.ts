import { locales, type Locale } from "../i18n/locales";

export const site = {
  name: "danielceban.com",
  url: "https://danielceban.com",
  author: "Daniel Ceban",
  email: "hello@danielceban.com",
  donateUrl: "https://buymeacoffee.com/danielceban",
  copyrightYear: 2026,
} as const;

export interface Topic {
  slug: string;
  // Math notation shown next to the tab label (not translated).
  symbol?: string;
  // Locales with written content; the rest use contentLocale() fallback.
  locales: readonly Locale[];
}

export interface Subject {
  slug: string;
  symbol: string;
  status: "available" | "soon";
  // Large symbols shown on the "coming soon" panel.
  soonSymbol?: string;
  topics: readonly Topic[];
}

// Labels live in src/i18n/ui/*.json under subjects.<slug> and topics.<slug>.
export const subjects: readonly Subject[] = [
  {
    slug: "calculo",
    symbol: "∫",
    status: "available",
    topics: [
      { slug: "trigonometria", locales },
      { slug: "suma-angulos", symbol: "α ± β", locales },
      { slug: "complejos", symbol: "ℂ", locales: ["es", "en"] },
    ],
  },
  { slug: "estadistica", symbol: "σ", soonSymbol: "σ  x̄", status: "soon", topics: [] },
  {
    slug: "algebra-lineal",
    symbol: "[A]",
    status: "available",
    topics: [
      { slug: "tipos-matrices", symbol: "Aᵗ", locales: ["es", "en"] },
      { slug: "operaciones-matrices", symbol: "A·B", locales: ["es", "en"] },
      { slug: "rango-inversa", symbol: "A⁻¹", locales: ["es", "en"] },
      { slug: "sistemas-pseudoinversa", symbol: "Ax = b", locales: ["es", "en"] },
    ],
  },
];
