# Apuntes de Matemáticas

Apuntes interactivos de matemáticas en [danielceban.com](https://danielceban.com).

## Arrancar

Requiere Node 22.23 o superior (el proyecto usa Node 24).

```sh
npm install
npm run dev       # servidor local en http://localhost:4321
```

## Compilar

```sh
npm run build     # astro check (tipos) + compilación estática en dist/
npm run preview   # sirve dist/ en local
```

## Desplegar

Cloudflare Pages, desde la rama `main`:

- Preset: Astro
- Comando de compilación: `npm run build`
- Carpeta de salida: `dist`
- Variable de entorno: `NODE_VERSION=24`

## Tecnologías

- **Astro**: genera HTML estático en la compilación. Las páginas no cargan JavaScript salvo donde hace falta, así que la web es rápida y fácil de alojar.
- **Svelte 5** (`@astrojs/svelte`): las partes interactivas (círculo trigonométrico, suma de ángulos, plano complejo) son islas que solo cargan su propio código. Svelte compila a JavaScript pequeño y sin runtime pesado.
- **TypeScript estricto**: detecta errores antes de compilar y documenta los datos (temas, idiomas, demostraciones).
- **MDX y Content Collections**: los apuntes se escriben en Markdown con componentes, y Astro valida su estructura con un esquema.
- **KaTeX** (`remark-math` + `rehype-katex` vía `@astrojs/markdown-remark`): las fórmulas se convierten a HTML al compilar, sin JavaScript en el navegador.
- **i18n nativo de Astro**: rutas `/es/`, `/en/`, etc. La raíz redirige al idioma guardado o a español.
- **Fontsource**: las fuentes se sirven desde el propio dominio, sin Google Fonts (más privacidad y sin dependencias externas).
- **Cloudflare Pages**: aloja `dist/` en su CDN y despliega automáticamente con cada push a `main`.
