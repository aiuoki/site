// Shared shape of a demonstration, for every topic.
export interface DemoFormulas {
  // Figure ids from src/components/figures/index.ts, shown in order.
  figures: readonly string[];
  // LaTeX with notation macros (\Sin, \Hyp, \hl{...}).
  statement: string;
  steps: readonly string[];
}

export interface DemoText {
  title: string;
  // One explanation per formula step.
  steps: string[];
  // "What it is for" paragraph.
  use: string;
}
