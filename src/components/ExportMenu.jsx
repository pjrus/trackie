import { exportToCSV } from '../utils/csvExport';
import { exportToJSON } from '../utils/jsonExport';
import { exportToICS } from '../utils/icsExport';
import { useState } from 'react';
import { SAMPLE_CSV, parseCSV } from '../utils/csvImport';

export function ExportMenu({ applications, onImportApps }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importContent, setImportContent] = useState('');
  const [importError, setImportError] = useState('');
  const [showSampleCSV, setShowSampleCSV] = useState(false);
  const [importMode, setImportMode] = useState('json'); // 'csv' | 'json'
  const [importPreview, setImportPreview] = useState(null);

  const handleCSVExport = () => {
    exportToCSV(applications);
    setShowMenu(false);
  };

  const handleJSONExport = () => {
    exportToJSON(applications);
    setShowMenu(false);
  };

  const handleICSExport = () => {
    exportToICS(applications);
    setShowMenu(false);
  };

  const closeImport = () => {
    setShowImportModal(false);
    setShowSampleCSV(false);
    setImportContent('');
    setImportError('');
    setImportPreview(null);
  };

  const handlePreview = () => {
    setImportError('');
    setImportPreview(null);
    try {
      if (importMode === 'json') {
        const parsed = JSON.parse(importContent);
        if (!Array.isArray(parsed)) {
          setImportError('JSON must be an array of applications');
          return;
        }
        setImportPreview(parsed);
      } else {
        const parsed = parseCSV(importContent);
        if (!parsed.length) {
          setImportError('No valid rows found. Make sure the file includes a header row.');
          return;
        }
        setImportPreview(parsed);
      }
    } catch (e) {
      setImportError(`Parse error: ${e.message}`);
    }
  };

  const handleConfirmImport = () => {
    if (!importPreview?.length) return;
    onImportApps(importPreview);
    closeImport();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportPreview(null);
    setImportError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (file.name.endsWith('.csv')) {
        setImportMode('csv');
        setImportContent(content);
      } else if (file.name.endsWith('.json')) {
        setImportMode('json');
        setImportContent(content);
      } else {
        setImportError('Please upload a .csv or .json file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-lm-surface-3 dark:bg-dm-surface-3 text-lm-text-primary dark:text-dm-text-primary rounded hover:bg-lm-surface-4 dark:hover:bg-dm-surface-4 font-medium"
      >
        Import / Export
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 bg-lm-surface-1 dark:bg-dm-surface-1 border border-lm-border-med dark:border-dm-border rounded shadow-lg z-20">
          <button
            onClick={handleCSVExport}
            className="block w-full text-left px-4 py-2 hover:bg-lm-surface-2 dark:hover:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
          >
            Export as CSV
          </button>
          <button
            onClick={handleJSONExport}
            className="block w-full text-left px-4 py-2 hover:bg-lm-surface-2 dark:hover:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
          >
            Export as JSON
          </button>
          <button
            onClick={handleICSExport}
            className="block w-full text-left px-4 py-2 hover:bg-lm-surface-2 dark:hover:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
          >
            Export as Calendar (.ics)
          </button>
          <hr className="border-lm-border dark:border-dm-border" />
          <button
            onClick={() => { setImportMode('json'); setShowImportModal(true); setShowMenu(false); }}
            className="block w-full text-left px-4 py-2 hover:bg-lm-surface-2 dark:hover:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
          >
            Import from JSON
          </button>
          <button
            onClick={() => { setImportMode('csv'); setShowImportModal(true); setShowMenu(false); }}
            className="block w-full text-left px-4 py-2 hover:bg-lm-surface-2 dark:hover:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary"
          >
            Import from CSV
          </button>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-lm-surface-1 dark:bg-dm-surface-1 border border-lm-border-med dark:border-dm-border max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="border-b border-lm-border dark:border-dm-border px-6 py-4 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-semibold text-lm-text-primary dark:text-dm-text-primary">Import Applications</h2>
              <button onClick={closeImport} className="text-lm-text-muted hover:text-lm-text-primary dark:text-dm-text-muted dark:hover:text-dm-text-primary text-2xl leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Mode toggle */}
              <div className="flex border border-lm-border-med dark:border-dm-border w-fit">
                {['csv', 'json'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setImportMode(m); setImportContent(''); setImportPreview(null); setImportError(''); }}
                    className={`px-4 py-1.5 text-sm font-medium uppercase ${
                      importMode === m
                        ? 'bg-lm-text-primary dark:bg-dm-accent text-lm-surface-1 dark:text-dm-base'
                        : 'bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-2 dark:hover:bg-dm-surface-3'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sample CSV collapsible */}
              {importMode === 'csv' && (
                <div className="border border-lm-border dark:border-dm-border">
                  <button
                    onClick={() => setShowSampleCSV(!showSampleCSV)}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-lm-text-secondary dark:text-dm-text-secondary bg-lm-surface-2 dark:bg-dm-surface-2 hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3 flex justify-between"
                  >
                    <span>View sample CSV format</span>
                    <span>{showSampleCSV ? '▲' : '▼'}</span>
                  </button>
                  {showSampleCSV && (
                    <pre className="p-4 text-xs font-mono text-lm-text-secondary dark:text-dm-text-secondary bg-lm-surface-2 dark:bg-dm-surface-1 overflow-x-auto whitespace-pre">
                      {SAMPLE_CSV}
                    </pre>
                  )}
                </div>
              )}

              {/* File upload */}
              <div>
                <label className="block text-sm font-semibold text-lm-text-secondary dark:text-dm-text-secondary mb-2">Upload file</label>
                <input
                  type="file"
                  accept={importMode === 'csv' ? '.csv' : '.json'}
                  onChange={handleFileUpload}
                  className="w-full text-sm text-lm-text-secondary dark:text-dm-text-secondary"
                />
              </div>

              {/* Paste area */}
              <div>
                <label className="block text-sm font-semibold text-lm-text-secondary dark:text-dm-text-secondary mb-2">Or paste content</label>
                <textarea
                  value={importContent}
                  onChange={(e) => { setImportContent(e.target.value); setImportError(''); setImportPreview(null); }}
                  placeholder={importMode === 'csv' ? 'Paste CSV (include header row)…' : 'Paste JSON array…'}
                  className="w-full px-3 py-2 border border-lm-border-med dark:border-dm-border bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-primary dark:text-dm-text-primary h-40 resize-none font-mono text-xs"
                />
              </div>

              {importError && (
                <div className="p-3 bg-lm-error-bg dark:bg-dm-error-bg border border-lm-error-border dark:border-dm-error-border text-lm-error-text dark:text-dm-error-text text-sm">
                  {importError}
                </div>
              )}

              {/* Preview */}
              {importPreview && (
                <div className="border border-lm-success-border dark:border-dm-success-border bg-lm-success-bg dark:bg-dm-success-bg p-4">
                  <p className="text-sm font-semibold text-lm-success-text dark:text-dm-success-text mb-2">
                    ✓ Found {importPreview.length} application{importPreview.length !== 1 ? 's' : ''} — ready to import
                  </p>
                  <ul className="text-xs text-lm-success-text dark:text-dm-success-text opacity-80 space-y-0.5 max-h-24 overflow-y-auto">
                    {importPreview.map((a, i) => (
                      <li key={i}>{a.company || '(no company)'} – {a.role || '(no role)'}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-lm-border dark:border-dm-border bg-lm-surface-2 dark:bg-dm-surface-2 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button onClick={closeImport} className="px-4 py-2 border border-lm-border-med dark:border-dm-border text-lm-text-secondary dark:text-dm-text-secondary hover:bg-lm-surface-3 dark:hover:bg-dm-surface-3 text-sm">
                Cancel
              </button>
              {!importPreview ? (
                <button
                  onClick={handlePreview}
                  disabled={!importContent.trim()}
                  className="px-4 py-2 bg-blue-500 dark:bg-dm-accent text-white dark:text-dm-base font-medium hover:bg-blue-600 dark:hover:opacity-90 disabled:bg-lm-surface-4 dark:disabled:bg-dm-surface-3 dark:disabled:text-dm-text-muted disabled:cursor-not-allowed text-sm"
                >
                  Preview
                </button>
              ) : (
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-lm-success-text dark:bg-dm-accent text-white dark:text-dm-base font-medium hover:opacity-90 text-sm"
                >
                  Import {importPreview.length} application{importPreview.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
