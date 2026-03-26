import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

async function getCooperativeId(db: any, userId: string | undefined): Promise<string> {
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  const cooperative = await db.cooperative.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!cooperative) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Cooperative not found. Please set up your cooperative first." });
  }

  return cooperative.id;
}

const coopFarmersRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const where: any = { cooperativeId };
      if (input.search) {
        where.OR = [
          { fullName: { contains: input.search, mode: "insensitive" } },
          { phoneNumber: { contains: input.search, mode: "insensitive" } },
          { location: { contains: input.search, mode: "insensitive" } },
          { qrCode: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const farmers = await ctx.db.coopFarmer.findMany({
        where,
        include: {
          fields: true,
          _count: { select: { collections: true, payments: true } },
        },
        // userId and email are on the model and returned by default
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined;
      if (farmers.length > input.limit) {
        const nextItem = farmers.pop();
        nextCursor = nextItem?.id;
      }

      return { farmers, nextCursor };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const coopFarmer = await ctx.db.coopFarmer.findFirst({
        where: { id: input.id, cooperativeId },
        include: {
          fields: true,
          collections: {
            orderBy: { date: "desc" },
            take: 10,
          },
          payments: {
            orderBy: { date: "desc" },
            take: 10,
          },
        },
      });

      if (!coopFarmer) return null;

      // If farmer has a linked account, fetch their real farm data
      let farmerAppData = null;
      if (coopFarmer.userId) {
        const [farmerFields, recentActivities] = await Promise.all([
          ctx.db.farmerFields.findMany({
            where: { userId: coopFarmer.userId },
            include: {
              activities: {
                orderBy: { date: "desc" },
                take: 5,
              },
              cropCycles: {
                orderBy: { startedAt: "desc" },
                take: 3,
              },
            },
          }),
          ctx.db.fieldActivity.findMany({
            where: { userId: coopFarmer.userId },
            orderBy: { date: "desc" },
            take: 10,
            include: {
              field: { select: { name: true, crop: true } },
            },
          }),
        ]);

        farmerAppData = {
          fields: farmerFields,
          recentActivities,
        };
      }

      return {
        ...coopFarmer,
        isLinked: !!coopFarmer.userId,
        farmerAppData,
      };
    }),

  getByQrCode: protectedProcedure
    .input(z.object({ qrCode: z.string() }))
    .query(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.coopFarmer.findFirst({
        where: { qrCode: input.qrCode, cooperativeId },
        include: {
          fields: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        location: z.string().optional(),
        farmSizeHa: z.number().positive().optional(),
        crops: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.coopFarmer.create({
        data: {
          ...input,
          cooperativeId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fullName: z.string().min(1).optional(),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        location: z.string().optional(),
        farmSizeHa: z.number().positive().optional(),
        crops: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);
      const { id, ...data } = input;

      return ctx.db.coopFarmer.update({
        where: { id, cooperativeId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.coopFarmer.delete({
        where: { id: input.id, cooperativeId },
      });
    }),

  addField: protectedProcedure
    .input(
      z.object({
        coopFarmerId: z.string(),
        name: z.string().min(1),
        crop: z.string().min(1),
        variety: z.string().optional(),
        sizeHa: z.number().positive(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const farmer = await ctx.db.coopFarmer.findFirst({
        where: { id: input.coopFarmerId, cooperativeId },
      });
      if (!farmer) throw new TRPCError({ code: "NOT_FOUND", message: "Farmer not found in your cooperative." });

      return ctx.db.coopFarmerField.create({
        data: input,
      });
    }),

  removeField: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const field = await ctx.db.coopFarmerField.findFirst({
        where: {
          id: input.id,
          coopFarmer: { cooperativeId },
        },
      });
      if (!field) throw new TRPCError({ code: "NOT_FOUND", message: "Field not found." });

      return ctx.db.coopFarmerField.delete({
        where: { id: input.id },
      });
    }),
});

export default coopFarmersRouter;
