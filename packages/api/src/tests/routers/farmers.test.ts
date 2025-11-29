import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";

describe("Farmers Router", () => {
  describe("addFarmer", () => {
    it.skip("should add a new farmer successfully", async () => {
      // Skipped: Requires real workspace in database
      // To run this test, you need to:
      // 1. Set up a test database
      // 2. Create test fixtures (workspace)
      // 3. Clean up test data after

      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        fullName: "John Doe",
        phoneNumber: "+1234567890",
        farmSize: 10, // number, not string
        province: "Test Province",
        country: "Test Country",
        crops: "Maize, Wheat", // string, not array
        quantityCanSupply: 1000,
        workspaceSlug: "test-workspace",
      };

      const result = await caller.farmers.addFarmer(input);

      expect(result).toBeDefined();
      expect(result.fullName).toBe(input.fullName);
      expect(result.phoneNumber).toBe(input.phoneNumber);
    });

    it("should fail when user is not authenticated", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      const input = {
        fullName: "John Doe",
        phoneNumber: "+1234567890",
        farmSize: 10,
        province: "Test Province",
        country: "Test Country",
        crops: "Maize, Wheat",
        quantityCanSupply: 1000,
        workspaceSlug: "test-workspace",
      };

      await expect(caller.farmers.addFarmer(input)).rejects.toThrow();
    });

    it("should validate input schema", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const invalidInput = {
        fullName: "", // Invalid: empty string
        farmSize: -1, // Invalid: negative number
        province: "",
        country: "",
        crops: "",
        quantityCanSupply: 0,
        workspaceSlug: "test-workspace",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.farmers.addFarmer(invalidInput as any)).rejects.toThrow();
    });

    it("should validate farmSize is positive", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        fullName: "John Doe",
        phoneNumber: "+1234567890",
        farmSize: 0, // Invalid: must be at least 1
        province: "Test Province",
        country: "Test Country",
        crops: "Maize",
        quantityCanSupply: 1000,
        workspaceSlug: "test-workspace",
      };

      await expect(caller.farmers.addFarmer(input)).rejects.toThrow();
    });
  });

  describe("editFarmer", () => {
    it.skip("should edit an existing farmer", async () => {
      // Skipped: Requires real farmer in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        id: "farmer-123",
        fullName: "John Doe Updated",
        phoneNumber: "+1234567890",
        farmSize: 15,
        province: "Updated Province",
        country: "Test Country",
        crops: "Maize, Wheat, Rice",
        quantityCanSupply: 1500,
        workspaceSlug: "test-workspace",
      };

      const result = await caller.farmers.editFarmer(input);

      expect(result).toBeDefined();
      expect(result.fullName).toBe(input.fullName);
      expect(result.farmSize).toBe(input.farmSize);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        id: "farmer-123",
        fullName: "John Doe",
        farmSize: 10,
        province: "Test Province",
        country: "Test Country",
        crops: "Maize",
        quantityCanSupply: 1000,
        workspaceSlug: "test-workspace",
      };

      await expect(caller.farmers.editFarmer(input)).rejects.toThrow("UNAUTHORIZED");
    });
  });

  describe("fetchByOrganization", () => {
    it.skip("should fetch all farmers for a workspace", async () => {
      // Skipped: Requires real workspace in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.fetchByOrganization({
        workspaceSlug: "test-workspace",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.farmers.fetchByOrganization({
          workspaceSlug: "test-workspace",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });
  });

  describe("farmersNamesAndIds", () => {
    it.skip("should fetch farmer names and IDs", async () => {
      // Skipped: Requires real workspace in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.farmersNamesAndIds({
        workspaceSlug: "test-workspace",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.farmers.farmersNamesAndIds({
          workspaceSlug: "test-workspace",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });
  });

  describe("fetchFarmerById", () => {
    it.skip("should fetch a farmer by ID", async () => {
      // Skipped: Requires real farmer in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.fetchFarmerById({
        id: "farmer-123",
        workspaceSlug: "test-workspace",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("farmer-123");
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.farmers.fetchFarmerById({
          id: "farmer-123",
          workspaceSlug: "test-workspace",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });
  });

  describe("delete", () => {
    it.skip("should delete a farmer", async () => {
      // Skipped: Requires real farmer in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.delete({
        id: "farmer-123",
        workspaceSlug: "test-workspace",
      });

      expect(result).toBe(true);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.farmers.delete({
          id: "farmer-123",
          workspaceSlug: "test-workspace",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required parameters", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.farmers.delete({
          id: "",
          workspaceSlug: "",
        })
      ).rejects.toThrow();
    });
  });
});
