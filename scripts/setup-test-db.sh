#!/usr/bin/env bash
set -euo pipefail

# Script to set up and prepare the test database
# This should be run before running tests

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "🚀 Setting up test database..."

# Start the test database container
echo "📦 Starting test PostgreSQL container..."
# Load .env.test if present so credentials/config come from the env file
if [ -f "$ROOT_DIR/.env.test" ]; then
  set -o allexport
  # shellcheck disable=SC1090
  . "$ROOT_DIR/.env.test"
  set +o allexport
fi

docker compose -f "$ROOT_DIR/docker-compose.test.yml" up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
DB_CONTAINER_ID="$(docker compose -f "$ROOT_DIR/docker-compose.test.yml" ps -q db-test)"
until docker exec "$DB_CONTAINER_ID" pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

echo "✅ PostgreSQL is ready"

# Ensure DATABASE_URL/DIRECT_URL are set (prefer values from .env.test)
if [ -z "${DATABASE_URL-}" ]; then
  export DATABASE_URL="postgresql://postgres:password@localhost:5433/kilimo_test"
fi
if [ -z "${DIRECT_URL-}" ]; then
  export DIRECT_URL="$DATABASE_URL"
fi

# Push Prisma schema to test database (use exported DATABASE_URL/DIRECT_URL)
echo "🔄 Pushing Prisma schema to test database..."
cd "$ROOT_DIR/packages/db"
DATABASE_URL="$DATABASE_URL" DIRECT_URL="$DIRECT_URL" pnpm exec prisma db push --skip-generate

echo "✅ Test database is ready!"
echo ""
echo "You can now run tests with: cd packages/api && pnpm test"
echo "To stop the test database: docker compose -f docker-compose.test.yml down"
