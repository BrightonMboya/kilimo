import { FAILED_TO_CREATE } from "@kilimo/utils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { inventorySchema } from "../schemas/inventory";

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

export default inventory;
