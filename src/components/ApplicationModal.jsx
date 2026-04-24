import { useState } from 'react';
import { ApplicationForm } from './ApplicationForm';

export function ApplicationModal({ app, onSave, onDelete, onClose }) {
  const [editedApp, setEditedApp] = useState(app);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onSave(editedApp);
  };

  const handleUpdate = (field, value) => {
    setEditedApp({
      ...editedApp,
      [field]: value,
    });
  };

  const handleAddTag = (tag) => {
    setEditedApp({
      ...editedApp,
      tags: [...editedApp.tags, tag],
    });
  };

  const handleRemoveTag = (tag) => {
    setEditedApp({
      ...editedApp,
      tags: editedApp.tags.filter((t) => t !== tag),
    });
  };

  const handleAddLink = (url) => {
    setEditedApp({
      ...editedApp,
      links: [...editedApp.links, { id: Date.now().toString(), url }],
    });
  };

  const handleRemoveLink = (id) => {
    setEditedApp({
      ...editedApp,
      links: editedApp.links.filter((l) => l.id !== id),
    });
  };

  const handleAddTimelineEntry = (date, description) => {
    setEditedApp({
      ...editedApp,
      timeline: [
        ...editedApp.timeline,
        {
          id: Date.now().toString(),
          date,
          description,
        },
      ],
    });
  };

  const handleRemoveTimelineEntry = (id) => {
    setEditedApp({
      ...editedApp,
      timeline: editedApp.timeline.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-lm-surface-1 dark:bg-dm-surface-1 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-lm-surface-1 dark:bg-dm-surface-1 border-b border-lm-border dark:border-dm-border px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-lm-text-primary dark:text-dm-text-primary">
              {editedApp.company}
            </h2>
            <p className="text-sm text-lm-text-muted dark:text-dm-text-muted">
              {editedApp.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-lm-text-muted hover:text-lm-text-secondary dark:text-dm-text-muted dark:hover:text-dm-text-secondary text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <ApplicationForm
          app={editedApp}
          onUpdate={handleUpdate}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
          onAddTimelineEntry={handleAddTimelineEntry}
          onRemoveTimelineEntry={handleRemoveTimelineEntry}
        />

        {/* Footer */}
        <div className="border-t border-lm-border dark:border-dm-border bg-lm-surface-2 dark:bg-dm-surface-2 px-6 py-4 flex justify-between gap-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-lm-error-bg dark:bg-dm-error-bg text-lm-error-text dark:text-dm-error-text border border-lm-error-border dark:border-dm-error-border rounded hover:opacity-80 font-medium"
          >
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary rounded hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 dark:bg-dm-accent text-white dark:text-dm-base rounded hover:bg-blue-600 dark:hover:opacity-90 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-lm-surface-1 dark:bg-dm-surface-1 rounded shadow-lg p-6 max-w-sm border border-lm-border dark:border-dm-border">
            <h3 className="text-lg font-semibold text-lm-text-primary dark:text-dm-text-primary mb-4">
              Delete application?
            </h3>
            <p className="text-lm-text-muted dark:text-dm-text-muted mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary rounded hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(editedApp.id);
                  onClose();
                }}
                className="px-4 py-2 bg-lm-error-bg dark:bg-dm-error-bg text-lm-error-text dark:text-dm-error-text border border-lm-error-border dark:border-dm-error-border rounded hover:opacity-80 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
