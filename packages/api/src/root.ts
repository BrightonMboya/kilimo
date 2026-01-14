import { createCallerFactory, createTRPCRouter } from "./trpc";
import {
  auth,
  equipments,
  farmers,
  harvests,
  inventory,
  organization,
  reports,
  warehouses,
  workspace,
  tasks,
  fields,
  financialRecords,
  farmerFields,
} from "./routers";

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
  farmers,
  auth,
  reports,
  workspace,
  tasks,
  fields,
  financialRecords,
  farmerFields,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
