import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { FAILED_TO_CREATE } from "~/utils/constants";
import { z } from "zod";
import { reportSchema } from "~/app/(app)/dashboard/[accountSlug]/reports/_components/schema";

export const edit = createTRPCRouter({
  edit: protectedProcedure
    .input(reportSchema.merge(
      z.object({
        id: z.string(),
        workspaceSlug: z.string(),
      }),
    ))
    .mutation(async ({ ctx, input }) => {
      try {
        const newEvents = input.trackingEvents.filter((event) => event.isItNew);
        const oldEvents = input.trackingEvents.filter((event) =>
          !event.isItNew
        );
        const workspace = await ctx.db.project.findUnique({
          where: {
            slug: input.workspaceSlug,
          },
          select: {
            id: true,
            name: true,
          },
        });

        return await ctx.db.reports.update({
          where: {
            id: input.id,
            project_id: workspace?.id,
          },
          data: {
            name: input.name,
            dateCreated: input.dateCreated,
            harvestsId: input.harvestId,
            project_id: workspace?.id,
            ReportTrackingEvents: {
              update: oldEvents
                .map((event) => ({
                  where: {
                    id: event.id,
                    project_id: workspace?.id,
                  },
                  data: {
                    eventName: event.eventName,
                    dateCreated: event.dateCreated,
                    description: event.description,
                  },
                })),
              createMany: {
                data: newEvents
                  .map((event) => ({
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
