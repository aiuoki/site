import type { Locale } from "../i18n/locales";
import { trigDemoText, trigDemos, trigTopicDemos } from "./trig";
import type { DemoFormulas, DemoText } from "./types";

export interface TopicDemo {
  id: string;
  formulas: DemoFormulas;
  text: DemoText;
}

// Demonstrations rendered (as dialogs) on a topic page.
export function demosForTopic(topic: string, lang: Locale): TopicDemo[] {
  if (topic === "trigonometria" || topic === "suma-angulos") {
    return trigTopicDemos[topic].map((id) => ({ id, formulas: trigDemos[id], text: trigDemoText[lang][id] }));
  }
  return [];
}
