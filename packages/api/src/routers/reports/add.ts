import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { FAILED_TO_CREATE } from "@kilimo/utils";
import { z } from "zod";
import { reportSchema } from "../../schemas/reports";

export const add = createTRPCRouter({
  add: protectedProcedure
    .input(reportSchema.merge(z.object({
      workspaceSlug: z.string(),
    })))
    .mutation(async ({ ctx, input }) => {
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
        return await ctx.db.reports.create({
          data: {
            name: input.name,
            dateCreated: input.dateCreated,
            harvestsId: input.harvestId,
            project_id: workspace?.id!,
            ReportTrackingEvents: {
              createMany: {
                data: input.trackingEvents.map((event) => ({
                  eventName: event.eventName,
                  dateCreated: event.dateCreated,
                  description: event.description,
                  project_id: workspace?.id!,
                })),
              },
            },
          },
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),
});
