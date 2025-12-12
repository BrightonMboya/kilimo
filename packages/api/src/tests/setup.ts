/**
 * Test setup file
 * This runs before all tests
 */

import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { db } from "@kilimo/db";
import { clearDatabase } from "./fixtures";

// Mock the env module before any imports
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "test",
    DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:password@localhost:5433/kilimo_test",
  },
}));

// Safety guard: ensure tests are running against the test database before any destructive actions
function ensureTestDatabaseEnv() {
  const raw = process.env.DATABASE_URL ?? "";
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Refusing to run tests: NODE_ENV !== 'test'. Set NODE_ENV=test");
  }

  let url: URL | null = null;
  try {
    url = new URL(raw);
  } catch (e) {
    throw new Error(`Refusing to run tests: DATABASE_URL is not a valid URL. Current DATABASE_URL=${raw}`);
  }

  const hostname = url.hostname;
  const dbName = url.pathname.replace(/^\//, "");

  // Require an exact host and database name for the test DB to avoid accidental deletion
  const hostSafe = hostname === "localhost" || hostname === "127.0.0.1";
  const dbSafe = dbName === "kilimo_test";

  if (!hostSafe || !dbSafe) {
    throw new Error(
      `Refusing to run tests: DATABASE_URL does not look like the test DB. Current host=${hostname} db=${dbName}`
    );
  }
}

ensureTestDatabaseEnv();

beforeAll(async () => {
  // Setup before all tests
  console.log("🗄️  Connecting to test database...");
  
  // Verify database connection
  try {
    await db.$connect();
    console.log("✅ Test database connected");
  } catch (error) {
    console.error("❌ Failed to connect to test database:", error);
    console.error("Make sure to run: docker-compose -f docker-compose.test.yml up -d");
    throw error;
  }
  
  // Clear any existing data
  await clearDatabase();
  console.log("🧹 Test database cleared");
});

afterEach(async () => {
  // Cleanup after each test
  await clearDatabase();
});

afterAll(async () => {
  // Cleanup after all tests
  await clearDatabase();
  await db.$disconnect();
  console.log("👋 Test database disconnected");
});
