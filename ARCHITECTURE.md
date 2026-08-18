# Architecture

Trackie is a client-only Next.js App Router application. There is no server,
API route or database — every application record lives in `localStorage` in
the visitor's browser, so the entire app is effectively a single-page client
component tree wrapped in App Router routing for URL-addressable views.

## Route structure

```
app/
  layout.tsx                 Root HTML shell: fonts, ThemeProvider, Toaster
  page.tsx                   "/" — redirects to the last-used view
  (workspace)/
    layout.tsx                Shared shell: WorkspaceProvider + sidebar
    kanban/
      layout.tsx               Header + FilterBar (no summary strip)
      page.tsx                 Renders KanbanBoard
    table/
      layout.tsx               Header + Summary strip + FilterBar
      page.tsx                 Renders TableView
  applications/
    [id]/page.tsx             Edit an existing application
    new/page.tsx               Create a new application
```

`(workspace)` is a route group: `kanban/` and `table/` are two independent
views of the same data, each supplying its own header chrome via a nested
layout, while sharing the sidebar and data context from the group's
`layout.tsx`. `/` holds no UI of its own — it reads the persisted `viewMode`
and redirects to `/kanban` or `/table`, showing `WorkspaceSkeleton` until that
read resolves. `applications/[id]` and `applications/new` sit outside the
`(workspace)` group: they're full-page editor routes, not workspace views.

## Data flow

```
localStorage ──▶ useApplications ──▶ WorkspaceProvider ──▶ view pages
  (jobApplications,      (CRUD +         (filter, sort,        (kanban/table
   filters, sortBy,       normalise)      derive `sorted`)       + editor pages)
   viewMode, darkMode)
```

- **`hooks/use-applications.ts`** is the source of truth for the application
  list. It lazily reads `jobApplications` from `localStorage` on mount,
  normalises it through `lib/applications.ts`, and writes back on every
  change. It exposes `addApplications`, `updateApplication`,
  `deleteApplication` and `moveApplication`.
- **`hooks/use-persisted-state.ts`** is a generic `localStorage`-backed
  `useState`, used for `filters`, `sortBy` and `viewMode`. Reads happen in a
  `queueMicrotask` so the first render matches the server-rendered markup
  (avoiding hydration mismatches) before the persisted value is applied.
- **`components/workspace-provider.tsx`** composes both hooks into one
  `WorkspaceContext` consumed by `useWorkspace()`. It derives `filtered`
  (via `filterApplications`) and `sorted` (via `sortApplications`) with
  `useMemo`, deferring the search term with `useDeferredValue` so typing
  doesn't block re-filtering large lists. It also owns navigation intents
  (`openApplication`, `openNewApplication` push to the `applications/*`
  routes) and theme migration from the legacy `darkMode` boolean key to
  `next-themes`.
- **`lib/applications.ts`** centralises the Zod schema, defaults,
  normalisation/migration of legacy records, date helpers, filtering and
  sorting — pure functions with no framework dependency, covered directly by
  `tests/applications.test.ts`.
- **`lib/import-export.ts`** owns CSV/JSON/ICS serialisation and import
  parsing (via `papaparse`), independent of the UI that drives it
  (`components/import-export.tsx`).

Every workspace view page (`kanban/page.tsx`, `table/page.tsx`) is a thin
consumer of `useWorkspace()`: it renders a skeleton until `isLoaded`, an empty
state if `sorted` is empty, otherwise the view component. `applications/[id]`
and `applications/new` bypass the context and call `useApplications()`
directly since they don't need filters or sort order.

## Component layers

- `components/*.tsx` — feature components (`kanban-board`, `table-view`,
  `application-editor`, `filter-bar`, `summary`, `import-export`,
  `settings-panel`, `help-dialog`, `app-sidebar`) plus the cross-view chrome
  in `workspace-chrome.tsx` (header, empty state, loading skeletons).
- `components/ui/*.tsx` — shadcn-style primitives wrapping Radix UI
  (`dialog`, `dropdown-menu`, `tabs`, `sidebar`, etc.), styled with Tailwind
  and `class-variance-authority`. These carry no application logic.
- Drag-and-drop on the kanban board uses `dnd-kit`; the board calls
  `moveApplication` from `useWorkspace()` on drop, which updates state and
  fires a `sonner` toast.

## Persistence contract

`lib/constants.ts` defines the legacy `localStorage` keys (`jobApplications`,
`darkMode`, `viewMode`, `filters`, `sortBy`) that must be preserved across
rewrites — see `README.md` and `docs/DATA_SCHEMA.md`. Legacy records with
string IDs or unknown fields are retained as-is on load; only new and
imported records get UUIDs (`lib/utils.ts#newId`). No data is ever sent off
the device — there is no server component that touches application data, no
API route, and `next.config.ts` carries no backend integration.

## Testing

- `tests/*.test.ts(x)` — Vitest + Testing Library unit/component tests for
  normalisation, filtering/sorting, import/export, `useApplications`, and the
  application editor form.
- `tests/e2e/*.spec.ts` — Playwright end-to-end tests (`application-lifecycle`,
  `mobile-layout`) driving the app through a real browser.

## Other directories

- `docs/` — schema (`DATA_SCHEMA.md`), import/export format
  (`EXPORT_IMPORT.md`), and product/UI reference docs consumed by humans, not
  code.
- `src/assets/` — leftover static assets from the project's pre-Next.js
  prototype; not imported anywhere in `app/`, `components/`, `hooks` or `lib`.
