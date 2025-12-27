import { describe, it, expect, beforeEach } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";
import {
  createTestUser,
  createTestProject,
  addUserToProject,
  createTestFarmer,
} from "../fixtures";

describe("Farmers Router", () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>;
  let testProject: Awaited<ReturnType<typeof createTestProject>>;

  beforeEach(async () => {
    // Create test user and project for each test
    testUser = await createTestUser({
      id: "test-user-123",
      email: "farmer-test@example.com",
    });
    testProject = await createTestProject({
      slug: "test-workspace",
    });
    await addUserToProject(testUser.id, testProject.id, "owner");
  });

  describe("addFarmer", () => {
    it("should add a new farmer successfully", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        fullName: "John Doe",
        phoneNumber: "+1234567890",
        farmSize: 10,
        province: "Test Province",
        country: "Test Country",
        crops: "Maize, Wheat",
        quantityCanSupply: 1000,
        workspaceSlug: testProject.slug,
      };

      const result = await caller.farmers.addFarmer(input);

      expect(result).toBeDefined();
      expect(result.fullName).toBe(input.fullName);
      expect(result.phoneNumber).toBe(input.phoneNumber);
      expect(result.farmSize).toBe(input.farmSize);
      expect(result.project_id).toBe(testProject.id);
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
    it("should edit an existing farmer", async () => {
      // Create a farmer first
      const farmer = await createTestFarmer(testProject.id, testUser.id, {
        fullName: "John Doe",
        farmSize: 10,
      });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        id: farmer.id,
        fullName: "John Doe Updated",
        phoneNumber: "+1234567890",
        farmSize: 15,
        province: "Updated Province",
        country: "Test Country",
        crops: "Maize, Wheat, Rice",
        quantityCanSupply: 1500,
        workspaceSlug: testProject.slug,
      };

      const result = await caller.farmers.editFarmer(input);

      expect(result).toBeDefined();
      expect(result.fullName).toBe(input.fullName);
      expect(result.farmSize).toBe(input.farmSize);
      expect(result.province).toBe(input.province);
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
    it("should fetch all farmers for a workspace", async () => {
      // Create multiple farmers
      await createTestFarmer(testProject.id, testUser.id, { fullName: "Farmer 1" });
      await createTestFarmer(testProject.id, testUser.id, { fullName: "Farmer 2" });
      await createTestFarmer(testProject.id, testUser.id, { fullName: "Farmer 3" });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.fetchByOrganization({
        workspaceSlug: testProject.slug,
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]?.fullName).toBeDefined();
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
    it("should fetch farmer names and IDs", async () => {
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
    it("should fetch a farmer by ID", async () => {
      const farmer = await createTestFarmer(testProject.id, testUser.id, {
        fullName: "Specific Farmer",
      });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.fetchFarmerById({
        id: farmer.id,
        workspaceSlug: testProject.slug,
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe(farmer.id);
      expect(result?.fullName).toBe("Specific Farmer");
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
    it("should delete a farmer", async () => {
      const farmer = await createTestFarmer(testProject.id, testUser.id, {
        fullName: "Farmer to Delete",
      });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.farmers.delete({
        id: farmer.id,
        workspaceSlug: testProject.slug,
      });

      expect(result).toBe(true);

      // Verify the farmer was deleted by checking it returns null
      const deletedFarmer = await caller.farmers.fetchFarmerById({
        id: farmer.id,
        workspaceSlug: testProject.slug,
      });
      expect(deletedFarmer).toBeNull();
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
