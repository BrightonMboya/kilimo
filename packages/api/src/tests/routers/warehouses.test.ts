import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";

describe("Warehouses Router", () => {
  describe("create", () => {
    it.skip("should create a new warehouse successfully", async () => {
      // Skipped: Requires real organization in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Main Storage Facility",
        description: "Primary warehouse for agricultural products",
        maxCapacity: 5000,
        unit: "tons",
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
      };

      await expect(caller.warehouses.create(input)).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required fields", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const invalidInput = {
        name: "", // Invalid: empty
        description: "",
        maxCapacity: 0,
        unit: "",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.warehouses.create(invalidInput as any)).rejects.toThrow();
    });

    it("should validate maxCapacity is positive", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Test Warehouse",
        description: "Test description",
        maxCapacity: -100, // Invalid: negative
        unit: "tons",
      };

      await expect(caller.warehouses.create(input)).rejects.toThrow();
    });
  });

  describe("fetchByOrganization", () => {
    it.skip("should fetch all warehouses for an organization", async () => {
      // Skipped: Requires real organization in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.warehouses.fetchByOrganization({
        organizationId: "org-123",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.warehouses.fetchByOrganization({
          organizationId: "org-123",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate organizationId is provided", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.warehouses.fetchByOrganization({
          organizationId: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("fetchById", () => {
    it.skip("should fetch a warehouse by ID", async () => {
      // Skipped: Requires real warehouse in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.warehouses.fetchById({
        warehouseId: "warehouse-123",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("warehouse-123");
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
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.warehouses.fetchById({
          warehouseId: "",
        })
      ).rejects.toThrow();
    });
  });
});
