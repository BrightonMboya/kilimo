import { createTRPCRouter, protectedProcedure } from "../trpc";
import { farmersSchema } from "~/app/(app)/dashboard/[accountSlug]/farmers/_components/schema";
import z from "zod";
import { FAILED_TO_CREATE, NOT_FOUND_ERROR } from "~/utils/constants";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { createClient } from "~/utils/supabase/client";

const farmers = createTRPCRouter({
  addFarmer: protectedProcedure
    .input(
      farmersSchema,
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // return await ctx.db.farmers.create({
        //   data: {
        //     fullName: input.fullName,
        //     phoneNumber: input.phoneNumber!,
        //     farmSize: input.farmSize,
        //     province: input.province,
        //     country: input.country,
        //     crops: input.crops,
        //     quantityCanSupply: input.quantityCanSupply,
        //     organization_id: ctx?.user.id,
        //   },
        // });

        const {data, error} = await ctx.supabase
        .from("Farmers")
        .insert({
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          farmSize: input.farmSize,
          province: input.province,
          country: input.country,
          crops: input.country,
          quantityCanSupply: input.quantityCanSupply,
          organization_id: "",
          account_id: ""
        })

      } catch (cause) {
        console.log(cause);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create farmer",
        });
      }
    }),

  editFarmer: protectedProcedure.input(
    farmersSchema.merge(z.object({ id: z.string() })),
  ).mutation(
    async ({ ctx, input }) => {
      try {
        return await ctx.db.farmers.update({
          where: {
            id: input.id,
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

  fetchByOrganization: protectedProcedure
    .query(async ({ ctx }) => {
      try {
       
        const { data, error } = await ctx.supabase
          .from("Farmers")
          .select("*");
        //   .eq("organization_id", ctx?.user.id);
    
        if (data) {
          return data;
        } else {
          console.log("######, I am fucked up");
          console.log(data, ">?>??@*!*(*&@!*(Y!W*H!SHSU!UIBWUSBQHW");
        }
      } catch (cause) {
        console.log(cause, "??ASAOQO@(!)!)@W");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load farmers",
        });
      }
    }),

  farmersNamesAndIds: protectedProcedure
    .query(async ({ ctx, input }) => {
      try {
        const farmers = await ctx.db.farmers.findMany({
          where: {
            organization_id: ctx?.user?.id,
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
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const farmer = await ctx.db.farmers.findFirst({
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

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.farmers.delete({
          where: {
            id: input.id,
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
