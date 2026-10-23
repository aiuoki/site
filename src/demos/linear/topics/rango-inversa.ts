import type { DemoFormulas } from "../../types";
import { aug, pm } from "../rank-tex";

const tex = String.raw;

// Topic 3 of the notes: elementary operations, rank and the inverse.
// Formulas carry no words (they are shared by every language), so the rank
// is written r and the operations are named in the texts of ./text/rango-inversa.
export const demos = {
  "la-elem-matrix": {
    figures: ["la-elem-matrix"],
    statement: tex`${pm([[1, 0], [-3, 1]])}${pm([[1, 2], [3, 4]])} = ${pm([[1, 2], [0, -2]])}`,
    steps: [
      tex`E = ${pm([[1, 0], [-3, 1]])}`,
      tex`(EA)_{i\bullet} = e_{i1}\,A_{1\bullet} + e_{i2}\,A_{2\bullet} + \cdots`,
      tex`(EA)_{1\bullet} = \hl{1}\cdot(1,\ 2) + \hl{0}\cdot(3,\ 4) = (1,\ 2)`,
      tex`(EA)_{2\bullet} = \hl{-3}\cdot(1,\ 2) + \hl{1}\cdot(3,\ 4) = (0,\ -2)`,
      tex`EA = ${pm([[1, 2], [0, -2]])}`,
      tex`${pm([[0, 1], [1, 0]])}${pm([["a", "b"], ["c", "d"]])} = ${pm([["c", "d"], ["a", "b"]])}`,
      tex`${pm([[1, 0], [0, "k"]])}${pm([["a", "b"], ["c", "d"]])} = ${pm([["a", "b"], ["kc", "kd"]])}`,
    ],
  },
  "la-elem-inverse": {
    figures: ["la-elem-inverse"],
    statement: tex`${pm([[1, 0], [-3, 1]])}^{-1} = ${pm([[1, 0], [3, 1]])}`,
    steps: [
      tex`E = ${pm([[1, 0], [-3, 1]])},\qquad E' = ${pm([[1, 0], [3, 1]])}`,
      tex`E'E = ${pm([[1, 0], [3, 1]])}${pm([[1, 0], [-3, 1]])} = ${pm([[1, 0], [-3 + 3, 1]])} = I`,
      tex`${pm([[0, 1], [1, 0]])}${pm([[0, 1], [1, 0]])} = ${pm([[1, 0], [0, 1]])} = I`,
      tex`${pm([[1, 0], [0, "k"]])}${pm([[1, 0], [0, "1/k"]])} = ${pm([[1, 0], [0, 1]])} = I\qquad (k \neq 0)`,
      tex`P = E_k \cdots E_2 E_1 \;\Rightarrow\; P^{-1} = E_1^{-1} E_2^{-1} \cdots E_k^{-1}`,
    ],
  },
  "la-equiv-rows": {
    figures: ["la-equiv-rows"],
    statement: tex`[\,I \mid A\,] \sim [\,P \mid B\,] \;\Rightarrow\; B = PA`,
    steps: [
      tex`E\,[\,I \mid A\,] = [\,EI \mid EA\,] = [\,E \mid EA\,]`,
      tex`E_2\,[\,E_1 \mid E_1A\,] = [\,E_2E_1 \mid E_2E_1A\,]`,
      tex`[\,E_k \cdots E_1 \mid E_k \cdots E_1 A\,] = [\,P \mid PA\,] = [\,P \mid B\,]`,
      tex`${aug(2, [[1, 0, 1, 2], [0, 1, 3, 4]])} \to ${aug(2, [[1, 0, 1, 2], [-3, 1, 0, -2]])} \to ${aug(2, [[-2, 1, 1, 0], [-3, 1, 0, -2]])}`,
      tex`PA = ${pm([[-2, 1], [-3, 1]])}${pm([[1, 2], [3, 4]])} = ${pm([[1, 0], [0, -2]])} = B`,
      tex`B = PA \;\Rightarrow\; A = P^{-1}B`,
    ],
  },
  "la-rank-2x2": {
    figures: ["la-rank-2x2"],
    statement: tex`\det = ad - bc \neq 0 \iff r = 2`,
    steps: [
      tex`a \neq 0:\quad ${pm([["a", "b"], ["c", "d"]])} \sim ${pm([["a", "b"], [0, "d - \\frac{bc}{a}"]])}`,
      tex`d - \dfrac{bc}{a} = \dfrac{ad - bc}{a} = \dfrac{\det}{a}`,
      tex`\det \neq 0 \;\Rightarrow\; r = 2 \qquad\qquad \det = 0 \;\Rightarrow\; r = 1`,
      tex`a = 0:\quad ${pm([[0, "b"], ["c", "d"]])} \sim ${pm([["c", "d"], [0, "b"]])},\qquad \det = -bc`,
      tex`\det${pm([[1, 2], [3, 4]])} = 4 - 6 = -2 \neq 0 \;\Rightarrow\; r = 2`,
      tex`\det${pm([[1, 2], [2, 4]])} = 4 - 4 = 0 \;\Rightarrow\; r = 1`,
    ],
  },
  "la-rank-3x3": {
    figures: ["la-rank-3x3"],
    statement: tex`A = ${pm([[0, 1, 2], [1, 1, 1], [2, 3, 4]])}:\quad \det A = 0,\ r = 2`,
    steps: [
      tex`\det A = 0\cdot1\cdot4 + 1\cdot1\cdot2 + 2\cdot1\cdot3 - 2\cdot1\cdot2 - 1\cdot1\cdot4 - 0\cdot1\cdot3`,
      tex`= 0 + 2 + 6 - 4 - 4 - 0 = 0 \;\Rightarrow\; r < 3`,
      tex`\begin{vmatrix} 1 & 1 \\ 2 & 3 \end{vmatrix} = 3 - 2 = 1 \neq 0 \;\Rightarrow\; r \ge 2`,
      tex`${pm([[0, 1, 2], [1, 1, 1], [2, 3, 4]])} \sim ${pm([[1, 1, 1], [0, 1, 2], [2, 3, 4]])} \sim ${pm([[1, 1, 1], [0, 1, 2], [0, 0, 0]])}`,
      tex`B = ${pm([[1, 2, 3], [2, 4, 6], [3, 6, 9]])}:\ \begin{vmatrix} 1 & 2 \\ 2 & 4 \end{vmatrix} = 0,\ \begin{vmatrix} 2 & 3 \\ 4 & 6 \end{vmatrix} = 0,\ \dots \;\Rightarrow\; r = 1`,
    ],
  },
  "la-rank-triangular": {
    figures: ["la-rank-triangular"],
    statement: tex`\begin{vmatrix} t_{11} & * & * \\ 0 & \ddots & * \\ 0 & 0 & t_{nn} \end{vmatrix} = t_{11}\,t_{22} \cdots t_{nn}`,
    steps: [
      tex`\det${pm([[2, 1, 3], [0, -1, 4], [0, 0, 5]])} = 2\begin{vmatrix} -1 & 4 \\ 0 & 5 \end{vmatrix} = 2\cdot(-5) = -10`,
      tex`2 \cdot (-1) \cdot 5 = -10 \neq 0 \;\Rightarrow\; r = 3`,
      tex`T' = ${pm([[2, 1, 3], [0, 0, 4], [0, 0, 5]])} \sim ${pm([[2, 1, 3], [0, 0, 4], [0, 0, 0]])} \;\Rightarrow\; r = 2`,
      tex`t_{kk} = 0 \;\Rightarrow\; t_{k1} = \cdots = t_{kk} = 0,\ \ t_{k+1,1} = \cdots = t_{k+1,k} = 0,\ \dots`,
      tex`\hl{n - k + 1} \;>\; \hl{n - k}`,
    ],
  },
  "la-gauss-jordan": {
    figures: ["la-gauss-jordan"],
    statement: tex`[\,A \mid I\,] \sim [\,I \mid A^{-1}\,]`,
    steps: [
      tex`E_k \cdots E_2 E_1\,A = I \qquad (P = E_k \cdots E_1)`,
      tex`E_k \cdots E_1\,[\,A \mid I\,] = [\,PA \mid PI\,] = [\,I \mid P\,]`,
      tex`PA = I \;\Rightarrow\; A = P^{-1} \;\Rightarrow\; AP = P^{-1}P = I`,
      tex`PA = AP = I \;\Rightarrow\; P = A^{-1}`,
    ],
  },
  "la-inverse-example": {
    figures: ["la-inverse-example"],
    statement: tex`${pm([[1, 2], [2, 5]])}^{-1} = ${pm([[5, -2], [-2, 1]])}`,
    steps: [
      tex`[\,A \mid I\,] = ${aug(2, [[1, 2, 1, 0], [2, 5, 0, 1]])}`,
      tex`\sim ${aug(2, [[1, 2, 1, 0], [0, 1, -2, 1]])}`,
      tex`\sim ${aug(2, [[1, 0, 5, -2], [0, 1, -2, 1]])} = [\,I \mid A^{-1}\,]`,
      tex`AA^{-1} = ${pm([[1, 2], [2, 5]])}${pm([[5, -2], [-2, 1]])} = ${pm([[5 - 4, -2 + 2], [10 - 10, -4 + 5]])} = I`,
      tex`A^{-1} = \dfrac{1}{ad - bc}${pm([["d", "-b"], ["-c", "a"]])} = \dfrac{1}{1}${pm([[5, -2], [-2, 1]])}`,
    ],
  },
  "la-inv-rank": {
    figures: ["la-inv-rank"],
    statement: tex`\exists\, A^{-1} \iff r = n`,
    steps: [
      tex`r = n \;\Rightarrow\; PA = I \;\Rightarrow\; P = A^{-1}`,
      tex`\exists\, A^{-1},\ r < n \;\Rightarrow\; PA = E,\quad E_{n\bullet} = (0, \dots, 0)`,
      tex`P = P(AA^{-1}) = (PA)A^{-1} = EA^{-1}`,
      tex`P_{n\bullet} = E_{n\bullet}\,A^{-1} = (0, \dots, 0)`,
      tex`(PP^{-1})_{n\bullet} = P_{n\bullet}\,P^{-1} = (0, \dots, 0) \neq I_{n\bullet}`,
      tex`${aug(2, [[1, 2, 1, 0], [2, 4, 0, 1]])} \sim ${aug(2, [[1, 2, 1, 0], [0, 0, -2, 1]])} \;\Rightarrow\; \nexists\, A^{-1}`,
    ],
  },
  "la-inv-product": {
    figures: ["la-inv-product"],
    statement: tex`(AB)^{-1} = B^{-1}A^{-1}`,
    steps: [
      tex`(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1}`,
      tex`= A\,I\,A^{-1} = AA^{-1} = I`,
      tex`(B^{-1}A^{-1})(AB) = B^{-1}(A^{-1}A)B = B^{-1}B = I`,
      tex`A = ${pm([[1, 2], [0, 1]])},\ B = ${pm([[1, 0], [3, 1]])},\ AB = ${pm([[7, 2], [3, 1]])}`,
      tex`B^{-1}A^{-1} = ${pm([[1, 0], [-3, 1]])}${pm([[1, -2], [0, 1]])} = ${pm([[1, -2], [-3, 7]])} = (AB)^{-1}`,
      tex`A^{-1}B^{-1} = ${pm([[7, -2], [-3, 1]])} \neq (AB)^{-1}`,
    ],
  },
  "la-inv-transpose": {
    figures: ["la-inv-transpose"],
    statement: tex`(A^t)^{-1} = (A^{-1})^t`,
    steps: [
      tex`(XY)^t = Y^tX^t,\qquad I^t = I`,
      tex`A^t\,(A^{-1})^t = (A^{-1}A)^t = I^t = I`,
      tex`(A^{-1})^t\,A^t = (AA^{-1})^t = I^t = I`,
      tex`A = ${pm([[1, 2], [3, 5]])},\quad A^{-1} = ${pm([[-5, 2], [3, -1]])},\quad (A^{-1})^t = ${pm([[-5, 3], [2, -1]])}`,
      tex`A^t = ${pm([[1, 3], [2, 5]])},\quad (A^t)^{-1} = ${pm([[-5, 3], [2, -1]])}`,
    ],
  },
  "la-solve-inverse": {
    figures: ["la-solve-inverse"],
    statement: tex`AX = b \;\Rightarrow\; X = A^{-1}b`,
    steps: [
      tex`AX = b \;\Rightarrow\; A^{-1}(AX) = A^{-1}b`,
      tex`(A^{-1}A)\,X = A^{-1}b`,
      tex`I\,X = X = A^{-1}b`,
      tex`A(A^{-1}b) = (AA^{-1})\,b = I\,b = b`,
      tex`${pm([[2, 1], [1, 1]])}\binom{x}{y} = \binom{3}{2} \;\Rightarrow\; X = ${pm([[1, -1], [-1, 2]])}\binom{3}{2} = \binom{1}{1}`,
    ],
  },
} satisfies Record<string, DemoFormulas>;
