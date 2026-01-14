import { FAILED_TO_CREATE, NOT_FOUND_ERROR } from "@kilimo/utils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { warehouseSchema } from "../schemas/warehouses";

const warehouses = createTRPCRouter({
  create: protectedProcedure
    .input(
      warehouseSchema.merge(
        z.object({
          project_id: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.warehouses.create({
          data: input,
        });
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
        return await ctx.db.warehouses.findMany({
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
        warehouseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.warehouses.findUnique({
          where: {
            id: input.warehouseId,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});

export default warehouses;
