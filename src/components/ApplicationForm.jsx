import { useState } from 'react';
import { formatDate, formatDateForInput } from '../utils/dateUtils';

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

export function ApplicationForm({ app, onUpdate, onAddTag, onRemoveTag, onAddLink, onRemoveLink, onAddTimelineEntry, onRemoveTimelineEntry }) {
  const [activeTab, setActiveTab] = useState('details');
  const [newTag, setNewTag] = useState('');
  const [newTimelineDate, setNewTimelineDate] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [newLink, setNewLink] = useState('');

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

  const Field = ({ label, children }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none transition-all duration-200 ${
          isExpanded ? 'h-32' : 'h-20'
        }`}
      />
    );
  };

  const Select = ({ value, onChange, options }) => (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 flex gap-4 px-6 py-2 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'details'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'timeline'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <Field label="Application Deadline">
                <input
                  type="date"
                  value={formatDateForInput(app.applicationDeadline)}
                  onChange={(e) => onUpdate('applicationDeadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </Field>
              <Field label="Next Step Deadline">
                <input
                  type="date"
                  value={formatDateForInput(app.nextStepDeadline)}
                  onChange={(e) => onUpdate('nextStepDeadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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
                      className={`text-3xl transition-transform duration-150 hover:scale-110 cursor-pointer ${
                        n <= app.confidence ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Referral">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={app.referral}
                    onChange={(e) => onUpdate('referral', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Have a referral
                  </span>
                </label>
              </Field>
              {app.referral && (
                <Field label="Referrer Name">
                  <TextInput
                    value={app.referrerName}
                    onChange={(e) => onUpdate('referrerName', e.target.value)}
                  />
                </Field>
              )}
            </div>

            {/* Tags */}
            <Field label="Tags">
              <div className="flex flex-wrap gap-2 mb-2">
                {app.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => onRemoveTag(tag)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-bold"
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
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                    >
                      {link.url}
                    </a>
                    <button
                      onClick={() => onRemoveLink(link.id)}
                      className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
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
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddLink}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </Field>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Add Timeline Entry
              </h3>
              <input
                type="date"
                value={newTimelineDate}
                onChange={(e) => setNewTimelineDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={newTimelineDesc}
                onChange={(e) => setNewTimelineDesc(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTimelineEntry()}
                placeholder="e.g., Submitted OA"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddTimelineEntry}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
              >
                Add Entry
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Timeline ({app.timeline.length})
              </h3>
              {app.timeline.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No timeline entries yet
                </p>
              ) : (
                <div className="space-y-2">
                  {[...app.timeline]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(entry.date)}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {entry.description}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveTimelineEntry(entry.id)}
                          className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
