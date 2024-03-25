import {
  FAILED_TO_CREATE,
  NOT_FOUND_ERROR,
  organizationIdSchema,
} from "~/utils/constants";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import z from "zod";
import { equipmentSchema } from "~/pages/dashboard/equipments/new";

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
    .input(organizationIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.equipments.findMany({
          where: {
            id: input.organizationId,
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


export default equipments