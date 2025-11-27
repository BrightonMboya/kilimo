import { createTRPCRouter, protectedProcedure } from "../../trpc";

import { z } from "zod";

export const deleteReport = createTRPCRouter({
  delete: protectedProcedure
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
      return await ctx.db.reports.delete({
        where: {
          id: input.reportId,
          project_id: workspace?.id,
        },
      });
    }),
});
