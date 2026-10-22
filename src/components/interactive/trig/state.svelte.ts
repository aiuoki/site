import type { AngleUnit } from "../../../lib/trig";

// Shared by every trig island on the page (canvas, panel and live checks
// in the guide). Islands are separate roots but import the same module.
export const circle = $state({ deg: 60 });

export const sum = $state({ a: 45, b: 30, op: 1 as 1 | -1, unit: "deg" as AngleUnit });
