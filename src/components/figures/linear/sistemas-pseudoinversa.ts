import AAt from "./sistemas-pseudoinversa/AAt.astro";
import ColSpace from "./sistemas-pseudoinversa/ColSpace.astro";
import Dimension from "./sistemas-pseudoinversa/Dimension.astro";
import FourCases from "./sistemas-pseudoinversa/FourCases.astro";
import GeneralSolution from "./sistemas-pseudoinversa/GeneralSolution.astro";
import Homogeneous from "./sistemas-pseudoinversa/Homogeneous.astro";
import LeftPseudo from "./sistemas-pseudoinversa/LeftPseudo.astro";
import LeftUnique from "./sistemas-pseudoinversa/LeftUnique.astro";
import NulLine from "./sistemas-pseudoinversa/NulLine.astro";
import Particular from "./sistemas-pseudoinversa/Particular.astro";
import RankNullity from "./sistemas-pseudoinversa/RankNullity.astro";
import RightPseudo from "./sistemas-pseudoinversa/RightPseudo.astro";

export const figures = {
  "la-nul-example": NulLine,
  "la-dimension": Dimension,
  "la-rank-nullity": RankNullity,
  "la-aat-invertible": AAt,
  "la-right-pseudo": RightPseudo,
  "la-particular": Particular,
  "la-homogeneous": Homogeneous,
  "la-general-solution": GeneralSolution,
  "la-left-pseudo": LeftPseudo,
  "la-left-unique": LeftUnique,
  "la-left-colspace": ColSpace,
  "la-both-cases": FourCases,
};
