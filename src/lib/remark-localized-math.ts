import type { Notation } from "./notation";
import { expandNotation } from "./notation";

interface MathNode {
  type: string;
  value?: string;
  children?: MathNode[];
}

// Expands \Sin, \Hyp... inside $...$ of an MDX file using the notation of the
// file's language, taken from its name (src/content/.../<lang>.mdx).
export function remarkLocalizedMath(options: { notations: Record<string, Notation> }) {
  return (tree: MathNode, file: { path?: string }) => {
    const lang = file.path?.match(/([a-z]{2})\.mdx?$/)?.[1];
    const notation = lang ? options.notations[lang] : undefined;
    if (!notation) return;
    const walk = (node: MathNode) => {
      if ((node.type === "math" || node.type === "inlineMath") && node.value) {
        node.value = expandNotation(node.value, notation);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
