import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { FAILED_TO_CREATE } from "~/utils/constants";
import { z } from "zod";


export const markAsFinishedTracking  = createTRPCRouter({
      markAsFinishedTracking: protectedProcedure
    .input(z.object({ reportId: z.string(), workspaceSlug: z.string() }))
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
        return await ctx.db.reports.update({
          where: {
            id: input.reportId,
            project_id: workspace?.id,
          },
          data: {
            finishedTracking: true,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_CREATE;
      }
    }),
})