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
      <div className="h-screen flex flex-col bg-lm-base dark:bg-dm-base text-lm-text-primary dark:text-dm-text-primary">
        {/* Header */}
        <div className="relative bg-lm-surface-1 dark:bg-dm-surface-1 border-b border-lm-border dark:border-dm-border px-4 sm:px-6 py-4">
          <div className="mx-auto w-full text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-lm-text-primary dark:text-dm-text-primary">
              Create New Application
            </h1>
            <p className="text-sm text-lm-text-muted dark:text-dm-text-muted mt-1">
              Enter the details about your job application
            </p>
          </div>
          <button
            onClick={onCancel}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lm-text-muted hover:text-lm-text-secondary dark:text-dm-text-muted dark:hover:text-dm-text-secondary text-3xl sm:right-6"
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
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full bg-lm-base dark:bg-dm-base lg:w-3/5">
            <ApplicationForm
              app={formData}
              onUpdate={handleUpdate}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onAddLink={handleAddLink}
              onRemoveLink={handleRemoveLink}
              onAddTimelineEntry={handleAddTimelineEntry}
              onRemoveTimelineEntry={handleRemoveTimelineEntry}
              showPreview={false}
            />
          </div>

          {/* Error Display */}
          {Object.keys(errors).length > 0 && (
            <div className="mx-auto mt-4 w-full p-4 bg-lm-error-bg dark:bg-dm-error-bg border border-lm-error-border dark:border-dm-error-border rounded lg:w-3/5">
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

        </div>

        {/* Footer */}
        <div className="border-t border-lm-border dark:border-dm-border bg-lm-surface-2 dark:bg-dm-surface-2 px-6 py-4 shrink-0">
          <div className="mx-auto flex w-full justify-end gap-3 lg:w-3/5">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary rounded hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="px-4 py-2 bg-lm-text-primary text-lm-surface-1 dark:bg-dm-text-primary dark:text-dm-base rounded hover:bg-lm-text-secondary dark:hover:bg-dm-text-secondary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
