// Poses of the mascot. Each one is a CSS state of the same layered drawing
// (see mascot.css): no extra artwork is loaded per pose.
export const MASCOT_POSES = ["idle", "wave", "think", "happy", "build"] as const;
export type MascotPose = (typeof MASCOT_POSES)[number];

// Tentacles as stroked paths, drawn back to front; the root (first point) is
// where each one sways from.
export const ARMS = [
  { d: "M250 860 C170 980 70 1090 150 1185", root: [250, 860], tone: "light" },
  { d: "M774 860 C854 980 954 1090 874 1185", root: [774, 860], tone: "light" },
  { d: "M512 920 L512 1195", root: [512, 920], tone: "light" },
  { d: "M365 900 C340 1000 320 1120 390 1190", root: [365, 900], tone: "dark" },
  { d: "M659 900 C684 1000 704 1120 634 1190", root: [659, 900], tone: "dark" },
] as const;

// Raised arm of the wave and build poses. It replaces the right outer
// tentacle and starts behind the edge of the body so the joint is hidden.
export const RAISED_ARM = { d: "M840 780 C950 720 1010 620 975 520", root: [840, 780] } as const;

// Hard hat of the build pose: shell, shine and the Ω plate on the front.
export const HELMET = {
  shell: "M190 330 C210 150 340 70 512 70 C684 70 814 150 834 330 Z",
  shine: "M300 230 C320 160 380 118 450 104",
  plate: { cx: 512, cy: 222, r: 58 },
} as const;

// Head and body: a single dome. The rim is the same path, shifted.
export const DOME = "M115 690 C105 270 270 72 512 72 C754 72 919 270 910 690 C905 870 730 945 512 945 C294 945 120 870 115 690 Z";

export const EYES = [
  { cx: 362, cy: 591 },
  { cx: 662, cy: 591 },
] as const;
