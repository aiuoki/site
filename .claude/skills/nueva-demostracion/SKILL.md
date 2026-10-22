---
name: nueva-demostracion
description: "Trigger: nueva demostración, demostrar fórmula, popup de demostración, figura SVG. Escribe una demostración paso a paso con figura."
license: Apache-2.0
metadata:
  author: "danielceban"
  version: "1.0"
---

## Activation Contract

Usar al añadir o reescribir una demostración de una fórmula de cualquier tema.

## Hard Rules

- Estructura obligatoria: enunciado, una o varias figuras SVG, pasos numerados (fórmula y explicación debajo de cada uno) y bloque «Para qué sirve».
- Cada término se define antes de usarlo; nada de jerga sin explicar.
- Datos de la demostración (pasos y fórmulas) en `src/demos/<tema>/`; textos en los archivos de idioma, nunca en el componente.
- Cada figura es un componente propio en `src/components/figures/`, un archivo por figura.
- Colores de las figuras solo con variables del tema (`var(--sin)`, `var(--z)`…); nunca hex.
- Fórmulas con KaTeX en la compilación, sin JavaScript en el navegador.
- Se abre con `DemoDialog` de `src/components/ui/`.

## Execution Steps

1. Escribe el enunciado y los pasos en orden, de lo conocido a lo nuevo.
2. Añade los datos en `src/demos/<tema>/` y los textos en todos los idiomas del tema.
3. Dibuja la figura en `src/components/figures/` con `viewBox` y sin tamaños fijos.
4. Enlázala desde la guía del tema.
5. Comprueba que se abre en todos los idiomas y que `npm test` y `npm run build` pasan.

## Output Contract

Demostración añadida, figuras creadas, idiomas cubiertos y resultado de la compilación.

## References

- `CLAUDE.md` — reglas de contenido didáctico.
- `src/config/theme.ts` — colores disponibles.
