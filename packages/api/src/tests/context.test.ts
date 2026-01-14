import { describe, it, expect } from "vitest";
import { createInnerTRPCContext } from "../trpc";
import { createMockSession } from "./helpers/test-context";

describe("tRPC Context", () => {
  it("should create context with session", () => {
    const session = createMockSession();
    const ctx = createInnerTRPCContext({
      session,
      headers: new Headers(),
    });

    expect(ctx.session).toBeDefined();
    expect(ctx.session?.user?.email).toBe("test@example.com");
    expect(ctx.db).toBeDefined();
  });

  it("should create context without session", () => {
    const ctx = createInnerTRPCContext({
      session: null,
      headers: new Headers(),
    });

    expect(ctx.session).toBeNull();
    expect(ctx.db).toBeDefined();
  });
});
