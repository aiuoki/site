import type { DemoFormulas } from "../../types";
import { pm, vm } from "../rank-tex";

const tex = String.raw;

// Topic 4 of the notes: systems AX = b, null space, rank-nullity and the
// right / left pseudoinverses. Formulas carry no words (shared by every
// language): r is the rank of A, m its rows and n its columns.
const A = [[1, 1, 0], [0, 1, 1]];
const T = [[1, 0], [0, 1], [1, 1]];
const R3 = tex`\dfrac{1}{3}${pm([[2, -1], [1, 1], [-1, 2]])}`;
const L3 = tex`\dfrac{1}{3}${pm([[2, -1, 1], [-1, 2, 1]])}`;
const inv3 = tex`\dfrac{1}{3}${pm([[2, -1], [-1, 2]])}`;

export const demos = {
  "la-nul-example": {
    figures: ["la-nul-example"],
    statement: tex`A = ${pm(A)}:\quad \operatorname{Nul}(A) = \{\, t\,(-1,\ 1,\ -1) : t \in \mathbb{R} \,\}`,
    steps: [
      tex`AX = 0 \;\Longleftrightarrow\; \begin{cases} x_1 + x_2 = 0 \\ x_2 + x_3 = 0 \end{cases}`,
      tex`x_2 = \hl{t}`,
      tex`x_1 = -t,\qquad x_3 = -t`,
      tex`X = (-t,\ t,\ -t) = t\,(-1,\ 1,\ -1)`,
      tex`A${vm([-1, 1, -1])} = ${vm(["-1 + 1 + 0", "0 + 1 - 1"])} = ${vm([0, 0])}`,
      tex`A(tv) = t\,(Av) = t \cdot 0 = 0,\qquad A(u + v) = Au + Av = 0`,
    ],
  },
  "la-dimension": {
    figures: ["la-dimension"],
    statement: tex`\dim\{0\} = 0,\qquad \dim\{\,tv\,\} = 1,\qquad \dim\{\,sv + tw\,\} = 2`,
    steps: [
      tex`X = 0`,
      tex`X = t\,v`,
      tex`X = s\,v + t\,w,\qquad v \nparallel w`,
      tex`\operatorname{Nul}(A) = \{\, t\,(-1,\ 1,\ -1) \,\} \;\Rightarrow\; \dim = 1`,
      tex`x_1 + x_2 + x_3 = 0:\quad x_2 = s,\ x_3 = t,\ x_1 = -s - t`,
      tex`X = s\,(-1,\ 1,\ 0) + t\,(-1,\ 0,\ 1) \;\Rightarrow\; \dim = 2`,
    ],
  },
  "la-rank-nullity": {
    figures: ["la-rank-nullity"],
    statement: tex`\dim\operatorname{Nul}(A) = n - r`,
    steps: [
      tex`A = ${pm([[1, 2, 0, 1], [0, 0, 1, 1], [1, 2, 1, 2]])} \sim ${pm([[1, 2, 0, 1], [0, 0, 1, 1], [0, 0, 0, 0]])}`,
      tex`r = 2`,
      tex`n - r = 4 - 2 = 2 \;\Rightarrow\; x_2 = \hl{s},\ x_4 = \hl{t}`,
      tex`x_1 + 2x_2 + x_4 = 0,\quad x_3 + x_4 = 0 \;\Rightarrow\; x_1 = -2s - t,\ x_3 = -t`,
      tex`X = s\,(-2,\ 1,\ 0,\ 0) + t\,(-1,\ 0,\ -1,\ 1) \;\Rightarrow\; \dim\operatorname{Nul}(A) = 2`,
      tex`\dim\operatorname{Nul}(A) = n - r`,
    ],
  },
  "la-aat-invertible": {
    figures: ["la-aat-invertible"],
    statement: tex`r = m \;\Rightarrow\; \exists\,(AA^t)^{-1}`,
    steps: [
      tex`\underbrace{A}_{m \times n}\ \underbrace{A^t}_{n \times m} = \underbrace{AA^t}_{m \times m}`,
      tex`AA^t x = 0 \;\Rightarrow\; x^tAA^tx = 0`,
      tex`x^tAA^tx = (A^tx)^t(A^tx) = \|A^tx\|^2 = 0`,
      tex`\|A^tx\|^2 = 0 \;\Rightarrow\; A^tx = 0`,
      tex`r_{A^t} = r = m \;\Rightarrow\; \dim\operatorname{Nul}(A^t) = m - m = 0 \;\Rightarrow\; x = 0`,
      tex`\operatorname{Nul}(AA^t) = \{0\} \;\Rightarrow\; r_{AA^t} = m \;\Rightarrow\; \exists\,(AA^t)^{-1}`,
      tex`r = n \;\Rightarrow\; \exists\,(A^tA)^{-1}`,
    ],
  },
  "la-right-pseudo": {
    figures: ["la-right-pseudo"],
    statement: tex`AR = I_m \;\Rightarrow\; R = A^t(AA^t)^{-1}`,
    steps: [
      tex`R = A^t\,C_{m \times m}`,
      tex`AR = (AA^t)\,C = I`,
      tex`C = (AA^t)^{-1} \qquad (r = m)`,
      tex`R = A^tC = A^t(AA^t)^{-1}`,
      tex`AR = AA^t(AA^t)^{-1} = I`,
      tex`AA^t = ${pm([[2, 1], [1, 2]])},\quad (AA^t)^{-1} = ${inv3}`,
      tex`R = A^t(AA^t)^{-1} = ${R3}`,
      tex`AR = \dfrac{1}{3}${pm(A)}${pm([[2, -1], [1, 1], [-1, 2]])} = \dfrac{1}{3}${pm([[3, 0], [0, 3]])} = I_2`,
    ],
  },
  "la-particular": {
    figures: ["la-particular"],
    statement: tex`X_p = Rb \;\Rightarrow\; AX_p = b`,
    steps: [
      tex`AR = I_m`,
      tex`A(Rb) = (AR)\,b`,
      tex`(AR)\,b = I_m\,b = b`,
      tex`Rb = ${R3}${vm([3, 3])} = \dfrac{1}{3}${vm(["6 - 3", "3 + 3", "-3 + 6"])} = ${vm([1, 2, 1])}`,
      tex`A${vm([1, 2, 1])} = ${vm(["1 + 2 + 0", "0 + 2 + 1"])} = ${vm([3, 3])} = b`,
    ],
  },
  "la-homogeneous": {
    figures: ["la-homogeneous"],
    statement: tex`AX = b \;\Rightarrow\; X_h = X - Rb \in \operatorname{Nul}(A)`,
    steps: [
      tex`X = Rb + (X - Rb)`,
      tex`A(X - Rb) = AX - A(Rb)`,
      tex`= b - (AR)\,b = b - I\,b = b - b = 0`,
      tex`AX_h = 0 \;\Rightarrow\; X_h \in \operatorname{Nul}(A)`,
      tex`X = (0,\ 3,\ 0):\quad AX = (3,\ 3) = b`,
      tex`X_h = (0,\ 3,\ 0) - (1,\ 2,\ 1) = (-1,\ 1,\ -1) \in \operatorname{Nul}(A)`,
    ],
  },
  "la-general-solution": {
    figures: ["la-general-solution"],
    statement: tex`AX = b \iff X = Rb + X_h,\quad X_h \in \operatorname{Nul}(A)`,
    steps: [
      tex`AX = b \;\Rightarrow\; X = X_p + X_h`,
      tex`A(X_p + X_h) = AX_p + AX_h = b + 0 = b`,
      tex`\{\, X : AX = b \,\} = X_p + \operatorname{Nul}(A)`,
      tex`X = (1,\ 2,\ 1) + t\,(-1,\ 1,\ -1)`,
      tex`t = 0:\ (1,\ 2,\ 1) \qquad t = 1:\ (0,\ 3,\ 0) \qquad t = 2:\ (-1,\ 4,\ -1)`,
      tex`A${vm([-1, 4, -1])} = ${vm(["-1 + 4 + 0", "0 + 4 - 1"])} = ${vm([3, 3])}`,
    ],
  },
  "la-left-pseudo": {
    figures: ["la-left-pseudo"],
    statement: tex`LA = I_n \;\Rightarrow\; L = (A^tA)^{-1}A^t`,
    steps: [
      tex`L = C_{n \times n}\,A^t`,
      tex`LA = C\,(A^tA) = I`,
      tex`C = (A^tA)^{-1} \qquad (r = n)`,
      tex`L = CA^t = (A^tA)^{-1}A^t`,
      tex`LA = (A^tA)^{-1}A^tA = (A^tA)^{-1}(A^tA) = I`,
      tex`A = ${pm(T)}:\quad A^tA = ${pm([[2, 1], [1, 2]])},\quad (A^tA)^{-1} = ${inv3}`,
      tex`L = (A^tA)^{-1}A^t = ${L3}`,
      tex`LA = \dfrac{1}{3}${pm([[2, -1, 1], [-1, 2, 1]])}${pm(T)} = \dfrac{1}{3}${pm([[3, 0], [0, 3]])} = I_2`,
    ],
  },
  "la-left-unique": {
    figures: ["la-left-unique"],
    statement: tex`LA = I \;\Rightarrow\; (AX = b \Rightarrow X = Lb)`,
    steps: [
      tex`AX = b \;\Rightarrow\; L(AX) = Lb`,
      tex`(LA)\,X = Lb`,
      tex`I\,X = X = Lb`,
      tex`AX_h = 0 \;\Rightarrow\; X_h = (LA)X_h = L(AX_h) = L\,0 = 0`,
      tex`\operatorname{Nul}(A) = \{0\} \qquad (\dim = n - r = 0)`,
      tex`A = ${pm(T)},\ b = ${vm([1, 2, 3])}:\quad X = Lb = ${L3}${vm([1, 2, 3])} = ${vm([1, 2])}`,
      tex`A${vm([1, 2])} = ${vm([1, 2, 3])} = b`,
    ],
  },
  "la-left-colspace": {
    figures: ["la-left-colspace"],
    statement: tex`A(Lb) = b \iff b \in \operatorname{Col}(A)`,
    steps: [
      tex`\operatorname{Col}(A) = \{\, AX \,\} = \{\, x_1 a_1 + \cdots + x_n a_n \,\}`,
      tex`A(Lb) = b \;\Rightarrow\; b = A\,(Lb) \in \operatorname{Col}(A)`,
      tex`b = AX_0 \;\Rightarrow\; Lb = LAX_0 = X_0 \;\Rightarrow\; A(Lb) = AX_0 = b`,
      tex`A = ${pm(T)}:\quad \operatorname{Col}(A) = \{\, x_1(1, 0, 1) + x_2(0, 1, 1) \,\} = \{\, (x_1,\ x_2,\ x_1 + x_2) \,\}`,
      tex`b = (1,\ 2,\ 3):\quad 1 + 2 = 3 \;\Rightarrow\; b \in \operatorname{Col}(A),\quad A(Lb) = A(1, 2) = b`,
      tex`b' = (1,\ 2,\ 0):\quad Lb' = (0,\ 1),\quad A(Lb') = (0,\ 1,\ 1) \neq b'`,
    ],
  },
  "la-both-cases": {
    figures: ["la-both-cases"],
    statement: tex`r = m = n \;\Rightarrow\; R = L = A^{-1}`,
    steps: [
      tex`(AA^t)^{-1} = (A^t)^{-1}A^{-1}`,
      tex`R = A^t(AA^t)^{-1} = A^t(A^t)^{-1}A^{-1} = I\,A^{-1} = A^{-1}`,
      tex`(A^tA)^{-1} = A^{-1}(A^t)^{-1}`,
      tex`L = (A^tA)^{-1}A^t = A^{-1}(A^t)^{-1}A^t = A^{-1}\,I = A^{-1}`,
      tex`A = ${pm([[2, 1], [1, 1]])}:\quad AA^t = ${pm([[5, 3], [3, 2]])},\quad (AA^t)^{-1} = ${pm([[2, -3], [-3, 5]])}`,
      tex`R = A^t(AA^t)^{-1} = ${pm([[2, 1], [1, 1]])}${pm([[2, -3], [-3, 5]])} = ${pm([[1, -1], [-1, 2]])} = A^{-1}`,
    ],
  },
} satisfies Record<string, DemoFormulas>;
