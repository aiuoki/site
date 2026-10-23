// Shared by the matrix figures of linear algebra (also used by operaciones-matrices).
// Colors are theme token names without the "--" ("a", "b", "g", "cos"...).
export type Token = string;

export interface MatrixItem {
  data: string[][];
  // Background and text color per cell (null = none).
  fills?: (Token | null)[][];
  inks?: (Token | null)[][];
  // Cells drawn with an outline.
  marks?: [number, number][];
  // A whole row / column outlined and softly filled.
  rowBand?: [number, Token];
  colBand?: [number, Token];
  // Dashed partition lines after these row / column indices (block matrices).
  splitRows?: number[];
  splitCols?: number[];
  label?: string;
  labelInk?: Token;
  // Small muted line under the label.
  note?: string;
}

export interface OpItem {
  op: string;
  ink?: Token;
}

export type Item = MatrixItem | OpItem;
export const isOp = (item: Item): item is OpItem => "op" in item;

// Numbers and fractions as text, with the typographic minus.
export const txt = (x: number | string): string => String(x).replace("-", "−");
export const mat = (rows: (number | string)[][]): string[][] => rows.map((row) => row.map(txt));

// Builds a per-cell array (fills, inks) from a rule.
export const cellsOf = <T,>(data: string[][], rule: (i: number, j: number) => T): T[][] =>
  data.map((row, i) => row.map((_, j) => rule(i, j)));

// Fill by region: diagonal, off-diagonal, upper triangle...
export const diag = (data: string[][], token: Token) => cellsOf(data, (i, j) => (i === j ? token : null));
export const offDiag = (data: string[][], token: Token) => cellsOf(data, (i, j) => (i !== j ? token : null));
export const upper = (data: string[][], token: Token) => cellsOf(data, (i, j) => (j >= i ? token : null));
export const all = (data: string[][], token: Token) => cellsOf(data, () => token);
