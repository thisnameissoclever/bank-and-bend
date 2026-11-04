# Supabase migration status

Updated 2026-11-04 UTC. Bank & Bend is live at https://bankandbend.com on Vercel with Supabase. The original Sites app remains available as a migration backup.

## Verified deployment

- Pull request #1 is merged into main. Production deployment dpl_B53fNGFieiLvbXd92rDe9R5HQ5XQ, commit ee7dbbeab9193bea535e0ae2c7497b0f8942f567, is READY.
- The dedicated Supabase organization and Oregon project remain on Free. Google sign-in is enabled and the verified owner is linked to the migrated journal. Apple remains deferred.
- The production-only, sensitive SUPABASE_DATABASE_URL secret contains a working credential. Live shared-scoring and availability requests return 200. PostgreSQL certificate-chain and hostname validation are enabled using the public Supabase CA.
- Signed-in journal readback matches every original record field and revision. Visits, favorites, notes and ratings are preserved. Saved filters, sort order and map layer match. A preference change saved successfully and was restored to its original value.
- Immediately before cutover, all 242 rows across the original five Sites tables matched the migration export exactly. The additional account-link table maps the verified owner. All six tables have RLS and no direct browser-role table grants.
- Google sign-in on bankandbend.com completed and returned to the map with the migrated account and saved filters. Anonymous shared-setting responses report canEdit=false; the signed-in owner reports canEdit=true. Private-record isolation and revision conflict behavior are covered by the tests.
- All 109 tests, typecheck and the production build passed. Desktop layout and the collapsed narrow-screen layout were checked in the browser. Narrow-screen verification used browser zoom; it was not a native-device test.
- Squarespace forwarding was replaced with an apex A record to 216.150.1.1 and a www CNAME to cee1149f736fcaaf.vercel-dns-016.com, both with 30-minute TTL. Domain Connect and email-security records were preserved. Both domains pass Vercel DNS checks. Both have valid, automatically renewed certificates; www redirects to the apex over HTTPS.
- Device-local viewport, panel size and presentation settings belong to their browser origin. They do not automatically transfer from the old Sites hostname.

## Maintenance and remaining work

The Thursday stocking and Friday conditions schedules now identify bankandbend.com and this repository as authoritative. Their original cadence is unchanged. Public research updates should be committed here and published through Vercel.

The legacy ChatGPT fishing connector still targets Sites. The new /mcp endpoint uses the owner's web session and has not been configured for external connector authentication. Do not send scheduled writes to the old connector or assume they update this deployment. Use the new /api/availability for current shared revisions. Until a new authenticated connector is verified, research can continue and public corpus changes can publish, but shared availability writes require the verified owner session. If that is unavailable, save proposed changes and report the specific blocker.

The original Sites app is not a synchronized mirror. Its post-cutover writes do not reach Supabase. Retain it and previous database copies for recovery; do not delete them without a retention decision. Unused legacy provider variables and the previous provider project also remain pending deliberate cleanup.

Preview deployments remain disconnected from production data unless an isolated test database is configured. Automatic deployment remains disabled for the old migration branch; main deploys through the GitHub integration. The Supabase connector still lacks access to the new organization, and the local runtime cannot resolve its pooler; the production Vercel connection works.

## Credential handling

The Google client secret belongs only in Supabase's provider configuration. The database password belongs only in the server SUPABASE_DATABASE_URL secret. Never commit either to GitHub or expose private data in logs. Reject placeholder connection strings before connecting. Keep TLS verification enabled.

The Google Maps browser key is necessarily delivered to the browser for Maps JavaScript API use. Protect it with Google API and website restrictions; storing it in a hosting secret does not make it invisible to visitors.
