import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { NOT_FOUND_ERROR } from "~/utils/constants";
import { z } from "zod";

export const fetchByOrganization = createTRPCRouter({
  fetchByOrganization: protectedProcedure
    .input(z.object({ workspaceSlug: z.string() }))
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
        return await ctx.db.reports.findMany({
          where: {
            project_id: workspace?.id,
          },
          include: {
            Harvests: {
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
