export function parseCSV(content) {
  const lines = content.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const applications = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, idx) => {
      row[header.toLowerCase()] = values[idx] || '';
    });

    const app = {
      id: Date.now().toString() + i,
      company: row['company'] || '',
      role: row['role'] || '',
      industry: row['industry'] || 'Other',
      type: row['type'] || 'Full-time',
      stage: row['stage'] || 'Applied',
      applicationDeadline: row['application deadline'] || '',
      nextStepDeadline: row['next step deadline'] || '',
      nextStepDescription: row['next step description'] || '',
      priority: row['priority'] || 'Medium',
      location: row['location'] || '',
      salary: row['salary'] || '',
      jobUrl: row['job url'] || '',
      notes: row['notes'] || '',
      whyApplied: row['why applied'] || '',
      tags: row['tags'] ? row['tags'].split(';').map((t) => t.trim()) : [],
      confidence: parseInt(row['confidence']) || 3,
      referral: row['referral'] === 'Yes',
      referrerName: row['referrer name'] || '',
      dateAdded: row['date added'] || new Date().toISOString(),
      timeline: [],
      links: [],
    };

    applications.push(app);
  }

  return applications;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export const SAMPLE_CSV = `Company,Role,Industry,Type,Stage,Application Deadline,Next Step Deadline,Next Step Description,Priority,Location,Salary,Job URL,Notes,Why Applied,Tags,Confidence,Referral,Referrer Name,Date Added
Google,Software Engineer,Software Engineering,Full-time,Applied,2026-05-01,2026-04-25,Complete online assessment,High,Mountain View USA,150000,https://careers.google.com/,Strong company,Great brand and impact,coding;quant,5,No,,2026-04-22
Jane Street,Quantitative Trader,Quantitative Trading,Graduate,Phone Screen,2026-06-01,2026-05-05,Phone screen with hiring manager,High,New York USA,200000,https://www.janestreet.com/,Trading firm,Interested in quant,quant;trading,4,Yes,John Doe,2026-04-21
`;
