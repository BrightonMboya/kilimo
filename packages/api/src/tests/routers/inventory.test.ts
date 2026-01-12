import { describe, it, expect, beforeEach } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";
import {
  createTestUser,
  createTestProject,
  addUserToProject,
  createTestWarehouse,
} from "../fixtures";

describe("Inventory Router", () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>;
  let testProject: Awaited<ReturnType<typeof createTestProject>>;
  let testWarehouse: Awaited<ReturnType<typeof createTestWarehouse>>;

  beforeEach(async () => {
    testUser = await createTestUser({
      id: "inventory-test-user",
      email: "inventory-test@example.com",
    });
    testProject = await createTestProject({
      slug: "inventory-workspace",
    });
    await addUserToProject(testUser.id, testProject.id, "owner");
    testWarehouse = await createTestWarehouse(testProject.id);
  });

  describe("create", () => {
    it("should create new inventory item successfully", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Fertilizer NPK",
        inventoryType: "Agricultural Input",
        inventoryUnit: "kg",
        description: "High-quality nitrogen-phosphorus-potassium fertilizer",
        estimatedValuePerUnit: "25.50",
        warehouseId: testWarehouse.id, // Schema expects warehouseId
      };

      const result = await caller.inventory.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.inventoryType).toBe(input.inventoryType);
      expect(result.warehousesId).toBe(testWarehouse.id);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      const input = {
        name: "Fertilizer NPK",
        inventoryType: "Agricultural Input",
        inventoryUnit: "kg",
        description: "High-quality fertilizer",
        estimatedValuePerUnit: "25.50",
        warehousesId: "warehouse-123", // Changed from warehouseId to match Prisma schema
      };

      await expect(caller.inventory.create(input)).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required fields", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const invalidInput = {
        name: "", // Invalid: empty
        inventoryType: "",
        inventoryUnit: "",
        description: "",
        estimatedValuePerUnit: "",
        warehousesId: "", // Changed from warehouseId to match Prisma schema
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.inventory.create(invalidInput as any)).rejects.toThrow();
    });

    it("should validate name is not empty", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "", // Invalid: empty
        inventoryType: "Agricultural Input",
        inventoryUnit: "kg",
        description: "Test description",
        estimatedValuePerUnit: "25.50",
        warehousesId: "warehouse-123", // Changed from warehouseId to match Prisma schema
      };

      await expect(caller.inventory.create(input)).rejects.toThrow();
    });

    it("should validate estimatedValuePerUnit is not empty", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Fertilizer",
        inventoryType: "Agricultural Input",
        inventoryUnit: "kg",
        description: "Test description",
        estimatedValuePerUnit: "", // Invalid: empty
        warehousesId: "warehouse-123", // Changed from warehouseId to match Prisma schema
      };

      await expect(caller.inventory.create(input)).rejects.toThrow();
    });
  });
});
