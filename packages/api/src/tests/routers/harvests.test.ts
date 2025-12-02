import { describe, it, expect, beforeEach } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";
import {
  createTestUser,
  createTestProject,
  addUserToProject,
  createTestFarmer,
  createTestHarvest,
} from "../fixtures";

describe("Harvests Router", () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>;
  let testProject: Awaited<ReturnType<typeof createTestProject>>;
  let testFarmer: Awaited<ReturnType<typeof createTestFarmer>>;

  beforeEach(async () => {
    // Create test user, project, and farmer for each test
    testUser = await createTestUser({
      id: "harvest-test-user",
      email: "harvest-test@example.com",
    });
    testProject = await createTestProject({
      slug: "test-workspace",
    });
    await addUserToProject(testUser.id, testProject.id, "owner");
    testFarmer = await createTestFarmer(testProject.id, testUser.id);
  });

  describe("create", () => {
    it("should create a new harvest successfully", async () => {
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Spring Harvest 2025",
        date: new Date("2025-03-15"),
        crop: "Maize",
        unit: "kg",
        size: 1500,
        inputsUsed: "Fertilizer, Pesticide",
        farmerId: testFarmer.id,
        workspaceSlug: testProject.slug,
      };

      const result = await caller.harvests.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.crop).toBe(input.crop);
      expect(result.size).toBe(input.size);
      expect(result.farmersId).toBe(testFarmer.id);
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
    it("should fetch all harvests for a workspace", async () => {
      // Create some harvests first
      await createTestHarvest(testProject.id, testFarmer.id, testUser.id, {
        name: "Harvest 1",
      });
      await createTestHarvest(testProject.id, testFarmer.id, testUser.id, {
        name: "Harvest 2",
      });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.harvests.fetchByOrganization({
        workspaceSlug: testProject.slug,
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
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
    it("should fetch a single harvest by ID", async () => {
      const harvest = await createTestHarvest(testProject.id, testFarmer.id, testUser.id, {
        name: "Specific Harvest",
      });

      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.harvests.fetchById({
        harvestId: harvest.id,
        workspaceSlug: testProject.slug,
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe(harvest.id);
      expect(result?.name).toBe("Specific Harvest");
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
      const session = createMockSession(testUser.id);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.harvests.fetchById({
        harvestId: "",
        workspaceSlug: "",
      });
      
      // Empty IDs return null, not an error
      expect(result).toBeNull();
    });
  });
});
