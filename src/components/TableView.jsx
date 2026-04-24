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
      className="text-left font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
    >
      {label} {sortBy === value && '↓'}
    </button>
  );

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
              Company
            </th>
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
              Role
            </th>
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
              Industry
            </th>
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
              Type
            </th>
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
              Stage
            </th>
            <th className="text-left p-2">
              <SortHeader label="Next Deadline" value="deadline" />
            </th>
            <th className="text-left p-2">
              <SortHeader label="Priority" value="priority" />
            </th>
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
              Location
            </th>
            <th className="text-left p-2 font-semibold text-gray-700 dark:text-gray-300">
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
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
              >
                <td className="p-2 font-semibold text-gray-900 dark:text-white">
                  {app.company}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">
                  {app.role}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">
                  {app.industry}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">
                  {app.type}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">
                  {app.stage}
                </td>
                <td
                  className={`p-2 font-semibold ${
                    overdue
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {formatDate(app.nextStepDeadline)}
                  {daysText && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {daysText}
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      app.priority === 'High'
                        ? 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100'
                        : app.priority === 'Medium'
                        ? 'bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-100'
                        : 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100'
                    }`}
                  >
                    {app.priority}
                  </span>
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">
                  {app.location}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-300">
                  {app.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {app.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {app.tags.length > 2 && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
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
