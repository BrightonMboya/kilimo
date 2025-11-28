import type { Session } from "next-auth";
import { createInnerTRPCContext } from "../../trpc";

/**
 * Creates a test context for tRPC procedures
 * This allows us to test our API without needing to mock Next.js req/res
 */
export const createTestContext = (opts?: { session?: Session | null }) => {
  return createInnerTRPCContext({
    session: opts?.session ?? null,
    headers: new Headers(),
  });
};

/**
 * Mock session for authenticated tests
 */
export const createMockSession = (userId = "test-user-id"): Session => {
  return {
    user: {
      id: userId,
      email: "test@example.com",
      name: "Test User",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  };
};

/**
 * Helper to clean up test data after tests
 */
export const cleanupTestData = async () => {
  // Add cleanup logic here based on your test data patterns
  // For example:
  // await db.farmers.deleteMany({ where: { /* test data criteria */ } });
};
