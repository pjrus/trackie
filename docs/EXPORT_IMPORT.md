# Export & Import Guide

## CSV Format

**Use for:** Spreadsheet analysis, external processing

**Columns:** Company, Role, Industry, Type, Stage, Application Deadline, Next Step Deadline, Next Step Description, Priority, Location, Salary, Job URL, Notes, Why Applied, Tags, Confidence, Referral, Referrer Name, Date Added

**Special handling:**
- Tags semicolon-separated (e.g., `FAANG;remote`)
- Referral column: "Yes"/"No"
- Fields with commas/quotes auto-escaped

**Example:**
```
Company,Role,Stage,Priority
Google,SWE,Applied,High
Jane Street,Trader,Phone Screen,High
```

## JSON Format

**Use for:** Complete backup, re-import into app

Array of application objects with all fields (includes timeline/links not in CSV).

**Re-importing:** IDs regenerated, dates preserved.

See [DATA_SCHEMA.md](DATA_SCHEMA.md) for object structure.

## ICS Format

**Use for:** Calendar integration

Each application becomes calendar event dated on next step deadline.

**Supported:** Google Calendar, Outlook, Apple Calendar, etc.

**Requirements:** Must have next step deadline to be included.

## Importing

**How:** Click Export → Import applications → Select CSV or JSON

**CSV Requirements:**
- Header row with column names (order doesn't matter)
- Columns map to application fields
- Missing columns use defaults from [DATA_SCHEMA.md](DATA_SCHEMA.md)

**Behavior:**
- Applications merge with existing data (no replacement)
- New IDs generated
- No duplicate detection

**Example valid CSV (minimal):**
```
Company,Role
Google,SWE
```

**JSON Requirements:**
- Must be array of objects: `[{...}, {...}]`
- Only include fields you have
- id/dateAdded ignored (regenerated)

## Common Issues

| Problem | Solution |
|---------|----------|
| Import fails | Check file is actual CSV/JSON, not renamed |
| Missing data | Verify CSV headers match column names |
| Wrong dates | Ensure YYYY-MM-DD format for deadlines |
| Calendar shows no events | Applications must have next step deadline |
| Duplicate applications | Manual deletion required |

## Workflows

**Monthly Backup:** Export JSON → Save with date in filename (e.g., `jobs_2026-04-22.json`) → Store in cloud

**Spreadsheet Analysis:** Export CSV → Open in Excel/Sheets → Create pivot tables/charts

**Calendar Sync:** Export ICS → Import to Google Calendar/Outlook → Set reminders

## Security Notes

- All export/import happens in browser (no server upload)
- Exported files are plain text (handle like sensitive data)
- Don't share without removing salary/personal notes
- Store backups in password-protected cloud storage
