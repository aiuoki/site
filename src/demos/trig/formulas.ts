import type { DemoFormulas } from "../types";

const tex = String.raw;

// One entry per demonstration: statement, figures and one formula per step.
// Step explanations live in ./text/<lang>.json, in the same order.
export const trigDemos = {
  sin: {
    figures: ["sin"],
    statement: tex`\Sin\theta = y`,
    steps: [tex`P = (x, y)`, tex`\Hyp = \hl{1}`, tex`\Sin\theta = \dfrac{\Opp}{\Hyp}`, tex`\Sin\theta = \dfrac{\hl{y}}{\hl{1}}`, tex`\Sin\theta = y`],
  },
  cos: {
    figures: ["cos"],
    statement: tex`\Cos\theta = x`,
    steps: [tex`P = (x, y)`, tex`\Hyp = \hl{1}`, tex`\Cos\theta = \dfrac{\Adj}{\Hyp}`, tex`\Cos\theta = \dfrac{\hl{x}}{\hl{1}} = x`],
  },
  tan: {
    figures: ["tan"],
    statement: tex`\Tan\theta = \dfrac{\Sin\theta}{\Cos\theta} = t`,
    steps: [
      tex`\Tan\theta = \dfrac{\Opp}{\Adj} = \dfrac{y}{x}`,
      tex`\triangle(x, y) \;\sim\; \triangle(\hl{1}, \hl{t})`,
      tex`\dfrac{t}{1} = \dfrac{y}{x}`,
      tex`t = \dfrac{y}{x} = \Tan\theta`,
    ],
  },
  cot: {
    figures: ["cot"],
    statement: tex`\Cot\theta = \dfrac{\Cos\theta}{\Sin\theta} = c`,
    steps: [
      tex`\Cot\theta = \dfrac{\Cos\theta}{\Sin\theta} = \dfrac{1}{\Tan\theta}`,
      tex`\triangle\ (0, 0),\ (0, 1),\ (c, 1)`,
      tex`\angle(c, 1) = \theta`,
      tex`\Tan\theta = \dfrac{\hl{1}}{\hl{c}}`,
      tex`c = \dfrac{1}{\Tan\theta} = \Cot\theta`,
    ],
  },
  sec: {
    figures: ["sec"],
    statement: tex`\Sec\theta = \dfrac{1}{\Cos\theta} = h`,
    steps: [tex`\triangle:\ 1,\ t,\ \hl{h}`, tex`\Cos\theta = \dfrac{\Adj}{\Hyp} = \dfrac{1}{h}`, tex`h = \dfrac{1}{\Cos\theta} = \Sec\theta`],
  },
  csc: {
    figures: ["csc"],
    statement: tex`\Csc\theta = \dfrac{1}{\Sin\theta} = h`,
    steps: [tex`\triangle:\ c,\ 1,\ \hl{h}`, tex`\Sin\theta = \dfrac{\Opp}{\Hyp} = \dfrac{1}{h}`, tex`h = \dfrac{1}{\Sin\theta} = \Csc\theta`],
  },
  rad: {
    figures: ["rad"],
    statement: tex`\theta_{\Rad} = \theta\degree \cdot \dfrac{\pi}{180}`,
    steps: [
      tex`L = 2\pi r`,
      tex`r = 1 \;\to\; L = 2\pi`,
      tex`1\ \Rad:\ \frown = r`,
      tex`360\degree = 2\pi\ \Rad \;\to\; 180\degree = \pi\ \Rad`,
      tex`60\degree \cdot \dfrac{\pi}{180} = \dfrac{\pi}{3}\ \Rad`,
    ],
  },
  signs: {
    figures: ["signs"],
    statement: tex`\Sin\theta = y \quad\cdot\quad \Cos\theta = x`,
    steps: [
      tex`\Sin\theta = y,\quad \Cos\theta = x`,
      tex`\text{I}:\ x > 0,\ y > 0`,
      tex`\text{II}:\ x < 0,\ y > 0`,
      tex`\text{III}:\ x < 0,\ y < 0`,
      tex`\text{IV}:\ x > 0,\ y < 0`,
      tex`\Sec \sim \Cos,\quad \Csc \sim \Sin,\quad \Cot \sim \Tan`,
    ],
  },
  notables: {
    figures: ["notables"],
    statement: tex`\Sin 30\degree = \dfrac{1}{2} \quad\cdot\quad \Sin 45\degree = \dfrac{\sqrt{2}}{2} \quad\cdot\quad \Sin 60\degree = \dfrac{\sqrt{3}}{2}`,
    steps: [
      tex`45\degree:\ a^2 + a^2 = 1^2`,
      tex`2a^2 = 1 \;\to\; a = \dfrac{1}{\sqrt{2}} = \dfrac{\sqrt{2}}{2}`,
      tex`\Sin 45\degree = \Cos 45\degree = \dfrac{\sqrt{2}}{2}`,
      tex`60\degree + 60\degree + 60\degree = 180\degree \;\to\; 30\degree,\ 60\degree,\ 90\degree`,
      tex`b = \dfrac{1}{2},\quad \left(\dfrac{1}{2}\right)^2 + h^2 = 1 \;\to\; h = \dfrac{\sqrt{3}}{2}`,
      tex`\Sin 30\degree = \dfrac{1}{2},\quad \Cos 30\degree = \dfrac{\sqrt{3}}{2},\quad \Sin 60\degree = \dfrac{\sqrt{3}}{2},\quad \Cos 60\degree = \dfrac{1}{2}`,
    ],
  },
  "rec-sin": {
    figures: [],
    statement: tex`\Sin\theta \cdot \Csc\theta = 1`,
    steps: [
      tex`\Csc\theta = \dfrac{1}{\Sin\theta}`,
      tex`\Sin\theta \cdot \Csc\theta = \Sin\theta \cdot \hl{\dfrac{1}{\Sin\theta}}`,
      tex`= \dfrac{\Sin\theta}{\Sin\theta} = 1`,
    ],
  },
  "rec-cos": {
    figures: [],
    statement: tex`\Cos\theta \cdot \Sec\theta = 1`,
    steps: [
      tex`\Sec\theta = \dfrac{1}{\Cos\theta}`,
      tex`\Cos\theta \cdot \Sec\theta = \Cos\theta \cdot \hl{\dfrac{1}{\Cos\theta}}`,
      tex`= \dfrac{\Cos\theta}{\Cos\theta} = 1`,
    ],
  },
  "rec-tan": {
    figures: ["rectan"],
    statement: tex`\Tan\theta \cdot \Cot\theta = 1`,
    steps: [
      tex`\Tan\theta = \dfrac{\Sin\theta}{\Cos\theta},\quad \Cot\theta = \dfrac{\Cos\theta}{\Sin\theta}`,
      tex`\Tan\theta \cdot \Cot\theta = \dfrac{\Sin\theta}{\Cos\theta} \cdot \dfrac{\Cos\theta}{\Sin\theta}`,
      tex`= \dfrac{\hl{\Sin\theta} \cdot \Cos\theta}{\Cos\theta \cdot \hl{\Sin\theta}} = 1`,
    ],
  },
  "quot-tan": {
    figures: ["pyth"],
    statement: tex`\Tan\theta = \dfrac{\Sin\theta}{\Cos\theta}`,
    steps: [tex`\Tan\theta = \dfrac{\Opp}{\Adj}`, tex`= \dfrac{y}{x}`, tex`= \dfrac{\hl{\Sin\theta}}{\hl{\Cos\theta}}`],
  },
  "quot-cot": {
    figures: ["pyth"],
    statement: tex`\Cot\theta = \dfrac{\Cos\theta}{\Sin\theta}`,
    steps: [tex`\Cot\theta = \dfrac{\Adj}{\Opp}`, tex`= \dfrac{x}{y}`, tex`= \dfrac{\hl{\Cos\theta}}{\hl{\Sin\theta}}`],
  },
  pyth: {
    figures: ["pyth"],
    statement: tex`\Sin^2\theta + \Cos^2\theta = 1`,
    steps: [
      tex`a^2 + b^2 = c^2`,
      tex`a = \hl{x},\quad b = \hl{y},\quad c = \hl{1}`,
      tex`x^2 + y^2 = (1)^2`,
      tex`(\Cos\theta)^2 + (\Sin\theta)^2 = 1`,
      tex`\Cos^2\theta + \Sin^2\theta = 1`,
      tex`\Sin^2\theta + \Cos^2\theta = 1`,
    ],
  },
  "pyth-tan": {
    figures: ["pyth-tan"],
    statement: tex`1 + \Tan^2\theta = \Sec^2\theta`,
    steps: [
      tex`\Sin^2\theta + \Cos^2\theta = 1`,
      tex`\dfrac{\Sin^2\theta}{\hl{\Cos^2\theta}} + \dfrac{\Cos^2\theta}{\hl{\Cos^2\theta}} = \dfrac{1}{\hl{\Cos^2\theta}}`,
      tex`\Tan^2\theta + 1 = \Sec^2\theta`,
      tex`1 + \Tan^2\theta = \Sec^2\theta`,
    ],
  },
  "pyth-cot": {
    figures: ["pyth-cot"],
    statement: tex`1 + \Cot^2\theta = \Csc^2\theta`,
    steps: [
      tex`\Sin^2\theta + \Cos^2\theta = 1`,
      tex`\dfrac{\Sin^2\theta}{\hl{\Sin^2\theta}} + \dfrac{\Cos^2\theta}{\hl{\Sin^2\theta}} = \dfrac{1}{\hl{\Sin^2\theta}}`,
      tex`1 + \Cot^2\theta = \Csc^2\theta`,
    ],
  },
  "sum-cos": {
    figures: ["dist"],
    statement: tex`\Cos(\alpha \pm \beta) = \Cos\alpha\,\Cos\beta \mp \Sin\alpha\,\Sin\beta`,
    steps: [
      tex`A = (\Cos\alpha, \Sin\alpha),\quad B = (\Cos\beta, \Sin\beta)`,
      tex`d^2 = (\Cos\alpha - \Cos\beta)^2 + (\Sin\alpha - \Sin\beta)^2`,
      tex`= \Cos^2\alpha - 2\Cos\alpha\,\Cos\beta + \Cos^2\beta + \Sin^2\alpha - 2\Sin\alpha\,\Sin\beta + \Sin^2\beta`,
      tex`= \hl{(\Sin^2\alpha + \Cos^2\alpha)} + \hl{(\Sin^2\beta + \Cos^2\beta)} - 2(\Cos\alpha\,\Cos\beta + \Sin\alpha\,\Sin\beta)`,
      tex`d^2 = 2 - 2(\Cos\alpha\,\Cos\beta + \Sin\alpha\,\Sin\beta)`,
      tex`A' = (\Cos(\alpha - \beta), \Sin(\alpha - \beta)),\quad B' = (1, 0)`,
      tex`d^2 = (\Cos(\alpha - \beta) - 1)^2 + \Sin^2(\alpha - \beta) = 2 - 2\Cos(\alpha - \beta)`,
      tex`2 - 2\hl{\Cos(\alpha - \beta)} = 2 - 2\hl{(\Cos\alpha\,\Cos\beta + \Sin\alpha\,\Sin\beta)}`,
      tex`\Cos(\alpha - \beta) = \Cos\alpha\,\Cos\beta + \Sin\alpha\,\Sin\beta`,
      tex`\Cos(\alpha + \beta) = \Cos\alpha\,\Cos(\hl{-\beta}) + \Sin\alpha\,\Sin(\hl{-\beta}) = \Cos\alpha\,\Cos\beta - \Sin\alpha\,\Sin\beta`,
    ],
  },
  "sum-sin": {
    figures: ["sumsin", "comp"],
    statement: tex`\Sin(\alpha \pm \beta) = \Sin\alpha\,\Cos\beta \pm \Cos\alpha\,\Sin\beta`,
    steps: [
      tex`\Sin x = \Cos(90\degree - x)`,
      tex`\Sin(\alpha + \beta) = \Cos(90\degree - (\alpha + \beta)) = \Cos(\hl{(90\degree - \alpha)} - \beta)`,
      tex`= \Cos(90\degree - \alpha)\,\Cos\beta + \Sin(90\degree - \alpha)\,\Sin\beta`,
      tex`= \hl{\Sin\alpha}\,\Cos\beta + \hl{\Cos\alpha}\,\Sin\beta`,
      tex`\Sin(\alpha - \beta) = \Sin\alpha\,\Cos\beta - \Cos\alpha\,\Sin\beta`,
    ],
  },
  "sum-tan": {
    figures: ["sumtan"],
    statement: tex`\Tan(\alpha \pm \beta) = \dfrac{\Tan\alpha \pm \Tan\beta}{1 \mp \Tan\alpha\,\Tan\beta}`,
    steps: [
      tex`\Tan(\alpha \pm \beta) = \dfrac{\Sin(\alpha \pm \beta)}{\Cos(\alpha \pm \beta)}`,
      tex`= \dfrac{\Sin\alpha\,\Cos\beta \pm \Cos\alpha\,\Sin\beta}{\Cos\alpha\,\Cos\beta \mp \Sin\alpha\,\Sin\beta}`,
      tex`= \dfrac{\dfrac{\Sin\alpha\,\Cos\beta}{\hl{\Cos\alpha\,\Cos\beta}} \pm \dfrac{\Cos\alpha\,\Sin\beta}{\hl{\Cos\alpha\,\Cos\beta}}}{\dfrac{\Cos\alpha\,\Cos\beta}{\hl{\Cos\alpha\,\Cos\beta}} \mp \dfrac{\Sin\alpha\,\Sin\beta}{\hl{\Cos\alpha\,\Cos\beta}}}`,
      tex`= \dfrac{\Tan\alpha \pm \Tan\beta}{1 \mp \Tan\alpha\,\Tan\beta}`,
    ],
  },
  dbl: {
    figures: ["dbl"],
    statement: tex`\Sin 2\alpha = 2\Sin\alpha\,\Cos\alpha`,
    steps: [
      tex`\Sin(\alpha + \beta) = \Sin\alpha\,\Cos\beta + \Cos\alpha\,\Sin\beta`,
      tex`\Sin(\alpha + \hl{\alpha}) = \Sin\alpha\,\Cos\hl{\alpha} + \Cos\alpha\,\Sin\hl{\alpha}`,
      tex`\Sin 2\alpha = 2\Sin\alpha\,\Cos\alpha`,
      tex`\Cos 2\alpha = \Cos\alpha\,\Cos\alpha - \Sin\alpha\,\Sin\alpha = \Cos^2\alpha - \Sin^2\alpha`,
      tex`\Tan 2\alpha = \dfrac{\Tan\alpha + \Tan\alpha}{1 - \Tan\alpha\,\Tan\alpha} = \dfrac{2\Tan\alpha}{1 - \Tan^2\alpha}`,
    ],
  },
  dbl2: {
    figures: ["dbl2"],
    statement: tex`\Cos 2\alpha = 2\Cos^2\alpha - 1 = 1 - 2\Sin^2\alpha`,
    steps: [
      tex`\Cos 2\alpha = \Cos^2\alpha - \Sin^2\alpha`,
      tex`\Sin^2\alpha = 1 - \Cos^2\alpha`,
      tex`\Cos 2\alpha = \Cos^2\alpha - \hl{(1 - \Cos^2\alpha)} = 2\Cos^2\alpha - 1`,
      tex`\Cos^2\alpha = 1 - \Sin^2\alpha`,
      tex`\Cos 2\alpha = \hl{(1 - \Sin^2\alpha)} - \Sin^2\alpha = 1 - 2\Sin^2\alpha`,
    ],
  },
  half: {
    figures: ["half"],
    statement: tex`\Sin\dfrac{\alpha}{2} = \pm\sqrt{\dfrac{1 - \Cos\alpha}{2}}`,
    steps: [
      tex`\Cos 2x = 1 - 2\Sin^2 x`,
      tex`x = \dfrac{\alpha}{2} \;\to\; \Cos\alpha = 1 - 2\Sin^2\dfrac{\alpha}{2}`,
      tex`2\Sin^2\dfrac{\alpha}{2} = 1 - \Cos\alpha`,
      tex`\Sin\dfrac{\alpha}{2} = \pm\sqrt{\dfrac{1 - \Cos\alpha}{2}}`,
      tex`\Cos\dfrac{\alpha}{2} = \pm\sqrt{\dfrac{1 + \Cos\alpha}{2}}`,
    ],
  },
  s2p: {
    figures: ["s2p"],
    statement: tex`\Sin\alpha + \Sin\beta = 2\Sin\dfrac{\alpha + \beta}{2}\,\Cos\dfrac{\alpha - \beta}{2}`,
    steps: [
      tex`\Sin(x + y) = \Sin x\,\Cos y + \Cos x\,\Sin y`,
      tex`\Sin(x - y) = \Sin x\,\Cos y - \Cos x\,\Sin y`,
      tex`\Sin(x + y) + \Sin(x - y) = 2\Sin x\,\Cos y`,
      tex`\alpha = x + y,\quad \beta = x - y \;\to\; x = \dfrac{\alpha + \beta}{2},\quad y = \dfrac{\alpha - \beta}{2}`,
      tex`\Sin\alpha + \Sin\beta = 2\Sin\dfrac{\alpha + \beta}{2}\,\Cos\dfrac{\alpha - \beta}{2}`,
    ],
  },
} satisfies Record<string, DemoFormulas>;

export type TrigDemoId = keyof typeof trigDemos;

// Demonstrations reachable from each topic page.
export const trigTopicDemos: Record<"trigonometria" | "suma-angulos", TrigDemoId[]> = {
  trigonometria: [
    "sin", "cos", "tan", "cot", "sec", "csc", "rad", "signs", "notables",
    "rec-sin", "rec-cos", "rec-tan", "quot-tan", "quot-cot", "pyth", "pyth-tan", "pyth-cot",
  ],
  "suma-angulos": ["sum-sin", "sum-cos", "sum-tan", "dbl", "dbl2", "half", "s2p"],
};
