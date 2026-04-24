export function SummaryBar({ applications }) {
  const stageCounts = {
    'Applied': 0,
    'Online Assessment': 0,
    'Phone Screen': 0,
    'Interview': 0,
    'Offer': 0,
    'Rejected': 0,
    'Withdrawn': 0,
  };

  const activeCount = applications.filter(
    (app) => app.stage !== 'Rejected' && app.stage !== 'Withdrawn'
  ).length;

  applications.forEach((app) => {
    if (stageCounts.hasOwnProperty(app.stage)) {
      stageCounts[app.stage]++;
    }
  });

  return (
    <div className="border-b border-lm-border dark:border-dm-border bg-lm-surface-1 dark:bg-dm-surface-1 px-4 sm:px-6 py-3 sticky top-0 z-10">
      <div className="flex flex-wrap gap-4 text-sm font-medium text-lm-text-secondary dark:text-dm-text-secondary">
        <div>
          <span className="font-semibold text-lm-text-primary dark:text-dm-text-primary">
            {activeCount}
          </span>{' '}
          active
        </div>
        {Object.entries(stageCounts).map(([stage, count]) => (
          <div key={stage}>
            <span className="font-semibold text-lm-text-primary dark:text-dm-text-primary">
              {count}
            </span>{' '}
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}
