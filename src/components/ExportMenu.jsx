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
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
      >
        Import / Export
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-20">
          <button
            onClick={handleCSVExport}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            Export as CSV
          </button>
          <button
            onClick={handleJSONExport}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            Export as JSON
          </button>
          <button
            onClick={handleICSExport}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            Export as Calendar (.ics)
          </button>
          <hr className="border-gray-200 dark:border-gray-700" />
          <button
            onClick={() => { setImportMode('json'); setShowImportModal(true); setShowMenu(false); }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            Import from JSON
          </button>
          <button
            onClick={() => { setImportMode('csv'); setShowImportModal(true); setShowMenu(false); }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            Import from CSV
          </button>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Import Applications</h2>
              <button onClick={closeImport} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Mode toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 w-fit">
                {['csv', 'json'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setImportMode(m); setImportContent(''); setImportPreview(null); setImportError(''); }}
                    className={`px-4 py-1.5 text-sm font-medium uppercase ${
                      importMode === m
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sample CSV collapsible */}
              {importMode === 'csv' && (
                <div className="border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowSampleCSV(!showSampleCSV)}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
                  >
                    <span>View sample CSV format</span>
                    <span>{showSampleCSV ? '▲' : '▼'}</span>
                  </button>
                  {showSampleCSV && (
                    <pre className="p-4 text-xs font-mono text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 overflow-x-auto whitespace-pre">
                      {SAMPLE_CSV}
                    </pre>
                  )}
                </div>
              )}

              {/* File upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload file</label>
                <input
                  type="file"
                  accept={importMode === 'csv' ? '.csv' : '.json'}
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Paste area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Or paste content</label>
                <textarea
                  value={importContent}
                  onChange={(e) => { setImportContent(e.target.value); setImportError(''); setImportPreview(null); }}
                  placeholder={importMode === 'csv' ? 'Paste CSV (include header row)…' : 'Paste JSON array…'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-40 resize-none font-mono text-xs"
                />
              </div>

              {importError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-sm">
                  {importError}
                </div>
              )}

              {/* Preview */}
              {importPreview && (
                <div className="border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-4">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                    ✓ Found {importPreview.length} application{importPreview.length !== 1 ? 's' : ''} — ready to import
                  </p>
                  <ul className="text-xs text-green-700 dark:text-green-400 space-y-0.5 max-h-24 overflow-y-auto">
                    {importPreview.map((a, i) => (
                      <li key={i}>{a.company || '(no company)'} – {a.role || '(no role)'}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button onClick={closeImport} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                Cancel
              </button>
              {!importPreview ? (
                <button
                  onClick={handlePreview}
                  disabled={!importContent.trim()}
                  className="px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
                >
                  Preview
                </button>
              ) : (
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-green-500 text-white font-medium hover:bg-green-600 text-sm"
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
