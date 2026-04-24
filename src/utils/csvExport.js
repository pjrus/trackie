export function exportToCSV(applications, filename = 'applications.csv') {
  const headers = [
    'Company',
    'Role',
    'Industry',
    'Type',
    'Stage',
    'Application Deadline',
    'Next Step Deadline',
    'Next Step Description',
    'Priority',
    'Location',
    'Salary',
    'Job URL',
    'Notes',
    'Why Applied',
    'Tags',
    'Confidence',
    'Referral',
    'Referrer Name',
    'Date Added',
  ];

  const rows = applications.map((app) => [
    app.company || '',
    app.role || '',
    app.industry || '',
    app.type || '',
    app.stage || '',
    app.applicationDeadline || '',
    app.nextStepDeadline || '',
    app.nextStepDescription || '',
    app.priority || '',
    app.location || '',
    app.salary || '',
    app.jobUrl || '',
    `"${(app.notes || '').replace(/"/g, '""')}"`,
    `"${(app.whyApplied || '').replace(/"/g, '""')}"`,
    (app.tags || []).join(';'),
    app.confidence || '',
    app.referral ? 'Yes' : 'No',
    app.referrerName || '',
    app.dateAdded || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  downloadFile(csv, filename, 'text/csv');
}

function escapeCSV(value) {
  if (typeof value !== 'string') return value;
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
