import type { Locale } from "../i18n/locales";
import { complexDict, isComplexLocale } from "../i18n/topics/complejos";
import type { Words } from "../lib/notation";
import { complexDemoIds, complexDemoText, complexDemos, type ComplexDemoId } from "./complex";
import { linearDemoText, linearDemos, linearTopicDemos } from "./linear";
import { trigDemoText, trigDemos, trigTopicDemos, type TrigDemoId } from "./trig";
import type { DemoFormulas, DemoText } from "./types";

export interface TopicDemo {
  id: string;
  formulas: DemoFormulas;
  text: DemoText;
  // Topic words used by the formulas (\W{...}).
  words?: Words;
}

// A demonstration by id, in the given content language.
export function findDemo(id: string, lang: Locale): TopicDemo | null {
  if (id in trigDemos) {
    const key = id as TrigDemoId;
    return { id, formulas: trigDemos[key], text: trigDemoText[lang][key] };
  }
  if (id in complexDemos) {
    const key = id as ComplexDemoId;
    const cl = isComplexLocale(lang) ? lang : "en";
    return { id, formulas: complexDemos[key], text: complexDemoText[cl][key], words: complexDict(cl).words };
  }
  if (id in linearDemos) {
    const text = linearDemoText(id, lang);
    return text ? { id, formulas: linearDemos[id]!, text } : null;
  }
  return null;
}

// Demonstrations rendered (as dialogs) on a topic page.
export function demosForTopic(topic: string, lang: Locale): TopicDemo[] {
  const ids: readonly string[] =
    topic === "trigonometria" || topic === "suma-angulos" ? trigTopicDemos[topic]
    : topic === "complejos" ? complexDemoIds
    : Object.keys(linearTopicDemos[topic] ?? {});
  return ids.map((id) => findDemo(id, lang)).filter((d): d is TopicDemo => d !== null);
}
