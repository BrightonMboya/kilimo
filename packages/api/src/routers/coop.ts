import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

async function ensureCooperative(db: any, userId: string | undefined) {
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  let cooperative = await db.cooperative.findFirst({
    where: { userId },
  });

  if (!cooperative) {
    cooperative = await db.cooperative.create({
      data: {
        userId,
        name: "My Cooperative",
        slug: generateSlug("my-cooperative"),
      },
    });
  }

  return cooperative;
}

const coopRouter = createTRPCRouter({
  getMyCooperative: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return ensureCooperative(ctx.db, userId);
  }),

  updateCooperative: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        location: z.string().optional(),
        country: z.string().optional(),
        contactName: z.string().optional(),
        contactPhone: z.string().optional(),
        contactEmail: z.string().email().optional(),
        logo: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cooperative = await ensureCooperative(ctx.db, userId);

      return ctx.db.cooperative.update({
        where: { id: cooperative.id },
        data: input,
      });
    }),

  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const cooperative = await ensureCooperative(ctx.db, userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [farmersCount, fieldsCount, lotsToday, kgToday, totalLots, totalKg] =
      await Promise.all([
        ctx.db.coopFarmer.count({
          where: { cooperativeId: cooperative.id },
        }),
        ctx.db.coopFarmerField.count({
          where: { coopFarmer: { cooperativeId: cooperative.id } },
        }),
        ctx.db.collection.count({
          where: {
            cooperativeId: cooperative.id,
            date: { gte: today },
          },
        }),
        ctx.db.collection.aggregate({
          where: {
            cooperativeId: cooperative.id,
            date: { gte: today },
          },
          _sum: { weightKg: true },
        }),
        ctx.db.collection.count({
          where: { cooperativeId: cooperative.id },
        }),
        ctx.db.collection.aggregate({
          where: { cooperativeId: cooperative.id },
          _sum: { weightKg: true },
        }),
      ]);

    return {
      cooperative,
      farmersCount,
      fieldsCount,
      lotsToday,
      kgToday: kgToday._sum.weightKg ?? 0,
      totalLots,
      totalKg: totalKg._sum.weightKg ?? 0,
    };
  }),
});

export default coopRouter;
