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
    setTimeout(() => {
      onSubmit(formData);
    }, 500);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-lm-base dark:bg-dm-base text-lm-text-primary dark:text-dm-text-primary">
        {/* Header */}
        <div className="bg-lm-surface-1 dark:bg-dm-surface-1 border-b border-lm-border dark:border-dm-border px-4 sm:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-lm-text-primary dark:text-dm-text-primary">
              Create New Application
            </h1>
            <p className="text-sm text-lm-text-muted dark:text-dm-text-muted mt-1">
              Enter the details about your job application
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-lm-text-muted hover:text-lm-text-secondary dark:text-dm-text-muted dark:hover:text-dm-text-secondary text-3xl"
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-lm-success-bg dark:bg-dm-success-bg border-b border-lm-success-border dark:border-dm-success-border px-6 py-4">
            <p className="text-lm-success-text dark:text-dm-success-text font-medium">
              Application created successfully!
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-lm-base dark:bg-dm-base max-w-4xl">
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
            <div className="mx-6 mt-4 p-4 bg-lm-error-bg dark:bg-dm-error-bg border border-lm-error-border dark:border-dm-error-border rounded">
              <p className="text-lm-error-text dark:text-dm-error-text font-medium mb-2">
                Please fix the following errors:
              </p>
              <ul className="text-lm-error-text dark:text-dm-error-text text-sm space-y-1 opacity-80">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-lm-border dark:border-dm-border bg-lm-surface-2 dark:bg-dm-surface-2 px-6 py-4 flex justify-end gap-3 sticky bottom-0">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary rounded hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="px-4 py-2 bg-lm-accent text-white dark:bg-dm-accent dark:text-dm-base rounded hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
