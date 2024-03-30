import { FAILED_TO_CREATE, NOT_FOUND_ERROR } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { harvestsSchema } from "~/pages/dashboard/harvests/new";
import useOrganizationId from "~/hooks/useOrganizationId";

const harvests = createTRPCRouter({
  create: protectedProcedure
    .input(
      harvestsSchema.merge(
        z.object({
          organizationEmail: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const organizationId = await useOrganizationId(input.organizationEmail);
        // start by creating the qrCode and store it on the s3 bucket
        const qrCodeLink = "";
        const newHarvest = await ctx.db.harvests.create({
          data: {
            date: input.date,
            name: input.name,
            qrCodeLink,
            crop: input.crop,
            unit: input.unit,
            inputsUsed: input.inputsUsed,
            farmersId: input.farmerId,
            organizationId: organizationId?.id!,
            size: input.size,
          },
        });
        return newHarvest;
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
        return await ctx.db.harvests.findMany({
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
        harvestId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.harvests.findUnique({
          where: {
            id: input.harvestId,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});

export default harvests;
