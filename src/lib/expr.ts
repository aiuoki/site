// Safe arithmetic for user input: numbers, π, √, + − * / and parentheses.
// Products can be implicit: "2π/3", "3(π/6)", "2√3". Never uses eval.

export interface Parsed {
  val: number;
  hasPi: boolean;
}

const NUMBER = /^(\d+\.?\d*|\.\d+)$/;

// `text` must already be normalised: lower case, "." decimals, "-" minus,
// "π" and "√" symbols, no unit suffixes.
export function evaluate(input: string): Parsed | null {
  // "3 4" is two numbers, not 34.
  if (/[\d.]\s+[\d.]/.test(input)) return null;
  const text = input.replace(/\s+/g, "");
  const tokens = text.match(/\d+\.?\d*|\.\d+|[π√+\-*/()]|./g);
  if (!tokens || tokens.some((t) => !NUMBER.test(t) && !"π√+-*/()".includes(t))) return null;

  let i = 0;
  const peek = () => tokens[i];
  const expr = (): number => {
    let v = term();
    while (peek() === "+" || peek() === "-") v = tokens[i++] === "+" ? v + term() : v - term();
    return v;
  };
  const term = (): number => {
    let v = unary();
    for (;;) {
      const t = peek();
      if (t === "*" || t === "/") {
        i++;
        v = t === "*" ? v * unary() : v / unary();
      } else if (t === "π" || t === "(" || t === "√") {
        v *= unary();
      } else return v;
    }
  };
  const unary = (): number => {
    if (peek() === "-") return i++, -unary();
    if (peek() === "+") return i++, unary();
    if (peek() === "√") return i++, Math.sqrt(primary());
    return primary();
  };
  const primary = (): number => {
    const t = tokens[i++];
    if (t === "π") return Math.PI;
    if (t === "(") {
      const v = expr();
      if (tokens[i++] !== ")") throw new Error("unbalanced");
      return v;
    }
    if (t !== undefined && NUMBER.test(t)) return Number(t);
    throw new Error("unexpected token");
  };

  try {
    const val = expr();
    // Anything beyond 1e9 is a typo, and would overflow later conversions.
    if (i !== tokens.length || !Number.isFinite(val) || Math.abs(val) > 1e9) return null;
    return { val, hasPi: text.includes("π") };
  } catch {
    return null;
  }
}
