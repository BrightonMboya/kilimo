import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const editWorkspace = createTRPCRouter({
  changeWorkspaceName: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        updatedName: z.string(),
        // slug: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.project.update({
        where: {
          slug: input.workspaceId,
        },
        data: {
          name: input.updatedName,
          //   slug: input.slug,
        },
        include: {
          users: true,
        },
      });
      return res;
    }),
});
