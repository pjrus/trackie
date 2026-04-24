import { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

const INDUSTRIES = [
  'Software Engineering',
  'Quantitative Trading',
  'Consulting',
  'Banking & Finance',
  'Other',
];

const STAGES = [
  'Applied',
  'Online Assessment',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const TYPES = ['Internship', 'Graduate', 'Full-time'];
const PRIORITIES = ['High', 'Medium', 'Low'];

export function FilterBar({
  filters,
  onFilterChange,
  onQuickFilter,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-lm-surface-1 dark:bg-dm-surface-1 border-b border-lm-border dark:border-dm-border p-4">
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by company, role, or tags..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="w-full px-3 py-2 border border-lm-border-med dark:border-dm-border rounded bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary placeholder-lm-text-muted dark:placeholder-dm-text-muted"
        />

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onQuickFilter('dueThisWeek')}
            className={`px-3 py-1 text-sm border rounded ${
              filters.dueThisWeek
                ? 'bg-lm-surface-3 dark:bg-dm-accent/20 border-lm-surface-4 dark:border-dm-accent text-lm-text-primary dark:text-dm-text-primary'
                : 'bg-lm-surface-2 dark:bg-dm-surface-2 border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3'
            }`}
          >
            Due this week
          </button>
          <button
            onClick={() => onQuickFilter('activeOnly')}
            className={`px-3 py-1 text-sm border rounded ${
              filters.activeOnly
                ? 'bg-lm-surface-3 dark:bg-dm-accent/20 border-lm-surface-4 dark:border-dm-accent text-lm-text-primary dark:text-dm-text-primary'
                : 'bg-lm-surface-2 dark:bg-dm-surface-2 border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3'
            }`}
          >
            Active only
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-sm border border-lm-border-med dark:border-dm-border rounded bg-lm-surface-2 dark:bg-dm-surface-2 text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3"
          >
            {showAdvanced ? 'Hide filters' : 'More filters'}
          </button>
          <button
            onClick={() =>
              onFilterChange({
                search: '',
                stages: [],
                priorities: [],
                industries: [],
                types: [],
                deadlineFrom: '',
                deadlineTo: '',
                dueThisWeek: false,
                activeOnly: false,
              })
            }
            className="px-3 py-1 text-sm border border-lm-border-med dark:border-dm-border rounded bg-lm-surface-2 dark:bg-dm-surface-2 text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3"
          >
            Clear all
          </button>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t border-lm-border dark:border-dm-border">
            <FilterSelect
              label="Stage"
              options={STAGES}
              value={filters.stages}
              onChange={(v) => onFilterChange({ ...filters, stages: v })}
            />
            <FilterSelect
              label="Priority"
              options={PRIORITIES}
              value={filters.priorities}
              onChange={(v) => onFilterChange({ ...filters, priorities: v })}
            />
            <FilterSelect
              label="Industry"
              options={INDUSTRIES}
              value={filters.industries}
              onChange={(v) => onFilterChange({ ...filters, industries: v })}
            />
            <FilterSelect
              label="Type"
              options={TYPES}
              value={filters.types}
              onChange={(v) => onFilterChange({ ...filters, types: v })}
            />
            <div>
              <label className="block text-xs font-semibold text-lm-text-secondary dark:text-dm-text-secondary mb-1">
                From
              </label>
              <input
                type="date"
                value={filters.deadlineFrom}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    deadlineFrom: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-sm border border-lm-border-med dark:border-dm-border rounded bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-lm-text-secondary dark:text-dm-text-secondary mb-1">
                To
              </label>
              <input
                type="date"
                value={filters.deadlineTo}
                onChange={(e) =>
                  onFilterChange({ ...filters, deadlineTo: e.target.value })
                }
                className="w-full px-2 py-1 text-sm border border-lm-border-med dark:border-dm-border rounded bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-lm-text-secondary dark:text-dm-text-secondary mb-1">
        {label}
      </label>
      <div className="space-y-1 text-sm">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...value, opt]);
                } else {
                  onChange(value.filter((v) => v !== opt));
                }
              }}
              className="w-4 h-4"
            />
            <span className="text-lm-text-secondary dark:text-dm-text-secondary">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
