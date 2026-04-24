export function exportToJSON(applications, filename = 'applications.json') {
  const json = JSON.stringify(applications, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON(jsonString) {
  try {
    const applications = JSON.parse(jsonString);
    if (!Array.isArray(applications)) {
      throw new Error('JSON must contain an array of applications');
    }
    return applications;
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${e.message}`);
  }
}
