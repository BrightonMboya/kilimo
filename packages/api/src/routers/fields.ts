import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const fields = createTRPCRouter({
  byFarmerId: protectedProcedure
    .input(z.object({ farmersId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.fields.findMany({
          where: {
            farmersId: input.farmersId,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch fields",
        });
      }
    }),
});

export default fields;