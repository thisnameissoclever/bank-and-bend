# Supabase migration status

Updated 2026-11-03. The Vercel migration is deployed for verification. Domain cutover is still pending.

- The dedicated Bank & Bend Supabase organization and Oregon project remain on Free. Automatic RLS is enabled and automatic Data API table grants are disabled.
- Google OAuth is enabled. A live browser round trip created a confirmed Google account and reached the application callback. The verified owner account has been linked to the legacy journal. Apple remains deferred.
- The application uses Supabase SSR authentication, server-verified identity, PKCE, and PostgreSQL transaction pooling. The former database-provider SDKs have been removed from this branch.
- All imported fields were verified against the initial export. A November 3 reread of the five Sites tables matched the export exactly: 144 audit rows, 87 availability overrides, nine personal records, one preferences record and one scoring-settings record. The account-link table contains the verified owner mapping. All six tables have RLS and no direct browser-role table grants.
- The initial production DATABASE_URL was changed to target Supabase. The first live request exposed a missing trusted CA. The public Supabase CA is now configured with certificate and hostname validation intact. The following live request reached PostgreSQL and failed password authentication: the stored migration connection string contains a redacted placeholder. A valid database credential is required before sync can pass. Code now rejects placeholder credentials before connecting.
- The local runtime cannot resolve the pooler hostname. Database import and the guarded owner link used the authenticated Supabase dashboard. The Supabase connector still lacks access to the new organization.
- Vercel's production build is ready, but signed-in journal sync and shared-settings reads have not passed. Do not route the custom domain to this deployment yet.
- The existing Sites app remains authoritative, and bankandbend.com still forwards there. Squarespace DNS management is available. Preserve Domain Connect, email-security records and the current forwarding until cutover checks pass.
- Automatic deployments are disabled for the migration branch. Preview must remain disconnected or use isolated test data. The application now reads a dedicated SUPABASE_DATABASE_URL secret to avoid sharing the Neon integration-managed variable. That dedicated secret must be populated before the next deploy. Supabase public configuration is production-only; unused old provider variables still require cleanup after successful migration.
- The draft pull request remains unmerged. Keep research schedules and the existing connector on Sites until replacement authentication is verified. Do not delete earlier migration copies without an explicit retention decision.

## Remaining verification

Provide the real database password through the hosting settings, redeploy, and verify private journal reads and writes, favorites, filters, custom weights, availability revisions, and account isolation. Complete desktop/mobile checks. Reconcile any newer Sites writes immediately before cutover. Obtain fresh Vercel DNS targets, replace only the forwarding records, and verify both HTTPS hosts plus Google sign-in on the custom domain. Keep the prior service and rollback deployment available.

## Credential handling

The Google client secret belongs only in Supabase's Google provider configuration. The database password belongs only in the server SUPABASE_DATABASE_URL secret. Do not commit either to GitHub or put private data in logs. Reject redacted or placeholder values as incomplete configuration. Certificate-verification failures must be fixed with the provider CA, never by disabling verification.
