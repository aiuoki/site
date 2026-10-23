import { fromNumbers, type Matrix } from "../../../../lib/matrix";

// Starting matrix of RankLab: invertible, with a negative determinant and a fractional inverse.
export const DEFAULT_MATRIX = (): Matrix => fromNumbers([[1, 2], [3, 4]]);

// key = dictionary key of the button label.
export const PRESETS: { key: string; data: number[][] }[] = [
  { key: "presetInv2", data: [[1, 2], [3, 4]] },
  { key: "presetSingular2", data: [[1, 2], [2, 4]] },
  { key: "presetRank2", data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  { key: "presetInv3", data: [[1, 2, 0], [0, 1, 3], [1, 0, 1]] },
  { key: "presetWide", data: [[1, 1, 0], [0, 1, 1]] },
];
