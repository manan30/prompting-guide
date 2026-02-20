# AGENTS.md - Development Guidelines for AI Agents

This file provides guidance for AI agents working in this repository.

## Project Overview

- **Project Name:** prompting-guide
- **Type:** Website (Astro + React + Tailwind CSS)
- **Core Functionality:** Educational site for learning AI prompting techniques
- **Tech Stack:** Astro 5.x, React 19, Tailwind CSS 4, TypeScript

## Build & Development Commands

```bash
# Development
npm run dev          # Start Astro dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

**Note:** This project does not currently have a test framework or linter configured. Consider adding Vitest for testing and ESLint/Prettier for code quality if needed.

## Code Style Guidelines

### General Principles

- Keep code concise and readable
- Use functional components with hooks in React
- Prefer composition over inheritance
- Handle errors gracefully with try/catch where appropriate

### TypeScript

- Use explicit TypeScript interfaces for data structures
- Avoid `any` type - use `unknown` if type is truly unknown
- Use strict null checks
- Example interface pattern:
  ```typescript
  interface Technique {
    id: string;
    name: string;
    description: string;
    example: string;
  }
  ```

### React Components

- Use functional components with hooks (`useState`, `useEffect`)
- Define interfaces above the component
- Destructure props in function signature
- Use early returns for conditional rendering
- Example structure:
  ```typescript
  import { useState, useEffect } from 'react';

  interface Props {
    title: string;
    onSubmit: (data: Data) => void;
  }

  export default function Component({ title, onSubmit }: Props) {
    const [state, setState] = useState('');
    
    // Early return
    if (!ready) return <Spinner />;
    
    return <div>...</div>;
  }
  ```

### Imports

Order imports as follows:
1. React/core libraries
2. Third-party packages
3. Local components/utilities
4. Astro layouts/pages

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout.astro';
import PromptBuilder from '../components/PromptBuilder';
```

### Naming Conventions

- **Components:** PascalCase (e.g., `PromptBuilder.tsx`)
- **Files:** kebab-case for non-component files
- **Variables/functions:** camelCase
- **Interfaces:** PascalCase with descriptive names (e.g., `SavedPrompt`)
- **Constants:** UPPER_SNAKE_CASE for magic numbers, regular camelCase for objects

### Astro Pages

- Use frontmatter `---` delimiters for component imports
- Prefer `.astro` for static pages, `.tsx` for interactive components
- Access props via Astro.props in frontmatter

```astro
---
import Layout from '../layouts/Layout.astro';
import PromptBuilder from '../components/PromptBuilder';
---

<Layout title="Playground">
  <PromptBuilder client:load />
</Layout>
```

### Tailwind CSS

- Use utility classes consistently the with existing dark theme
- Color palette: slate (backgrounds), emerald (primary), cyan (secondary), violet (accent)
- Use `card-gradient` and `glow-*` custom classes from global.css
- Prefer responsive prefixes (`sm:`, `md:`, `lg:`) over hardcoded breakpoints

### Error Handling

- Use try/catch for async operations
- Provide user feedback via UI (not alerts in production)
- Log errors appropriately for debugging
- Example pattern:
  ```typescript
  try {
    const data = await fetchData();
    setData(data);
  } catch (error) {
    console.error('Failed to fetch:', error);
    setError('Failed to load data. Please try again.');
  }
  ```

### State Management

- Use `useState` for local component state
- Use `useEffect` for side effects (data fetching, subscriptions)
- Use `localStorage` for persistent client-side data
- Avoid over-engineering - simple state is preferred

## Project Structure

```
src/
├── components/        # React components (.tsx)
├── layouts/           # Astro layouts (.astro)
├── pages/             # Route pages (.astro, .tsx)
│   ├── learn/         # Learning content
│   │   └── techniques/
│   ├── exercises.astro
│   ├── index.astro
│   ├── my-prompts.astro
│   └── playground.astro
└── styles/            # Global CSS
```

## Adding New Features

1. Follow existing component patterns in `src/components/`
2. Use Tailwind classes matching the dark theme
3. Test interactive components in the playground
4. Build before deploying: `npm run build`

## File Extensions

- `.astro` - Static pages, layouts
- `.tsx` - React components with state/interactivity
- `.ts` - Pure TypeScript utilities (if needed)
- `.css` - Global styles

## Performance Notes

- Use `client:load` or `client:visible` for React components in Astro
- Lazy load heavy components where appropriate
- Optimize images before adding to public/
