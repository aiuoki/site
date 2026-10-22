import en from "./text/en.json";
import es from "./text/es.json";
import type { ComplexLocale } from "../../i18n/topics/complejos";
import type { DemoText } from "../types";
import { complexBasics } from "./basics";
import { complexPolar } from "./polar";

export const complexDemos = { ...complexBasics, ...complexPolar };
export type ComplexDemoId = keyof typeof complexDemos;
export const complexDemoIds = Object.keys(complexDemos) as ComplexDemoId[];

export const complexDemoText: Record<ComplexLocale, Record<ComplexDemoId, DemoText>> = { es, en };
