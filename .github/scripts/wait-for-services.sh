#!/bin/bash

# Wait for Services Script
# Waits for all required services to be healthy before proceeding
# Usage: ./wait-for-services.sh [timeout_seconds]

set -e

TIMEOUT=${1:-300}  # Default 5 minutes
INTERVAL=5
ELAPSED=0

echo "⏳ Waiting for services to be ready (timeout: ${TIMEOUT}s)..."
echo ""

# Services to check
SERVICES=(
  "Supabase API:http://localhost:54321/health"
  "PostgreSQL:localhost:54322"
  "Next.js App:http://localhost:3000"
)

# Function to check HTTP endpoint
check_http() {
  local url=$1
  curl -sf "$url" > /dev/null 2>&1
  return $?
}

# Function to check TCP port
check_tcp() {
  local host=$1
  local port=$2
  timeout 1 bash -c "cat < /dev/null > /dev/tcp/$host/$port" 2>/dev/null
  return $?
}

# Function to check a service
check_service() {
  local name=$1
  local endpoint=$2
  
  if [[ $endpoint == http* ]]; then
    check_http "$endpoint"
  else
    IFS=':' read -r host port <<< "$endpoint"
    check_tcp "$host" "$port"
  fi
}

# Main loop
while [ $ELAPSED -lt $TIMEOUT ]; do
  ALL_READY=true
  
  echo "🔍 Checking services... (${ELAPSED}s / ${TIMEOUT}s)"
  
  for service in "${SERVICES[@]}"; do
    IFS=':' read -r name endpoint <<< "$service"
    
    if check_service "$name" "${endpoint#*:}"; then
      echo "  ✅ $name is ready"
    else
      echo "  ⏳ $name is not ready yet"
      ALL_READY=false
    fi
  done
  
  if [ "$ALL_READY" = true ]; then
    echo ""
    echo "🎉 All services are ready!"
    exit 0
  fi
  
  echo ""
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

echo "❌ Timeout reached. Not all services are ready."
echo ""
echo "Service status:"
for service in "${SERVICES[@]}"; do
  IFS=':' read -r name endpoint <<< "$service"
  
  if check_service "$name" "${endpoint#*:}"; then
    echo "  ✅ $name"
  else
    echo "  ❌ $name"
  fi
done

exit 1
