import {
  FAILED_TO_CREATE,
  NOT_FOUND_ERROR,
  organizationEmailSchema,
} from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { equipmentSchema } from "~/app/(app)/dashboard/[accountSlug]/equipments/_components/schema";

const equipments = createTRPCRouter({
  create: protectedProcedure
    .input(
      equipmentSchema.merge(
        z.object({
          organizationId: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.equipments.create({
          data: input,
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),

  fetchByOrganization: protectedProcedure
    .input(organizationEmailSchema)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.equipments.findMany({
          where: {
            id: input.organizationEmail,
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
        equipmentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.equipments.findUnique({
          where: {
            id: input.equipmentId,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});

export default equipments;
