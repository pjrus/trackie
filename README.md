# Trackie

Trackie is a private, local-first workspace for managing job applications. It is built with Next.js App Router, TypeScript, Tailwind CSS and shadcn-style Radix primitives. There is no account, API or database: application data remains in the browser.

## Development

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Data compatibility

The rewrite continues to read and write the existing localStorage keys:

- `jobApplications`
- `darkMode`
- `viewMode`
- `filters`
- `sortBy`

Legacy records are normalised on load. Existing string IDs and unknown fields are retained, while new and imported records receive UUIDs. CSV, JSON and ICS formats remain compatible with the documented schema.

See [docs/DATA_SCHEMA.md](docs/DATA_SCHEMA.md) and [docs/EXPORT_IMPORT.md](docs/EXPORT_IMPORT.md) for details.
