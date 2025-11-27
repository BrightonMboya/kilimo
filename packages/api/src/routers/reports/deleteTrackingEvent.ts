import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import {FAILED_TO_MUTATE} from "@kilimo/utils";


export const deleteTrackingEvent = createTRPCRouter({
  deleteTrackingEvent: protectedProcedure
    .input(z.object({ eventId: z.string(), workspaceSlug: z.string() }))
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
        return await ctx.db.reportTrackingEvents.delete({
          where: {
            id: input.eventId,
            project_id: workspace?.id,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_MUTATE;
      }
    }),
});
