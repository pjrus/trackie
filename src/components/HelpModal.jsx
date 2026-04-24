import { useState } from 'react';
import { SAMPLE_CSV } from '../utils/csvImport';

const TEMPLATES = [
  {
    id: 'single-job',
    label: 'Single Job Posting → CSV Row',
    icon: '📋',
    summary: 'Paste a job listing and get a ready-to-import CSV row.',
    when: 'You found a role online and want to add it quickly without filling every field manually.',
    prompt: `You are helping me track job applications. I will paste a job posting below. Extract the relevant details and output a SINGLE CSV row (with NO header line) that matches this exact column order:

Company,Role,Industry,Type,Stage,Application Deadline,Next Step Deadline,Next Step Description,Priority,Location,Salary,Job URL,Notes,Why Applied,Tags,Confidence,Referral,Referrer Name,Date Added

Rules:
- Industry must be one of: Quantitative Trading, Software Engineering, Consulting, Banking & Finance, Other
- Type must be one of: Internship, Graduate, Full-time
- Stage must be: Applied
- Priority: choose High / Medium / Low based on how competitive or prestigious the role seems
- Tags: comma-free, semicolon-separated (e.g. coding;python;quant)
- Confidence: a number 1–5 (how excited I might be about this role — guess 3 if unknown)
- Referral: No (leave blank unless stated)
- Referrer Name: leave blank
- Application Deadline & Next Step Deadline: use YYYY-MM-DD format, or leave blank if not stated
- Salary: leave blank if not stated
- Why Applied: write a 1-sentence suggested reason based on the role
- Notes: 1-sentence summary of the key requirements
- Date Added: today's date in YYYY-MM-DD format
- Wrap each field in double-quotes if it contains a comma

Output ONLY the CSV row, nothing else — no explanation, no markdown, no header.

JOB POSTING:
[PASTE THE JOB POSTING HERE]`,
    outputFormat: 'csv',
    tip: 'Copy the output, open Import → Import from CSV, paste it with the header line from the Sample CSV above it.',
  },
  {
    id: 'bulk-jobs',
    label: 'Multiple Jobs from Notes → Full CSV',
    icon: '📑',
    summary: 'Dump rough notes about several jobs; get a complete importable CSV.',
    when: 'You\'ve been researching roles and have messy notes — company names, roles, deadlines jotted down — and want to bulk-import them.',
    prompt: `You are helping me bulk-import job applications into a tracker. I will give you rough notes about multiple jobs. For each job, output one CSV row. Start with this exact header line:

Company,Role,Industry,Type,Stage,Application Deadline,Next Step Deadline,Next Step Description,Priority,Location,Salary,Job URL,Notes,Why Applied,Tags,Confidence,Referral,Referrer Name,Date Added

Then output one row per job.

Rules:
- Industry must be one of: Quantitative Trading, Software Engineering, Consulting, Banking & Finance, Other
- Type must be one of: Internship, Graduate, Full-time
- Stage must be: Applied (unless my notes say otherwise — use: Applied, Online Assessment, Phone Screen, Interview, Offer, Rejected, Withdrawn)
- Priority: High / Medium / Low — use context clues (deadline urgency, prestige)
- Tags: semicolon-separated, no spaces inside (e.g. quant;python;case)
- Confidence: 1–5 (guess based on role fit)
- Referral: Yes or No
- Dates: YYYY-MM-DD format or blank
- Wrap fields containing commas in double-quotes
- Date Added: today's date for all rows unless my notes specify otherwise

Output ONLY the CSV (header + rows). No explanation, no markdown.

MY NOTES:
[PASTE YOUR NOTES HERE — one job per paragraph or bullet point]`,
    outputFormat: 'csv',
    tip: 'Copy the entire output including the header, open Import → Import from CSV, and paste.',
  },
  {
    id: 'recruiter-email',
    label: 'Recruiter Email → Stage Update',
    icon: '📧',
    summary: 'Paste a recruiter email to find out which fields to update.',
    when: 'You received an email about an application — an OA invitation, interview invite, rejection, or offer — and want to know what to update.',
    prompt: `I am tracking my job applications. I received the email below from a recruiter or company. Based on the email content, tell me exactly which fields I should update in my tracker.

The fields I track are:
- Stage (Applied, Online Assessment, Phone Screen, Interview, Offer, Rejected, Withdrawn)
- Next Step Deadline (YYYY-MM-DD)
- Next Step Description (free text)
- Notes (anything important from the email)
- Timeline entry (date + what happened, e.g. "2026-04-22 - Received OA invitation")

Format your response as a short numbered list like this:
1. Stage → [new value]
2. Next Step Deadline → [YYYY-MM-DD or "not specified"]
3. Next Step Description → [brief description]
4. Notes → [key details from email]
5. Timeline entry → [YYYY-MM-DD - description]

Keep each answer short and actionable. No extra commentary.

EMAIL:
[PASTE THE EMAIL HERE]`,
    outputFormat: 'instructions',
    tip: 'Read the AI\'s suggestions, open the application card, and update each field it lists.',
  },
  {
    id: 'linkedin-profile',
    label: 'LinkedIn / Company Page → Why I Applied',
    icon: '🔍',
    summary: 'Get a personalised "Why I applied" and notes from a company page or LinkedIn post.',
    when: 'You want to record genuine reasons for applying before you forget, using the company\'s own description.',
    prompt: `I am tracking why I apply to jobs. I will paste a company description, LinkedIn post, or "About Us" page. Based on this, write:

1. Why Applied (2–3 sentences, first-person, genuine-sounding — what about this company/role is compelling)
2. Tags (5–8 relevant tags, semicolon-separated, lowercase, no spaces — e.g. fintech;python;quant;startup)
3. Notes (1–2 sentences summarising what the company does and what skills they value)

Format:
Why Applied: [text]
Tags: [tag1;tag2;tag3]
Notes: [text]

Keep the tone professional but personal. No extra output.

COMPANY DESCRIPTION / PAGE TEXT:
[PASTE HERE]`,
    outputFormat: 'instructions',
    tip: 'Copy the "Why Applied", "Tags", and "Notes" values directly into the application modal.',
  },
  {
    id: 'json-bulk',
    label: 'Structured Notes → JSON (full detail)',
    icon: '🗂️',
    summary: 'Get a fully-structured JSON array with all fields populated.',
    when: 'You want maximum detail in your imports — timeline events, links, and all metadata — and are comfortable with JSON.',
    prompt: `You are helping me import job applications into a tracker. Output a JSON array where each element matches this exact schema:

{
  "company": "string",
  "role": "string",
  "industry": "Quantitative Trading|Software Engineering|Consulting|Banking & Finance|Other",
  "type": "Internship|Graduate|Full-time",
  "stage": "Applied|Online Assessment|Phone Screen|Interview|Offer|Rejected|Withdrawn",
  "applicationDeadline": "YYYY-MM-DD or empty string",
  "nextStepDeadline": "YYYY-MM-DD or empty string",
  "nextStepDescription": "string",
  "priority": "High|Medium|Low",
  "location": "string",
  "salary": "string or empty",
  "jobUrl": "URL string or empty",
  "notes": "string",
  "whyApplied": "string",
  "tags": ["array", "of", "strings"],
  "confidence": 1-5,
  "referral": true|false,
  "referrerName": "string or empty",
  "dateAdded": "YYYY-MM-DD",
  "timeline": [
    { "date": "YYYY-MM-DD", "description": "string" }
  ],
  "links": [
    { "label": "string", "url": "string" }
  ]
}

Rules:
- Infer industry, priority, confidence, and tags intelligently from context
- dateAdded: use today's date for all entries unless specified
- timeline: include at least one entry: { "date": today, "description": "Application added" }
- links: include jobUrl as { "label": "Job Posting", "url": "..." } if available
- Output ONLY valid JSON, no markdown, no explanation

MY NOTES / JOB DETAILS:
[PASTE YOUR NOTES OR JOB DESCRIPTIONS HERE]`,
    outputFormat: 'json',
    tip: 'Copy the entire JSON output, open Import → Import from JSON, and paste it in.',
  },
  {
    id: 'timeline-from-emails',
    label: 'Email Thread → Timeline Events',
    icon: '🕐',
    summary: 'Convert a thread of recruiter emails into a chronological timeline.',
    when: 'You have a chain of emails with a company and want to reconstruct the full application history as timeline entries.',
    prompt: `I am building a timeline of events for a job application. I will paste a thread of emails (oldest to newest, or mixed — you can sort them). Extract every meaningful event and output a JSON array of timeline entries:

[
  { "date": "YYYY-MM-DD", "description": "Brief factual description of what happened" },
  ...
]

Events to look for: application submitted, OA received, OA completed, phone screen scheduled, interview scheduled, offer received, rejection received, follow-up sent, deadline extended, etc.

Rules:
- Use the email date or any date mentioned in the content
- Keep descriptions short (under 80 characters), factual, and in past tense
- Sort chronologically (oldest first)
- Output ONLY the JSON array, no markdown, no explanation

EMAIL THREAD:
[PASTE EMAILS HERE]`,
    outputFormat: 'json',
    tip: 'Copy the JSON array, open the application in the tracker, go to the Timeline tab, and use the "Import timeline events" field (or add them manually using the output as reference).',
  },
];

