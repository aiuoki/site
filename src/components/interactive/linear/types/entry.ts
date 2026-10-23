// Names of matrix entries for the readouts: a₁₂, c₂₃...
const SUB = "₀₁₂₃₄₅₆₇₈₉";

export const subscript = (n: number) => String(n).replace(/\d/g, (d) => SUB[Number(d)]!);

// Entry at row i, column j (0-based) written with 1-based subscripts.
export const entryName = (letter: string, i: number, j: number) => `${letter}${subscript(i + 1)}${subscript(j + 1)}`;
