import { createTRPCRouter, protectedProcedure } from "../trpc";
import { farmersSchema } from "~/pages/dashboard/farmers/new";
import z from "zod";
import { FAILED_TO_CREATE } from "~/utils/constants";

const farmers = createTRPCRouter({
  addFarmer: protectedProcedure
    .input(
      farmersSchema.merge(
        z.object({
          gender: z.string(),
          organizationEmail: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const organizationId = await ctx.db.organization.findUnique({
          where: {
            email: input.organizationEmail,
          },
          select: {
            id: true,
          },
        });
        return await ctx.db.farmers.create({
          data: {
            fullName: input.fullName,
            gender: input.gender,
            phoneNumber: input.phoneNumber,
            farmSize: input.farmSize,
            province: input.province,
            organizationId: organizationId?.id as unknown as string,
          },
        });

      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),
});

export default farmers;
