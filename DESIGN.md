---
name: Trackie
description: A privacy-first, local-only workspace for tracking job applications — the ledger and the ladder.
colors:
  ultramarine: "#2e35d4"
  ultramarine-deep: "#242ab4"
  ultramarine-wash: "#ecedfd"
  ultramarine-ink: "#262ca8"
  warm-paper: "#fbfbf9"
  ink: "#15171c"
  lifted-white: "#ffffff"
  paper-shade: "#f3f3ef"
  muted-slate: "#5f6670"
  rust: "#b33a1b"
  pine: "#276b4e"
  brass: "#a96a0b"
  hairline: "#e7e7e1"
  input-line: "#d6d6ce"
  stage-applied: "#c1c4ee"
  stage-assessment: "#9a9ee5"
  stage-screen: "#7276dc"
  stage-interview: "#4b51d3"
  stage-offer: "#276b4e"
  stage-rejected: "#b4aba4"
  stage-withdrawn: "#cbcbc4"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.018em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.018em"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.09em"
rounded:
  md: "0px"
  lg: "0px"
  xl: "0px"
spacing:
  xs: "0.375rem"
  sm: "0.625rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ultramarine}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine-deep}"
  button-secondary:
    backgroundColor: "{colors.lifted-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 0.875rem"
    height: "2.25rem"
  card:
    backgroundColor: "{colors.lifted-white}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 0.875rem"
  input:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    height: "2.25rem"
---

# Design System: Trackie

## Overview

**Creative North Star: "The Ledger & Ladder"**

Trackie reads as a ledger, not a dashboard: near-white warm paper, square corners without exception, and hairlines doing almost all of the separating that shadows or fills would do elsewhere. Against that quiet field sits exactly one brand color — a saturated ultramarine — so its every appearance registers as a decision, not decoration. The interface is quiet and precise, closer to a well-kept accounting book than a marketing surface: restrained, a little austere, built for someone re-entering it daily to update dozens of live records without friction or noise.

The "Ladder" half of the system is the seven-stage pipeline (Applied → Assessment → Phone Screen → Interview → Offer, with Rejected and Withdrawn as terminal states off the ramp). It is expressed literally — a proportional bar of stage segments, a five-rung progress track on every card, one hue climbing in intensity as an application advances — so the product's core mental model is visible in the chrome itself, not just the data.

Numbers get their own voice: every count, date, and countdown is set in a tabular monospace face so columns never jitter as data changes daily. Two accent hues outside ultramarine exist only to report time pressure and outcome (brass for "due soon," rust for "overdue," pine for "offer") — they are status language, not palette expansion.

Confirmed anti-references: no gradients, no decorative shadows or glows, no rounded corners anywhere in the system (per `docs/STYLING_GUIDE.md` and the zeroed radius scale).

**Key Characteristics:**
- One brand color (ultramarine) on a warm near-white ground; everything else is neutral ink/paper or status-only color.
- Every corner in the system is square — radius tokens exist by name but resolve to zero.
- Hairline borders (1px, `hairline` / `input-line`) carry separation that shadow or fill would carry elsewhere.
- A single hue ramp (pale → saturated ultramarine) visualizes pipeline progress; offer breaks the ramp into pine, the two closed stages drop out of it entirely.
- All numerals are tabular monospace (IBM Plex Mono); all display type is Bricolage Grotesque; all interface prose is IBM Plex Sans.

## Colors

Warm, restrained, and almost monochrome at rest — ultramarine is the only color that means "brand"; every other hue on screen is reporting a state.

### Primary
- **Ultramarine** (`#2e35d4`): the sole brand accent — primary buttons, links, focus rings, active/selected states, and the wordmark. Deepens to **Ultramarine Deep** (`#242ab4`) on hover/press.
- **Ultramarine Wash** (`#ecedfd`) / **Ultramarine Ink** (`#262ca8`): the tint-and-ink pairing used for the `accent` role — selected chips, subtle highlight backgrounds, text on a wash background.

