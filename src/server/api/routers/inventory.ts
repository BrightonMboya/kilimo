import { FAILED_TO_CREATE, organizationIdSchema } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { inventorySchema } from "~/app/(app)/dashboard/inventory/page";

const inventory = createTRPCRouter({
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


export default inventory