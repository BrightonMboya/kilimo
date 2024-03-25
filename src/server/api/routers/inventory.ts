import { FAILED_TO_CREATE, organizationIdSchema } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { inventorySchema } from "~/pages/dashboard/inventory/new";

export const inventory = createTRPCRouter({
  create: protectedProcedure
    .input(inventorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.inventory.create({
          data: {
            ...input,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),
});
