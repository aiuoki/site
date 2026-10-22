import type { Complex } from "../../../lib/complex";
import type { AngleUnit } from "../../../lib/complex-format";
import type { Op } from "../../../lib/complex-panel";

// Shared by the plane, its panel and the live checks of the guide.
export const plane = $state({
  z: { re: 2, im: 1 } as Complex,
  w: { re: -1, im: 1 } as Complex,
  op: "prod" as Op,
  n: 3,
  unit: "rad" as AngleUnit,
  mode: "bin" as "bin" | "pol",
});
