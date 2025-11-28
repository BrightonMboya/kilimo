/**
 * Test setup file
 * This runs before all tests
 */

import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { cleanupTestData } from "./helpers/test-context";

// Mock the env module before any imports
vi.mock("~/env", () => ({
  env: {
    NODE_ENV: "test",
    DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test",
  },
}));

beforeAll(async () => {
  // Setup before all tests
  console.log("Setting up tests...");
});

afterEach(async () => {
  // Cleanup after each test
  await cleanupTestData();
});

afterAll(async () => {
  // Cleanup after all tests
  console.log("Cleaning up tests...");
});