const FORMAT_BADGE = {
  csv: { label: 'CSV output', color: 'bg-blue-100 text-blue-800 dark:bg-dm-surface-3 dark:text-dm-text-secondary' },
  json: { label: 'JSON output', color: 'bg-purple-100 text-purple-800 dark:bg-dm-surface-3 dark:text-dm-text-secondary' },
  instructions: { label: 'Instructions', color: 'bg-amber-100 text-amber-800 dark:bg-dm-surface-3 dark:text-dm-text-secondary' },
};

function TemplateCard({ template, onCopy, copied }) {
  const [expanded, setExpanded] = useState(false);
  const badge = FORMAT_BADGE[template.outputFormat];

  return (
    <div className="border border-lm-border dark:border-dm-border bg-lm-surface-1 dark:bg-dm-surface-2">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-lm-surface-2 dark:hover:bg-dm-surface-3"
      >
        <span className="text-2xl mt-0.5">{template.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-lm-text-primary dark:text-dm-text-primary">{template.label}</span>
            <span className={`text-xs px-2 py-0.5 font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-sm text-lm-text-muted dark:text-dm-text-muted mt-0.5">{template.summary}</p>
        </div>
        <span className="text-lm-text-muted dark:text-dm-text-muted text-lg mt-0.5 shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-lm-border dark:border-dm-border px-5 py-4 space-y-4">
          {/* When to use */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-lm-text-muted dark:text-dm-text-muted mb-1">When to use</p>
            <p className="text-sm text-lm-text-secondary dark:text-dm-text-secondary">{template.when}</p>
          </div>

          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-lm-text-muted dark:text-dm-text-muted">Prompt template</p>
              <button
                onClick={() => onCopy(template.id, template.prompt)}
                className={`text-xs px-3 py-1 font-medium border ${
                  copied === template.id
                    ? 'bg-lm-success-text dark:bg-dm-success-bg text-white dark:text-dm-success-text border-lm-success-text dark:border-dm-success-border'
                    : 'bg-lm-surface-1 dark:bg-dm-surface-3 text-lm-text-secondary dark:text-dm-text-secondary border-lm-border-med dark:border-dm-border hover:bg-lm-surface-2 dark:hover:bg-dm-surface-4'
                }`}
              >
                {copied === template.id ? '✓ Copied!' : 'Copy prompt'}
              </button>
            </div>
            <pre className="bg-lm-surface-2 dark:bg-dm-surface-1 border border-lm-border dark:border-dm-border p-4 text-xs font-mono text-lm-text-secondary dark:text-dm-text-secondary whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
              {template.prompt}
            </pre>
          </div>

          {/* Tip */}
          <div className="bg-amber-50 dark:bg-dm-surface-2 border-l-4 border-amber-400 dark:border-dm-accent px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-dm-text-muted mb-1">Then what?</p>
            <p className="text-sm text-amber-800 dark:text-dm-text-secondary">{template.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function HelpModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('how');
  const [copied, setCopied] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const tabs = [
    { id: 'how', label: 'How to use' },
    { id: 'templates', label: 'AI Prompt Templates' },
    { id: 'csv', label: 'CSV Format' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-lm-surface-1 dark:bg-dm-surface-1 w-full max-w-3xl max-h-[92vh] flex flex-col border border-lm-border-med dark:border-dm-border">

        {/* Modal header */}
        <div className="border-b border-lm-border dark:border-dm-border px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-lm-text-primary dark:text-dm-text-primary">Help & AI Templates</h2>
          <button
            onClick={onClose}
            className="text-lm-text-muted hover:text-lm-text-primary dark:text-dm-text-muted dark:hover:text-dm-text-primary text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-lm-border dark:border-dm-border px-6 flex gap-0 shrink-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 dark:border-dm-accent text-blue-600 dark:text-dm-text-primary'
                  : 'border-transparent text-lm-text-muted dark:text-dm-text-muted hover:text-lm-text-secondary dark:hover:text-dm-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── HOW TO USE ── */}
          {activeTab === 'how' && (
            <div className="space-y-6 text-sm text-lm-text-secondary dark:text-dm-text-secondary">
              <div>
                <h3 className="text-base font-bold text-lm-text-primary dark:text-dm-text-primary mb-3">Overview</h3>
                <p className="mb-3">
                  Job Application Tracker is a fully local, single-page app — <strong className="text-lm-text-primary dark:text-dm-text-primary">no account, no server, no data leaves your browser</strong>. Everything is saved to your browser's localStorage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: '📋', title: 'Kanban board', desc: 'Drag-free stage management — click any card, edit the Stage field, save. Cards move automatically.' },
                    { icon: '📊', title: 'Table view', desc: 'See all applications in a sortable table. Click column headers to sort by deadline, priority, or date.' },
                    { icon: '🔍', title: 'Filtering', desc: 'Search by company, role, or tags. Filter by stage, priority, industry, type, or date range.' },
                    { icon: '📤', title: 'Import / Export', desc: 'Export your data as CSV, JSON, or a .ics calendar. Import from CSV or JSON to bulk-add applications.' },
                  ].map((item) => (
                    <div key={item.title} className="border border-lm-border dark:border-dm-border p-4 bg-lm-surface-2 dark:bg-dm-surface-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-semibold text-lm-text-primary dark:text-dm-text-primary text-sm">{item.title}</span>
                      </div>
                      <p className="text-xs text-lm-text-muted dark:text-dm-text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-lm-text-primary dark:text-dm-text-primary mb-3">Adding your first application</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Click <strong className="text-lm-text-primary dark:text-dm-text-primary">+ New Application</strong> in the top bar.</li>
                  <li>A modal opens with a blank form. Fill in Company, Role, and Stage at minimum.</li>
                  <li>Set a <strong className="text-lm-text-primary dark:text-dm-text-primary">Next Step Deadline</strong> so the app can alert you to overdue items (shown in red).</li>
                  <li>Add <strong className="text-lm-text-primary dark:text-dm-text-primary">Tags</strong> (e.g. <code className="bg-lm-surface-2 dark:bg-dm-surface-2 px-1">quant</code>, <code className="bg-lm-surface-2 dark:bg-dm-surface-2 px-1">referral</code>) to make searching easier.</li>
                  <li>Use the <strong className="text-lm-text-primary dark:text-dm-text-primary">Timeline</strong> tab to log dated events as your application progresses.</li>
                  <li>Click <strong className="text-lm-text-primary dark:text-dm-text-primary">Save</strong>. The card appears on the board in the correct stage column.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-base font-bold text-lm-text-primary dark:text-dm-text-primary mb-3">Colour coding</h3>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="px-3 py-1 bg-red-500 text-white">High priority</span>
                  <span className="px-3 py-1 bg-amber-400 text-white">Medium priority</span>
                  <span className="px-3 py-1 bg-green-500 text-white">Low priority</span>
                  <span className="px-3 py-1 bg-red-600 text-white">Overdue deadline</span>
                </div>
                <p className="mt-2 text-xs text-lm-text-muted dark:text-dm-text-muted">
                  Cards and rows are tinted by priority. Deadlines that have passed today are shown in red.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-lm-text-primary dark:text-dm-text-primary mb-3">Quick filters explained</h3>
                <dl className="space-y-2">
                  <div><dt className="font-semibold text-lm-text-primary dark:text-dm-text-primary inline">Due this week — </dt><dd className="inline">Shows applications whose Next Step Deadline falls within the next 7 days from today.</dd></div>
                  <div><dt className="font-semibold text-lm-text-primary dark:text-dm-text-primary inline">Active only — </dt><dd className="inline">Hides Rejected and Withdrawn applications so you can focus on live opportunities.</dd></div>
                </dl>
              </div>

              <div>
                <h3 className="text-base font-bold text-lm-text-primary dark:text-dm-text-primary mb-3">Calendar export (.ics)</h3>
                <p>Export your next-step deadlines to any calendar app (Google Calendar, Apple Calendar, Outlook). Each event is titled <em>Company – Role</em> with the stage and description in the body. Open the .ics file after downloading to import it.</p>
              </div>

              <div>
                <h3 className="text-base font-bold text-lm-text-primary dark:text-dm-text-primary mb-3">Data persistence</h3>
                <p className="mb-2">Everything is stored in your browser's localStorage under the key <code className="bg-lm-surface-2 dark:bg-dm-surface-2 px-1">applications</code>. Your data survives page refreshes and browser restarts — but is <strong className="text-lm-text-primary dark:text-dm-text-primary">tied to this browser on this device</strong>.</p>
                <p className="text-amber-700 dark:text-dm-text-secondary font-medium">💡 Tip: Export to JSON regularly as a backup. Re-import it on a new device to restore your data.</p>
              </div>
            </div>
          )}

          {/* ── AI TEMPLATES ── */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-dm-surface-2 border border-blue-200 dark:border-dm-border p-4 text-sm">
                <p className="font-semibold text-blue-900 dark:text-dm-text-primary mb-1">How to use these templates</p>
                <ol className="text-blue-800 dark:text-dm-text-secondary space-y-1 list-decimal list-inside text-sm">
                  <li>Choose the template that fits your situation below.</li>
                  <li>Click <strong>Copy prompt</strong> to copy it to your clipboard.</li>
                  <li>Open your AI assistant (<a href="https://claude.ai" target="_blank" rel="noreferrer" className="underline">Claude</a>, <a href="https://chat.openai.com" target="_blank" rel="noreferrer" className="underline">ChatGPT</a>, Gemini, etc.).</li>
                  <li>Paste the prompt, replace the <code className="bg-blue-100 dark:bg-dm-surface-3 px-1">[PLACEHOLDER]</code> sections with your real content, and send.</li>
                  <li>Copy the AI's output and import it using <strong>Import / Export</strong> in the tracker header.</li>
                </ol>
              </div>

              <div className="space-y-2">
                {TEMPLATES.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onCopy={handleCopy}
                    copied={copied}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── CSV FORMAT ── */}
          {activeTab === 'csv' && (
            <div className="space-y-5 text-sm">
              <p className="text-lm-text-secondary dark:text-dm-text-secondary">
                Use this reference when writing AI prompts or creating CSV files manually. The first row must be the header exactly as shown.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-lm-surface-2 dark:bg-dm-surface-2">
                      <th className="border border-lm-border-med dark:border-dm-border px-3 py-2 text-left font-semibold text-lm-text-primary dark:text-dm-text-primary">Column</th>
                      <th className="border border-lm-border-med dark:border-dm-border px-3 py-2 text-left font-semibold text-lm-text-primary dark:text-dm-text-primary">Required?</th>
                      <th className="border border-lm-border-med dark:border-dm-border px-3 py-2 text-left font-semibold text-lm-text-primary dark:text-dm-text-primary">Allowed values / Format</th>
                    </tr>
                  </thead>
                  <tbody className="text-lm-text-secondary dark:text-dm-text-secondary">
                    {[
                      ['Company', 'Yes', 'Any text'],
                      ['Role', 'Yes', 'Any text'],
                      ['Industry', 'No', 'Quantitative Trading · Software Engineering · Consulting · Banking & Finance · Other'],
                      ['Type', 'No', 'Internship · Graduate · Full-time'],
                      ['Stage', 'No', 'Applied · Online Assessment · Phone Screen · Interview · Offer · Rejected · Withdrawn'],
                      ['Application Deadline', 'No', 'YYYY-MM-DD or blank'],
                      ['Next Step Deadline', 'No', 'YYYY-MM-DD or blank'],
                      ['Next Step Description', 'No', 'Any text'],
                      ['Priority', 'No', 'High · Medium · Low'],
                      ['Location', 'No', 'Any text (e.g. "Sydney, Australia")'],
                      ['Salary', 'No', 'Any text (e.g. "120000" or "$120k")'],
                      ['Job URL', 'No', 'Full URL'],
                      ['Notes', 'No', 'Any text — wrap in quotes if it contains commas'],
                      ['Why Applied', 'No', 'Any text — wrap in quotes if it contains commas'],
                      ['Tags', 'No', 'Semicolon-separated (e.g. quant;python;referral)'],
                      ['Confidence', 'No', '1 to 5 (integer)'],
                      ['Referral', 'No', 'Yes or No'],
                      ['Referrer Name', 'No', 'Any text, or blank'],
                      ['Date Added', 'No', 'YYYY-MM-DD (defaults to today if blank)'],
                    ].map(([col, req, vals]) => (
                      <tr key={col} className="even:bg-lm-surface-2 dark:even:bg-dm-surface-2">
                        <td className="border border-lm-border dark:border-dm-border px-3 py-1.5 font-mono font-semibold text-lm-text-primary dark:text-dm-text-primary">{col}</td>
                        <td className="border border-lm-border dark:border-dm-border px-3 py-1.5">{req}</td>
                        <td className="border border-lm-border dark:border-dm-border px-3 py-1.5">{vals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-lm-text-muted dark:text-dm-text-muted mb-2">Sample CSV (copy this header when pasting AI output)</p>
                <pre className="bg-lm-surface-2 dark:bg-dm-surface-1 border border-lm-border dark:border-dm-border p-4 text-xs font-mono text-lm-text-secondary dark:text-dm-text-secondary whitespace-pre overflow-x-auto">
                  {SAMPLE_CSV}
                </pre>
                <button
                  onClick={() => handleCopy('sample-csv', SAMPLE_CSV)}
                  className={`mt-2 text-xs px-3 py-1 border font-medium ${
                    copied === 'sample-csv'
                      ? 'bg-lm-success-text dark:bg-dm-success-bg text-white dark:text-dm-success-text border-lm-success-text dark:border-dm-success-border'
                      : 'bg-lm-surface-1 dark:bg-dm-surface-2 text-lm-text-secondary dark:text-dm-text-secondary border-lm-border-med dark:border-dm-border hover:bg-lm-surface-2 dark:hover:bg-dm-surface-3'
                  }`}
                >
                  {copied === 'sample-csv' ? '✓ Copied!' : 'Copy sample CSV'}
                </button>
              </div>
            </div>
          )}

          {/* ── FAQ ── */}
          {activeTab === 'faq' && (
            <div className="space-y-5 text-sm text-lm-text-secondary dark:text-dm-text-secondary">
              {[
                {
                  q: 'Will my data be lost if I clear my browser cache?',
                  a: 'Yes. localStorage is cleared when you clear site data or browser cache. Export to JSON regularly as a backup — you can re-import it anytime.',
                },
                {
                  q: 'Can I use this across multiple devices?',
                  a: 'Not automatically — localStorage is device and browser specific. Export your JSON on one device and import it on another to transfer your data.',
                },
                {
                  q: 'Which AI assistants work with the prompt templates?',
                  a: 'Any large language model works: Claude (claude.ai), ChatGPT (chat.openai.com), Gemini (gemini.google.com), or any API-based model. Claude tends to produce the most consistently formatted output.',
                },
                {
                  q: 'The AI\'s CSV output has extra text before/after the data. What do I do?',
                  a: 'Add "Output ONLY the CSV — no explanation, no markdown, no code block" to the end of the prompt. Alternatively, manually delete the extra text before importing.',
                },
                {
                  q: 'Can I add custom industries or stages?',
                  a: 'Currently, industries and stages are fixed to the predefined values. The "Other" industry and free-form Notes/Tags fields can capture anything outside those categories.',
                },
                {
                  q: 'What happens if I import a CSV with missing fields?',
                  a: 'Missing fields default to sensible values: Stage → Applied, Priority → Medium, Industry → Other, Confidence → 3, Referral → No.',
                },
                {
                  q: 'Can I undo a bulk import?',
                  a: 'Not automatically. Before a large import, export your current data to JSON as a backup. If something goes wrong, delete the imported entries manually or restore from your JSON backup.',
                },
                {
                  q: 'The calendar (.ics) export — how do I use it?',
                  a: 'Download the file, then open it with your calendar app. On macOS, double-click the .ics file to import to Apple Calendar. On Windows, open with Outlook. For Google Calendar, go to Settings → Import.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-lm-border dark:border-dm-border pb-4 last:border-0">
                  <p className="font-semibold text-lm-text-primary dark:text-dm-text-primary mb-1">{q}</p>
                  <p>{a}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-lm-border dark:border-dm-border px-6 py-4 flex justify-end shrink-0 bg-lm-surface-2 dark:bg-dm-surface-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-lm-text-primary dark:bg-dm-accent text-lm-surface-1 dark:text-dm-base font-medium hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
