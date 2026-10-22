---
name: nuevo-tema
description: "Trigger: nueva asignatura, nuevo tema, añadir tema, activar Estadística o Álgebra lineal. Añade una asignatura o un tema al sitio."
license: Apache-2.0
metadata:
  author: "danielceban"
  version: "1.0"
---

## Activation Contract

Usar al añadir una asignatura, un tema dentro de una asignatura o al pasar una asignatura de «Próximamente» a disponible.

## Hard Rules

- El registro único de asignaturas y temas es `src/config/site.ts`. Las rutas salen de ahí; no crees páginas a mano.
- Slugs en español, en minúsculas y con guiones (`suma-angulos`).
- Ningún texto visible en el código: el nombre va en `src/i18n/ui/*.json` (`subjects.<slug>`, `topics.<slug>`) en los 9 idiomas.
- La lógica matemática nueva va en `src/lib/` como funciones puras con su `*.test.ts`.
- Respeta las reglas de contenido didáctico de `CLAUDE.md`.

## Decision Gates

| Caso | Acción |
|------|--------|
| Asignatura nueva | Añadir a `subjects` con `status: "soon"` y `topics: []` |
| Activar asignatura | Cambiar a `status: "available"` cuando tenga al menos un tema |
| Tema sin todos los idiomas | Limitar `locales` del tema; el resto usa `contentLocale()` con aviso |
| Tema con parte interactiva | Isla Svelte en `src/components/interactive/` |

## Execution Steps

1. Añade el tema en `site.ts` (`slug`, `symbol` opcional, `locales`).
2. Añade `topics.<slug>` (y `subjects.<slug>` si es nueva) a los 9 JSON de `src/i18n/ui/`.
3. Crea `src/content/<asignatura>/<tema>/<lang>.mdx` por idioma con `title`, `eyebrow`, `intro` y `description`. El cuerpo usa los componentes de `src/components/guide/` (registrados en `guide/index.ts`).
4. Si tiene lienzo interactivo, añade la isla en `src/components/interactive/<tema>/` y su caso en `TopicApp.astro`.
5. Si tiene demostraciones, sigue el skill `nueva-demostracion` y devuélvelas en `demosForTopic()` (`src/demos/index.ts`).
6. Ejecuta `npm test` (comprueba que existe el MDX de cada idioma declarado) y `npm run build`.

## Output Contract

Lista de archivos tocados, idiomas cubiertos y resultado de tests y compilación.

## References

- `CLAUDE.md` — reglas y estructura de carpetas.
- `src/config/site.ts` — registro de asignaturas y temas.
