import AddLaws from "./operaciones-matrices/AddLaws.astro";
import Block from "./operaciones-matrices/Block.astro";
import BlockC from "./operaciones-matrices/BlockC.astro";
import NonComm from "./operaciones-matrices/NonComm.astro";
import ProdChain from "./operaciones-matrices/ProdChain.astro";
import ProdDist from "./operaciones-matrices/ProdDist.astro";
import ProdEntry from "./operaciones-matrices/ProdEntry.astro";
import ProdIdentity from "./operaciones-matrices/ProdIdentity.astro";
import ProdSize from "./operaciones-matrices/ProdSize.astro";
import ScalarLaws from "./operaciones-matrices/ScalarLaws.astro";
import TraceLin from "./operaciones-matrices/TraceLin.astro";
import TraceProd from "./operaciones-matrices/TraceProd.astro";

export const figures = {
  "la-add-laws": AddLaws,
  "la-scalar-laws": ScalarLaws,
  "la-prod-entry": ProdEntry,
  "la-prod-size": ProdSize,
  "la-prod-chain": ProdChain,
  "la-prod-dist": ProdDist,
  "la-prod-identity": ProdIdentity,
  "la-non-comm": NonComm,
  "la-block": Block,
  "la-block-c": BlockC,
  "la-trace-lin": TraceLin,
  "la-trace-prod": TraceProd,
};
