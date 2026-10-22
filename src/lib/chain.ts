// Demonstration steps often continue the previous line ("= a + bi"). On
// screen each step stands alone, so a bare "=" looks like something is
// missing. withLeftSide() writes the left side of the chain in front of it.

// Separators after which a new statement starts inside one step.
const SEPARATOR = /\\(?:Rightarrow|Leftrightarrow|quad|qquad)\b|\;|\\to\b/;
// Anything that means "this is not a plain left side".
const NOT_A_SIDE = /[,:<>]|\\(?:ge|le|in|notin|sim|neq|approx)\b/;

// Splits at the top level only (outside braces), so \frac{a=b}{c} stays whole.
function topLevel(tex: string, find: (rest: string) => number): number {
  let depth = 0;
  for (let i = 0; i < tex.length; i++) {
    const ch = tex[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (depth === 0 && find(tex.slice(i)) === 0) return i;
  }
  return -1;
}

// Left side of the (last) equality chain of a step, or null when unclear.
export function leftSide(step: string): string | null {
  // Keep only what follows the last implication / spacing separator.
  let chain = step;
  for (;;) {
    const at = topLevel(chain, (rest) => rest.search(SEPARATOR));
    if (at < 0) break;
    const m = chain.slice(at).match(SEPARATOR)!;
    chain = chain.slice(at + m[0].length);
  }
  chain = chain.trim();
  const eq = topLevel(chain, (rest) => (rest.startsWith("=") ? 0 : -1));
  if (eq <= 0) return null;
  const side = chain.slice(0, eq).trim();
  return side && !NOT_A_SIDE.test(side) ? side : null;
}

export function withLeftSide(steps: readonly string[]): string[] {
  let side: string | null = null;
  return steps.map((step) => {
    if (!step.trimStart().startsWith("=")) {
      side = leftSide(step);
      return step;
    }
    return side ? `${side} ${step.trimStart()}` : step;
  });
}
