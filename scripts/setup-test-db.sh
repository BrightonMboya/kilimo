#!/usr/bin/env bash
set -euo pipefail

# Script to set up and prepare the test database
# This should be run before running tests

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🚀 Setting up test database..."

# Start the test database container
echo "📦 Starting test PostgreSQL container..."
docker compose -f "$ROOT_DIR/docker-compose.test.yml" up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
DB_CONTAINER_ID="$(docker compose -f "$ROOT_DIR/docker-compose.test.yml" ps -q db-test)"
until docker exec "$DB_CONTAINER_ID" pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

echo "✅ PostgreSQL is ready"

# Export test database URL
export DATABASE_URL="postgresql://postgres:password@localhost:5433/kilimo_test"
export DIRECT_URL="postgresql://postgres:password@localhost:5433/kilimo_test"

# Push Prisma schema to test database
echo "🔄 Pushing Prisma schema to test database..."
cd "$ROOT_DIR/packages/db"
DATABASE_URL="postgresql://postgres:password@localhost:5433/kilimo_test" DIRECT_URL="postgresql://postgres:password@localhost:5433/kilimo_test" pnpm exec prisma db push --skip-generate

echo "✅ Test database is ready!"
echo ""
echo "You can now run tests with: cd packages/api && pnpm test"
echo "To stop the test database: docker compose -f docker-compose.test.yml down"
