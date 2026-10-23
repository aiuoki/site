import { fromNumbers, type Matrix } from "../../../../lib/matrix";

// Dictionary key of the button label, and the matrix it loads.
export interface Preset {
  label: string;
  matrix: () => Matrix;
}

export const NOTES_EXAMPLE = () => fromNumbers([[1, 4], [2, 3]]);

export const PRESETS: Preset[] = [
  { label: "presetNotes", matrix: NOTES_EXAMPLE },
  { label: "presetIdentity", matrix: () => fromNumbers([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) },
  { label: "presetDiagonal", matrix: () => fromNumbers([[2, 0, 0], [0, -1, 0], [0, 0, 5]]) },
  { label: "presetSymmetric", matrix: () => fromNumbers([[1, 2, 3], [2, 4, -1], [3, -1, 0]]) },
  { label: "presetAntisymmetric", matrix: () => fromNumbers([[0, 2, -3], [-2, 0, 1], [3, -1, 0]]) },
  { label: "presetUpper", matrix: () => fromNumbers([[1, 2, 3], [0, 4, 5], [0, 0, 6]]) },
  { label: "presetLower", matrix: () => fromNumbers([[1, 0, 0], [2, 3, 0], [4, 5, 6]]) },
  { label: "presetRect", matrix: () => fromNumbers([[1, 2, 3], [4, 5, 6]]) },
];
