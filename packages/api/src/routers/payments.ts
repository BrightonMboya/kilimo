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
    throw new TRPCError({ code: "NOT_FOUND", message: "Cooperative not found." });
  }

  return cooperative.id;
}

const paymentsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(["pending_payment", "confirmed", "paid"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const where: any = { cooperativeId };

      if (input.status) {
        where.status = input.status;
      }

      if (input.search) {
        where.OR = [
          { coopFarmer: { fullName: { contains: input.search, mode: "insensitive" } } },
          { collection: { lotCode: { contains: input.search, mode: "insensitive" } } },
        ];
      }

      const payments = await ctx.db.payment.findMany({
        where,
        include: {
          coopFarmer: { select: { id: true, fullName: true } },
          collection: { select: { id: true, lotCode: true, weightKg: true, crop: true } },
        },
        orderBy: { date: "desc" },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined;
      if (payments.length > input.limit) {
        const nextItem = payments.pop();
        nextCursor = nextItem?.id;
      }

      return { payments, nextCursor };
    }),

  create: protectedProcedure
    .input(
      z.object({
        coopFarmerId: z.string(),
        collectionId: z.string().optional(),
        pricePerKg: z.number().positive(),
        weightKg: z.number().positive(),
        deductions: z.number().min(0).default(0),
        currency: z.string().default("KES"),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      const totalAmount = input.weightKg * input.pricePerKg - input.deductions;

      return ctx.db.payment.create({
        data: {
          cooperativeId,
          coopFarmerId: input.coopFarmerId,
          collectionId: input.collectionId,
          pricePerKg: input.pricePerKg,
          totalAmount,
          deductions: input.deductions,
          currency: input.currency,
          notes: input.notes,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        pricePerKg: z.number().positive().optional(),
        deductions: z.number().min(0).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);
      const { id, ...data } = input;

      const existing = await ctx.db.payment.findFirst({
        where: { id, cooperativeId },
        include: { collection: { select: { weightKg: true } } },
      });
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found." });
      }

      // Recalculate totalAmount if price or deductions changed
      const updateData: any = { ...data };
      if (data.pricePerKg !== undefined || data.deductions !== undefined) {
        const pricePerKg = data.pricePerKg ?? existing.pricePerKg;
        const deductions = data.deductions ?? existing.deductions;
        // Use collection weight if linked, otherwise preserve existing totalAmount ratio
        const weightKg = existing.collection?.weightKg ?? (existing.totalAmount + existing.deductions) / existing.pricePerKg;
        updateData.totalAmount = weightKg * pricePerKg - deductions;
      }

      return ctx.db.payment.update({
        where: { id, cooperativeId },
        data: updateData,
      });
    }),

  confirm: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["confirmed", "paid"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.payment.update({
        where: { id: input.id, cooperativeId },
        data: { status: input.status },
      });
    }),

  summary: protectedProcedure.query(async ({ ctx }) => {
    const cooperativeId = await getCooperativeId(ctx.db, ctx.session.user.id);

    const [totals, paidTotals, pendingCount] = await Promise.all([
      ctx.db.payment.aggregate({
        where: { cooperativeId },
        _sum: { totalAmount: true },
        _count: true,
      }),
      ctx.db.payment.aggregate({
        where: { cooperativeId, status: "paid" },
        _sum: { totalAmount: true },
      }),
      ctx.db.payment.count({
        where: { cooperativeId, status: "pending_payment" },
      }),
    ]);

    return {
      totalPayments: totals._count,
      totalAmount: totals._sum.totalAmount ?? 0,
      totalPaid: paidTotals._sum.totalAmount ?? 0,
      pendingCount,
    };
  }),
});

export default paymentsRouter;
