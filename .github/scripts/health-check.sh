#!/bin/bash

# Health Check Script for Deployments
# Usage: ./health-check.sh <environment> [--comprehensive]

set -e

ENVIRONMENT=${1:-staging}
COMPREHENSIVE=${2:-false}

echo "🏥 Health Check for $ENVIRONMENT environment"
echo "================================================"
echo ""

# Configuration
case $ENVIRONMENT in
  staging)
    API_URL="${STAGING_API_URL:-https://staging-api.kilimo.com}"
    APP_URL="${STAGING_APP_URL:-https://staging.kilimo.com}"
    ;;
  production)
    API_URL="${PROD_API_URL:-https://api.kilimo.com}"
    APP_URL="${PROD_APP_URL:-https://kilimo.com}"
    ;;
  preview)
    API_URL="${PREVIEW_API_URL}"
    APP_URL="${PREVIEW_APP_URL}"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "Valid environments: staging, production, preview"
    exit 1
    ;;
esac

FAILED=0

# Function to check HTTP endpoint
check_endpoint() {
  local name=$1
  local url=$2
  local expected_status=${3:-200}
  
  echo -n "Checking $name... "
  
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  
  if [ "$status" = "$expected_status" ]; then
    echo "✅ OK ($status)"
    return 0
  else
    echo "❌ FAILED (got $status, expected $expected_status)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# Basic Health Checks
echo "📍 Basic Health Checks"
echo "----------------------"

check_endpoint "API Health" "$API_URL/api/health" 200
check_endpoint "App Homepage" "$APP_URL" 200
check_endpoint "API Status" "$API_URL/api/status" 200

echo ""

# Database Connectivity Check
echo "💾 Database Connectivity"
echo "------------------------"
check_endpoint "Database Health" "$API_URL/api/health/db" 200

echo ""

# Comprehensive checks (if requested)
if [ "$COMPREHENSIVE" = "--comprehensive" ]; then
  echo "🔍 Comprehensive Checks"
  echo "-----------------------"
  
  # Check API endpoints
  check_endpoint "Auth API" "$API_URL/api/auth/session" 401  # Should return 401 without auth
  check_endpoint "TRPC Health" "$API_URL/api/trpc/health" 200
  
  # Check response times
  echo ""
  echo "⏱️  Response Time Checks"
  echo "------------------------"
  
  response_time=$(curl -s -o /dev/null -w "%{time_total}" "$API_URL/api/health")
  echo "API Health: ${response_time}s"
  
  if (( $(echo "$response_time > 1.0" | bc -l) )); then
    echo "⚠️  API response time above 1s"
    FAILED=$((FAILED + 1))
  fi
  
  response_time=$(curl -s -o /dev/null -w "%{time_total}" "$APP_URL")
  echo "App Homepage: ${response_time}s"
  
  if (( $(echo "$response_time > 2.0" | bc -l) )); then
    echo "⚠️  App response time above 2s"
    FAILED=$((FAILED + 1))
  fi
  
  echo ""
  echo "🔐 Security Checks"
  echo "------------------"
  
  # Check security headers
  headers=$(curl -s -I "$APP_URL")
  
  if echo "$headers" | grep -q "Strict-Transport-Security"; then
    echo "✅ HSTS header present"
  else
    echo "⚠️  HSTS header missing"
  fi
  
  if echo "$headers" | grep -q "X-Content-Type-Options"; then
    echo "✅ X-Content-Type-Options present"
  else
    echo "⚠️  X-Content-Type-Options missing"
  fi
  
  if echo "$headers" | grep -q "X-Frame-Options"; then
    echo "✅ X-Frame-Options present"
  else
    echo "⚠️  X-Frame-Options missing"
  fi
fi

echo ""
echo "================================================"

if [ $FAILED -eq 0 ]; then
  echo "✅ All health checks passed!"
  exit 0
else
  echo "❌ $FAILED health check(s) failed"
  exit 1
fi
