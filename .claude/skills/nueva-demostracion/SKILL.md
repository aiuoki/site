---
name: nueva-demostracion
description: "Trigger: nueva demostración, demostrar fórmula, popup de demostración, figura SVG. Escribe una demostración paso a paso con figura."
license: Apache-2.0
metadata:
  author: "danielceban"
  version: "1.1"
---

## Activation Contract

Usar al añadir o reescribir una demostración de una fórmula de cualquier tema.

## Hard Rules

- Estructura obligatoria: enunciado, una o varias figuras SVG, pasos numerados (fórmula y explicación debajo de cada uno) y bloque «Para qué sirve».
- Cada término se define antes de usarlo; nada de jerga sin explicar.
- Fórmulas en LaTeX con macros: `\Sin \Cos \Tan \Cot \Sec \Csc`, `\Hyp \Opp \Adj \Rad`, `\hl{...}` para resaltar, `\degree` para grados (nunca `^\circ`).
- Una explicación por fórmula, en el mismo orden, en todos los idiomas del tema.
- Figuras: un componente por archivo en `src/components/figures/`, con primitivas de `parts/`; solo `var(--token)`, nunca hex; etiquetas con `notationFor(pageLocale(Astro.currentLocale))`.
- `<defs>` con ids únicos prefijados (`fig-<id>-...`).

## Execution Steps

1. Fórmulas: añade la entrada en `src/demos/<tema>/formulas.ts` (`figures`, `statement`, `steps`).
2. Textos: añade `{ title, steps[], use }` con el mismo id en `src/demos/<tema>/text/<lang>.json` para cada idioma.
3. Figura: crea `src/components/figures/<Nombre>.astro` y regístrala en `figures/index.ts`.
4. Enlace: añade el id a la lista del tema (`trigTopicDemos` o equivalente) y un disparador con `data-demo="<id>"` en la guía MDX (`IdCard`, `RatioCard`, `DefItem`...).
5. `npm test`: comprueba textos, número de pasos y que cada fórmula compila en todos los idiomas.
6. `npm run build` y abre el popup en el navegador.

## Output Contract

Demostración añadida, figuras creadas, idiomas cubiertos y resultado de tests y compilación.

## References

- `src/demos/trig/formulas.ts` — ejemplo completo.
- `src/demos/trig/trig-demos.test.ts` — validaciones.
- `src/components/figures/figures.test.ts` — validación de figuras.
