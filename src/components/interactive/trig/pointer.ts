import { pointToDeg } from "../../../lib/plot";

// Angle under the pointer, in degrees, or null near the centre.
export function eventDeg(svg: SVGSVGElement, event: PointerEvent): number | null {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
  return pointToDeg(pt.x, pt.y);
}

// Arrow keys move 1°, or 15° with Shift. Returns null for other keys.
export function keyStep(event: KeyboardEvent): number | null {
  const step = event.shiftKey ? 15 : 1;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") return step;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") return -step;
  return null;
}
