// Linear algebra demonstrations, one module per topic:
//   topics/<topic-slug>.ts exports `demos` (id -> DemoFormulas)
//   text/<topic-slug>/{es,en}.json holds { id: DemoText }
// New topic files are picked up automatically.
import type { DemoFormulas, DemoText } from "../types";

const modules = import.meta.glob<Record<string, DemoFormulas>>("./topics/*.ts", { eager: true, import: "demos" });
const texts = import.meta.glob<Record<string, DemoText>>("./text/*/*.json", { eager: true, import: "default" });

const topicOf = (path: string) => path.split("/").pop()!.replace(/\.ts$/, "");

// Topic slug -> its demonstrations, in file order.
export const linearTopicDemos: Record<string, Record<string, DemoFormulas>> = Object.fromEntries(
  Object.entries(modules).map(([path, demos]) => [topicOf(path), demos]),
);

export const linearDemos: Record<string, DemoFormulas> = Object.assign({}, ...Object.values(linearTopicDemos));

export function linearDemoText(id: string, lang: string): DemoText | null {
  const l = lang === "es" ? "es" : "en";
  for (const [topic, demos] of Object.entries(linearTopicDemos)) {
    if (id in demos) return texts[`./text/${topic}/${l}.json`]?.[id] ?? null;
  }
  return null;
}
