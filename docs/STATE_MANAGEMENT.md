# State management

`useApplications()` is the typed data layer. It hydrates `jobApplications` after mount, normalises legacy records, and persists immutable state changes. Its public actions are `addApplications`, `updateApplication`, `deleteApplication` and `moveApplication`. Imports are appended in one state update.

Dashboard preferences use `usePersistedState()` and retain the existing `viewMode`, `filters` and `sortBy` keys. `next-themes` provides light, dark and system modes; the former `darkMode` key is migrated and kept current for backwards compatibility.

Filtering and sorting are derived with `useMemo`. Search uses `useDeferredValue` so typing remains responsive with larger collections. Filters use AND between categories and OR between selections in a category.
