# State Management

## Architecture Overview

**useApplications hook** (`src/hooks/useApplications.js`) = data layer
- Manages CRUD operations
- Handles localStorage persistence
- Provides: `applications`, `addApplication`, `updateApplication`, `deleteApplication`, `isLoaded`

**App.jsx component** = UI layer
- Manages: `darkMode`, `viewMode`, `filters`, `sortBy`, `selectedApp`, `showHelp`, `creationMode`
- Applies filters to create `filteredApps`
- Persists UI preferences to localStorage

## Data Flow

**Read:**
```
Load from localStorage → useApplications state → App receives applications
→ Applies filters → Components render filteredApps
```

**Write:**
```
User action → CRUD handler → setApplications() → useEffect saves to localStorage
→ Components re-render automatically
```

## useApplications Hook API

```javascript
// Returns:
{
  applications,                      // Current array
  addApplication(data),              // Returns new app id
  updateApplication(id, updates),    // Partial updates
  deleteApplication(id),             // Removes app
  clearAll(),                         // Nukes all data
  isLoaded,                           // Loading state
}
```

**Load/Save:**
- Loads once on mount from `localStorage['jobApplications']`
- Auto-saves on every change (if loaded)

**ID Strategy:** Uses `Date.now().toString()` — guaranteed unique unless multiple apps created in same millisecond.

**Immutable Updates:** All changes create new arrays, never mutate directly.

## App Component State

```javascript
darkMode        // Boolean, persisted to localStorage
viewMode        // 'kanban' or 'table', persisted
filters         // Object with search/stages/priorities/etc, persisted
sortBy          // Table sort column, persisted
selectedApp     // Application object or null
showHelp        // Help modal visibility
creationMode    // New application flow
```

**Filtering Logic:**
```javascript
const filteredApps = applications.filter((app) => {
  // All filters must pass (AND logic)
  if (filters.search && !matchesSearch(app)) return false;
  if (filters.stages.length > 0 && !filters.stages.includes(app.stage)) return false;
  // ... more filters ...
  return true;
});
```

## localStorage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `jobApplications` | JSON array | All applications |
| `darkMode` | Boolean JSON | Dark mode pref |
| `viewMode` | String | Kanban or table |
| `filters` | JSON object | Current filters |
| `sortBy` | String | Sort column |

## Extending State

**Add new persistent setting:**
```javascript
const [compactMode, setCompactMode] = useState(() => {
  const saved = localStorage.getItem('compactMode');
  return saved ? JSON.parse(saved) : false;
});

useEffect(() => {
  localStorage.setItem('compactMode', JSON.stringify(compactMode));
}, [compactMode]);
```

**Add new application field:**
1. Add to defaults in `useApplications.addApplication()`
2. Add form input in `ApplicationForm.jsx`
3. Update CSV export/import (see [EXPORT_IMPORT.md](EXPORT_IMPORT.md))
4. Update filtering if needed

## Performance Tips

**Current optimization:** Filtering is O(n) on every render. For 1000+ applications:
```javascript
const filteredApps = useMemo(() => {
  return applications.filter(app => { /* ... */ });
}, [applications, filters]);
```

**Batch imports:** Don't loop `addApplication()` — create array and `setApplications()` once.

## Debugging

```javascript
// Browser console:
JSON.parse(localStorage.getItem('jobApplications')).length  // Total apps
localStorage.getItem('darkMode')                            // Mode pref
JSON.parse(localStorage.getItem('filters'))                 // Filters
```

Use React DevTools to inspect component state and trace effect runs.

## Best Practices

- Keep `useApplications` pure (data only, no UI logic)
- Use immutable updates always
- Validate localStorage data on load (done in hook)
- Document complex state objects
- Test localStorage persistence across page reloads
