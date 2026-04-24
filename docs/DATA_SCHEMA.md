# Data Schema

## Application Object Structure

```javascript
{
  id: string                      // Auto-generated, do not edit
  dateAdded: ISO 8601 string     // Auto-generated
  company: string                 // Company name
  role: string                    // Job title
  industry: string               // One of: Software Engineering, Quantitative Trading, Consulting, Banking & Finance, Other
  type: string                   // One of: Internship, Graduate, Full-time
  stage: string                  // One of: Applied, Online Assessment, Phone Screen, Interview, Offer, Rejected, Withdrawn
  priority: string               // One of: High, Medium, Low (default: Medium)
  confidence: number             // 1-5 (default: 3)
  applicationDeadline: YYYY-MM-DD // When to apply by
  nextStepDeadline: YYYY-MM-DD   // When next action is due
  nextStepDescription: string    // e.g., "Submit online assessment"
  location: string               // Job location
  salary: string                 // Compensation
  jobUrl: string                 // Link to job posting
  notes: string                  // General notes
  whyApplied: string             // Motivation
  tags: string[]                 // Custom labels (e.g., ["FAANG", "remote"])
  links: {id, url}[]             // Additional URLs
  referral: boolean              // Was this a referral?
  referrerName: string           // Name of referrer
  timeline: {id, date, description}[] // Interaction history
}
```

## Validation Rules

- **Company/Role**: At least one should be filled
- **Dates**: YYYY-MM-DD format only
- **Confidence**: Integer 1-5
- **Stage progression**: Applied → Assessment/Phone → Interview → Offer (typical, not enforced)
- **Tags**: No duplicates per application
- **Referral**: If true, referrerName should be provided

## Defaults on Creation

```javascript
{
  id: Date.now().toString(),
  dateAdded: new Date().toISOString(),
  company: '',
  role: '',
  industry: 'Other',
  type: 'Full-time',
  stage: 'Applied',
  priority: 'Medium',
  confidence: 3,
  location: '',
  salary: '',
  jobUrl: '',
  notes: '',
  whyApplied: '',
  tags: [],
  links: [],
  referral: false,
  referrerName: '',
  timeline: [],
  applicationDeadline: '',
  nextStepDeadline: '',
  nextStepDescription: '',
}
```

## Storage

All applications stored in localStorage under `'jobApplications'` as JSON array.

```javascript
localStorage['jobApplications'] = JSON.stringify([app1, app2, ...])
```

Automatically persisted by `useApplications` hook on any change.
