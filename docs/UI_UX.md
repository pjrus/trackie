# Interface and interaction

The root route is an application workspace with a compact header, a pipeline strip, search and filters, and Kanban/table views.

The pipeline strip is the dashboard: how many applications are in flight, how many are due this week or overdue, and a proportional bar of the seven stages. On the table view its legend doubles as a per-stage filter. Colour is reserved for meaning — a single ultramarine accent for the product, a ramp of that hue for stage progress, and brass/rust only for deadline state — so priority is drawn in weight rather than hue.

- Kanban cards can be moved by pointer or keyboard through dnd-kit. The card action menu is the mobile and non-drag fallback.
- Creating and editing opens the same responsive sheet. Fields are grouped into Overview, Progress, Details and Activity.
- Dirty editors warn before closing. Deletion uses a confirmation alert.
- Quick and advanced filters update immediately and persist locally.
- Import validates each row and previews accepted records and errors before one batch update.
- Help, CSV guidance, FAQs and reusable AI prompts are available from the header.

All overlays trap focus and restore it through Radix primitives. Controls have visible keyboard focus; colour is not the only status indicator; motion honours `prefers-reduced-motion`.
