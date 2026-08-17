# Styling guide

Trackie uses Tailwind CSS v4 and semantic CSS variables in `app/globals.css`. The palette is warm and neutral with a restrained green accent. Use flat colours, spacing, borders and shallow shadows; do not add gradients or decorative effects.

Reusable controls live in `components/ui/` and follow shadcn composition patterns over Radix primitives. New interface work should use these controls, keep visible focus states, provide accessible names for icon-only buttons and support light and dark themes.

The editor is full-screen on mobile and a right-side sheet from the `sm` breakpoint. Kanban deliberately scrolls horizontally, while the table owns its horizontal overflow.
