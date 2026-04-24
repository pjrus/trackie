# Styling Guide

## Setup

**Framework:** Tailwind CSS v4
**Config:** Default (no customizations in `tailwind.config.js`)
**Dark mode:** Triggered by `dark` class on root element

## Color System

### Light Mode (Default)
- Background: `bg-white`
- Text primary: `text-gray-900`
- Text secondary: `text-gray-600`
- Borders: `border-gray-200`

### Dark Mode (Add `dark:` prefix)
- Background: `dark:bg-gray-900`
- Text primary: `dark:text-white`
- Text secondary: `dark:text-gray-400`
- Borders: `dark:border-gray-700`

### Semantic Colors
- Primary action: `bg-green-500 hover:bg-green-600`
- Secondary action: `bg-gray-200 dark:bg-gray-700`
- High priority: `bg-red-100 dark:bg-red-900`
- Medium priority: `bg-amber-100 dark:bg-amber-900`
- Low priority: `bg-green-100 dark:bg-green-900`

### Stage Colors (KanbanBoard.jsx)
```javascript
'Applied': 'bg-gray-100 dark:bg-gray-800',
'Online Assessment': 'bg-yellow-50 dark:bg-yellow-900',
'Phone Screen': 'bg-blue-50 dark:bg-blue-900',
'Interview': 'bg-purple-50 dark:bg-purple-900',
'Offer': 'bg-green-50 dark:bg-green-900',
'Rejected': 'bg-red-50 dark:bg-red-900',
'Withdrawn': 'bg-orange-50 dark:bg-orange-900',
```

## Spacing Scale

- `p-2` / `px-2` → 8px
- `p-3` / `px-3` → 12px
- `p-4` / `px-4` → 16px
- `p-6` / `px-6` → 24px
- `gap-2` / `gap-3` / `gap-4` → 8px / 12px / 16px

## Common Patterns

### Button
```jsx
// Primary
<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium">

// Secondary
<button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">

// Toggle
<button className={isActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}>
```

### Input
```jsx
<input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
```

### Card
```jsx
<div className="rounded border border-gray-300 dark:border-gray-600">
  <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-600">
    <h3 className="font-semibold text-gray-900 dark:text-white">Title</h3>
  </div>
  <div className="p-3">{/* content */}</div>
</div>
```

### Modal
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white dark:bg-gray-900 rounded shadow-lg max-w-2xl w-full p-6">
```

## Typography

- **h1:** `text-2xl sm:text-3xl font-bold`
- **h2:** `text-xl font-semibold`
- **Label:** `text-sm font-semibold`
- **Body:** `text-base`
- **Small:** `text-sm`
- **Extra small:** `text-xs`

## Responsive Breakpoints

- Default (mobile): `<640px`
- `sm:` — `≥640px`
- `md:` — `≥768px`
- `lg:` — `≥1024px`

**Example:**
```jsx
// Text grows on larger screens
<h1 className="text-2xl sm:text-3xl">

// Grid adapts
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
```

## Dark Mode Pattern

**Always include dark: variants:**
```jsx
// ❌ Wrong (breaks in dark mode)
<div className="bg-white text-gray-900">

// ✅ Right
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

## Common Mistakes

❌ Fixed colors: `style={{ backgroundColor: '#FF0000' }}`
✅ Use Tailwind: `className="bg-red-500"`

❌ No dark variants: `className="bg-white"`
✅ Include dark: `className="bg-white dark:bg-gray-900"`

❌ No hover state: `className="bg-green-500"`
✅ Add hover: `className="bg-green-500 hover:bg-green-600"`

## Adding New Components

1. Use existing color utilities only
2. Include `dark:` variants for all colors
3. Use spacing scale consistently
4. Test in both light and dark modes
5. Use responsive utilities for mobile
