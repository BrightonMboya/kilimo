import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";

describe("Inventory Router", () => {
  describe("create", () => {
    it.skip("should create new inventory item successfully", async () => {
      // Skipped: Requires real database setup
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Fertilizer NPK",
        inventoryType: "Agricultural Input",
        inventoryUnit: "kg",
        description: "High-quality nitrogen-phosphorus-potassium fertilizer",
        estimatedValuePerUnit: "25.50",
        warehouseId: "warehouse-123",
      };

      const result = await caller.inventory.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.inventoryType).toBe(input.inventoryType);
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
        warehouseId: "warehouse-123",
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
        warehouseId: "",
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
        warehouseId: "warehouse-123",
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
        warehouseId: "warehouse-123",
      };

      await expect(caller.inventory.create(input)).rejects.toThrow();
    });
  });
});
