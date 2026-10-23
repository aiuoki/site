import { fromNumbers, type Matrix } from "../../../../lib/matrix";

export interface ProductPreset {
  // Dictionary key of the button label.
  label: string;
  A: () => Matrix;
  B: () => Matrix;
}

export const DEFAULT_A = () => fromNumbers([[1, 2], [3, 4]]);
export const DEFAULT_B = () => fromNumbers([[0, 1], [1, 0]]);

export const PRESETS: ProductPreset[] = [
  { label: "presetOrder", A: DEFAULT_A, B: DEFAULT_B },
  { label: "presetRect", A: () => fromNumbers([[1, 2, 0], [3, -1, 4]]), B: () => fromNumbers([[2, 1], [0, 3], [-1, 1]]) },
  { label: "presetCommute", A: () => fromNumbers([[1, 2], [0, 1]]), B: () => fromNumbers([[1, 3], [0, 1]]) },
  { label: "presetIdentity", A: DEFAULT_A, B: () => fromNumbers([[1, 0], [0, 1]]) },
  { label: "presetSameSize", A: () => fromNumbers([[1, 2, 3], [4, 5, 6]]), B: () => fromNumbers([[6, 5, 4], [3, 2, 1]]) },
];
