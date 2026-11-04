# Application architecture

Next.js serves the public map and authenticated APIs on Vercel. Supabase PostgreSQL stores private journals and preferences, shared scoring settings, availability overrides, and the availability audit trail. Supabase Auth verifies Google sign-in. The same-origin OAuth callback exchanges a single-use code using PKCE; protected APIs call getUser before resolving account ownership. No request header may supply a trusted user identity.

## Data boundaries

- `data/spots.json`, access audits, coverage audits and research documents are public. Keep observations anonymous and personal visit flags empty.
- `personal_records` and `preferences` are scoped to the verified account. Every query includes the resolved user ID.
- `account_links` maps a verified new account to its migrated identity. Only an operator may create a link after verifying account ownership. Never assign old records to the first signup or accept a client-supplied legacy identity.
- Scoring and availability writes require the configured owner identity. Revision checks reject stale edits; availability changes and audit records commit in one transaction.
- Row-level security is enabled with no public policies. The trusted server connection owns the tables. Never expose its URL or grant browser roles direct table access.
- Device-local map view, panel dimensions and detail presentation stay local. Cloud preferences contain filters, sorting, map layer and compatible historical preference fields. GPS positions remain in memory.

## Environment

`SUPABASE_DATABASE_URL` connects the server to PostgreSQL. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are intentionally public client configuration. Never put a secret or service-role key in either variable. Use the transaction pooler with prepared statements disabled and verified TLS for server PostgreSQL connections. The public Supabase CA in lib/database-ca.ts is scoped to this client, with certificate-chain and hostname validation enabled. Obtain certificate updates from the project Database Settings page; never disable validation to fix a connection failure. `AVAILABILITY_EDITOR_ID` selects the resolved owner identity. `GOOGLE_MAPS_BROWSER_KEY` is a domain-restricted browser API key served at runtime.

Optional private research-redaction values can remove an old name or travel origin from migrated shared records. Do not store those values in source. Historical private data and database connection snippets must never enter the public repository, build output or logs.

Preview deployments must use an isolated development database or remain disconnected. Supabase database branching is not included in the Free plan. Do not give every preview production database credentials. Tests use synthetic data in PGlite. Production credentials are unnecessary for CI.

## Migration and rollback

Import legacy records with their stable keys, revisions, timestamps and audit history. Compare every imported field with the private export. Keep the old service available until new-account linking, signed-in sync, public map behavior and production routing are verified. Before final cutover, reconcile any changes written to the old service since the export.

The two services do not share authentication. A browser's device-local viewport and panel settings also belong to its original domain. Cloud preferences and journals move through the database import; device-local preferences need an explicit export/import if they must move.

The `/mcp` endpoint exposes the existing research tool protocol and currently authenticates with the web session. External connector authentication must be configured and verified before moving scheduled writers from the old service. Do not silently direct an old connector to a new endpoint with incompatible authentication.
