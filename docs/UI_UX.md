# UI/UX Documentation

## Overview

The Job Application Tracker features a clean, modern interface designed to help users efficiently track and manage multiple job applications. The app uses a responsive design with full dark mode support and provides two complementary view modes for different use cases.

## Layout Structure

### Header
- **Title**: "Job Application Tracker" (left-aligned)
- **Action Buttons** (right-aligned):
  - Export/Import menu (three-dot icon or "Export" label)
  - "+ New Application" (green button)
  - View toggle ("≡ Table" or "⊞ Kanban")
  - Help modal trigger ("?")
  - Dark mode toggle ("●" for light mode, "○" for dark mode)

### Summary Bar
- **Sticky bar** below header showing quick stats
- Displays count of "active" applications (excludes Rejected/Withdrawn)
- Shows count of applications in each stage: Applied, Online Assessment, Phone Screen, Interview, Offer, Rejected, Withdrawn
- Updated in real-time based on current filters

### Filter Bar
- **Search input**: Full-width text field with placeholder "Search by company, role, or tags..."
- **Quick filter buttons**:
  - "Due this week" - highlights applications with deadlines in the next 7 days
  - "Active only" - excludes rejected and withdrawn applications
  - "More filters" - expands advanced filter options
  - "Clear all" - resets all filters
- **Advanced filters** (collapsible grid):
  - Stage (multi-select checkbox list)
  - Priority (multi-select checkbox list)
  - Industry (multi-select checkbox list)
  - Type (multi-select checkbox list)
  - Deadline range (from/to date pickers)

### Main Content Area

#### Kanban Board View (Default)
- Horizontal scrollable layout with 7 columns (one per stage)
- Each column shows:
  - Stage name and application count
  - Scrollable list of cards for that stage
  - Minimum height of 300px to show empty state clearly
- **Card design**:
  - Company name (bold)
  - Role title
  - Priority badge (color-coded: red for High, amber for Medium, green for Low)
  - "Next step deadline" with days remaining or "Overdue" label
  - Hover effect for interactivity (clickable)
- **Stage colors** (background):
  - Applied: Gray
  - Online Assessment: Yellow
  - Phone Screen: Blue
  - Interview: Purple
  - Offer: Green
  - Rejected: Red
  - Withdrawn: Orange

#### Table View
- Traditional row-based layout with sortable columns
- **Default sort**: By deadline (ascending)
- **Columns** (left to right typically): Company, Role, Stage, Priority, Industry, Next Step Deadline, Type
- Each row is clickable to open the application modal
- Responsive: columns may wrap on smaller screens

### Application Modal
- **Fixed overlay** with semi-transparent dark background (z-index 50)
- **Content**:
  - **Header** (sticky at top):
    - Company name (large, left-aligned)
    - Role name (smaller subtitle)
    - Action buttons (Save, Delete, Close) - right-aligned
  - **Body** (scrollable):
    - Form sections for editing all application fields:
      - Basic info: Company, Role, Industry, Type, Location, Salary
      - Tracking: Stage (dropdown), Priority (dropdown), Confidence slider
      - Deadlines: Application deadline, Next step deadline, Next step description
      - Links: Job posting URL, additional links (addable/removable)
      - Notes: Why applied, general notes
      - Tags: Custom tag system (addable/removable)
      - Referral info: Checkbox + referrer name field
      - Timeline: Track interactions (addable/removable entries with date + description)

### Application Creation Page
- Full-page form for adding new applications
- Similar to modal form but optimized for initial entry
- Prominent "Submit" button and "Cancel" button
- Darker overlay when displayed

### Help Modal
- Displays user guidance and AI template suggestions
- Overlays main content
- Closeable

## Visual Design System

### Colors
- **Light mode background**: White (#ffffff)
- **Dark mode background**: Gray-900 (#111827)
- **Borders**: Gray-200 (light), Gray-700 (dark)
- **Text primary**: Gray-900 (light), White (dark)
- **Text secondary**: Gray-600 (light), Gray-400 (dark)
- **Accent colors**:
  - Primary action: Green-500 (hover: Green-600)
  - Secondary action: Gray-200 (light), Gray-700 (dark)
  - Destructive: Red tones
  - Info/Active: Blue tones

### Priority Colors
- **High**: Red background with red text (opposite in dark mode)
- **Medium**: Amber background with amber text
- **Low**: Green background with green text

### Typography
- **Heading (h1)**: 24-32px, bold
- **Heading (h2)**: 20px, semibold
- **Body**: 14-16px
- **Small text**: 12-14px

### Spacing
- Default padding: 4px (0.25rem) to 24px (1.5rem) increments
- Card gaps: 8px and 16px

## Interactions

### Filter Behavior
- Filters are applied in real-time as user types/selects
- Filter state persists in localStorage
- Multiple filters act as AND conditions (all must match)
- Within a single filter (e.g., multiple stages), results are OR'd

### Search
- Case-insensitive partial match
- Searches across: company name, role, and tags

### Dark Mode
- Toggle button in header
- Applies `dark` class to root HTML element
- All Tailwind dark: variants respond automatically
- Preference persists in localStorage

### View Switching
- Toggle between Kanban and Table views
- View preference persists in localStorage
- Different sorting options available per view

### Modal Management
- Clicking a card/row opens the modal
- Close button, X button, or clicking outside the modal closes it
- Modal scrolls internally if content exceeds 90vh height

## Responsive Behavior

### Breakpoints
- **Mobile**: Default styles (< 640px)
- **Small (sm)**: 640px+
- **Medium (md)**: 768px+
- **Large (lg)**: 1024px+

### Mobile Optimizations
- Header buttons wrap with `flex-wrap`
- Whitespace between buttons with `gap-3`
- Full-width inputs and buttons
- Stack layout for advanced filters below sm breakpoint

### Kanban Board
- Horizontal scroll required on smaller screens (intentional behavior)
- Cards remain consistently sized

### Table View
- Responsive column wrapping or horizontal scroll on smaller screens
- Maintains readability

## Empty States

### No Applications
- Centered message: "No applications yet. Create your first one!"
- Prominent "+ New Application" button

### No Matching Results
- Centered message: "No applications match your filters."
- Suggests clearing filters

### Empty Column in Kanban
- "No applications" text in gray, centered in column

## Loading State
- Full-screen centered loading message
- "Loading..." text
- Blocks interaction until data loads from localStorage

## Accessibility Considerations
- Semantic HTML with proper heading hierarchy
- Buttons have descriptive labels or title attributes
- Forms have associated labels
- Color not the only indicator (priority has badges, stages have text labels)
- Modal has z-index layering for proper focus management
- Keyboard navigation through tab and enter keys
