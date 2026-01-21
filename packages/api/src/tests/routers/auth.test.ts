import { describe, it, expect } from "vitest";
import { createCaller } from "../../root";
import { createTestContext, createMockSession } from "../helpers/test-context";

describe("Auth Router", () => {
  describe("getProfileData", () => {
    it("should return user profile data when authenticated", async () => {
      const session = createMockSession("user-123");
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.auth.getProfileData();
      
      expect(result).toBeDefined();
      expect(result.id).toBe("user-123");
      expect(result.email).toBe("test@example.com");
      expect(result.name).toBe("Test User");
    });

    it("should throw UNAUTHORIZED when not authenticated", async () => {
      const ctx = createTestContext(); // No session
      const caller = createCaller(ctx);

      await expect(caller.auth.getProfileData()).rejects.toThrow("UNAUTHORIZED");
    });

    it("should return correct user data for different users", async () => {
      const userId = "different-user-id";
      const session = createMockSession(userId);
      const ctx = createTestContext({ session });
      const caller = createCaller(ctx);

      const result = await caller.auth.getProfileData();
      
      expect(result.id).toBe(userId);
    });
  });
});
