---
name: traducir
description: "Trigger: traducir, nuevo idioma, completar idioma, falta texto, i18n. Añade o completa un idioma de la interfaz o del contenido."
license: Apache-2.0
metadata:
  author: "danielceban"
  version: "1.0"
---

## Activation Contract

Usar al añadir un idioma nuevo, completar textos que faltan o traducir el contenido de un tema.

## Hard Rules

- `es` es el idioma de referencia: todos los JSON de `src/i18n/ui/` tienen exactamente sus mismas claves.
- Mantén los marcadores `{nombre}` tal cual; `t()` los rellena.
- Notación matemática según la convención del idioma (por ejemplo `sen` en español).
- Si un tema no está traducido, el catalán muestra la versión española y el resto de idiomas la inglesa, con el aviso `nav.contentFallback`.
- Nada de traducciones automáticas sin revisar el sentido matemático.

## Decision Gates

| Caso | Acción |
|------|--------|
| Idioma nuevo | Añadir a `locales` y `localeMeta` en `src/i18n/locales.ts`, crear su JSON e importarlo en `src/i18n/index.ts` |
| Texto de interfaz | Editar `src/i18n/ui/<lang>.json` |
| Contenido de un tema | Crear `src/content/<asignatura>/<tema>/<lang>.mdx` y añadir el idioma a `locales` del tema en `site.ts` |

## Execution Steps

1. Copia la estructura de `es.json` y traduce cada valor.
2. Ejecuta `npm test`: el test de i18n falla si falta o sobra una clave o hay textos vacíos.
3. Ejecuta `npm run build` y revisa la página en ese idioma.

## Output Contract

Idioma tocado, claves añadidas y resultado de tests y compilación.

## References

- `src/i18n/index.ts` — `t()`, `contentLocale()` y fallback.
- `src/i18n/i18n.test.ts` — comprobación de claves.