### Neutral
- **Warm Paper** (`#fbfbf9`): the page canvas — a faint warm tint so pure-white cards still lift off it without a shadow doing the work.
- **Lifted White** (`#ffffff`): card, popover, and dialog surfaces — the one step whiter than the canvas.
- **Ink** (`#15171c`): primary text.
- **Paper Shade** (`#f3f3ef`): secondary/muted surface fills (sidebar, muted backgrounds, pressed states).
- **Muted Slate** (`#5f6670`): secondary text — captions, placeholders, eyebrow labels.
- **Hairline** (`#e7e7e1`): the default border/divider — the system's primary separator.
- **Input Line** (`#d6d6ce`): a half-step darker border reserved for form controls, so fields read as slightly more defined than static dividers.

### Status
- **Brass** (`#a96a0b`): "due soon" — deadline pressure, warning state.
- **Rust** (`#b33a1b`): "overdue" — destructive actions and past-due deadlines.
- **Pine** (`#276b4e`): "offer" — success state and the terminus of the stage ramp.

### The Ladder
The seven pipeline stages are one hue gaining intensity as an application advances, so the pipeline bar reads as a funnel: **Applied** (`#c1c4ee`) → **Assessment** (`#9a9ee5`) → **Phone Screen** (`#7276dc`) → **Interview** (`#4b51d3`), then the ramp resolves into **Offer** (`#276b4e`, pine — a deliberate break from ultramarine to mark a genuinely different outcome). **Rejected** (`#b4aba4`) and **Withdrawn** (`#cbcbc4`) are warm neutrals that drop out of the ramp entirely — closed stages don't compete for color attention.

### Dark mode
Dark mode inverts rather than dims: canvas becomes near-black ink (`#0e0f12`), cards lift to `#17191e`, and ultramarine itself shifts lighter and slightly desaturated (`#9095ff`) to hold contrast on a dark ground rather than reusing the light-mode hex at reduced opacity. Status colors (brass/rust/pine) each get their own lighter dark-mode value for the same reason — see `.dark` block in `app/globals.css` for the full token set.

### Named Rules
**The Colour Reports, It Doesn't Decorate Rule.** Ultramarine is the only brand signal in the system. Brass, rust, and pine exist solely to report deadline and outcome state — never as a "second brand color," never applied for visual variety. If a new element needs color and isn't reporting brand identity or a status, it stays neutral.

## Typography

**Display Font:** Bricolage Grotesque (with `ui-sans-serif, system-ui` fallback)
**Body Font:** IBM Plex Sans (with `ui-sans-serif, system-ui` fallback), weights 400/500/600/700
**Label/Mono Font:** IBM Plex Mono (with `ui-monospace, monospace` fallback), weights 400/500/600

**Character:** Bricolage's slightly wide, geometric grotesque carries every heading, wordmark, and card title — pulled in with `-0.018em` tracking so it doesn't run loose at display sizes. IBM Plex Sans handles all interface prose and stays completely neutral. IBM Plex Mono is reserved for anything that is, functionally, a number.

