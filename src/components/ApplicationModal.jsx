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
      <div className="bg-white dark:bg-gray-900 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editedApp.company}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {editedApp.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
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
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between gap-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 rounded hover:bg-red-300 dark:hover:bg-red-800 font-medium"
          >
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete application?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(editedApp.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
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
