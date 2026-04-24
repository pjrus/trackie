# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Job Application Tracker** is a React + Vite web application for tracking job applications throughout the hiring process. Users can create, filter, and organize applications by stage, priority, and deadline, with support for multiple views (Kanban board and table), data export/import, and dark mode.

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint code with ESLint
npm run lint

# Preview production build locally
npm run preview
```

## Documentation

Comprehensive guides for different aspects of the project:

- **[docs/UI_UX.md](docs/UI_UX.md)** — Layout structure, components, interactions, and responsive design
- **[docs/FEATURES.md](docs/FEATURES.md)** — User-facing features, workflows, and best practices
- **[docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md)** — Application data model, validation, and defaults
- **[docs/EXPORT_IMPORT.md](docs/EXPORT_IMPORT.md)** — CSV/JSON/ICS formats, import/export workflows
- **[docs/STATE_MANAGEMENT.md](docs/STATE_MANAGEMENT.md)** — useApplications hook, component state, extending architecture
- **[docs/STYLING_GUIDE.md](docs/STYLING_GUIDE.md)** — Tailwind CSS patterns, color system, dark mode

## Architecture & Key Patterns

### State Management
- **Single custom hook**: `useApplications()` in `src/hooks/useApplications.js` manages all application data
- **LocalStorage persistence**: All data is automatically persisted to localStorage under the key `'jobApplications'`
- **No external state library**: Uses React's built-in useState/useEffect

### Application Data Schema
Each job application object contains:
- **Core fields**: `id`, `company`, `role`, `dateAdded`
- **Tracking fields**: `stage` (Applied/Online Assessment/Phone Screen/Interview/Offer/Rejected/Withdrawn), `priority` (High/Medium/Low), `type` (Full-time/etc)
- **Deadline fields**: `applicationDeadline`, `nextStepDeadline`, `nextStepDescription`
- **Additional fields**: `industry`, `location`, `salary`, `jobUrl`, `notes`, `whyApplied`, `tags`, `links`, `confidence`, `referral`, `referrerName`, `timeline`

### Component Organization
- **App.jsx**: Main entry point; handles filters, view switching, dark mode, and modal states
- **View components**: `KanbanBoard.jsx` and `TableView.jsx` for different application layouts
- **Modal components**: `ApplicationModal.jsx` (edit/view), `ApplicationCreationPage.jsx` (new app flow), `HelpModal.jsx`
- **Feature components**: `FilterBar.jsx` (search + multi-select filters), `SummaryBar.jsx` (stats), `ExportMenu.jsx` (import/export)

### Filtering System
- Filters object in App state includes: `search`, `stages`, `priorities`, `industries`, `types`, `deadlineFrom`, `deadlineTo`, `dueThisWeek`, `activeOnly`
- Filtering logic is centralized in App.jsx (lines 113-178)
- Quick filters ("due this week", "active only") toggle specific flags

### Styling
- Tailwind CSS with dark mode support
- Dark mode state persisted to localStorage
- Color-coded stages and priorities using Tailwind classes (defined in components like KanbanBoard.jsx)
- Responsive design with `sm:` breakpoints

**CSS Variables (src/index.css)**:
- All colors are defined as CSS variables: `--lm-*` for light mode, `--dm-*` for dark mode
- Available variables: `base`, `surface-1` through `surface-4`, `border`, `border-med`, `accent`, `text-primary`, `text-secondary`, `text-muted`, plus priority/status colors
- Always use CSS variable classes (`bg-lm-accent`, `text-dm-text-primary`, etc.) instead of hardcoded Tailwind colors
- Use `dark:` prefix for dark mode variants: `bg-lm-surface-1 dark:bg-dm-surface-1`
- When styling buttons, inputs, or interactive elements, prefer Tailwind classes with CSS variables over inline styles
- To adjust colors globally (e.g., accent button brightness), modify the CSS variable in `src/index.css` rather than changing individual component classes

### Export/Import
- Utilities in `src/utils/`: `csvExport.js`, `csvImport.js`, `jsonExport.js`, `icsExport.js`
- Import merges new applications with existing ones
- Handles multiple file formats

## Key Files to Know

- `src/hooks/useApplications.js`: Custom hook for CRUD operations and persistence
- `src/utils/dateUtils.js`: Deadline calculation and formatting
- `eslint.config.js`: ESLint configuration (React best practices, hooks rules)
- `vite.config.js`: Vite configuration with React plugin

## Common Workflows

### Adding a new filter
1. Add field to `DEFAULT_FILTERS` in App.jsx
2. Add filter UI control to `FilterBar.jsx`
3. Add filtering logic to `filteredApps` calculation in App.jsx

### Adding a new application field
1. Add default value in `useApplications.addApplication()`
2. Add UI input in `ApplicationForm.jsx` or `ApplicationCreationPage.jsx`
3. Update `ApplicationModal.jsx` to display/edit the field

### Modifying application stages or priorities
- Update STAGES and PRIORITY_COLORS constants in `KanbanBoard.jsx` and other components that reference them
- These are hardcoded; consider extracting to a shared constants file if frequent changes needed

## localStorage Keys Used
- `'jobApplications'`: Main application data (JSON array)
- `'darkMode'`: Boolean for dark mode preference
- `'viewMode'`: Current view ('kanban' or 'table')
- `'filters'`: Current filter state (JSON object)
- `'sortBy'`: Table view sort column
