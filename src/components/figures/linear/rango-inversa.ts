import ElemInverse from "./rango-inversa/ElemInverse.astro";
import ElemMatrix from "./rango-inversa/ElemMatrix.astro";
import EquivRows from "./rango-inversa/EquivRows.astro";
import GaussJordan from "./rango-inversa/GaussJordan.astro";
import InverseExample from "./rango-inversa/InverseExample.astro";
import InvProduct from "./rango-inversa/InvProduct.astro";
import InvRank from "./rango-inversa/InvRank.astro";
import InvTranspose from "./rango-inversa/InvTranspose.astro";
import Rank2x2 from "./rango-inversa/Rank2x2.astro";
import Rank3x3 from "./rango-inversa/Rank3x3.astro";
import SolveInverse from "./rango-inversa/SolveInverse.astro";
import TriangularRank from "./rango-inversa/TriangularRank.astro";

export const figures = {
  "la-elem-matrix": ElemMatrix,
  "la-elem-inverse": ElemInverse,
  "la-equiv-rows": EquivRows,
  "la-rank-2x2": Rank2x2,
  "la-rank-3x3": Rank3x3,
  "la-rank-triangular": TriangularRank,
  "la-gauss-jordan": GaussJordan,
  "la-inverse-example": InverseExample,
  "la-inv-rank": InvRank,
  "la-inv-product": InvProduct,
  "la-inv-transpose": InvTranspose,
  "la-solve-inverse": SolveInverse,
};
