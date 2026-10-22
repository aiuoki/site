import Comp from "./Comp.astro";
import Cos from "./Cos.astro";
import Cot from "./Cot.astro";
import Csc from "./Csc.astro";
import Dbl from "./Dbl.astro";
import Dbl2 from "./Dbl2.astro";
import Dist from "./Dist.astro";
import Half from "./Half.astro";
import Notables from "./Notables.astro";
import Pyth from "./Pyth.astro";
import PythCot from "./PythCot.astro";
import PythTan from "./PythTan.astro";
import Rad from "./Rad.astro";
import Rectan from "./Rectan.astro";
import S2p from "./S2p.astro";
import Sec from "./Sec.astro";
import Signs from "./Signs.astro";
import Sin from "./Sin.astro";
import SumSin from "./SumSin.astro";
import SumTan from "./SumTan.astro";
import Tan from "./Tan.astro";

export const figures = {
  sin: Sin,
  cos: Cos,
  pyth: Pyth,
  tan: Tan,
  sec: Sec,
  "pyth-tan": PythTan,
  cot: Cot,
  csc: Csc,
  "pyth-cot": PythCot,
  sumsin: SumSin,
  sumtan: SumTan,
  dbl: Dbl,
  dbl2: Dbl2,
  half: Half,
  rectan: Rectan,
  dist: Dist,
  comp: Comp,
  signs: Signs,
  rad: Rad,
  s2p: S2p,
  notables: Notables,
};

export type FigureId = keyof typeof figures;
