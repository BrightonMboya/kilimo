import { createTRPCRouter, protectedProcedure } from "../trpc";
import { farmersSchema } from "../schemas/farmers";
import z from "zod";
import { NOT_FOUND_ERROR } from "@kilimo/utils";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

const farmers = createTRPCRouter({
  addFarmer: protectedProcedure
    .input(
      farmersSchema.merge(
        z.object({
          workspaceSlug: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      // first we get the workspace
      const workspace = await ctx.db.project.findUnique({
        where: {
          slug: input.workspaceSlug,
        },
        select: {
          id: true,
          name: true,
        },
      });
      try {

        return await ctx.db.farmers.create({
          data: {
            fullName: input.fullName,
            phoneNumber: input.phoneNumber!,
            farmSize: input.farmSize,
            province: input.province,
            country: input.country,
            crops: input.crops,
            quantityCanSupply: input.quantityCanSupply,
            project_id: workspace?.id!,
            // user: ctx.session?.user!
          },
        });
      } catch (cause) {
        console.log(cause);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create farmer",
        });
      }
    }),

  editFarmer: protectedProcedure.input(
    farmersSchema.merge(
      z.object({ id: z.string(), workspaceSlug: z.string() }),
    ),
  ).mutation(
    async ({ ctx, input }) => {
      const workspace = await ctx.db.project.findUnique({
        where: {
          slug: input.workspaceSlug,
        },
        select: {
          id: true,
          name: true,
        },
      });

      try {
        return await ctx.db.farmers.update({
          where: {
            id: input.id,
            project_id: workspace?.id,
          },
          data: {
            fullName: input.fullName,
            phoneNumber: input.phoneNumber!,
            farmSize: input.farmSize,
            province: input.province,
            country: input.country,
            crops: input.crops,
            quantityCanSupply: input.quantityCanSupply,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to edit farmer",
        });
      }
    },
  ),

  // fetch all farmers belonging to a specific workspace/ project
  fetchByOrganization: protectedProcedure
    .input(z.object({
      workspaceSlug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // we need to get the project in the first place
      const workspace = await ctx.db.project.findUnique({
        where: {
          slug: input.workspaceSlug,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!workspace) {
        throw new TRPCClientError(
          `No workspace found with the name ${input.workspaceSlug}`,
        );
      }

      return await ctx.db.farmers.findMany({
        where: {
          project_id: workspace?.id,
        },
      });
    }),

  farmersNamesAndIds: protectedProcedure
    .input(
      z.object({
        workspaceSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.project.findUnique({
        where: {
          slug: input.workspaceSlug,
        },
        select: {
          id: true,
          name: true,
        },
      });
      try {
        const farmers = await ctx.db.farmers.findMany({
          where: {
            project_id: workspace?.id,
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

  fetchFarmerById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workspaceSlug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const workspace = await ctx.db.project.findUnique({
          where: {
            slug: input.workspaceSlug,
          },
          select: {
            id: true,
            name: true,
          },
        });

        const farmer = await ctx.db.farmers.findFirst({
          where: {
            id: input.id,
            project_id: workspace?.id,
          },
        });
        return farmer;
      } catch (cause) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Farmers",
          cause,
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        workspaceSlug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const workspace = await ctx.db.project.findUnique({
          where: {
            slug: input.workspaceSlug,
          },
          select: {
            id: true,
            name: true,
          },
        });
        await ctx.db.farmers.delete({
          where: {
            id: input.id,
            project_id: workspace?.id,
          },
        });
        return true;
      } catch (cause) {
        console.log(cause);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete farmer",
          cause,
        });
      }
    }),
});

export default farmers;
