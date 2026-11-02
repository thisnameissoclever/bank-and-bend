# Application architecture

Next.js serves the public map and authenticated APIs on Vercel. Neon PostgreSQL stores private journals and preferences, shared scoring settings, availability overrides, and the availability audit trail. Neon Auth verifies account sessions through same-origin Next.js routes. No request header may supply a trusted user identity.

## Data boundaries

- `data/spots.json`, access audits, coverage audits and research documents are public. Keep observations anonymous and personal visit flags empty.
- `personal_records` and `preferences` are scoped to the verified account. Every query includes the resolved user ID.
- `account_links` maps a verified new account to its migrated identity. Only an operator may create a link after verifying account ownership. Never assign old records to the first signup or accept a client-supplied legacy identity.
- Scoring and availability writes require the configured owner identity. Revision checks reject stale edits; availability changes and audit records commit in one transaction.
- Row-level security is enabled with no public policies. The trusted server connection owns the tables. Never expose its URL or grant browser roles direct table access.
- Device-local map view, panel dimensions and detail presentation stay local. Cloud preferences contain filters, sorting, map layer and compatible historical preference fields. GPS positions remain in memory.

## Environment

`DATABASE_URL` connects the server to PostgreSQL. `NEON_AUTH_BASE_URL` identifies the project's managed authentication endpoint. `NEON_AUTH_COOKIE_SECRET` signs session cache cookies and must have at least 32 characters. `AVAILABILITY_EDITOR_ID` selects the resolved owner identity. `GOOGLE_MAPS_BROWSER_KEY` is a domain-restricted browser API key served at runtime.

Optional private research-redaction values can remove an old name or travel origin from migrated shared records. Do not store those values in source. Historical private data and database connection snippets must never enter the public repository, build output or logs.

Preview deployments use separate Neon branches. Database branches can contain copies of production data, so keep preview protection enabled and restrict project access. Tests use synthetic data in PGlite. Production credentials are unnecessary for CI.

## Migration and rollback

Import legacy records with their stable keys, revisions, timestamps and audit history. Compare every imported field with the private export. Keep the old service available until new-account linking, signed-in sync, public map behavior and production routing are verified. Before final cutover, reconcile any changes written to the old service since the export.

The two services do not share authentication. A browser's device-local viewport and panel settings also belong to its original domain. Cloud preferences and journals move through the database import; device-local preferences need an explicit export/import if they must move.

The `/mcp` endpoint exposes the existing research tool protocol and currently authenticates with the web session. External connector authentication must be configured and verified before moving scheduled writers from the old service. Do not silently direct an old connector to a new endpoint with incompatible authentication.
