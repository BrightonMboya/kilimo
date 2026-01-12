# Local Supabase Test Environment

Complete setup for running Supabase locally for unit and integration tests.

## Quick Start

```bash
# 1. Start Supabase (runs Docker containers with Postgres, PostgREST, Auth, etc.)
pnpm supabase:start

# 2. Check status
pnpm supabase:status

# 3. Apply Prisma schema to local DB
pnpm db:push:local

# 4. Seed test data
pnpm db:seed:local

# 5. Stop when done
pnpm supabase:stop
```

## Connection Details

When Supabase is running locally, use these connection strings:

### For Prisma / Direct DB Connection
```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

### For Supabase Client (API/PostgREST)
```bash
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<get from pnpm supabase:status>"
```

## Available Commands

### Start/Stop
- `pnpm supabase:start` - Start all Supabase services (DB, Auth, Storage, etc.)
- `pnpm supabase:stop` - Stop and remove containers
- `pnpm supabase:status` - Show connection details and service URLs

### Database Operations
- `pnpm db:push:local` - Push Prisma schema to local Supabase DB
- `pnpm db:seed:local` - Seed test data from `supabase/seed.sql`
- `pnpm db:reset:local` - Reset DB (stop, start, push schema, seed)
- `pnpm db:studio:local` - Open Prisma Studio connected to local DB

### Testing Workflow
```bash
# Full test cycle
pnpm db:reset:local  # Fresh DB with test data
pnpm test            # Run your tests
pnpm supabase:stop   # Clean up
```

## Ports

Default ports (configured in `config.toml`):

- **PostgreSQL**: 54322
- **API (PostgREST)**: 54321
- **Studio (Supabase Studio)**: 54323
- **Inbucket (Email testing)**: 54324

## Schemas

The local DB includes these schemas:
- `public` - Your main application tables (via Prisma)
- `next_auth` - NextAuth.js tables
- `graphql_public` - GraphQL schema
- `auth` - Supabase Auth tables (built-in)
- `storage` - Supabase Storage tables (built-in)

## Test Data

The `seed.sql` file includes:
- 2 test users (admin@test.local, member@test.local)
- 1 test project
- 2 test farmers
- 2 test harvests
- 1 warehouse with inventory
- 1 report with tracking events

## Troubleshooting

### Services won't start
```bash
# Check Docker is running
docker ps

# View detailed logs
docker logs supabase_db_kilimo
docker logs supabase_rest_kilimo

# Nuclear option: remove everything and start fresh
pnpm supabase:stop
docker system prune -a --volumes
pnpm supabase:start
```

### Schema errors
If PostgREST complains about missing schemas:
```bash
# Connect directly and create them
PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres
# Then run:
# CREATE SCHEMA IF NOT EXISTS next_auth;
# CREATE SCHEMA IF NOT EXISTS graphql_public;
```

### Can't connect to DB
Ensure Supabase is running:
```bash
pnpm supabase:status
# Should show all services as "healthy"
```

## CI/CD Integration

For GitHub Actions or other CI:

```yaml
- name: Start Supabase
  run: pnpm supabase:start

- name: Setup test DB
  run: |
    pnpm db:push:local
    pnpm db:seed:local

- name: Run tests
  run: pnpm test
  env:
    DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres

- name: Cleanup
  run: pnpm supabase:stop
```

## Using with Tests

Example test setup (e.g., Vitest or Jest):

```typescript
// test/setup.ts
import { beforeAll, afterAll } from 'vitest'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

beforeAll(async () => {
  // Ensure fresh DB state
  await execAsync('pnpm db:reset:local')
})

afterAll(async () => {
  // Optional: stop supabase after tests
  // await execAsync('pnpm supabase:stop')
})
```
