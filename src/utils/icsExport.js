export function exportToICS(applications, filename = 'job-deadlines.ics') {
  const events = applications
    .filter((app) => app.nextStepDeadline)
    .map((app) => createEvent(app));

  const icsContent = createICSFile(events);
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function createEvent(app) {
  const deadline = new Date(app.nextStepDeadline);
  const dateStr = formatICSDate(deadline);
  const uid = `${app.id}@jobtracker`;
  const title = `${app.company} - ${app.role}`;
  const description = app.nextStepDescription || app.stage;

  return {
    uid,
    dtstart: dateStr,
    dtend: dateStr,
    summary: title,
    description,
    priority: getPriorityNumber(app.priority),
  };
}

function formatICSDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function getPriorityNumber(priority) {
  switch (priority) {
    case 'High':
      return '1';
    case 'Medium':
      return '5';
    case 'Low':
      return '9';
    default:
      return '5';
  }
}

function createICSFile(events) {
  const now = new Date();
  const dtNow = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Job Application Tracker//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Job Application Deadlines
X-WR-TIMEZONE:UTC
DTSTAMP:${dtNow}Z
`;

  events.forEach((event) => {
    ics += `BEGIN:VEVENT
UID:${event.uid}
DTSTAMP:${dtNow}Z
DTSTART;VALUE=DATE:${event.dtstart}
DTEND;VALUE=DATE:${event.dtend}
SUMMARY:${escapeICS(event.summary)}
DESCRIPTION:${escapeICS(event.description)}
PRIORITY:${event.priority}
STATUS:CONFIRMED
END:VEVENT
`;
  });

  ics += 'END:VCALENDAR';
  return ics;
}

function escapeICS(text) {
  return text.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}
