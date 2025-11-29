import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext } from "../helpers/test-context";

describe("Organization Router", () => {
  describe("signUp", () => {
    it.skip("should create a new organization successfully", async () => {
      // Skipped: Requires database setup
      // This is a public procedure so no auth needed
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        name: "Test Agriculture Co.",
        email: "test@agriculture.com",
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await caller.organization.signUp(input);

      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.name).toBe(input.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.Email).toBe(input.email);
    });

    it("should validate required fields", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const invalidInput = {
        name: "", // Invalid: empty
        email: "",
      };

      await expect(caller.organization.signUp(invalidInput)).rejects.toThrow();
    });

    it("should validate email is not empty", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        name: "Test Organization",
        email: "", // Invalid: empty
      };

      await expect(caller.organization.signUp(input)).rejects.toThrow();
    });

    it("should validate name is not empty", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        name: "", // Invalid: empty
        email: "test@example.com",
      };

      await expect(caller.organization.signUp(input)).rejects.toThrow();
    });
  });

  describe("addFarmer", () => {
    it.skip("should add a farmer to organization successfully", async () => {
      // Skipped: Requires real organization in database
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        fullName: "Jane Farmer",
        phoneNumber: "+260971234567",
        farmSize: 15,
        quantityCanSupply: 2000,
        province: "Lusaka",
        cropTheySell: "Maize",
        gender: "Female",
        email: "org@example.com",
        description: "Experienced maize farmer",
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await caller.organization.addFarmer(input);

      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.fullName).toBe(input.fullName);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.farmSize).toBe(input.farmSize);
    });

    it("should validate required fields", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const invalidInput = {
        fullName: "", // Invalid
        phoneNumber: "",
        farmSize: -1, // Invalid: negative
        quantityCanSupply: -1,
        province: "",
        cropTheySell: "",
        gender: "",
        email: "",
        description: "",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      await expect(caller.organization.addFarmer(invalidInput as any)).rejects.toThrow();
    });

    it("should validate farmSize is positive", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        fullName: "Test Farmer",
        phoneNumber: "+260971234567",
        farmSize: -10, // Invalid: negative
        quantityCanSupply: 2000,
        province: "Lusaka",
        cropTheySell: "Maize",
        gender: "Male",
        email: "org@example.com",
        description: "Test farmer",
      };

      await expect(caller.organization.addFarmer(input)).rejects.toThrow();
    });

    it("should validate quantityCanSupply is positive", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      const input = {
        fullName: "Test Farmer",
        phoneNumber: "+260971234567",
        farmSize: 10,
        quantityCanSupply: -500, // Invalid: negative
        province: "Lusaka",
        cropTheySell: "Maize",
        gender: "Male",
        email: "org@example.com",
        description: "Test farmer",
      };

      await expect(caller.organization.addFarmer(input)).rejects.toThrow();
    });
  });

  describe("fetchFarmers", () => {
    it.skip("should fetch farmers for an organization", async () => {
      // Skipped: Requires real organization in database
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await caller.organization.fetchFarmers({
        email: "org@example.com",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should validate email is provided", async () => {
      const ctx = createTestContext();
      const caller = createCaller(ctx);

      await expect(
        caller.organization.fetchFarmers({
          email: "",
        })
      ).rejects.toThrow();
    });

    it("should be a public procedure (no auth required)", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      // Should not throw UNAUTHORIZED error
      // But will throw other errors due to missing DB data
      const promise = caller.organization.fetchFarmers({
        email: "test@example.com",
      });

      // We just check it doesn't throw UNAUTHORIZED
      await expect(promise).rejects.not.toThrow("UNAUTHORIZED");
    });
  });
});
