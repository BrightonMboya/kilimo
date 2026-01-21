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
    DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  },
}));

beforeAll(async () => {
  // Setup before all tests
  console.log("🗄️  Connecting to test database...");
  
  // Verify database connection
  try {
    await db.$connect();
    console.log("✅ Test database connected");
  } catch (error) {
    console.error("❌ Failed to connect to test database:", error);
    console.error("Make sure to run: pnpm supabase:start");
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
