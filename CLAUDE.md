# Apuntes de Matemáticas · danielceban.com

Web de apuntes interactivos de matemáticas. Astro (salida estática) + islas de Svelte 5, desplegada en Cloudflare Pages desde la rama `main`.

## Cómo trabajar conmigo

- Respóndeme siempre en español, de forma directa y concisa. Aplica las correcciones sin explicaciones largas.
- Antes de borrar archivos o cambiar algo que no se pueda deshacer, pregúntame.
- Al terminar un cambio: compila (`npm run build`), revisa que no haya errores y dime en una o dos frases qué ha cambiado.
- Haz commits pequeños con mensajes en español.

## Diseño

- Nada de emojis en ningún sitio: ni en textos, ni en código, ni en la UI, ni en los commits.
- Tipografías: Young Serif (títulos), Figtree (texto), STIX Two Text (fórmulas) e IBM Plex Mono (etiquetas y números). No uses Inter, Roboto, Arial ni fuentes genéricas. Si se cambia una fuente, que sea distinta de la que había.
- Todos los colores salen de los tokens del tema (`src/config/theme.ts`). Nunca escribas un color hex directamente en un componente.
- Hay modo claro y oscuro con un botón sol/luna, y la elección se guarda en `localStorage`.
- El footer siempre queda pegado abajo, aunque la página sea corta. A la izquierda el correo `hello@danielceban.com`, en el centro `danielceban.com` y a la derecha `© 2026 Daniel Ceban`, todo debajo de una línea.
- Botón de donación «Invítame a un café» que enlaza a `https://buymeacoffee.com/danielceban`, en la cabecera y en un bloque antes del footer.
- Selector de idioma con banderas arriba a la derecha.
- Nada de barras de scroll visibles en menús y pestañas.
- Diseño responsive: tiene que verse bien desde 360 px de ancho, sin scroll horizontal.

## Código

- Ningún archivo de más de unas 300 líneas. Si crece, se divide en módulos.
- TypeScript en todo el código nuevo.
- La lógica matemática va en funciones puras dentro de `src/lib/`, sin tocar el DOM, para poder probarla.
- Los componentes interactivos son islas de Svelte. El resto de la página es HTML estático generado por Astro.
- Ningún texto visible escrito a mano en los componentes: todo sale de los archivos de idioma.

## Contenido didáctico

- Se explica paso a paso, en el orden de los apuntes.
- Cada término se define antes de usarlo y no hay jerga sin explicar.
- Siempre hay ejemplos resueltos.
- Cada concepto termina con «Para qué sirve».
- Cada demostración tiene: un enunciado, una o varias figuras SVG, pasos numerados (una fórmula y una explicación debajo de cada uno) y un bloque «Para qué sirve».

## Entorno

- Node 24 (Homebrew `node@24`, keg-only: añadir `/opt/homebrew/opt/node@24/bin` al `PATH` si `node` no se encuentra).
- `legacy/` es la web antigua: solo referencia visual y funcional, no se publica ni se compila.
