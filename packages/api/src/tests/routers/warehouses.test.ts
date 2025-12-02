import { describe, it, expect, beforeEach } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";
import {
  createTestUser,
  createTestProject,
  addUserToProject,
  createTestWarehouse,
} from "../fixtures";

describe("Warehouses Router", () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>;
  let testProject: Awaited<ReturnType<typeof createTestProject>>;

  beforeEach(async () => {
    // Create test user and project for each test
    testUser = await createTestUser({
      id: "warehouse-test-user",
      email: "warehouse-test@example.com",
    });
    testProject = await createTestProject({
      slug: "warehouse-workspace",
    });
    await addUserToProject(testUser.id, testProject.id, "owner");
  });

  describe("create", () => {
    it("should create a new warehouse successfully", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Main Storage Facility",
        description: "Primary warehouse for agricultural products",
        maxCapacity: 5000,
        unit: "tons",
        project_id: testProject.id,
      };

      const result = await caller.warehouses.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.maxCapacity).toBe(input.maxCapacity);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      const input = {
        name: "Test Warehouse",
        description: "Test warehouse description",
        maxCapacity: 5000,
        unit: "tons",
        project_id: "dummy-project-id",
      };

      await expect(caller.warehouses.create(input)).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required fields", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const invalidInput = {
        name: "", // Invalid: empty
        description: "",
        maxCapacity: 0,
        unit: "",
        project_id: "",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.warehouses.create(invalidInput as any)).rejects.toThrow();
    });

    it("should validate maxCapacity is positive", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Test Warehouse",
        description: "Test description",
        maxCapacity: -100, // Invalid: negative
        unit: "tons",
        project_id: testProject.id,
      };

      await expect(caller.warehouses.create(input)).rejects.toThrow();
    });
  });

  // Removed organization-specific tests: organization not used anymore

  describe("fetchById", () => {
    it("should fetch a warehouse by ID", async () => {
      const warehouse = await createTestWarehouse(testProject.id, {
        name: "Specific Warehouse",
      });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.warehouses.fetchById({
        warehouseId: warehouse.id,
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe(warehouse.id);
      expect(result?.name).toBe("Specific Warehouse");
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.warehouses.fetchById({
          warehouseId: "warehouse-123",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate warehouseId is provided", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.warehouses.fetchById({
        warehouseId: "",
      });
      
      // Empty ID returns null, not an error
      expect(result).toBeNull();
    });
  });
});
