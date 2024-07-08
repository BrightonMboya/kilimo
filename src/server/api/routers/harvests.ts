import { FAILED_TO_CREATE, NOT_FOUND_ERROR } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { harvestsSchema } from "~/app/(app)/dashboard/[accountSlug]/harvests/_components/schema";
import { TRPCError } from "@trpc/server";

const harvests = createTRPCRouter({
  create: protectedProcedure
    .input(
      harvestsSchema,
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newHarvest = await ctx.db.harvests.create({
          data: {
            date: input.date,
            name: input.name,
            crop: input.crop,
            unit: input.unit,
            inputsUsed: input.inputsUsed,
            farmersId: input.farmerId,
            organization_id: ctx?.user?.id,
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
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.harvests.findMany({
          where: {
            organization_id: ctx.user?.id,
          },
          include: {
            Farmers: {
              select: {
                fullName: true,
              },
            },
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

  editHarvest: protectedProcedure
    .input(
      harvestsSchema
        .merge(z.object({ id: z.string() })),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedHarvest = await ctx.db.harvests.update({
          where: {
            id: input.id,
          },
          data: {
            date: input.date,
            name: input.name,
            crop: input.crop,
            unit: input.unit,
            inputsUsed: input.inputsUsed,
            farmersId: input.farmerId,
            organization_id: ctx?.user?.id,
            size: input.size,
          },
        });
        return updatedHarvest;
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        harvestId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedHarvest = await ctx.db.harvests.delete({
          where: {
            id: input.harvestId,
          },
        });
        return deletedHarvest;
      } catch (cause) {
        console.log(cause);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete farmer",
          cause,
        });
      }
    }),

  harvestsNamesAndId: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.harvests.findMany({
          where: {
            organization_id: ctx.user?.id,
          },
          select: {
            id: true,
            name: true,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});

export default harvests;
