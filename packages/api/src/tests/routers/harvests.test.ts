import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";

describe("Harvests Router", () => {
  describe("create", () => {
    it.skip("should create a new harvest successfully", async () => {
      // Skipped: Requires real workspace and farmer in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Spring Harvest 2025",
        date: new Date("2025-03-15"),
        crop: "Maize",
        unit: "kg",
        size: 1500,
        inputsUsed: "Fertilizer, Pesticide",
        farmerId: "farmer-123",
        workspaceSlug: "test-workspace",
      };

      const result = await caller.harvests.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.crop).toBe(input.crop);
      expect(result.size).toBe(input.size);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      const input = {
        name: "Test Harvest",
        date: new Date(),
        crop: "Wheat",
        unit: "kg",
        size: 1000,
        inputsUsed: "None",
        farmerId: "farmer-123",
        workspaceSlug: "test-workspace",
      };

      await expect(caller.harvests.create(input)).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required fields", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const invalidInput = {
        name: "", // Invalid: empty string
        date: new Date(),
        crop: "",
        unit: "",
        size: -1, // Invalid: negative
        inputsUsed: "",
        farmerId: "",
        workspaceSlug: "",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.harvests.create(invalidInput as any)).rejects.toThrow();
    });

    it("should validate size is a positive number", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Test Harvest",
        date: new Date(),
        crop: "Maize",
        unit: "kg",
        size: -100, // Invalid
        inputsUsed: "None",
        farmerId: "farmer-123",
        workspaceSlug: "test-workspace",
      };

      await expect(caller.harvests.create(input)).rejects.toThrow();
    });
  });

  describe("fetchByOrganization", () => {
    it.skip("should fetch all harvests for a workspace", async () => {
      // Skipped: Requires real workspace in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.harvests.fetchByOrganization({
        workspaceSlug: "test-workspace",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.harvests.fetchByOrganization({
          workspaceSlug: "test-workspace",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate workspaceSlug is provided", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.harvests.fetchByOrganization({
          workspaceSlug: "",
        })
      ).rejects.toThrow();
    });
  });

  describe("fetchById", () => {
    it.skip("should fetch a single harvest by ID", async () => {
      // Skipped: Requires real harvest in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.harvests.fetchById({
        harvestId: "harvest-123",
        workspaceSlug: "test-workspace",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("harvest-123");
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.harvests.fetchById({
          harvestId: "harvest-123",
          workspaceSlug: "test-workspace",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required parameters", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.harvests.fetchById({
          harvestId: "",
          workspaceSlug: "",
        })
      ).rejects.toThrow();
    });
  });
});
