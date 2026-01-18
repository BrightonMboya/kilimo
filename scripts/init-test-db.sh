#!/usr/bin/env bash
set -euo pipefail

# Small helper to start the test DB and run the SQL seed file.
# Usage: ./scripts/init-test-db.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Load .env.test safely (ignore comments) and export variables
if [ -f "$ROOT_DIR/.env.test" ]; then
  # Use bash's allexport so sourced assignments become exported env vars
  set -o allexport
  # shellcheck disable=SC1090
  . "$ROOT_DIR/.env.test"
  set +o allexport
fi

echo "Bringing up test Postgres..."

# Prefer the modern `docker compose` subcommand, fall back to docker-compose if needed.
# Use a small helper so we don't try to execute a single command name containing a space.
if docker compose version >/dev/null 2>&1; then
  USE_COMPOSE_PLUGIN=1
elif command -v docker-compose >/dev/null 2>&1; then
  USE_COMPOSE_PLUGIN=0
else
  echo "Neither 'docker compose' nor 'docker-compose' is available. Install Docker Compose." >&2
  exit 1
fi

compose() {
  if [ "${USE_COMPOSE_PLUGIN}" -eq 1 ]; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

compose -f "$ROOT_DIR/docker-compose.test.yml" up -d

echo "Waiting for Postgres to be ready..."
DB_CONTAINER_ID="$(compose -f "$ROOT_DIR/docker-compose.test.yml" ps -q db-test)"
until docker exec "$DB_CONTAINER_ID" pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
  DB_CONTAINER_ID="$(compose -f "$ROOT_DIR/docker-compose.test.yml" ps -q db-test)"
done

if [ -f "$ROOT_DIR/supabase/seed.sql" ]; then
  echo "Seeding database from supabase/seed.sql"
  docker exec -i "$DB_CONTAINER_ID" psql -U postgres -d kilimo_test < "$ROOT_DIR/supabase/seed.sql"
else
  echo "No seed file found at supabase/seed.sql — skipping seed step"
fi

echo "Test DB is ready at $DATABASE_URL"
