import { useState, useEffect } from 'react';
import { useApplications } from './hooks/useApplications';
import { SummaryBar } from './components/SummaryBar';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { ApplicationModal } from './components/ApplicationModal';
import { ApplicationCreationPage } from './components/ApplicationCreationPage';
import { ExportMenu } from './components/ExportMenu';
import { HelpModal } from './components/HelpModal';
import { dueThisWeek } from './utils/dateUtils';

const DEFAULT_FILTERS = {
  search: '',
  stages: [],
  priorities: [],
  industries: [],
  types: [],
  deadlineFrom: '',
  deadlineTo: '',
  dueThisWeek: false,
  activeOnly: false,
};

function App() {
  const { applications, addApplication, updateApplication, deleteApplication, isLoaded } = useApplications();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('viewMode');
      return saved || 'kanban';
    }
    return 'kanban';
  });
  const [filters, setFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('filters');
      return saved ? { ...DEFAULT_FILTERS, ...JSON.parse(saved) } : DEFAULT_FILTERS;
    }
    return DEFAULT_FILTERS;
  });
  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sortBy');
      return saved || 'deadline';
    }
    return 'deadline';
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [creationMode, setCreationMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleAddApplication = () => {
    setCreationMode(true);
  };

  const handleCreationSubmit = (formData) => {
    addApplication(formData);
    setCreationMode(false);
  };

  const handleCreationCancel = () => {
    setCreationMode(false);
  };

  if (creationMode) {
    return (
      <ApplicationCreationPage
        onSubmit={handleCreationSubmit}
        onCancel={handleCreationCancel}
        darkMode={darkMode}
      />
    );
  }

  const filteredApps = applications.filter((app) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchCompany = app.company?.toLowerCase().includes(searchLower);
      const matchRole = app.role?.toLowerCase().includes(searchLower);
      const matchTags = app.tags?.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      if (!matchCompany && !matchRole && !matchTags) return false;
    }

    if (filters.dueThisWeek) {
      if (!dueThisWeek(app.nextStepDeadline)) return false;
    }

    if (filters.activeOnly) {
      if (app.stage === 'Rejected' || app.stage === 'Withdrawn')
        return false;
    }

    if (filters.stages.length > 0 && !filters.stages.includes(app.stage)) {
      return false;
    }

    if (
      filters.priorities.length > 0 &&
      !filters.priorities.includes(app.priority)
    ) {
      return false;
    }

    if (
      filters.industries.length > 0 &&
      !filters.industries.includes(app.industry)
    ) {
      return false;
    }

    if (filters.types.length > 0 && !filters.types.includes(app.type)) {
      return false;
    }

    if (filters.deadlineFrom || filters.deadlineTo) {
      if (!app.nextStepDeadline) return false;
      const deadline = new Date(app.nextStepDeadline);
      if (filters.deadlineFrom) {
        const from = new Date(filters.deadlineFrom);
        if (deadline < from) return false;
      }
      if (filters.deadlineTo) {
        const to = new Date(filters.deadlineTo);
        if (deadline > to) return false;
      }
    }

    return true;
  });

  const handleQuickFilter = (type) => {
    if (type === 'dueThisWeek') {
      setFilters({ ...filters, dueThisWeek: !filters.dueThisWeek });
    } else if (type === 'activeOnly') {
      setFilters({ ...filters, activeOnly: !filters.activeOnly });
    }
  };

  const handleSaveApplication = (updatedApp) => {
    updateApplication(updatedApp.id, updatedApp);
    setSelectedApp(null);
  };

  const handleDeleteApplication = (id) => {
    deleteApplication(id);
  };

  const handleImportApps = (importedApps) => {
    importedApps.forEach((app) => {
      addApplication(app);
    });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-lm-base dark:bg-dm-base text-lm-text-primary dark:text-dm-text-primary">
        {/* Header */}
        <div className="bg-lm-surface-1 dark:bg-dm-surface-1 border-b border-lm-border dark:border-dm-border px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-lm-text-primary dark:text-dm-text-primary">
            Job Application Tracker
          </h1>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <ExportMenu
              applications={applications}
              onImportApps={handleImportApps}
            />
            <button
              onClick={handleAddApplication}
              className="px-4 py-2 bg-lm-accent text-white dark:bg-dm-surface-3 dark:text-dm-text-primary rounded hover:opacity-90 dark:hover:bg-dm-surface-4 font-medium whitespace-nowrap"
            >
              + New Application
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
              className="px-4 py-2 bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-primary dark:text-dm-text-primary rounded hover:bg-lm-surface-4 dark:hover:bg-dm-surface-4 font-medium whitespace-nowrap"
            >
              {viewMode === 'kanban' ? '≡ Table' : '⊞ Kanban'}
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-primary dark:text-dm-text-primary rounded hover:bg-lm-surface-4 dark:hover:bg-dm-surface-4 font-medium"
              title="Help & AI Templates"
            >
              ?
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-primary dark:text-dm-text-primary rounded hover:bg-lm-surface-4 dark:hover:bg-dm-surface-4 font-medium"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '○' : '●'}
            </button>
          </div>
        </div>

        <SummaryBar applications={filteredApps} />
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onQuickFilter={handleQuickFilter}
        />

        <div>
          {viewMode === 'kanban' ? (
            <KanbanBoard
              applications={filteredApps}
              onCardClick={setSelectedApp}
            />
          ) : (
            <TableView
              applications={filteredApps}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onRowClick={setSelectedApp}
            />
          )}
        </div>

        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lm-text-muted dark:text-dm-text-muted text-lg mb-4">
              {applications.length === 0
                ? 'No applications yet. Create your first one!'
                : 'No applications match your filters.'}
            </p>
            {applications.length === 0 && (
              <button
                onClick={handleAddApplication}
                className="px-6 py-2 bg-lm-accent text-white dark:bg-dm-surface-3 dark:text-dm-text-primary rounded hover:opacity-90 dark:hover:bg-dm-surface-4 font-medium"
              >
                + New Application
              </button>
            )}
          </div>
        )}

        {selectedApp && (
          <ApplicationModal
            app={selectedApp}
            onSave={handleSaveApplication}
            onDelete={handleDeleteApplication}
            onClose={() => setSelectedApp(null)}
          />
        )}

        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </div>
    </div>
  );
}

export default App;
