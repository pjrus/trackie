import { useState, useCallback } from 'react';
import { ApplicationForm } from './ApplicationForm';

export function ApplicationCreationPage({ onSubmit, onCancel, darkMode }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    industry: 'Other',
    type: 'Full-time',
    stage: 'Applied',
    applicationDeadline: '',
    nextStepDeadline: '',
    nextStepDescription: '',
    priority: 'Medium',
    location: '',
    salary: '',
    jobUrl: '',
    notes: '',
    whyApplied: '',
    tags: [],
    links: [],
    confidence: 3,
    referral: false,
    referrerName: '',
    timeline: [],
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleUpdate = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts editing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleAddTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
  }, []);

  const handleRemoveTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const handleAddLink = useCallback((url) => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { id: Date.now().toString(), url }],
    }));
  }, []);

  const handleRemoveLink = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  }, []);

  const handleAddTimelineEntry = useCallback((date, description) => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          id: Date.now().toString(),
          date,
          description,
        },
      ],
    }));
  }, []);

  const handleRemoveTimelineEntry = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((e) => e.id !== id),
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    // Show success message briefly before submitting
    setTimeout(() => {
      onSubmit(formData);
    }, 500);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Create New Application
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter the details about your job application
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 dark:bg-green-900 border-b border-green-200 dark:border-green-800 px-6 py-4">
            <p className="text-green-800 dark:text-green-100 font-medium">
              Application created successfully!
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-950 max-w-4xl">
            <ApplicationForm
              app={formData}
              onUpdate={handleUpdate}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onAddLink={handleAddLink}
              onRemoveLink={handleRemoveLink}
              onAddTimelineEntry={handleAddTimelineEntry}
              onRemoveTimelineEntry={handleRemoveTimelineEntry}
            />
          </div>

          {/* Error Display */}
          {Object.keys(errors).length > 0 && (
            <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded">
              <p className="text-red-800 dark:text-red-100 font-medium mb-2">
                Please fix the following errors:
              </p>
              <ul className="text-red-700 dark:text-red-200 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end gap-3 sticky bottom-0">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
