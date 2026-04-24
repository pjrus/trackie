# Features Guide

## Application Management

**Create:** Click "+ New Application" → Fill form → Submit
**Edit:** Click card/row → Update fields → Save
**Delete:** Open application → Click Delete → Confirm

See [DATA_SCHEMA.md](DATA_SCHEMA.md) for field details.

## Tracking Progress

### Stages
Applied → Online Assessment → Phone Screen → Interview → Offer (or Rejected/Withdrawn)

Update stage by opening application and changing dropdown.

### Next Steps
Set "Next Step Deadline" and "Next Step Description" to track what's due and when.

## Filtering & Searching

**Quick Filters:**
- **Search** — Finds company, role, or tags (case-insensitive)
- **Due this week** — Shows applications with deadline in next 7 days
- **Active only** — Excludes rejected/withdrawn
- **More filters** — Stage, Priority, Industry, Type, Deadline range

Click "Clear all" to reset.

## View Modes

**Kanban (Default):** 7 columns by stage, cards show company/role/priority/deadline
- Best for: Visual workflow tracking
- Horizontally scrollable on mobile

**Table:** Sortable rows with columns for company, role, stage, priority, industry, deadline, type
- Best for: Detailed comparison
- Click column headers to sort

## Dark Mode

Click ● (filled circle) in header to toggle. Preference persists.

## Data Persistence

All changes auto-save to browser localStorage:
- Applications
- View mode (Kanban/Table)
- Dark mode preference
- Filters
- Sort preference

**Warning:** Clearing browser data deletes all applications.

## Export & Import

Click "Export" menu for:
- **CSV** — Spreadsheet format for external analysis
- **JSON** — Complete backup (includes timeline/links)
- **ICS** — Calendar format (imports to Google Calendar, Outlook, etc.)

**Import:** Upload CSV or JSON to add applications

See [EXPORT_IMPORT.md](EXPORT_IMPORT.md) for format details and workflows.

## Common Workflows

**Weekly Planning:** Click "Due this week" → Review and complete actions → Update stages

**Comparing Offers:** Filter Stage: Offer → Table view → Sort by priority

**Tracking Interactions:** Open application → Add timeline entries with dates and descriptions

**Backing Up:** Export as JSON monthly and save to cloud storage

## Summary Bar

Shows live stats: active count + count per stage. Updates in real-time as you filter.

## Help Modal

Click "?" for feature explanations and AI template suggestions.
