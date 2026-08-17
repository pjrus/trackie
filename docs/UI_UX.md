# Interface and interaction

The root route is an editorial application workspace with a compact header, live summary, search and filters, and Kanban/table views.

- Kanban cards can be moved by pointer or keyboard through dnd-kit. The card action menu is the mobile and non-drag fallback.
- Creating and editing opens the same responsive sheet. Fields are grouped into Overview, Progress, Details and Activity.
- Dirty editors warn before closing. Deletion uses a confirmation alert.
- Quick and advanced filters update immediately and persist locally.
- Import validates each row and previews accepted records and errors before one batch update.
- Help, CSV guidance, FAQs and reusable AI prompts are available from the header.

All overlays trap focus and restore it through Radix primitives. Controls have visible keyboard focus; colour is not the only status indicator; motion honours `prefers-reduced-motion`.
