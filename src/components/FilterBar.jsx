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
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by company, role, or tags..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onQuickFilter('dueThisWeek')}
            className={`px-3 py-1 text-sm border rounded ${
              filters.dueThisWeek
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Due this week
          </button>
          <button
            onClick={() => onQuickFilter('activeOnly')}
            className={`px-3 py-1 text-sm border rounded ${
              filters.activeOnly
                ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Active only
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Clear all
          </button>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <input
                type="date"
                value={filters.deadlineTo}
                onChange={(e) =>
                  onFilterChange({ ...filters, deadlineTo: e.target.value })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
            <span className="text-gray-700 dark:text-gray-300">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
