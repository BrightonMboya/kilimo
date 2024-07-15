import { createTRPCRouter, protectedProcedure } from "../../trpc";
import {z} from "zod";
import { TRPCClientError } from "@trpc/client";


export const fetchAllWorkspaces = createTRPCRouter({
     fetchAllWorkspaces: protectedProcedure
    .query(async ({ ctx }) => {
      const workspaces = await ctx.db.project.findMany({
        where: {
          users: {
            some: {
              userId: ctx?.user.id,
            },
          },
        },
        include: {
          users: {
            where: {
              userId: ctx?.user.id,
            },
            select: {
              role: true,
            },
          },
        },
      });

      // const formattedWorkspaces = workspaces.map((project) =>
      //   WorkspaceSchema.parse({ ...project, id: `ws_${project.id}` })
      // );

      const freeWorkspaces = workspaces?.filter(
        (workspace) =>
          workspace.plan === "free" &&
          workspace?.users &&
          workspace?.users[0]!.role === "owner",
      );

      return {
        workspaces,
        freeWorkspaces,
        exceedingFreeWorkspaces: freeWorkspaces && freeWorkspaces.length >= 2,
      };
    }),
})