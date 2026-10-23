import Comp from "./Comp.astro";
import Cos from "./Cos.astro";
import Cot from "./Cot.astro";
import Csc from "./Csc.astro";
import CxConj from "./CxConj.astro";
import CxConjsum from "./CxConjsum.astro";
import CxEuler from "./CxEuler.astro";
import CxExample from "./CxExample.astro";
import CxExp from "./CxExp.astro";
import CxInv from "./CxInv.astro";
import CxIpow from "./CxIpow.astro";
import CxLog from "./CxLog.astro";
import CxMoivre from "./CxMoivre.astro";
import CxPhasor from "./CxPhasor.astro";
import CxPhasorE from "./CxPhasorE.astro";
import CxPlane from "./CxPlane.astro";
import CxPolar from "./CxPolar.astro";
import CxProd from "./CxProd.astro";
import CxProdE from "./CxProdE.astro";
import CxQuad from "./CxQuad.astro";
import CxQuot from "./CxQuot.astro";
import CxRoots from "./CxRoots.astro";
import CxRoots3 from "./CxRoots3.astro";
import CxRoots8 from "./CxRoots8.astro";
import CxRot from "./CxRot.astro";
import CxTri from "./CxTri.astro";
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
  "cx-plane": CxPlane,
  "cx-ipow": CxIpow,
  "cx-inv": CxInv,
  "cx-phasor": CxPhasor,
  "cx-phasor-e": CxPhasorE,
  "cx-conj": CxConj,
  "cx-conjsum": CxConjsum,
  "cx-tri": CxTri,
  "cx-prod": CxProd,
  "cx-prod-e": CxProdE,
  "cx-quot": CxQuot,
  "cx-polar": CxPolar,
  "cx-quad": CxQuad,
  "cx-rot": CxRot,
  "cx-moivre": CxMoivre,
  "cx-euler": CxEuler,
  "cx-roots": CxRoots,
  "cx-roots3": CxRoots3,
  "cx-roots8": CxRoots8,
  "cx-exp": CxExp,
  "cx-log": CxLog,
  "cx-example": CxExample,
};

// Linear algebra figures register themselves: figures/linear/<topic>.ts
// exports `figures` (id -> component).
type FigureComponent = (typeof figures)[keyof typeof figures];
const linear = import.meta.glob<Record<string, FigureComponent>>("./linear/*.ts", { eager: true, import: "figures" });
Object.assign(figures, ...Object.values(linear));

export type FigureId = keyof typeof figures;
