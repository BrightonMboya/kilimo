import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const organization = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const newOrg = await ctx.db.organization.create({
          data: {
            name: input.name,
            country: "zambia",
            Email: input.email,
          },
        });
        return newOrg;
      } catch (cause) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register the organization",
          cause,
        });
      }
    }),

  addFarmer: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        phoneNumber: z.string(),
        farmSize: z.number(),
        quantityCanSupply: z.number(),
        province: z.string(),
        cropTheySell: z.string(),
        gender: z.string(),
        email: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // find the organization Id
        const organizationId = await ctx.db.organization.findFirst({
          where: {
            Email: input.email,
          },
          select: {
            id: true,
          },
        });

        const newFarmer = await ctx.db.organizationFarmers.create({
          data: {
            fullName: input.fullName,
            phoneNumber: input.phoneNumber,
            farmSize: input.farmSize,
            province: input.province,
            cropTheySell: input.cropTheySell,
            quantityCanSupply: input.quantityCanSupply,
            gender: input.gender,
            description: input.description,
            organizationId: organizationId?.id as unknown as number,
          },
        });
        return newFarmer;
      } catch (cause) {
        console.log(cause, "I am the cause");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add the farmer",
          cause,
        });
      }
    }),

  fetchFarmers: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        // finc the organization id first
        const organizationId = await ctx.db.organization.findFirst({
          where: {
            Email: input.email,
          },
          select: {
            id: true,
          },
        });

        // now use the organization id to fetch the farmers who belong to that org
        const farmers = await ctx.db.organizationFarmers.findMany({
          where: {
            organizationId: organizationId?.id,
          },
        });
        return farmers;
      } catch (cause) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Farmers",
          cause,
        });
      }
    }),

  // fetching individual details of the farmer
  fetchFarmerById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const farmer = await ctx.db.organizationFarmers.findFirst({
          where: {
            id: input.id,
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
});

export default organization;
