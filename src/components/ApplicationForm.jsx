import { useState } from 'react';
import { formatDate, formatDateForInput } from '../utils/dateUtils';

const inputClass = "w-full px-3 py-2 border border-lm-border-med dark:border-dm-border rounded bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary";
const dateInputClass = `${inputClass} dark:[color-scheme:dark]`;

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-lm-text-secondary dark:text-dm-text-secondary mb-1">
      {label}
    </label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={inputClass}
  />
);

const TextArea = ({ value, onChange, placeholder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <textarea
      value={value}
      onChange={onChange}
      onFocus={() => setIsExpanded(true)}
      placeholder={placeholder}
      className={`${inputClass} resize-none transition-all duration-200 ${
        isExpanded ? 'h-32' : 'h-20'
      }`}
    />
  );
};

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    className={`${inputClass} appearance-none`}
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

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

const displayValue = (value, fallback = 'Not provided') => {
  if (typeof value === 'string') {
    return value.trim() || fallback;
  }
  return value || fallback;
};

const PreviewRow = ({ label, value }) => (
  <div>
    <dt className="text-xs font-semibold uppercase text-lm-text-muted dark:text-dm-text-muted">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-lm-text-secondary dark:text-dm-text-secondary break-words">
      {value}
    </dd>
  </div>
);

