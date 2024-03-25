import { createTRPCRouter } from "~/server/api/trpc";
import { equipments, harvests, warehouses, inventory, organization } from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organization,
  equipments,
  harvests,
  warehouses,
  inventory,
});

// export type definition of API
export type AppRouter = typeof appRouter;
