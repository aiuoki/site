import type { UiDict } from "../../../i18n";
import type { Notation } from "../../../lib/notation";

export type TrigStrings = UiDict["trig"];

export interface TrigIslandProps {
  strings: TrigStrings;
  notation: Notation;
  // BCP 47 locale for number formatting.
  locale: string;
  seeDemo: string;
}
