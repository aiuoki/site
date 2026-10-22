// Localized math notation. Formulas are written once in LaTeX with macros
// (\Sin, \Cos, ..., \Hyp, \Rad) and expanded per language at build time.

export interface Notation {
  sin: string;
  cos: string;
  tan: string;
  cot: string;
  sec: string;
  csc: string;
  hyp: string;
  opp: string;
  adj: string;
  rad: string;
}

const FUNCTIONS = ["sin", "cos", "tan", "cot", "sec", "csc"] as const;
const WORDS = ["hyp", "opp", "adj", "rad"] as const;

const capitalize = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const MACRO = new RegExp(`\\\\(${[...FUNCTIONS, ...WORDS].map(capitalize).join("|")})(?![a-zA-Z])`, "g");

export function expandNotation(tex: string, n: Notation): string {
  return tex.replace(MACRO, (_, name: string) => {
    const key = name.toLowerCase() as keyof Notation;
    return (FUNCTIONS as readonly string[]).includes(key)
      ? `\\operatorname{${n[key]}}`
      : `\\text{${n[key]}}`;
  });
}

// Plain-text version used by the legacy texts: "§sin θ" -> "sen θ".
export function expandText(text: string, n: Notation): string {
  return text.replace(/§([a-z]+)/g, (match, name: string) =>
    name in n ? n[name as keyof Notation] : match,
  );
}
