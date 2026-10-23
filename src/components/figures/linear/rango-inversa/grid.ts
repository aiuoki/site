// Layout of a matrix drawn as a grid of numbers in an SVG figure. An optional
// divider (the bar of [A | I]) leaves a small gap before one column.

export interface GridLayout {
  cw: number;
  ch: number;
  gap: number;
  divider?: number;
}

export const layout = (o: Partial<GridLayout> = {}): GridLayout => ({ cw: 34, ch: 26, gap: 12, ...o });

export const gridWidth = (cols: number, l: GridLayout) => cols * l.cw + (l.divider === undefined ? 0 : l.gap);
export const gridHeight = (rows: number, l: GridLayout) => rows * l.ch;

// Left edge of column j and top edge of row i, relative to the grid origin.
export const colX = (j: number, l: GridLayout) => j * l.cw + (l.divider !== undefined && j >= l.divider ? l.gap : 0);
export const rowY = (i: number, l: GridLayout) => i * l.ch;

// Highlight keys: "r2" (row), "c0" (column) or "1,2" (one cell); the most
// specific one wins.
export function pick<T>(map: Record<string, T> | undefined, i: number, j: number): T | undefined {
  return map?.[`${i},${j}`] ?? map?.[`r${i}`] ?? map?.[`c${j}`];
}
