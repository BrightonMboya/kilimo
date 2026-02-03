import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

// Use process.env for server-side NODE_ENV to avoid importing the app's
// runtime `env` helper (which may be untyped in this package).
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const nodeEnv: string | undefined = process.env.NODE_ENV as unknown as
  | string
  | undefined;
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });
// .$extends(withAccelerate());

if (nodeEnv !== "production") globalForPrisma.prisma = db;
