// Helpers to write matrices in LaTeX inside the demonstrations of the rank,
// inverse and systems topics. Kept outside topics/: the registry reads the
// `demos` export of every file there.
export type Cell = string | number;

const row = (r: Cell[]) => r.join(" & ");

// (a b; c d) as \begin{pmatrix}.
export const pm = (m: Cell[][]): string => `\\begin{pmatrix} ${m.map(row).join(" \\\\ ")} \\end{pmatrix}`;

// Column vector.
export const vm = (v: Cell[]): string => pm(v.map((x) => [x]));

// [ left | right ]: `cols` columns on the left of the bar.
export const aug = (cols: number, m: Cell[][]): string => {
  const n = m[0]!.length;
  const spec = "c".repeat(cols) + "|" + "c".repeat(n - cols);
  return `\\left(\\begin{array}{${spec}} ${m.map(row).join(" \\\\ ")} \\end{array}\\right)`;
};