export function ApplicationForm({
  app,
  onUpdate,
  onAddTag,
  onRemoveTag,
  onAddLink,
  onRemoveLink,
  onAddTimelineEntry,
  onRemoveTimelineEntry,
  showPreview = true,
}) {
  const [newTag, setNewTag] = useState('');
  const [newTimelineDate, setNewTimelineDate] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [newLink, setNewLink] = useState('');
  const sortedTimeline = [...app.timeline].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddTag = () => {
    if (newTag.trim() && !app.tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      onAddLink(newLink);
      setNewLink('');
    }
  };

  const handleAddTimelineEntry = () => {
    if (newTimelineDate.trim() && newTimelineDesc.trim()) {
      onAddTimelineEntry(newTimelineDate, newTimelineDesc);
      setNewTimelineDate('');
      setNewTimelineDesc('');
    }
  };

  return (
    <div className="w-full">
      <div className="p-6">
        <div className={`grid grid-cols-1 gap-8 ${showPreview ? 'xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]' : ''}`}>
          <div className="space-y-6">
            {/* Primary application details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Company">
                  <TextInput
                    value={app.company}
                    onChange={(e) => onUpdate('company', e.target.value)}
                  />
                </Field>
                <Field label="Role">
                  <TextInput
                    value={app.role}
                    onChange={(e) => onUpdate('role', e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Field label="Industry">
                  <Select
                    value={app.industry}
                    onChange={(e) => onUpdate('industry', e.target.value)}
                    options={INDUSTRIES}
                  />
                </Field>
                <Field label="Type">
                  <Select
                    value={app.type}
                    onChange={(e) => onUpdate('type', e.target.value)}
                    options={TYPES}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Field label="Stage">
                  <Select
                    value={app.stage}
                    onChange={(e) => onUpdate('stage', e.target.value)}
                    options={STAGES}
                  />
                </Field>
                <Field label="Priority">
                  <Select
                    value={app.priority}
                    onChange={(e) => onUpdate('priority', e.target.value)}
                    options={PRIORITIES}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Field label="Application Deadline">
                  <input
                    type="date"
                    value={formatDateForInput(app.applicationDeadline)}
                    onChange={(e) => onUpdate('applicationDeadline', e.target.value)}
                    className={dateInputClass}
                  />
                </Field>
                <Field label="Next Step Deadline">
                  <input
                    type="date"
                    value={formatDateForInput(app.nextStepDeadline)}
                    onChange={(e) => onUpdate('nextStepDeadline', e.target.value)}
                    className={dateInputClass}
                  />
                </Field>
              </div>

              <Field label="Next Step Description">
                <TextArea
                  value={app.nextStepDescription}
                  onChange={(e) => onUpdate('nextStepDescription', e.target.value)}
                  placeholder="e.g., Complete OA by Oct 10"
                />
              </Field>

              <Field label="Why I Applied">
                <TextArea
                  value={app.whyApplied}
                  onChange={(e) => onUpdate('whyApplied', e.target.value)}
                  placeholder="What attracted you to this opportunity?"
                />
              </Field>

              <Field label="Notes">
                <TextArea
                  value={app.notes}
                  onChange={(e) => onUpdate('notes', e.target.value)}
                  placeholder="Additional notes"
                />
              </Field>
            </div>

            {/* Supporting details and timeline */}
            <div className="space-y-6">
              <div className="space-y-4 rounded border border-lm-border dark:border-dm-border bg-lm-surface-1 dark:bg-dm-surface-1 p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-4">
                <Field label="Location">
                  <TextInput
                    value={app.location}
                    onChange={(e) => onUpdate('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </Field>
                <Field label="Salary / Stipend">
                  <TextInput
                    value={app.salary}
                    onChange={(e) => onUpdate('salary', e.target.value)}
                    placeholder="e.g., $150,000"
                  />
                </Field>
              </div>

              <Field label="Job Posting URL">
                <TextInput
                  value={app.jobUrl}
                  onChange={(e) => onUpdate('jobUrl', e.target.value)}
                  placeholder="https://..."
                />
              </Field>

              <Field label="Confidence Rating">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => onUpdate('confidence', n)}
                      className={`text-3xl leading-none cursor-pointer ${
                        n <= app.confidence
                          ? 'text-lm-warning-text dark:text-dm-warning-text'
                          : 'text-lm-border-med dark:text-dm-border'
                      }`}
                      aria-label={`Set confidence rating to ${n}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Referrer Name">
                <TextInput
                  value={app.referrerName}
                  onChange={(e) => onUpdate('referrerName', e.target.value)}
                  placeholder="Referrer's name (optional)"
                />
              </Field>

              {/* Tags */}
              <Field label="Tags">
                <div className="flex flex-wrap gap-2 mb-2">
                  {app.tags.map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-2 px-2 py-1 bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-secondary dark:text-dm-text-secondary rounded text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => onRemoveTag(tag)}
                        className="text-lm-text-muted dark:text-dm-text-muted hover:text-lm-text-secondary dark:hover:text-dm-text-secondary font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tag..."
                    className={inputClass}
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-lm-surface-3 dark:bg-dm-accent text-lm-text-primary dark:text-dm-base rounded hover:bg-lm-surface-4 dark:hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </Field>

              {/* Links */}
              <Field label="Links">
                <div className="space-y-2 mb-2">
                  {app.links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2 bg-lm-surface-2 dark:bg-dm-surface-2 rounded border border-lm-border dark:border-dm-border"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-dm-accent hover:underline truncate"
                      >
                        {link.url}
                      </a>
                      <button
                        onClick={() => onRemoveLink(link.id)}
                        className="ml-2 text-lm-text-muted dark:text-dm-text-muted hover:text-lm-text-secondary dark:hover:text-dm-text-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    placeholder="https://..."
                    className={inputClass}
                  />
                  <button
                    onClick={handleAddLink}
                    className="px-3 py-2 bg-lm-surface-3 dark:bg-dm-accent text-lm-text-primary dark:text-dm-base rounded hover:bg-lm-surface-4 dark:hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </Field>
              </div>

              <section className="rounded border border-lm-border dark:border-dm-border bg-lm-surface-1 dark:bg-dm-surface-1 p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-lm-text-primary dark:text-dm-text-primary">
                    Timeline
                  </h3>
                  <span className="rounded bg-lm-surface-2 dark:bg-dm-surface-2 px-2 py-1 text-xs font-medium text-lm-text-muted dark:text-dm-text-muted">
                    {app.timeline.length} {app.timeline.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="date"
                    value={newTimelineDate}
                    onChange={(e) => setNewTimelineDate(e.target.value)}
                    className={dateInputClass}
                  />
                  <input
                    type="text"
                    value={newTimelineDesc}
                    onChange={(e) => setNewTimelineDesc(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTimelineEntry()}
                    placeholder="e.g., Submitted OA"
                    className={inputClass}
                  />
                  <button
                    onClick={handleAddTimelineEntry}
                    className="px-3 py-2 bg-lm-surface-3 dark:bg-dm-accent text-lm-text-primary dark:text-dm-base rounded hover:bg-lm-surface-4 dark:hover:opacity-90 font-medium"
                  >
                    Add Entry
                  </button>
                </div>

                <div className="mt-4 border-t border-lm-border dark:border-dm-border pt-4">
                  {app.timeline.length === 0 ? (
                    <p className="text-lm-text-muted dark:text-dm-text-muted text-sm">
                      No timeline entries yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {sortedTimeline.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between p-3 bg-lm-surface-2 dark:bg-dm-surface-2 rounded border border-lm-border dark:border-dm-border"
                          >
                            <div>
                              <div className="font-semibold text-lm-text-primary dark:text-dm-text-primary">
                                {formatDate(entry.date)}
                              </div>
                              <div className="text-sm text-lm-text-secondary dark:text-dm-text-secondary">
                                {entry.description}
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveTimelineEntry(entry.id)}
                              className="ml-4 text-lm-text-muted dark:text-dm-text-muted hover:text-lm-text-secondary dark:hover:text-dm-text-secondary font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {showPreview && (
            <aside className="min-h-[calc(100vh-12rem)] xl:sticky xl:top-6">
              <div className="min-h-[calc(100vh-12rem)] rounded border border-lm-border dark:border-dm-border bg-lm-surface-1 dark:bg-dm-surface-1 p-5 shadow-sm">
                <div className="border-b border-lm-border dark:border-dm-border pb-4">
                  <p className="text-xs font-semibold uppercase text-lm-text-muted dark:text-dm-text-muted">
                    Preview
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-lm-text-primary dark:text-dm-text-primary break-words">
                    {displayValue(app.company, 'Company name')}
                  </h3>
                  <p className="mt-1 text-sm text-lm-text-secondary dark:text-dm-text-secondary break-words">
                    {displayValue(app.role, 'Role title')}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded bg-lm-surface-2 dark:bg-dm-surface-2 px-2 py-1 text-xs font-medium text-lm-text-secondary dark:text-dm-text-secondary">
                      {app.stage}
                    </span>
                    <span className="rounded bg-lm-surface-2 dark:bg-dm-surface-2 px-2 py-1 text-xs font-medium text-lm-text-secondary dark:text-dm-text-secondary">
                      {app.priority} priority
                    </span>
                    <span className="rounded bg-lm-surface-2 dark:bg-dm-surface-2 px-2 py-1 text-xs font-medium text-lm-text-secondary dark:text-dm-text-secondary">
                      {app.confidence}/5 confidence
                    </span>
                  </div>
                </div>

              <dl className="mt-4 grid grid-cols-1 gap-4">
                <PreviewRow label="Industry" value={app.industry} />
                <PreviewRow label="Type" value={app.type} />
                <PreviewRow label="Location" value={displayValue(app.location)} />
                <PreviewRow label="Salary / stipend" value={displayValue(app.salary)} />
                <PreviewRow
                  label="Application deadline"
                  value={app.applicationDeadline ? formatDate(app.applicationDeadline) : 'Not provided'}
                />
                <PreviewRow
                  label="Next step"
                  value={app.nextStepDeadline ? formatDate(app.nextStepDeadline) : 'Not provided'}
                />
                <PreviewRow label="Next step details" value={displayValue(app.nextStepDescription)} />
                <PreviewRow label="Referrer" value={displayValue(app.referrerName)} />
              </dl>

              <div className="mt-5 border-t border-lm-border dark:border-dm-border pt-4">
                <h4 className="text-sm font-semibold text-lm-text-primary dark:text-dm-text-primary">
                  Why applied
                </h4>
                <p className="mt-2 whitespace-pre-wrap text-sm text-lm-text-secondary dark:text-dm-text-secondary">
                  {displayValue(app.whyApplied)}
                </p>
              </div>

              <div className="mt-5 border-t border-lm-border dark:border-dm-border pt-4">
                <h4 className="text-sm font-semibold text-lm-text-primary dark:text-dm-text-primary">
                  Notes
                </h4>
                <p className="mt-2 whitespace-pre-wrap text-sm text-lm-text-secondary dark:text-dm-text-secondary">
                  {displayValue(app.notes)}
                </p>
              </div>

              <div className="mt-5 border-t border-lm-border dark:border-dm-border pt-4">
                <h4 className="text-sm font-semibold text-lm-text-primary dark:text-dm-text-primary">
                  Tags
                </h4>
                {app.tags.length === 0 ? (
                  <p className="text-lm-text-muted dark:text-dm-text-muted text-sm">
                    No tags yet
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-lm-surface-2 dark:bg-dm-surface-2 px-2 py-1 text-xs font-medium text-lm-text-secondary dark:text-dm-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-lm-border dark:border-dm-border pt-4">
                <h4 className="text-sm font-semibold text-lm-text-primary dark:text-dm-text-primary">
                  Timeline
                </h4>
                {sortedTimeline.length === 0 ? (
                  <p className="mt-2 text-sm text-lm-text-muted dark:text-dm-text-muted">
                    No timeline entries yet
                  </p>
                ) : (
                  <ol className="mt-3 space-y-3">
                    {sortedTimeline.map((entry) => (
                      <li key={entry.id} className="border-l-2 border-lm-border-med dark:border-dm-border pl-3">
                        <p className="text-xs font-semibold text-lm-text-muted dark:text-dm-text-muted">
                          {formatDate(entry.date)}
                        </p>
                        <p className="mt-1 text-sm text-lm-text-secondary dark:text-dm-text-secondary">
                          {entry.description}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
