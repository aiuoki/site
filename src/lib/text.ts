// Text helpers without dictionaries, safe to import from client islands.
export type Vars = Record<string, string | number>;

// Accepts a missing dictionary entry (undefined) and returns "" for it; the
// dictionary tests make sure every key used by an island exists.
export function interpolate(text: string | undefined, vars: Vars = {}): string {
  return (text ?? "").replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}
