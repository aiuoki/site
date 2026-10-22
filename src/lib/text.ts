// Text helpers without dictionaries, safe to import from client islands.
export type Vars = Record<string, string | number>;

export function interpolate(text: string, vars: Vars = {}): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}
