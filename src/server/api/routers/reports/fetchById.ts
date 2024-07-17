import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { NOT_FOUND_ERROR } from "~/utils/constants";

export const fetchById = createTRPCRouter({
  fetchById: protectedProcedure
    .input(z.object({ reportId: z.string(), workspaceSlug: z.string() }))
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
        return await ctx.db.reports.findFirst({
          where: {
            project_id: workspace?.id,
            id: input.reportId,
          },
          include: {
            Harvests: {
              select: {
                name: true,
                crop: true,
                inputsUsed: true,
                Farmers: {
                  select: {
                    fullName: true,
                    country: true,
                    province: true,
                  },
                },
              },
            },
            ReportTrackingEvents: {
              select: {
                id: true,
                eventName: true,
                dateCreated: true,
                description: true,
              },
            },
            Project: {
              select: {
                name: true,
              },
            },
          },
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
});
