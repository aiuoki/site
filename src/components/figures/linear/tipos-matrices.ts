import Anti from "./tipos-matrices/Anti.astro";
import AntiSquare from "./tipos-matrices/AntiSquare.astro";
import Gram from "./tipos-matrices/Gram.astro";
import Mirror from "./tipos-matrices/Mirror.astro";
import Split from "./tipos-matrices/Split.astro";
import SumTypes from "./tipos-matrices/SumTypes.astro";
import SymInv from "./tipos-matrices/SymInv.astro";
import SymProd from "./tipos-matrices/SymProd.astro";
import TranspProd from "./tipos-matrices/TranspProd.astro";
import TranspRect from "./tipos-matrices/TranspRect.astro";
import TriInv from "./tipos-matrices/TriInv.astro";
import TriProd from "./tipos-matrices/TriProd.astro";
import TriZones from "./tipos-matrices/TriZones.astro";

export const figures = {
  "la-transp-rect": TranspRect,
  "la-mirror": Mirror,
  "la-transp-prod": TranspProd,
  "la-gram": Gram,
  "la-sym-inv": SymInv,
  "la-sym-prod": SymProd,
  "la-sum-types": SumTypes,
  "la-anti": Anti,
  "la-anti-square": AntiSquare,
  "la-tri-prod": TriProd,
  "la-tri-inv": TriInv,
  "la-tri-zones": TriZones,
  "la-split": Split,
};
