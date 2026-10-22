import ca from "./text/ca.json";
import de from "./text/de.json";
import en from "./text/en.json";
import es from "./text/es.json";
import fr from "./text/fr.json";
import it from "./text/it.json";
import pt from "./text/pt.json";
import ro from "./text/ro.json";
import ru from "./text/ru.json";
import type { Locale } from "../../i18n/locales";
import type { DemoText } from "../types";
import { trigDemos, type TrigDemoId } from "./formulas";

export { trigDemos, trigTopicDemos, type TrigDemoId } from "./formulas";

export const trigDemoText: Record<Locale, Record<TrigDemoId, DemoText>> = { es, ca, en, fr, de, it, pt, ro, ru };

export const trigDemoIds = Object.keys(trigDemos) as TrigDemoId[];