### Hierarchy
- **Display** (600, 1.875rem/30px, leading-none): the single largest figure on any screen — the pipeline's "in flight" stat.
- **Headline** (600, 1.5rem/24px): section and empty-state headlines (e.g. the application editor's name field, "no results" states).
- **Title** (600, 1.25rem down to 1.125rem/20–18px): dialog, sheet, and page titles.
- **Body** (400, 0.875rem/14px): all interface prose, inputs, table cells.
- **Label** (500, 0.6875rem/11px, uppercase, `0.09em` tracking — the `eyebrow` utility): field labels, filter legend captions, card eyebrows (company name above role title), stat captions ("in flight," "due this week").

### Named Rules
**The Tabular Numerals Rule.** Every number that can change — counts, dates, countdowns — is set in IBM Plex Mono with `font-variant-numeric: tabular-nums`. Columns of figures must not shift width as their digits change.

## Layout

The workspace shell is a persistent sidebar (`AppSidebar`) plus a content region that never scrolls horizontally itself — each view owns its own overflow instead. Page structure is consistent across Kanban and table: `WorkspaceHeader` → `PipelineStrip` → `FilterBar` → `<main>`.

Page-edge margins step from `1rem` (mobile) to `2rem` at the `lg` breakpoint (`mx-4 lg:mx-8`) — the system uses only `sm:` and `lg:` breakpoints, no `md:`. Two padding pairs dominate: `1.25rem × 1rem` for strip/section-level containers (pipeline strip, filter bar) and `0.875rem × 0.75rem` for card-level containers. Component spacing runs `0.375rem` / `0.625rem` / `1.25rem` depending on density (tight card meta rows vs. kanban column gaps).

Kanban columns are fixed-width (`300px`) and the board scrolls horizontally as a deliberate choice — the board is a strip of ledger columns, not a fluid grid. The table view owns its own horizontal scroll instead, keeping the page shell stable either way.

The application editor is full-screen below `sm` and becomes a right-side sheet (`min(720px, 92vw)`, bordered left edge, no shadow) from `sm` up — the same `Dialog` primitive underlies both the centered modal and the sheet.

## Elevation & Depth

Mostly flat, with shadow used sparingly and only where it earns its place. Resting cards and default buttons carry a barely-visible ambient `shadow-sm` (`0 1px 2px 0 rgb(21 23 28 / 0.05)`) — present, but doing almost no visual work next to the hairline borders that do the actual separating. Shadow escalates only for two real situations: hover feedback on an interactive application card, and true overlays that lift off the page (dialogs, popovers, dropdowns, the select menu, the dragged kanban card).

### Shadow Vocabulary
- **Ambient** (`shadow-sm`, `0 1px 2px 0 rgb(21 23 28 / 0.05)`): default resting state for cards and buttons — barely there, structural.
- **Hover** (`shadow-md`, `0 4px 12px -2px rgb(21 23 28 / 0.08)`): application card on hover, paired with a 1px lift (`-translate-y-px`) and a shift to `ultramarine/40` border.
- **Overlay** (`shadow-lg`, `0 16px 40px -12px rgb(21 23 28 / 0.22)`): dialogs, popovers, dropdown/select menus, the drag overlay preview.

### Named Rules
**The Earned Shadow Rule.** A resting surface stays flat and lets its hairline border do the separating. Shadow only escalates when something genuinely leaves the page's plane — hover lift, drag, or a true overlay. Shadow is never applied for decoration or default "card polish."

## Shapes

Every corner in the system is square. `--radius-xs` through `--radius-4xl` all resolve to `0` in `app/globals.css`; components still request a radius by name (`rounded-md`, `rounded-lg`, `rounded-xl`) so the zero stays a single, reversible decision rather than something hand-edited per component. The one exception is Sonner's toast, which is explicitly forced back to `border-radius: 0` since it's the one primitive that ships its own rounded corners by default.

With no soft corners anywhere, edges carry the structure: hairline dividers between table rows, a ruled line above each table column, and 1px borders around every card, input, and button. The one deliberate geometric flourish in the system is the **urgency rail** — a 3px solid color bar on the left edge of an application card, present only when a deadline is due soon (brass) or overdue (rust), absent otherwise. It is the single sharpest visual signal in the interface, reserved for exactly one meaning.

### Named Rules
**The Square by Design Rule.** No border-radius anywhere in the product. Every component still asks the theme for a radius by name — the zero value is a one-place decision in `globals.css`, not a per-component override, so the system could reintroduce curvature in a single line if it ever needed to.

## Components

### Buttons
- **Shape:** square (`rounded-md` → 0px), 1px border on secondary/outline variants only.
- **Primary:** ultramarine fill (`#2e35d4`), white text, ambient shadow-sm, `h-9 px-3.5` (default) / `h-11 px-6` (lg) / `h-8 px-2.5` (sm) / `size-9 p-0` (icon-only).
- **Hover / Focus:** hover deepens fill to `#242ab4`; focus shows a 2px `ring-ring` ring with a 2px offset; pressed state nudges the button `1px` down (`active:translate-y-px`) instead of scaling — a tactile, mechanical press rather than a soft bounce.
- **Secondary / Ghost / Outline:** secondary is a bordered white surface with no fill (hover darkens the border, not the background); ghost drops border and background entirely until hover; destructive swaps the fill to rust.

### Cards / Containers
- **Corner Style:** square (`rounded-xl` → 0px).
- **Background:** Lifted White (`#ffffff`) on Warm Paper (`#fbfbf9`).
- **Shadow Strategy:** ambient at rest, `shadow-md` + `-1px` lift + ultramarine-tinted border on hover (application cards specifically); see Elevation & Depth.
- **Border:** 1px Hairline (`#e7e7e1`); shifts to `ultramarine/40` on hover for interactive cards.
- **Internal Padding:** `0.875rem × 0.75rem` (px-3.5 py-3) is the dominant card padding; section-level containers (pipeline strip) use `1.25rem × 1rem`.

### Inputs / Fields
- **Style:** 1px Input Line border (`#d6d6ce`), Warm Paper background, square corners, `h-9` height, `0.875rem` (14px) text.
- **Focus:** border shifts to Ultramarine, paired with a soft `ring-2 ring-ring/35` glow — no shadow.
- **Labels:** 13px medium-weight, `text-foreground/85` — one step quieter than full ink.
- **Error / Disabled:** disabled drops to 50% opacity; error states are not yet distinctly styled in code beyond standard form validation messaging.

### Navigation (Sidebar)
- Persistent left sidebar using the same eyebrow label style for section headers (`text-sidebar-foreground/55`), square active/hover states, `size-4` icon sizing throughout. No separate mobile nav pattern beyond the standard responsive sidebar collapse.

### Signature: Pipeline Strip
The dashboard-in-miniature that opens every view: an eyebrow-labeled stat (in-flight count, in Display type) alongside due/overdue figures marked by a small colored dot (brass/rust), followed by a proportional horizontal bar where each pipeline stage is a flex-grown segment colored from the Ladder ramp — closed stages (Rejected/Withdrawn) sit visually separated by a gap rather than joining the flow. On the table view, the same stage swatches double as a filter legend.

### Signature: Kanban Board & Stage Ladder
Fixed-width (300px) columns in a horizontally scrolling strip, `gap-5` apart. Cards carry the urgency rail described in Shapes, plus a compact five-rung `StageTrack` (three-pixel-tall bars) showing progress through the open stages — Offer and the closed stages are called out separately since they've left the ramp. Drop targets highlight with an `accent` background and a 1px `ultramarine/40` ring; the drag overlay itself rotates 1° and gains `shadow-lg` to read as physically lifted off the board.

## Do's and Don'ts

### Do:
- **Do** keep every corner square (`rounded-* → 0`) — reach for a hairline border or spacing to differentiate a surface, not a radius change.
- **Do** reserve ultramarine for brand/selection/focus meaning, and brass/rust/pine strictly for deadline and outcome state.
- **Do** set every changing number (counts, dates, countdowns) in tabular IBM Plex Mono so columns don't jitter.
- **Do** let shadow escalate only for real elevation (hover, drag, true overlays) — keep resting surfaces flat.
- **Do** provide accessible names for icon-only buttons and keep focus rings visible (`ring-2 ring-ring ring-offset-2`) on every interactive element.
- **Do** support pointer and keyboard parity for drag-and-drop (dnd-kit), with the card action menu as the non-drag fallback.

### Don't:
- **Don't** add gradients or decorative shadows/glows — the system is explicitly flat-color, per `docs/STYLING_GUIDE.md`.
- **Don't** introduce a second "brand" color alongside ultramarine; new semantic needs should map to the existing brass/rust/pine status vocabulary or stay neutral.
- **Don't** round any corner, anywhere, without a deliberate system-wide decision (it would mean touching the single `--radius-*` source of truth, not overriding one component).
- **Don't** use color as the sole indicator of state — pair it with icons, weight, or text (already the pattern for priority, which is drawn in weight rather than hue).
- **Don't** ignore `prefers-reduced-motion` — all transition/animation durations must collapse to near-zero under that media query, as they already do globally.
