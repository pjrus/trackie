import { getDaysRemainingText, isOverdue } from '../utils/dateUtils';

const STAGES = [
  'Applied',
  'Online Assessment',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const STAGE_COLORS = {
  'Applied': 'bg-gray-100 dark:bg-gray-900',
  'Online Assessment': 'bg-yellow-50 dark:bg-yellow-900/35',
  'Phone Screen': 'bg-blue-50 dark:bg-blue-900/35',
  'Interview': 'bg-purple-50 dark:bg-purple-900/35',
  'Offer': 'bg-green-50 dark:bg-green-900/35',
  'Rejected': 'bg-red-50 dark:bg-red-900/35',
  'Withdrawn': 'bg-orange-50 dark:bg-orange-900/35',
};

const PRIORITY_COLORS = {
  'High': 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100',
  'Medium': 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100',
  'Low': 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
};

export function KanbanBoard({ applications, onCardClick }) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto pb-8">
      {STAGES.map((stage) => {
        const stageApps = applications.filter((app) => app.stage === stage);
        return (
          <div key={stage} className="flex-shrink-0 w-80">
            <div className={`rounded border border-gray-200 dark:border-gray-700 ${STAGE_COLORS[stage]}`}>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-transparent">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {stage}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stageApps.length}
                </p>
              </div>
              <div className="space-y-2 p-3 min-h-[300px]">
                {stageApps.length === 0 ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                    No applications
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <KanbanCard
                      key={app.id}
                      app={app}
                      onClick={() => onCardClick(app)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ app, onClick }) {
  const overdue = isOverdue(app.nextStepDeadline);
  const daysText = getDaysRemainingText(app.nextStepDeadline);

  return (
    <div
      onClick={onClick}
      className="p-3 border border-gray-200 dark:border-gray-700 rounded cursor-pointer transition-all hover:shadow-md dark:hover:shadow-black/50 bg-white dark:bg-gray-800"
    >
      <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
        {app.company}
      </div>
      <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">
        {app.role}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {app.industry && (
          <span className="inline-block px-2 py-0.5 text-xs rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
            {app.industry}
          </span>
        )}
        <span
          className={`inline-block px-2 py-0.5 text-xs rounded ${
            app.priority === 'High'
              ? 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100'
              : app.priority === 'Medium'
              ? 'bg-amber-200 dark:bg-amber-700 text-amber-900 dark:text-amber-100'
              : 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100'
          }`}
        >
          {app.priority}
        </span>
      </div>
      {daysText && (
        <div
          className={`text-xs font-semibold ${
            overdue
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {daysText}
        </div>
      )}
      {app.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {app.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {app.tags.length > 3 && (
            <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              +{app.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
