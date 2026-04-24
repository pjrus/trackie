import { formatDate, getDaysRemainingText, isOverdue } from '../utils/dateUtils';

export function TableView({
  applications,
  sortBy,
  onSortChange,
  onRowClick,
}) {
  const sortedApps = [...applications].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        if (!a.nextStepDeadline) return 1;
        if (!b.nextStepDeadline) return -1;
        return (
          new Date(a.nextStepDeadline) - new Date(b.nextStepDeadline)
        );
      case 'priority':
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return (
          (priorityOrder[a.priority] || 3) -
          (priorityOrder[b.priority] || 3)
        );
      case 'dateAdded':
        return (
          new Date(b.dateAdded) - new Date(a.dateAdded)
        );
      default:
        return 0;
    }
  });

  const SortHeader = ({ label, value }) => (
    <button
      onClick={() => onSortChange(value)}
      className="text-left font-semibold text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3 px-2 py-1 rounded"
    >
      {label} {sortBy === value && '↓'}
    </button>
  );

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-lm-border dark:border-dm-border bg-lm-surface-2 dark:bg-dm-surface-1">
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Company
            </th>
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Role
            </th>
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Industry
            </th>
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Type
            </th>
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Stage
            </th>
            <th className="text-left p-2">
              <SortHeader label="Next Deadline" value="deadline" />
            </th>
            <th className="text-left p-2">
              <SortHeader label="Priority" value="priority" />
            </th>
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Location
            </th>
            <th className="text-left p-2 font-semibold text-lm-text-secondary dark:text-dm-text-secondary">
              Tags
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedApps.map((app) => {
            const overdue = isOverdue(app.nextStepDeadline);
            const daysText = getDaysRemainingText(app.nextStepDeadline);

            return (
              <tr
                key={app.id}
                onClick={() => onRowClick(app)}
                className="border-b border-lm-border dark:border-dm-border hover:bg-lm-surface-2 dark:hover:bg-dm-surface-2 cursor-pointer"
              >
                <td className="p-2 font-semibold text-lm-text-primary dark:text-dm-text-primary">
                  {app.company}
                </td>
                <td className="p-2 text-lm-text-secondary dark:text-dm-text-secondary">
                  {app.role}
                </td>
                <td className="p-2 text-lm-text-secondary dark:text-dm-text-secondary">
                  {app.industry}
                </td>
                <td className="p-2 text-lm-text-secondary dark:text-dm-text-secondary">
                  {app.type}
                </td>
                <td className="p-2 text-lm-text-secondary dark:text-dm-text-secondary">
                  {app.stage}
                </td>
                <td
                  className={`p-2 font-semibold ${
                    overdue
                      ? 'text-lm-overdue dark:text-dm-overdue'
                      : 'text-lm-text-secondary dark:text-dm-text-secondary'
                  }`}
                >
                  {formatDate(app.nextStepDeadline)}
                  {daysText && (
                    <div className="text-xs text-lm-text-muted dark:text-dm-text-muted">
                      {daysText}
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      app.priority === 'High'
                        ? 'bg-lm-high-bg dark:bg-dm-high-bg text-lm-high-text dark:text-dm-high-text'
                        : app.priority === 'Medium'
                        ? 'bg-lm-med-bg dark:bg-dm-med-bg text-lm-med-text dark:text-dm-med-text'
                        : 'bg-lm-low-bg dark:bg-dm-low-bg text-lm-low-text dark:text-dm-low-text'
                    }`}
                  >
                    {app.priority}
                  </span>
                </td>
                <td className="p-2 text-lm-text-secondary dark:text-dm-text-secondary">
                  {app.location}
                </td>
                <td className="p-2 text-lm-text-secondary dark:text-dm-text-secondary">
                  {app.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {app.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 text-xs rounded bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-secondary dark:text-dm-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                      {app.tags.length > 2 && (
                        <span className="text-xs text-lm-text-muted dark:text-dm-text-muted">
                          +{app.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
