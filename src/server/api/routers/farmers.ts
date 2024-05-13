import { createTRPCRouter, protectedProcedure } from "../trpc";
import { farmersSchema } from "~/app/(app)/dashboard/farmers/_components/schema";
import z from "zod";
import { FAILED_TO_CREATE, NOT_FOUND_ERROR } from "~/utils/constants";

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
        const res = await ctx.db.farmers.create({
          data: {
            fullName: input.fullName,
            gender: input.gender,
            phoneNumber: input.phoneNumber,
            farmSize: input.farmSize,
            province: input.province,
            organizationId: "",
          },
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),

  fetchByOrganization: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.farmers.findMany({
          where: {
            organization_id: ctx?.user.id,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),

  farmersNamesAndIds: protectedProcedure
    .input(
      z.object({
        organizationEmail: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const organizationId = await ctx.db.organization.findUnique({
          where: {
            email: input.organizationEmail,
          },
          select: {
            id: true,
          },
        });
        const farmers = await ctx.db.farmers.findMany({
          where: {
            organizationId: organizationId?.id,
          },
          select: {
            id: true,
            fullName: true,
          },
        });
        return farmers;
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});

export default farmers;
