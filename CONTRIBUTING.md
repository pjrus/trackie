# Contributing to Trackie

Trackie is a private, local-first workspace for tracking job applications.
It has no backend: everything lives in the browser's `localStorage`. That
constraint drives most of the rules below — the biggest way to break this
app is to make it talk to a server.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See
[ARCHITECTURE.md](ARCHITECTURE.md) for how the routes, data hooks and
`localStorage` persistence fit together before making structural changes.

## Before opening a PR

Run all four checks — CI expects each to pass cleanly:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For changes that touch drag-and-drop, routing, or anything you can't fully
exercise with unit tests, also run the Playwright suite:

```bash
npm run test:e2e
```

## Ground rules

- **No application data leaves the browser.** Don't add network calls,
  analytics, telemetry, or any API route that touches `Application` records.
  If a feature seems to need a server, raise it as a design question first.
- **Preserve the `localStorage` contract.** The keys `jobApplications`,
  `darkMode`, `viewMode`, `filters`, and `sortBy` (see
  `lib/constants.ts#STORAGE_KEYS`) and the CSV/JSON/ICS export formats
  (`docs/DATA_SCHEMA.md`, `docs/EXPORT_IMPORT.md`) are a compatibility
  contract with existing users' saved data. If you must change the shape of
  a stored record, add migration logic in `lib/applications.ts` (see
  `normaliseApplication`) rather than assuming a fresh shape — existing
  records with legacy IDs or unknown fields need to keep working.
- **Keep business logic out of components.** Validation, normalisation,
  filtering, sorting, and date logic belong in `lib/applications.ts`;
  import/export format logic belongs in `lib/import-export.ts`. Both are
  plain functions with no React or Next.js dependency, which is what makes
  them straightforward to unit test.

## Code style

- TypeScript throughout, `strict` mode on — don't introduce `any` or
  `@ts-ignore` to route around a type error; fix the type.
- Follow the ESLint config (`eslint-config-next`, run via `npm run lint`).
  There's no separate Prettier setup — match the formatting already in the
  file you're editing.
- Client components are explicit: add `"use client"` to any file that uses
  hooks, browser APIs, or event handlers, matching the existing files.
- Use the `@/*` path alias (e.g. `@/lib/applications`) instead of relative
  `../../` imports, matching the rest of the codebase.
- Prefer extending an existing primitive in `components/ui/` over adding a
  new dependency for something Radix/shadcn already covers.

## Tests

- Unit and component tests live in `tests/*.test.ts(x)` (Vitest + Testing
  Library). Pure logic in `lib/` should be tested there directly, without
  mounting components.
- End-to-end tests live in `tests/e2e/*.spec.ts` (Playwright).
- New behavior needs a test alongside it: a new filter/sort rule, a new
  import/export format quirk, or a new normalisation/migration case should
  each get a case in the relevant `tests/*.test.ts` file.

## Commit and PR conventions

- Commit messages use a short `type: summary` subject line (`feat:`, `fix:`,
  `refactor:`, `docs:`, `test:`), written in the imperative mood, describing
  the *why* over the *what* where it isn't obvious from the diff.
- Keep PRs scoped to one change. If you notice an unrelated cleanup
  opportunity while working, mention it in the PR description rather than
  folding it in.
- Update `docs/` (`DATA_SCHEMA.md`, `EXPORT_IMPORT.md`, `FEATURES.md`,
  `STATE_MANAGEMENT.md`, `STYLING_GUIDE.md`, `UI_UX.md`) and
  `ARCHITECTURE.md` when a change affects what they describe — stale docs
  are worse than no docs.
