import type { DemoFormulas } from "../../types";

const tex = String.raw;

// Properties of the matrix types of the notes (pages 1-2): transpose,
// symmetric, antisymmetric, triangular and the symmetric + antisymmetric split.
// Explanations live in ../text/tipos-matrices/<lang>.json (one per step).
export const demos = {
  "la-transp-twice": {
    figures: ["la-transp-rect", "la-mirror"],
    statement: tex`(A^t)^t = A`,
    steps: [
      tex`A = [a_{ij}]_{m \times n} \;\Rightarrow\; A^t = [a_{ji}]_{n \times m}`,
      tex`A = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \;\Rightarrow\; A^t = \begin{pmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{pmatrix}`,
      tex`[(A^t)^t]_{ij} = [A^t]_{ji} = a_{ij}`,
      tex`(A^t)^t = A`,
    ],
  },
  "la-transp-prod": {
    figures: ["la-transp-prod"],
    statement: tex`(AB)^t = B^t A^t`,
    steps: [
      tex`A \in M_{n \times p},\ B \in M_{p \times m} \;\Rightarrow\; AB \in M_{n \times m},\ (AB)^t \in M_{m \times n}`,
      tex`B^t \in M_{m \times p},\ A^t \in M_{p \times n} \;\Rightarrow\; B^t A^t \in M_{m \times n}`,
      tex`[(AB)^t]_{ij} = (AB)_{ji} = \sum_{k=1}^{p} a_{jk}\, b_{ki}`,
      tex`[B^t A^t]_{ij} = \sum_{k=1}^{p} (B^t)_{ik}\, (A^t)_{kj} = \sum_{k=1}^{p} b_{ki}\, a_{jk}`,
      tex`(AB)^t = B^t A^t`,
      tex`A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 2 \end{pmatrix},\ B = \begin{pmatrix} 1 & 0 \\ 2 & 1 \\ 0 & 3 \end{pmatrix}:\quad (AB)^t = \begin{pmatrix} 5 & 5 \\ 2 & 7 \end{pmatrix} = B^t A^t`,
    ],
  },
  "la-sym-gram": {
    figures: ["la-gram"],
    statement: tex`(AA^t)^t = AA^t,\qquad (A^tA)^t = A^tA`,
    steps: [
      tex`A \in M_{m \times n} \;\Rightarrow\; AA^t \in M_{m \times m},\ \ A^tA \in M_{n \times n}`,
      tex`(AA^t)^t = (A^t)^t A^t`,
      tex`= AA^t`,
      tex`(A^tA)^t = A^t (A^t)^t = A^tA`,
      tex`A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 2 \end{pmatrix}:\quad AA^t = \begin{pmatrix} 5 & 5 \\ 5 & 14 \end{pmatrix},\quad A^tA = \begin{pmatrix} 10 & 5 & 6 \\ 5 & 5 & 2 \\ 6 & 2 & 4 \end{pmatrix}`,
    ],
  },
  "la-sym-inv": {
    figures: ["la-sym-inv"],
    statement: tex`A = A^t \;\Rightarrow\; (A^{-1})^t = A^{-1}`,
    steps: [
      tex`(A^{-1}A)^t = A^t (A^{-1})^t`,
      tex`(A^{-1}A)^t = I^t = I \;\Rightarrow\; A^t (A^{-1})^t = I`,
      tex`A^t = A \;\Rightarrow\; A\, (A^{-1})^t = I`,
      tex`A^{-1} A\, (A^{-1})^t = A^{-1} I \;\Rightarrow\; (A^{-1})^t = A^{-1}`,
      tex`A = \begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix},\quad A^{-1} = \begin{pmatrix} 1 & -1 \\ -1 & 2 \end{pmatrix}`,
    ],
  },
  "la-sym-prod": {
    figures: ["la-sym-prod"],
    statement: tex`A = A^t,\ B = B^t:\qquad (AB)^t = AB \iff AB = BA`,
    steps: [
      tex`(AB)^t = B^t A^t`,
      tex`= BA`,
      tex`(AB)^t = AB \iff BA = AB`,
      tex`A = \begin{pmatrix} 1 & 0 \\ 0 & 2 \end{pmatrix},\ B = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}:\quad AB = \begin{pmatrix} 0 & 1 \\ 2 & 0 \end{pmatrix} \neq \begin{pmatrix} 0 & 2 \\ 1 & 0 \end{pmatrix} = BA`,
      tex`A = \begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix},\ B = \begin{pmatrix} 3 & 4 \\ 4 & 3 \end{pmatrix}:\quad AB = BA = \begin{pmatrix} 11 & 10 \\ 10 & 11 \end{pmatrix}`,
    ],
  },
  "la-sum-types": {
    figures: ["la-sum-types"],
    statement: tex`(A + B)^t = A^t + B^t`,
    steps: [
      tex`[(A + B)^t]_{ij} = (A + B)_{ji} = a_{ji} + b_{ji} = [A^t + B^t]_{ij}`,
      tex`A^t = A,\ B^t = B \;\Rightarrow\; (A + B)^t = A + B`,
      tex`A^t = -A,\ B^t = -B \;\Rightarrow\; (A + B)^t = -A - B = -(A + B)`,
      tex`\begin{pmatrix} 1 & 2 \\ 2 & 3 \end{pmatrix} + \begin{pmatrix} 0 & 5 \\ 5 & 4 \end{pmatrix} = \begin{pmatrix} 1 & 7 \\ 7 & 7 \end{pmatrix}`,
      tex`\begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix} + \begin{pmatrix} 0 & 2 \\ -2 & 0 \end{pmatrix} = \begin{pmatrix} 0 & 3 \\ -3 & 0 \end{pmatrix}`,
    ],
  },
  "la-anti-diag": {
    figures: ["la-anti"],
    statement: tex`A^t = -A \;\Rightarrow\; a_{ii} = 0`,
    steps: [
      tex`A^t = -A \;\Rightarrow\; a_{ji} = -a_{ij} \quad (\forall\, i, j)`,
      tex`m \times n = n \times m \;\Rightarrow\; m = n`,
      tex`i = j:\quad a_{ii} = -a_{ii}`,
      tex`2\, a_{ii} = 0 \;\Rightarrow\; a_{ii} = 0`,
      tex`A = \begin{pmatrix} 0 & 1 & 2 \\ -1 & 0 & 3 \\ -2 & -3 & 0 \end{pmatrix}`,
    ],
  },
  "la-anti-odd": {
    figures: ["la-anti"],
    statement: tex`A^t = -A,\ n = 2k + 1 \;\Rightarrow\; \det A = 0`,
    steps: [
      tex`\det(A^t) = \det A`,
      tex`\det(-A) = (-1)^n \det A`,
      tex`\det A = \det(A^t) = \det(-A) = (-1)^n \det A`,
      tex`n = 2k + 1 \;\Rightarrow\; (-1)^n = -1 \;\Rightarrow\; \det A = -\det A`,
      tex`2 \det A = 0 \;\Rightarrow\; \det A = 0`,
      tex`\det A = 0 \cdot \bigl(0 \cdot 0 - 3 \cdot (-3)\bigr) - 1 \cdot \bigl((-1) \cdot 0 - 3 \cdot (-2)\bigr) + 2 \cdot \bigl((-1)(-3) - 0 \cdot (-2)\bigr) = 0 - 6 + 6 = 0`,
    ],
  },
  "la-anti-square": {
    figures: ["la-anti-square"],
    statement: tex`A^t = -A \;\Rightarrow\; (A^2)^t = A^2`,
    steps: [
      tex`(A^2)^t = (AA)^t = A^t A^t`,
      tex`= (-A)(-A) = A^2`,
      tex`A = \begin{pmatrix} 0 & 1 & 2 \\ -1 & 0 & 3 \\ -2 & -3 & 0 \end{pmatrix}:\quad A^2 = \begin{pmatrix} -5 & -6 & 3 \\ -6 & -10 & -2 \\ 3 & -2 & -13 \end{pmatrix}`,
      tex`(A^k)^t = (A^t)^k = (-A)^k = (-1)^k A^k`,
    ],
  },
  "la-tri-prod": {
    figures: ["la-tri-prod"],
    statement: tex`c_{ij} = 0\ (i > j),\qquad c_{ii} = a_{ii}\, b_{ii}`,
    steps: [
      tex`a_{ik} = 0\ (i > k),\qquad b_{kj} = 0\ (k > j)`,
      tex`C = AB:\quad c_{ij} = \sum_{k=1}^{n} a_{ik}\, b_{kj}`,
      tex`i > j:\quad k < i \Rightarrow a_{ik} = 0, \qquad k \geq i > j \Rightarrow b_{kj} = 0`,
      tex`c_{ij} = 0 + 0 + \dots + 0 = 0 \qquad (i > j)`,
      tex`c_{ii} = \sum_{k=1}^{n} a_{ik}\, b_{ki} = a_{ii}\, b_{ii}`,
      tex`\begin{pmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{pmatrix} \begin{pmatrix} 2 & 1 & 0 \\ 0 & 3 & 1 \\ 0 & 0 & 5 \end{pmatrix} = \begin{pmatrix} 2 & 7 & 17 \\ 0 & 12 & 29 \\ 0 & 0 & 30 \end{pmatrix}`,
      tex`(AB)^t = B^t A^t`,
    ],
  },
  "la-tri-inv": {
    figures: ["la-tri-inv"],
    statement: tex`A\, x = e_j \;\Rightarrow\; x_i = 0\ (i > j)`,
    steps: [
      tex`A A^{-1} = I \;\Rightarrow\; A\, x = e_j \quad \bigl(x = (A^{-1})_{\bullet j}\bigr)`,
      tex`a_{nn}\, x_n = (e_j)_n, \qquad a_{nn} \neq 0`,
      tex`j < n:\quad x_n = 0,\ \ x_{n-1} = 0,\ \dots,\ x_{j+1} = 0`,
      tex`(A^{-1})_{ij} = x_i = 0 \qquad (i > j)`,
      tex`\begin{pmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & -2 & 5 \\ 0 & 1 & -4 \\ 0 & 0 & 1 \end{pmatrix} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}`,
    ],
  },
  "la-split": {
    figures: ["la-split"],
    statement: tex`A = \underbrace{\frac{A + A^t}{2}}_{S} + \underbrace{\frac{A - A^t}{2}}_{K}`,
    steps: [
      tex`S^t = \frac{A^t + (A^t)^t}{2} = \frac{A^t + A}{2} = S`,
      tex`K^t = \frac{A^t - (A^t)^t}{2} = \frac{A^t - A}{2} = -K`,
      tex`S + K = \frac{A + A^t + A - A^t}{2} = \frac{2A}{2} = A`,
      tex`A = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}:\quad A + A^t = \begin{pmatrix} 2 & 6 \\ 6 & 6 \end{pmatrix},\quad A - A^t = \begin{pmatrix} 0 & 2 \\ -2 & 0 \end{pmatrix}`,
      tex`S = \begin{pmatrix} 1 & 3 \\ 3 & 3 \end{pmatrix},\quad K = \begin{pmatrix} 0 & 1 \\ -1 & 0 \end{pmatrix},\quad S + K = \begin{pmatrix} 1 & 4 \\ 2 & 3 \end{pmatrix}`,
      tex`A = S' + K' \;\Rightarrow\; A^t = S' - K' \;\Rightarrow\; S' = \frac{A + A^t}{2},\ K' = \frac{A - A^t}{2}`,
    ],
  },
} satisfies Record<string, DemoFormulas>;
