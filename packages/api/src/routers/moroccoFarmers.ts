import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const moroccoFarmers = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    console.log("Fetching Morocco Farmer for user:", ctx.session.user.id);
    return await ctx.db.moroccoFarmers.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),

  create: protectedProcedure
    .input(z.object({ fullName: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const farmer = await ctx.db.moroccoFarmers.create({
          data: {
            userId: ctx.session.user.id,
            fullName: input.fullName || ctx.session.user.name,
          },
        });
        return farmer;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create farmer profile",
        });
      }
    }),
});


export default moroccoFarmers;