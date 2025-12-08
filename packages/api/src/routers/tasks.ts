import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const tasks = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        priority: z.enum(["low", "medium", "high"]),
        dueAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.farmersTasks.create({
        data: {
          name: input.name,
          description: input.description,
          priority: input.priority,
          dueAt: input.dueAt,
          status: "pending",
          userId: ctx.session.user.id, // Use Clerk user ID from session
        },
      });
    }),

  // Get tasks for the current logged-in user
  myTasks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.farmersTasks.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        dueAt: "asc",
      },
    });
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "inProgress", "completed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.farmersTasks.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
});

export default tasks