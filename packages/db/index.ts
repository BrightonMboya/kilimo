import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

import { env } from "~/env";

// `env` is provided by the app's runtime env helper and may be untyped here;
// coerce its NODE_ENV into a typed value to satisfy eslint/type-check rules
const nodeEnv: string | undefined = (env as { NODE_ENV?: string | undefined })?.NODE_ENV ?? process.env.NODE_ENV;
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ??
  new PrismaClient({
    log: nodeEnv === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
// .$extends(withAccelerate());

  if (nodeEnv !== "production") globalForPrisma.prisma = db;
