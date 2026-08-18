# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Job seekers tracking applications across a search — students and professionals applying to internships, graduate roles, and full-time positions. They are hands-on with their own data: entering companies, stages, deadlines, and notes as they move through Applied → Assessment/Phone → Interview → Offer. Comfortable enough with tools to prefer a browser app with no signup over a spreadsheet or a hosted SaaS tracker.

## Product Purpose

Trackie is a private, local-first workspace for managing job applications: Kanban and table views over a set of application records, with search, filtering, deadline tracking, and CSV/JSON/ICS import-export. Success is a job seeker who can see their whole pipeline at a glance, never miss a deadline, and never worry about where their data lives.

## Positioning

Privacy-first, no account: unlike Notion trackers, Huntr, or Teal, Trackie has no backend, no signup, and no server — application data never leaves the browser, persisted only to localStorage. A neighboring product built on a hosted database could not truthfully make the same claim.

## Operating Context

- Root route redirects to whichever of Kanban or table view was last used.
- Kanban: drag-and-drop (pointer or keyboard via dnd-kit) between the seven pipeline stages, with a card action menu as the non-drag fallback.
- Table: sortable, horizontally scrollable, with the pipeline strip's stage legend doubling as a filter.
- Creating/editing opens a responsive sheet grouped into Overview, Progress, Details, and Activity; dirty editors warn before closing.
- Import validates each row and previews accepted records and errors before a batch update; export covers CSV, JSON, and calendar ICS.
- Header carries help, CSV guidance, FAQs, and reusable AI prompt templates.
- Light, dark, and system themes.

## Capabilities and Constraints

- No backend, no accounts, no network calls, no analytics/telemetry, no API route that touches application records — this is the load-bearing constraint on every feature decision.
- All data persisted to `localStorage` under documented keys (`jobApplications`, `darkMode`, `viewMode`, `filters`, `sortBy`); legacy records and unknown fields must keep working through migration, not a fresh shape.
- CSV, JSON, and ICS export formats are a compatibility contract with existing users' saved data (see `docs/DATA_SCHEMA.md`, `docs/EXPORT_IMPORT.md`).
- Business logic (validation, normalisation, filtering, sorting, dates) lives in `lib/applications.ts`; import/export format logic in `lib/import-export.ts` — both framework-free and unit-testable.
- Application record shape: company, role, industry, type, stage, priority, confidence, deadlines, location, salary, job URL, notes, motivation, tags, links, referral info, and a timeline of interactions (full schema in `docs/DATA_SCHEMA.md`).

## Evidence on Hand

No testimonials, customer references, benchmarks, or usage data exist yet. Future work must not fabricate any. Public repository at `github.com/pjrus/trackie`, no LICENSE file yet.

## Product Principles

1. Privacy is the product, not a feature — every design and technical decision defaults to keeping data in the browser.
2. Never lose or corrupt an existing user's data — storage keys and export formats are a compatibility contract, not an implementation detail.
3. The pipeline is the mental model — Kanban and table are two views onto the same seven-stage journey, and the interface should keep that journey legible at a glance (stage counts, deadline pressure, priority).
4. Low friction for high-frequency use — job searches involve dozens of applications tracked over weeks; entry, triage, and status updates should be fast and keyboard-friendly.
5. Accessible by default — keyboard and pointer parity for drag-and-drop, visible focus, colour never the sole status signal, motion respects `prefers-reduced-motion`.

## Accessibility & Inclusion

Kanban drag-and-drop must work by pointer or keyboard (dnd-kit + card action menu fallback). Overlays trap and restore focus via Radix primitives. Controls have visible keyboard focus. Colour is never the only status indicator. Motion honours `prefers-reduced-motion`.
