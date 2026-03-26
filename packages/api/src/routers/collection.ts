import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

function generateLotCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "LOT-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function getCooperativeId(db: any, userId: string | undefined): Promise<string> {
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  const cooperative = await db.cooperative.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!cooperative) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Cooperative not found." });
  }

  return cooperative.id;
}

const collectionRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const where: any = { cooperativeId };

      if (input.search) {
        where.OR = [
          { lotCode: { contains: input.search, mode: "insensitive" } },
          { crop: { contains: input.search, mode: "insensitive" } },
          { coopFarmer: { fullName: { contains: input.search, mode: "insensitive" } } },
        ];
      }

      if (input.startDate || input.endDate) {
        where.date = {};
        if (input.startDate) where.date.gte = input.startDate;
        if (input.endDate) where.date.lte = input.endDate;
      }

      const collections = await ctx.db.collection.findMany({
        where,
        include: {
          coopFarmer: { select: { id: true, fullName: true, qrCode: true } },
          payment: { select: { id: true, status: true, totalAmount: true } },
        },
        orderBy: { date: "desc" },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined;
      if (collections.length > input.limit) {
        const nextItem = collections.pop();
        nextCursor = nextItem?.id;
      }

      return { collections, nextCursor };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.collection.findFirst({
        where: { id: input.id, cooperativeId },
        include: {
          coopFarmer: true,
          payment: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        coopFarmerId: z.string(),
        date: z.date().optional(),
        crop: z.string().min(1),
        variety: z.string().optional(),
        quantity: z.number().positive(),
        unit: z.string().default("kg"),
        weightKg: z.number().positive(),
        qualityGrade: z.enum(["A", "B", "C"]).default("B"),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      // Verify farmer belongs to this coop
      const farmer = await ctx.db.coopFarmer.findFirst({
        where: { id: input.coopFarmerId, cooperativeId },
      });
      if (!farmer) throw new TRPCError({ code: "NOT_FOUND", message: "Farmer not found in your cooperative." });

      return ctx.db.collection.create({
        data: {
          ...input,
          cooperativeId,
          lotCode: generateLotCode(),
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        crop: z.string().min(1).optional(),
        variety: z.string().optional(),
        quantity: z.number().positive().optional(),
        unit: z.string().optional(),
        weightKg: z.number().positive().optional(),
        qualityGrade: z.enum(["A", "B", "C"]).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);
      const { id, ...data } = input;

      return ctx.db.collection.update({
        where: { id, cooperativeId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.collection.delete({
        where: { id: input.id, cooperativeId },
      });
    }),

  todayStats: protectedProcedure.query(async ({ ctx }) => {
    const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [count, aggregate] = await Promise.all([
      ctx.db.collection.count({
        where: { cooperativeId, date: { gte: today } },
      }),
      ctx.db.collection.aggregate({
        where: { cooperativeId, date: { gte: today } },
        _sum: { weightKg: true },
      }),
    ]);

    return {
      lotsToday: count,
      kgToday: aggregate._sum.weightKg ?? 0,
    };
  }),
});

export default collectionRouter;
