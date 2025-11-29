import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";

describe("Equipments Router", () => {
  describe("create", () => {
    it.skip("should create new equipment successfully", async () => {
      // Skipped: Requires real organization in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const input = {
        name: "Tractor",
        type: "Heavy Machinery",
        leased: false,
        dateAcquired: new Date("2025-01-01"),
        purchasePrice: "50000",
        estimatedValue: "45000",
        brand: "John Deere",
        status: "Available",
        organizationId: "org-123",
      };

      const result = await caller.equipments.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.brand).toBe(input.brand);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      const input = {
        name: "Tractor",
        type: "Heavy Machinery",
        leased: false,
        dateAcquired: new Date("2025-01-01"),
        purchasePrice: "50000",
        estimatedValue: "45000",
        brand: "John Deere",
        status: "Available",
        organizationId: "org-123",
      };

      await expect(caller.equipments.create(input)).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate required fields", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const invalidInput = {
        name: "", // Invalid: empty
        type: "",
        leased: false,
        dateAcquired: new Date(),
        purchasePrice: "",
        estimatedValue: "",
        brand: "",
        status: "",
        organizationId: "",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.equipments.create(invalidInput as any)).rejects.toThrow();
    });

    it("should validate leased is boolean", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      // Testing with invalid type for leased field
      const input = {
        name: "Tractor",
        type: "Heavy Machinery",
        leased: "yes", // Invalid: should be boolean
        dateAcquired: new Date("2025-01-01"),
        purchasePrice: "50000",
        estimatedValue: "45000",
        brand: "John Deere",
        status: "Available",
        organizationId: "org-123",
      };

      // @ts-expect-error - Testing invalid input type
      await expect(caller.equipments.create(input)).rejects.toThrow();
    });
  });

  describe("fetchByOrganization", () => {
    it.skip("should fetch all equipment for an organization", async () => {
      // Skipped: Requires real organization in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.equipments.fetchByOrganization({
        organizationEmail: "test@org.com",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.equipments.fetchByOrganization({
          organizationEmail: "test@org.com",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate email format", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.equipments.fetchByOrganization({
          organizationEmail: "invalid-email",
        })
      ).rejects.toThrow();
    });
  });

  describe("fetchById", () => {
    it.skip("should fetch equipment by ID", async () => {
      // Skipped: Requires real equipment in database
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.equipments.fetchById({
        equipmentId: "equipment-123",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("equipment-123");
    });

    it("should require authentication", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.equipments.fetchById({
          equipmentId: "equipment-123",
        })
      ).rejects.toThrow("UNAUTHORIZED");
    });

    it("should validate equipmentId is provided", async () => {
      const session = createMockSession();
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      await expect(
        caller.equipments.fetchById({
          equipmentId: "",
        })
      ).rejects.toThrow();
    });
  });
});
