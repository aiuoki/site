import type { DemoFormulas } from "../types";

const tex = String.raw;

// Sections 01-06 of the notes: definition, structure, conjugate, modulus,
// division and polar form. Explanations live in ./text/<lang>.json.
export const complexBasics = {
  "cx-axiom": {
    figures: ["cx-plane"],
    statement: tex`(a, b) \cdot (c, d) = (ac - bd,\ ad + bc)`,
    steps: [
      tex`\mathbb{C} = \mathbb{R}^2 = \{(a, b) : a, b \in \mathbb{R}\}`,
      tex`(a, b) + (c, d) = (a + c,\ b + d)`,
      tex`(a + bi)(c + di) = ac + adi + bci + bd \cdot i^2`,
      tex`= ac + \hl{bd \cdot (-1)} + (ad + bc)i = (ac - bd) + (ad + bc)i`,
      tex`(a, b) \cdot (c, d) \coloneqq (ac - bd,\ ad + bc)`,
      tex`i = (0, 1) \;\to\; i^2 = (0 \cdot 0 - 1 \cdot 1,\ 0 \cdot 1 + 1 \cdot 0) = (-1, 0) = -1`,
    ],
  },
  "cx-ipow": {
    figures: ["cx-ipow"],
    statement: tex`i^0 = 1,\quad i^1 = i,\quad i^2 = -1,\quad i^3 = -i,\quad i^4 = 1`,
    steps: [
      tex`i^2 = -1`,
      tex`i^3 = i^2 \cdot i = -i`,
      tex`i^4 = i^2 \cdot i^2 = (-1)(-1) = 1`,
      tex`i^n = i^r,\quad r = \W{rest}(n \div 4)`,
      tex`i^{27} = i^{4 \cdot 6 + 3} = (i^4)^6 \cdot i^3 = -i`,
    ],
  },
  "cx-field": {
    figures: ["cx-inv"],
    statement: tex`z \neq 0 \;\Rightarrow\; z^{-1} = \dfrac{a - bi}{a^2 + b^2}`,
    steps: [
      tex`z + w = w + z,\quad zw = wz`,
      tex`z(w + v) = zw + zv`,
      tex`0 = 0 + 0i,\quad 1 = 1 + 0i`,
      tex`-z = -a - bi`,
      tex`\dfrac{1}{a + bi} = \dfrac{1}{a + bi} \cdot \dfrac{\hl{a - bi}}{\hl{a - bi}} = \dfrac{a - bi}{a^2 + b^2}`,
      tex`(1 + i)^{-1} = \dfrac{1 - i}{2} = \dfrac{1}{2} - \dfrac{1}{2}i`,
    ],
  },
  "cx-order": {
    figures: [],
    statement: tex`2 < i\,?\quad \W{no}`,
    steps: [
      tex`x > 0,\ y > 0 \;\Rightarrow\; xy > 0`,
      tex`x \neq 0 \;\Rightarrow\; x^2 > 0`,
      tex`i \neq 0 \;\Rightarrow\; i^2 > 0`,
      tex`i^2 = -1 \;\Rightarrow\; -1 > 0`,
      tex`1 = 1^2 > 0`,
      tex`0 = (-1) + 1 > 0\quad (\W{contra})`,
    ],
  },
  "cx-phasor": {
    figures: ["cx-phasor"],
    statement: tex`|z| = 1 \;\Leftrightarrow\; a^2 + b^2 = 1 \;\Leftrightarrow\; z = \Cos\theta + i\Sin\theta`,
    steps: [
      tex`z = a + bi,\quad |z| = \sqrt{a^2 + b^2}`,
      tex`|z| = 1 \;\Leftrightarrow\; a^2 + b^2 = 1`,
      tex`a = \Cos\theta,\quad b = \Sin\theta`,
      tex`z = \Cos\theta + i\Sin\theta = 1_\theta = e^{i\theta}`,
    ],
  },
  "cx-conj1": {
    figures: ["cx-conj"],
    statement: tex`\overline{\overline{z}} = z`,
    steps: [
      tex`z = a + bi \;\Rightarrow\; \overline{z} = a - bi`,
      tex`\overline{\overline{z}} = \overline{a + (-b)i} = a - (-b)i`,
      tex`= a + bi = z`,
    ],
  },
  "cx-conj2": {
    figures: ["cx-conjsum"],
    statement: tex`\overline{z + w} = \overline{z} + \overline{w}`,
    steps: [
      tex`z = a + bi,\quad w = c + di`,
      tex`z + w = (a + c) + (b + d)i`,
      tex`\overline{z + w} = (a + c) - (b + d)i`,
      tex`= (a - bi) + (c - di) = \overline{z} + \overline{w}`,
    ],
  },
  "cx-conj3": {
    figures: [],
    statement: tex`\overline{z \cdot w} = \overline{z} \cdot \overline{w} \quad\Rightarrow\quad \overline{z^n} = \overline{z}^{\,n}`,
    steps: [
      tex`zw = (ac - bd) + (ad + bc)i`,
      tex`\overline{zw} = (ac - bd) - (ad + bc)i`,
      tex`\overline{z} \cdot \overline{w} = (a - bi)(c - di) = ac - adi - bci + bd \cdot i^2`,
      tex`= (ac - bd) - (ad + bc)i`,
      tex`\overline{z^n} = \overline{z \cdot z \cdots z} = \overline{z} \cdot \overline{z} \cdots \overline{z} = \overline{z}^{\,n}`,
    ],
  },
  "cx-mod1": {
    figures: ["cx-polar"],
    statement: tex`|z| = \sqrt{a^2 + b^2} \ge 0`,
    steps: [
      tex`|z| = \sqrt{\operatorname{Re}(z)^2 + \operatorname{Im}(z)^2}`,
      tex`a^2 \ge 0,\ b^2 \ge 0 \;\Rightarrow\; a^2 + b^2 \ge 0 \;\Rightarrow\; |z| \ge 0`,
      tex`|z| = 0 \;\Leftrightarrow\; a^2 + b^2 = 0 \;\Leftrightarrow\; a = b = 0 \;\Leftrightarrow\; z = 0`,
      tex`|3 + 4i| = \sqrt{9 + 16} = \sqrt{25} = 5`,
    ],
  },
  "cx-tri": {
    figures: ["cx-tri"],
    statement: tex`|z + w| \le |z| + |w|`,
    steps: [
      tex`z + w`,
      tex`0 \;\to\; z \;\to\; z + w`,
      tex`|z + w| \le |z| + |w|`,
      tex`|z + w| = |z| + |w| \;\Leftrightarrow\; \theta_z = \theta_w`,
      tex`|3 + 4i| = 5 \;\le\; |3| + |4i| = 7`,
    ],
  },
  "cx-modprod": {
    figures: ["cx-prod"],
    statement: tex`|zw| = |z| \cdot |w| \quad\Rightarrow\quad |z^n| = |z|^n`,
    steps: [
      tex`|zw|^2 = (ac - bd)^2 + (ad + bc)^2`,
      tex`= a^2c^2 \hl{{}- 2abcd} + b^2d^2 + a^2d^2 \hl{{}+ 2abcd} + b^2c^2`,
      tex`= a^2(c^2 + d^2) + b^2(c^2 + d^2) = (a^2 + b^2)(c^2 + d^2)`,
      tex`= |z|^2 \cdot |w|^2 \quad\Rightarrow\quad |zw| = |z| \cdot |w|`,
      tex`|z^n| = |z \cdot z \cdots z| = |z|^n`,
    ],
  },
  "cx-modconj": {
    figures: ["cx-conj"],
    statement: tex`|z| = |\overline{z}|`,
    steps: [tex`\overline{z} = a - bi`, tex`|\overline{z}| = \sqrt{a^2 + (-b)^2} = \sqrt{a^2 + b^2} = |z|`],
  },
  "cx-zz": {
    figures: [],
    statement: tex`z \cdot \overline{z} = |z|^2`,
    steps: [
      tex`z \cdot \overline{z} = (a + bi)(a - bi)`,
      tex`= a^2 \hl{{}- abi + abi} - b^2i^2`,
      tex`= a^2 - b^2(-1) = a^2 + b^2`,
      tex`= |z|^2 \in \mathbb{R},\ \ge 0`,
    ],
  },
  "cx-div": {
    figures: ["cx-inv"],
    statement: tex`\dfrac{z}{w} = \dfrac{z\,\overline{w}}{|w|^2},\qquad \dfrac{1}{w} = \dfrac{\overline{w}}{|w|^2}\quad (w \neq 0)`,
    steps: [
      tex`\dfrac{z}{w} = \dfrac{z}{w} \cdot \dfrac{\hl{\overline{w}}}{\hl{\overline{w}}}`,
      tex`= \dfrac{z\,\overline{w}}{w\,\overline{w}} = \dfrac{z\,\overline{w}}{|w|^2}`,
      tex`z = 1 \;\Rightarrow\; \dfrac{1}{w} = \dfrac{\overline{w}}{|w|^2}`,
      tex`\dfrac{2 + 3i}{1 + 2i} = \dfrac{(2 + 3i)(1 - 2i)}{1^2 + 2^2}`,
      tex`= \dfrac{2 - 4i + 3i - 6i^2}{5} = \dfrac{8 - i}{5} = \dfrac{8}{5} - \dfrac{1}{5}i`,
    ],
  },
  "cx-arg": {
    figures: ["cx-quad"],
    statement: tex`\rho = \sqrt{a^2 + b^2},\qquad \theta = \operatorname{Arg} z \in (-\pi, \pi]`,
    steps: [
      tex`\Cos\theta = \dfrac{a}{\rho},\quad \Sin\theta = \dfrac{b}{\rho}`,
      tex`\Tan\theta = \dfrac{b}{a} \;\Rightarrow\; \theta = \arctan\dfrac{b}{a}`,
      tex`a > 0:\quad \theta = \arctan\dfrac{b}{a}`,
      tex`a < 0,\ b \ge 0:\ \theta = \arctan\dfrac{b}{a} + \pi;\qquad a < 0,\ b < 0:\ \theta = \arctan\dfrac{b}{a} - \pi`,
      tex`a = 0:\quad \theta = \pm\dfrac{\pi}{2}`,
      tex`\arg z = \{\theta + 2\pi k : k \in \mathbb{Z}\}`,
    ],
  },
  "cx-p2b": {
    figures: ["cx-polar"],
    statement: tex`a = \rho\Cos\theta,\quad b = \rho\Sin\theta \quad\Rightarrow\quad z = \rho(\Cos\theta + i\Sin\theta)`,
    steps: [
      tex`\Cos\theta = \dfrac{a}{\rho} \;\Rightarrow\; a = \rho\Cos\theta`,
      tex`\Sin\theta = \dfrac{b}{\rho} \;\Rightarrow\; b = \rho\Sin\theta`,
      tex`z = a + bi = \rho\Cos\theta + i\rho\Sin\theta = \rho(\Cos\theta + i\Sin\theta)`,
      tex`2_{\pi/3} = 2\left(\dfrac{1}{2} + \dfrac{\sqrt{3}}{2}i\right) = 1 + \sqrt{3}\,i`,
    ],
  },
} satisfies Record<string, DemoFormulas>;
