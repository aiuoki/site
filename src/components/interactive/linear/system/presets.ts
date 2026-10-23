import { fromNumbers, type Matrix } from "../../../../lib/matrix";

export interface Preset {
  // Dictionary key of the button label.
  key: string;
  A: number[][];
  b: number[];
}

// The example of the notes comes first and is also the starting state.
export const PRESETS: Preset[] = [
  { key: "presetNotes", A: [[1, 1, 0], [0, 1, 1]], b: [3, 3] },
  { key: "presetSquare", A: [[2, 1], [1, 1]], b: [3, 2] },
  { key: "presetTallIn", A: [[1, 0], [0, 1], [1, 1]], b: [1, 2, 3] },
  { key: "presetTallOut", A: [[1, 0], [0, 1], [1, 1]], b: [1, 2, 4] },
  { key: "presetNone", A: [[1, 2], [2, 4]], b: [1, 3] },
];

export const bColumn = (xs: number[]): Matrix => fromNumbers(xs.map((x) => [x]));
export const NOTES = PRESETS[0]!;
