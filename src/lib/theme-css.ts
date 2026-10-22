type Palette = Readonly<Record<string, string>>;

export function cssVarName(token: string): string {
  const kebab = token.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
  return `--${kebab}`;
}

export function declarations(palette: Palette): string {
  return Object.entries(palette)
    .map(([token, value]) => `${cssVarName(token)}:${value};`)
    .join("");
}

function aliasDeclarations(aliases: Palette): string {
  return Object.entries(aliases)
    .map(([alias, token]) => `${cssVarName(alias)}:var(${cssVarName(token)});`)
    .join("");
}

// Dark is the default; a stored choice in [data-theme] always wins over
// prefers-color-scheme.
export function themeCss(themes: { dark: Palette; light: Palette }, aliases: Palette = {}): string {
  const dark = declarations(themes.dark) + aliasDeclarations(aliases);
  const light = declarations(themes.light);
  return [
    `:root{${dark}color-scheme:dark}`,
    `@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){${light}color-scheme:light}}`,
    `:root[data-theme="light"]{${light}color-scheme:light}`,
  ].join("\n");
}
