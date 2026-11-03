# Supabase migration status

Updated 2026-11-03. This branch is preparation, not a completed production cutover.

- A dedicated Bank & Bend Free organization and healthy Oregon project have been created. Automatic RLS is enabled and automatic Data API table grants are disabled.
- Google is the initial sign-in provider. Apple is deferred. Production site and exact callback URLs are saved in Supabase.
- The application uses Supabase SSR authentication, server-verified user identity, PKCE code exchange, and PostgreSQL transaction pooling. The previous database provider SDKs have been removed from this branch.
- Google OAuth credentials remain pending because Cloud Console displays Site Unavailable in the cloud browser. Google sign-in is not enabled or verified.
- The connected Supabase tool is scoped to an older organization and cannot access the new one. Dashboard access works.
- The initial export has been copied into the new database: 144 audit rows, 87 availability overrides, nine personal records, one preferences record and one scoring-settings record. The transaction verified every column against the export before committing. All six tables have RLS enabled and direct browser roles have no table grants.
- Owner identity linking, end-to-end login and sync verification, deployment promotion, and domain DNS cutover remain pending. The local runtime could not resolve the database pooler hostname, so the database import used the authenticated dashboard SQL editor. Deployed connection verification remains required.
- Automatic deployments are disabled for this preparation branch in vercel.json. Do not enable its preview until it has isolated test data and its own environment configuration. Existing preview variables still belong to the previous provider.
- Original Sites data remains authoritative. Preserve all records and reconcile new changes before cutover. Do not delete the earlier migration copy until retention and cleanup are explicitly resolved.
- Keep the existing research schedules on Sites until their authenticated replacement is verified.

## November 3 checkpoint

- GitHub Actions passed for commit 9e6e7ac61d1022dc10cb912e5f9ce1f61f0dbe2e. Draft PR #1 contains the migration.
- Squarespace sign-in and DNS-management access are verified. The domain currently forwards to the existing Sites app, using four Squarespace A records. Domain Connect and email-security records must be preserved. No DNS changes were made.
- Supabase dashboard access was restored through the existing GitHub login. The project remains healthy on the Free plan.
- The public Supabase URL and publishable key are saved in Vercel's Production environment and their metadata was read back. The database connection still points to the previous provider; replace it only for a verified Supabase release. Preview credentials remain unsuitable for this branch.
- Google Cloud Console still returns Site Unavailable. Google OAuth configuration and a complete signed-in test remain blocked. The Supabase connector also still lacks permission for the new organization.

## Google setup

Create a Web application OAuth client in the existing Google Cloud account. Use only openid, email, and profile scopes. Register the exact callback shown in Supabase Authentication > Providers > Google. Store the client secret only in that provider configuration. Configure the application origins and audience; verify a complete round trip before announcing sign-in works.

## Domain cutover

Inspect current Squarespace DNS and obtain fresh Vercel DNS targets. Preserve unrelated records. Change DNS only after the production deployment, account ownership mapping, private data isolation, desktop/mobile behavior, and rollback path have passed verification.
