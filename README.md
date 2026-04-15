# Prompt Mastery

Prompt Mastery is a static educational website for learning practical AI prompting.
It combines structured lessons with an interactive playground and a personal prompt notes tool.

## Stack

- Astro 5
- React 19 (interactive components)
- Tailwind CSS 4
- TypeScript (strict)

## What the site includes

- `/` - landing page and overview
- `/learn` - techniques, model guides, and use cases
- `/playground` - interactive prompt builder with simulated AI response output
- `/exercises` - practice exercises by difficulty level
- `/my-prompts` - local prompt notes library saved in browser storage
- `/sitemap.xml` - generated sitemap endpoint
- `/robots.txt` - robots configuration

## Project structure

```text
.
├── public/
├── src/
│   ├── components/
│   │   ├── PromptBuilder.tsx
│   │   ├── PromptLibrary.tsx
│   │   ├── TechniqueNav.astro
│   │   └── TechniqueSidebar.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── learn/
│   │   ├── exercises.astro
│   │   ├── index.astro
│   │   ├── my-prompts.astro
│   │   ├── playground.astro
│   │   ├── robots.txt.ts
│   │   └── sitemap.xml.ts
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── wrangler.toml
```

## Local development

1. Install dependencies:

```bash
bun install
```

2. Start the dev server:

```bash
bun run dev
```

3. Open the app at `http://localhost:4321`.

## Available scripts

- `bun run dev` - start local dev server
- `bun run build` - production build into `dist/`
- `bun run preview` - preview production build locally
- `bun run astro` - run Astro CLI commands

## Build and deploy

1. Run a production build:

```bash
bun run build
```

2. Preview the static output:

```bash
bun run preview
```

3. Deploy `dist/` to your static hosting platform or Cloudflare Pages.

## Notes for contributors

- Keep content pages in `.astro` files.
- Keep interactive UI in React components under `src/components`.
- Favor consistent `stone`-based theme classes and shared layout styles.
- Browser-persisted prompt notes are intentionally local-only (`localStorage`).
