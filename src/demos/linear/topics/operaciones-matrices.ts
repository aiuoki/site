import type { DemoFormulas } from "../../types";

const tex = String.raw;

// Properties of the operations with matrices (notes pages 3-6): sum, scalar
// product, product, block product and trace.
// Explanations live in ../text/operaciones-matrices/<lang>.json (one per step).
export const demos = {
  "la-add-laws": {
    figures: ["la-add-laws"],
    statement: tex`A + B = B + A,\qquad (A + B) + C = A + (B + C)`,
    steps: [
      tex`[A + B]_{ij} = a_{ij} + b_{ij}`,
      tex`a_{ij} + b_{ij} = b_{ij} + a_{ij} \;\Rightarrow\; A + B = B + A`,
      tex`[(A + B) + C]_{ij} = (a_{ij} + b_{ij}) + c_{ij} = a_{ij} + (b_{ij} + c_{ij}) = [A + (B + C)]_{ij}`,
      tex`a_{ij} + 0 = a_{ij} \;\Rightarrow\; A + 0 = 0 + A = A`,
      tex`a_{ij} + (-a_{ij}) = 0 \;\Rightarrow\; A + (-A) = 0`,
      tex`\begin{pmatrix} 1 & 2 & 0 \\ 3 & -1 & 4 \end{pmatrix} + \begin{pmatrix} 2 & 0 & 5 \\ -1 & 1 & 2 \end{pmatrix} = \begin{pmatrix} 3 & 2 & 5 \\ 2 & 0 & 6 \end{pmatrix}`,
    ],
  },
  "la-scalar-laws": {
    figures: ["la-scalar-laws"],
    statement: tex`\lambda(A + B) = \lambda A + \lambda B,\quad (\lambda + \mu)A = \lambda A + \mu A,\quad (\lambda\mu)A = \lambda(\mu A)`,
    steps: [
      tex`[\lambda A]_{ij} = \lambda\, a_{ij}`,
      tex`[\lambda(A + B)]_{ij} = \lambda(a_{ij} + b_{ij}) = \lambda a_{ij} + \lambda b_{ij} = [\lambda A + \lambda B]_{ij}`,
      tex`[(\lambda + \mu)A]_{ij} = (\lambda + \mu)\, a_{ij} = \lambda a_{ij} + \mu a_{ij} = [\lambda A + \mu A]_{ij}`,
      tex`[(\lambda\mu)A]_{ij} = (\lambda\mu)\, a_{ij} = \lambda(\mu\, a_{ij}) = [\lambda(\mu A)]_{ij}`,
      tex`3 \begin{pmatrix} 1 & -2 \\ 0 & 4 \end{pmatrix} = \begin{pmatrix} 3 & -6 \\ 0 & 12 \end{pmatrix}`,
      tex`(2 + 3)A = \begin{pmatrix} 5 & -10 \\ 0 & 20 \end{pmatrix} = \begin{pmatrix} 2 & -4 \\ 0 & 8 \end{pmatrix} + \begin{pmatrix} 3 & -6 \\ 0 & 12 \end{pmatrix} = 2A + 3A`,
    ],
  },
  "la-prod-entry": {
    figures: ["la-prod-entry"],
    statement: tex`c_{ij} = \sum_{k=1}^{p} a_{ik}\, b_{kj}`,
    steps: [
      tex`\begin{pmatrix} a_1 & a_2 & \cdots & a_p \end{pmatrix} \begin{pmatrix} b_1 \\ b_2 \\ \vdots \\ b_p \end{pmatrix} = a_1 b_1 + a_2 b_2 + \dots + a_p b_p`,
      tex`A \in M_{n \times p},\ B \in M_{p \times m} \;\Rightarrow\; C = AB \in M_{n \times m}`,
      tex`c_{ij} = A_{i\bullet}\, B_{\bullet j}`,
      tex`c_{ij} = a_{i1} b_{1j} + a_{i2} b_{2j} + \dots + a_{ip} b_{pj} = \sum_{k=1}^{p} a_{ik}\, b_{kj}`,
      tex`c_{21} = 4 \cdot 7 + 5 \cdot 9 + 6 \cdot 11 = 28 + 45 + 66 = 139`,
      tex`\begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \begin{pmatrix} 7 & 8 \\ 9 & 10 \\ 11 & 12 \end{pmatrix} = \begin{pmatrix} 58 & 64 \\ 139 & 154 \end{pmatrix}`,
    ],
  },
  "la-prod-size": {
    figures: ["la-prod-size"],
    statement: tex`(n \times p)\cdot(p \times m) = (n \times m)`,
    steps: [
      tex`A = [a_{ik}]_{n \times p},\qquad B = [b_{kj}]_{q \times m}`,
      tex`\begin{pmatrix} a_{i1} & \cdots & a_{ip} \end{pmatrix} \begin{pmatrix} b_{1j} \\ \vdots \\ b_{qj} \end{pmatrix} \;\Rightarrow\; p = q`,
      tex`c_{ij}\ (i = 1, \dots, n;\ j = 1, \dots, m) \;\Rightarrow\; AB \in M_{n \times m}`,
      tex`(2 \times 3)\cdot(3 \times 4) = (2 \times 4)`,
      tex`(3 \times 4)\cdot(2 \times 3):\quad 4 \neq 2`,
    ],
  },
  "la-prod-assoc": {
    figures: ["la-prod-chain"],
    statement: tex`(AB)C = A(BC)`,
    steps: [
      tex`A \in M_{n \times p},\ B \in M_{p \times q},\ C \in M_{q \times m} \;\Rightarrow\; (AB)C,\ A(BC) \in M_{n \times m}`,
      tex`[(AB)C]_{il} = \sum_{k=1}^{q} (AB)_{ik}\, c_{kl} = \sum_{k=1}^{q} \Bigl(\sum_{j=1}^{p} a_{ij}\, b_{jk}\Bigr) c_{kl}`,
      tex`[A(BC)]_{il} = \sum_{j=1}^{p} a_{ij}\, (BC)_{jl} = \sum_{j=1}^{p} a_{ij} \Bigl(\sum_{k=1}^{q} b_{jk}\, c_{kl}\Bigr)`,
      tex`[(AB)C]_{il} = [A(BC)]_{il} = \sum_{j=1}^{p} \sum_{k=1}^{q} a_{ij}\, b_{jk}\, c_{kl}`,
      tex`(AB)C = A(BC) =: ABC`,
      tex`A = \begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix},\ B = \begin{pmatrix} 0 & 1 \\ 3 & 1 \end{pmatrix},\ C = \begin{pmatrix} 1 & 0 \\ 2 & 1 \end{pmatrix}:\quad (AB)C = \begin{pmatrix} 12 & 3 \\ 5 & 1 \end{pmatrix} = A(BC)`,
    ],
  },
  "la-prod-dist": {
    figures: ["la-prod-dist"],
    statement: tex`(A + B)C = AC + BC,\qquad C(A + B) = CA + CB`,
    steps: [
      tex`A, B \in M_{n \times p},\ C \in M_{p \times m}`,
      tex`[(A + B)C]_{ij} = \sum_{k=1}^{p} (a_{ik} + b_{ik})\, c_{kj}`,
      tex`= \sum_{k=1}^{p} a_{ik}\, c_{kj} + \sum_{k=1}^{p} b_{ik}\, c_{kj} = [AC]_{ij} + [BC]_{ij}`,
      tex`[C(A + B)]_{ij} = \sum_{k=1}^{p} c_{ik}\, (a_{kj} + b_{kj}) = [CA]_{ij} + [CB]_{ij}`,
      tex`\begin{pmatrix} 1 & 3 \\ 3 & 2 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 2 & 1 \end{pmatrix} = \begin{pmatrix} 7 & 3 \\ 7 & 2 \end{pmatrix} = \begin{pmatrix} 5 & 2 \\ 2 & 1 \end{pmatrix} + \begin{pmatrix} 2 & 1 \\ 5 & 1 \end{pmatrix}`,
    ],
  },
  "la-prod-identity": {
    figures: ["la-prod-identity"],
    statement: tex`IA = AI = A`,
    steps: [
      tex`I = [\delta_{ij}],\qquad \delta_{ij} = \begin{cases} 1 & i = j \\ 0 & i \neq j \end{cases}`,
      tex`[I_n A]_{ij} = \sum_{k=1}^{n} \delta_{ik}\, a_{kj} = a_{ij}`,
      tex`[A I_m]_{ij} = \sum_{k=1}^{m} a_{ik}\, \delta_{kj} = a_{ij}`,
      tex`A \in M_{n \times m}:\quad I_n A = A I_m = A`,
      tex`\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{pmatrix} \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}`,
    ],
  },
  "la-prod-noncomm": {
    figures: ["la-non-comm"],
    statement: tex`AB \neq BA`,
    steps: [
      tex`A \in M_{n \times p},\ B \in M_{p \times n} \;\Rightarrow\; AB \in M_{n \times n},\ BA \in M_{p \times p}`,
      tex`A \in M_{2 \times 3},\ B \in M_{3 \times 2}:\quad AB = \begin{pmatrix} 5 & 2 \\ 5 & 7 \end{pmatrix},\quad BA = \begin{pmatrix} 1 & 2 & 0 \\ 5 & 5 & 2 \\ 9 & 3 & 6 \end{pmatrix}`,
      tex`A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix},\ B = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}:\quad AB = \begin{pmatrix} 2 & 1 \\ 4 & 3 \end{pmatrix},\quad BA = \begin{pmatrix} 3 & 4 \\ 1 & 2 \end{pmatrix}`,
      tex`(AB)_{11} = 1 \cdot 0 + 2 \cdot 1 = 2 \neq 3 = 0 \cdot 1 + 1 \cdot 3 = (BA)_{11}`,
      tex`IA = AI,\qquad A^2 A = A A^2,\qquad (\lambda I) A = A (\lambda I)`,
    ],
  },
  "la-block": {
    figures: ["la-block", "la-block-c"],
    statement: tex`\begin{pmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{pmatrix} \begin{pmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end{pmatrix} = \begin{pmatrix} A_{11}B_{11} + A_{12}B_{21} & A_{11}B_{12} + A_{12}B_{22} \\ A_{21}B_{11} + A_{22}B_{21} & A_{21}B_{12} + A_{22}B_{22} \end{pmatrix}`,
    steps: [
      tex`A_{ik}: n_i \times p_k,\qquad B_{kj}: p_k \times m_j`,
      tex`c_{ij} = \sum_{k=1}^{p} a_{ik}\, b_{kj} = \sum_{k=1}^{p_1} a_{ik}\, b_{kj} + \sum_{k=p_1+1}^{p} a_{ik}\, b_{kj}`,
      tex`C_{ij} = A_{i1} B_{1j} + A_{i2} B_{2j}`,
      tex`A = \begin{pmatrix} 1 & 2 & 1 & 0 \\ 3 & 4 & 0 & 1 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 2 \end{pmatrix},\ B = \begin{pmatrix} 1 & 1 & 0 & 1 \\ 0 & 1 & 1 & 0 \\ 1 & 0 & 1 & 2 \\ 2 & 1 & 0 & 1 \end{pmatrix}`,
      tex`C_{11} = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} + \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ 2 & 1 \end{pmatrix} = \begin{pmatrix} 1 & 3 \\ 3 & 7 \end{pmatrix} + \begin{pmatrix} 1 & 0 \\ 2 & 1 \end{pmatrix} = \begin{pmatrix} 2 & 3 \\ 5 & 8 \end{pmatrix}`,
      tex`C_{12} = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} + \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix} = \begin{pmatrix} 2 & 1 \\ 4 & 3 \end{pmatrix} + \begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix} = \begin{pmatrix} 3 & 3 \\ 4 & 4 \end{pmatrix}`,
      tex`C_{21} = 0 \cdot B_{11} + 2 B_{21} = \begin{pmatrix} 2 & 0 \\ 4 & 2 \end{pmatrix},\qquad C_{22} = 0 \cdot B_{12} + 2 B_{22} = \begin{pmatrix} 2 & 4 \\ 0 & 2 \end{pmatrix}`,
      tex`AB = \begin{pmatrix} 2 & 3 & 3 & 3 \\ 5 & 8 & 4 & 4 \\ 2 & 0 & 2 & 4 \\ 4 & 2 & 0 & 2 \end{pmatrix}`,
    ],
  },
  "la-trace-lin": {
    figures: ["la-trace-lin"],
    statement: tex`\operatorname{tr}(A + B) = \operatorname{tr}A + \operatorname{tr}B,\qquad \operatorname{tr}(\lambda A) = \lambda \operatorname{tr}A`,
    steps: [
      tex`\operatorname{tr}A = a_{11} + a_{22} + \dots + a_{nn} = \sum_{i=1}^{n} a_{ii}`,
      tex`\operatorname{tr}(A + B) = \sum_{i=1}^{n} (a_{ii} + b_{ii}) = \sum_{i=1}^{n} a_{ii} + \sum_{i=1}^{n} b_{ii}`,
      tex`= \operatorname{tr}A + \operatorname{tr}B`,
      tex`\operatorname{tr}(\lambda A) = \sum_{i=1}^{n} \lambda\, a_{ii} = \lambda \sum_{i=1}^{n} a_{ii} = \lambda \operatorname{tr}A`,
      tex`\operatorname{tr}\begin{pmatrix} 6 & 2 \\ 4 & 6 \end{pmatrix} = 6 + 6 = 12 = 5 + 7 = \operatorname{tr}\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} + \operatorname{tr}\begin{pmatrix} 5 & 0 \\ 1 & 2 \end{pmatrix}`,
    ],
  },
  "la-trace-prod": {
    figures: ["la-trace-prod"],
    statement: tex`\operatorname{tr}(AB) = \operatorname{tr}(BA)`,
    steps: [
      tex`A \in M_{n \times p},\ B \in M_{p \times n} \;\Rightarrow\; AB \in M_{n \times n},\ BA \in M_{p \times p}`,
      tex`\operatorname{tr}(AB) = \sum_{i=1}^{n} (AB)_{ii} = \sum_{i=1}^{n} \sum_{k=1}^{p} a_{ik}\, b_{ki}`,
      tex`\operatorname{tr}(BA) = \sum_{k=1}^{p} (BA)_{kk} = \sum_{k=1}^{p} \sum_{i=1}^{n} b_{ki}\, a_{ik}`,
      tex`\sum_{i=1}^{n} \sum_{k=1}^{p} a_{ik}\, b_{ki} = \sum_{k=1}^{p} \sum_{i=1}^{n} b_{ki}\, a_{ik} \;\Rightarrow\; \operatorname{tr}(AB) = \operatorname{tr}(BA)`,
      tex`A = \begin{pmatrix} 1 & 2 & 0 \\ 3 & 1 & 2 \end{pmatrix},\ B = \begin{pmatrix} 1 & 0 \\ 2 & 1 \\ 0 & 3 \end{pmatrix}:\quad \operatorname{tr}(AB) = 5 + 7 = 12 = 1 + 5 + 6 = \operatorname{tr}(BA)`,
      tex`\operatorname{tr}(ABC) = \operatorname{tr}(BCA) = \operatorname{tr}(CAB)`,
    ],
  },
} satisfies Record<string, DemoFormulas>;
