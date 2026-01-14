import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const financialRecords = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["income", "expense"]),
        category: z.enum([
          "crop_sales",
          "livestock_sales",
          "government_subsidy",
          "other_income",
          "seeds",
          "fertilizer",
          "pesticides",
          "labor",
          "equipment",
          "fuel",
          "water",
          "rent",
          "other_expense",
        ]),
        amount: z.number().positive(),
        description: z.string().optional(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.financialRecords.create({
        data: {
          userId: ctx.session.user.id,
          type: input.type,
          category: input.category,
          amount: input.amount,
          description: input.description,
          date: input.date,
        },
      });
    }),

  myRecords: protectedProcedure
    .input(
      z
        .object({
          type: z.enum(["income", "expense"]).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
      };

      if (input?.type) {
        where.type = input.type;
      }

      if (input?.startDate || input?.endDate) {
        where.date = {};
        if (input.startDate) {
          where.date.gte = input.startDate;
        }
        if (input.endDate) {
          where.date.lte = input.endDate;
        }
      }

      return ctx.db.financialRecords.findMany({
        where,
        orderBy: {
          date: "desc",
        },
      });
    }),

  summary: protectedProcedure
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
      };

      if (input?.startDate || input?.endDate) {
        where.date = {};
        if (input.startDate) {
          where.date.gte = input.startDate;
        }
        if (input.endDate) {
          where.date.lte = input.endDate;
        }
      }

      const records = await ctx.db.financialRecords.findMany({
        where,
      });

      const totalIncome = records
        .filter((r) => r.type === "income")
        .reduce((sum, r) => sum + r.amount, 0);

      const totalExpenses = records
        .filter((r) => r.type === "expense")
        .reduce((sum, r) => sum + r.amount, 0);

      const netBalance = totalIncome - totalExpenses;

      // Group by category
      const byCategory: Record<string, number> = {};
      records.forEach((r) => {
        if (!byCategory[r.category]) {
          byCategory[r.category] = 0;
        }
        byCategory[r.category] += r.amount;
      });

      return {
        totalIncome,
        totalExpenses,
        netBalance,
        byCategory,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership before deleting
      const record = await ctx.db.financialRecords.findUnique({
        where: { id: input.id },
      });

      if (!record || record.userId !== ctx.session.user.id) {
        throw new Error("Record not found or unauthorized");
      }

      return ctx.db.financialRecords.delete({
        where: { id: input.id },
      });
    }),
});

export default financialRecords;
