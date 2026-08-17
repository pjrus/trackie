# Repository guidance

Trackie is a Next.js App Router application using TypeScript, Tailwind CSS, Radix UI primitives, React Hook Form, Zod and dnd-kit.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

## Architecture

- `app/` contains the routes and global theme tokens. `app/(workspace)/` holds
  the shared workspace shell, with `kanban/` and `table/` supplying their own
  layout and page; `/` redirects to whichever view was used last.
- `components/workspace-provider.tsx` shares applications, filters and sort
  order across the workspace layouts via context.
- `components/` also contains the workflows and shadcn-style primitives.
- `hooks/use-applications.ts` owns localStorage-backed CRUD actions.
- `lib/applications.ts` centralises validation, migration, dates, filtering and sorting.
- `lib/import-export.ts` owns CSV, JSON and ICS conversion and import previews.
- No application data may leave the browser.

Preserve the legacy localStorage keys and export schema documented in `README.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
