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
  'Applied':            'bg-gray-100 dark:bg-dm-surface-1',
  'Online Assessment':  'bg-yellow-50 dark:bg-dm-surface-1',
  'Phone Screen':       'bg-blue-50 dark:bg-dm-surface-1',
  'Interview':          'bg-purple-50 dark:bg-dm-surface-1',
  'Offer':              'bg-green-50 dark:bg-dm-surface-1',
  'Rejected':           'bg-red-50 dark:bg-dm-surface-1',
  'Withdrawn':          'bg-orange-50 dark:bg-dm-surface-1',
};

export function KanbanBoard({ applications, onCardClick }) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto pb-8">
      {STAGES.map((stage) => {
        const stageApps = applications.filter((app) => app.stage === stage);
        return (
          <div key={stage} className="flex-shrink-0 w-80">
            <div className={`rounded border border-lm-border dark:border-dm-border ${STAGE_COLORS[stage]}`}>
              <div className="px-4 py-3 border-b border-lm-border dark:border-dm-border bg-white/70 dark:bg-transparent">
                <h3 className="font-semibold text-lm-text-primary dark:text-dm-text-primary">
                  {stage}
                </h3>
                <p className="text-xs text-lm-text-muted dark:text-dm-text-muted">
                  {stageApps.length}
                </p>
              </div>
              <div className="space-y-2 p-3 min-h-[300px]">
                {stageApps.length === 0 ? (
                  <div className="text-xs text-lm-text-muted dark:text-dm-text-muted text-center py-4">
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
      className="p-3 border border-lm-border dark:border-dm-border rounded cursor-pointer transition-all hover:shadow-md dark:hover:shadow-black/50 bg-lm-surface-1 dark:bg-dm-surface-2"
    >
      <div className="font-semibold text-sm text-lm-text-primary dark:text-dm-text-primary mb-1">
        {app.company}
      </div>
      <div className="text-xs text-lm-text-secondary dark:text-dm-text-secondary mb-2">
        {app.role}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {app.industry && (
          <span className="inline-block px-2 py-0.5 text-xs rounded bg-lm-surface-1 dark:bg-dm-surface-3 text-lm-text-secondary dark:text-dm-text-secondary border border-lm-border dark:border-dm-border">
            {app.industry}
          </span>
        )}
        <span
          className={`inline-block px-2 py-0.5 text-xs rounded ${
            app.priority === 'High'
              ? 'bg-lm-high-bg dark:bg-dm-high-bg text-lm-high-text dark:text-dm-high-text'
              : app.priority === 'Medium'
              ? 'bg-lm-med-bg dark:bg-dm-med-bg text-lm-med-text dark:text-dm-med-text'
              : 'bg-lm-low-bg dark:bg-dm-low-bg text-lm-low-text dark:text-dm-low-text'
          }`}
        >
          {app.priority}
        </span>
      </div>
      {daysText && (
        <div
          className={`text-xs font-semibold ${
            overdue
              ? 'text-lm-overdue dark:text-dm-overdue'
              : 'text-lm-text-muted dark:text-dm-text-muted'
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
              className="inline-block px-1.5 py-0.5 text-xs rounded bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-secondary dark:text-dm-text-secondary"
            >
              {tag}
            </span>
          ))}
          {app.tags.length > 3 && (
            <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-secondary dark:text-dm-text-secondary">
              +{app.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
