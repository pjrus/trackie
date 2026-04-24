import { useState, useEffect } from 'react';

const STORAGE_KEY = 'jobApplications';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setApplications(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved applications:', e);
        setApplications([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever applications change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    }
  }, [applications, isLoaded]);

  const addApplication = (data) => {
    const newApp = {
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
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
      ...data,
    };
    setApplications([...applications, newApp]);
    return newApp.id;
  };

  const updateApplication = (id, updates) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      )
    );
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const clearAll = () => {
    setApplications([]);
  };

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    clearAll,
    isLoaded,
  };
}
