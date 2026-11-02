# Bank & Bend

A dark-first fishing finder for Washington and Oregon. Browse bank access on a map, compare seasonal keeper prospects, inspect parking and fishing directions, and keep a private journal.

## Development

Requires Node.js 22.13 or later and pnpm 11.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The public map needs no account. Configure Supabase Auth and PostgreSQL for account sync. Use an isolated development database locally. Never copy production journals into fixtures or public source.

```sh
pnpm test
pnpm typecheck
pnpm build
```

Tests use an isolated PostgreSQL runtime and do not require production credentials.

## Deployment

Vercel deploys the `main` branch. Set server environment variables from `.env.example` in Vercel. Run `node scripts/migrate.mjs` against the target database before serving authenticated requests. Schema changes are additive and must preserve records and revisions.

Google Maps loads in the browser. Its browser key is supplied at runtime by `/api/maps-config`, so it is visible to visitors using the map. Restrict it in Google Cloud to the permitted web origins and Maps JavaScript API. Keep the value out of this repository.

Read [the update protocol](docs/UPDATE-PROTOCOL.md) before changing fishing research and [the architecture](docs/ARCHITECTURE.md) before changing authentication or storage.
