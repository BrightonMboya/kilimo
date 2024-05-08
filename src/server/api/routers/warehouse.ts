import {
  FAILED_TO_CREATE,
  NOT_FOUND_ERROR,
  organizationIdSchema,
} from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { warehouseSchema } from "~/app/(app)/dashboard/warehouses/page";

const warehouses = createTRPCRouter({
  create: protectedProcedure
    .input(warehouseSchema.merge(organizationIdSchema))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.warehouses.create({
          data: input,
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),

  fetchByOrganization: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.warehouses.findMany({
          where: {
            organizationId: input.organizationId,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),

  fetchById: protectedProcedure
    .input(
      z.object({
        warehouseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.warehouses.findUnique({
          where: {
            id: input.warehouseId,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});


export default warehouses