# Prompt Atlas

Prompt Atlas is a static educational website for learning practical AI prompting.
It combines structured lessons with curated real-world prompt references.

## Stack

- Astro 5
- React 19 (interactive components)
- Tailwind CSS 4
- TypeScript (strict)

## What the site includes

- `/` - landing page and overview
- `/learn` - techniques, model guides, and use cases
- `/learn/real-world-prompts` - source-linked real-world prompt references
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
│   │   ├── index.astro
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

## Environment variables

- `PUBLIC_POSTHOG_KEY` - PostHog project token for client-side analytics
- `PUBLIC_POSTHOG_HOST` - PostHog API host (for example `https://us.i.posthog.com`)
- `PUBLIC_ENABLE_ANALYTICS` - optional local override (`true`) to enable analytics in non-production

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
