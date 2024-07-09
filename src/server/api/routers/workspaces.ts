import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { isReservedKey } from "~/utils/lib/edge-config";
import { DEFAULT_REDIRECTS } from "~/utils";
import { nanoid } from "~/utils";
import { waitUntil } from "@vercel/functions";
import { TRPCClientError } from "@trpc/client";
import { plans, roles } from "~/utils/types";

export const planSchema = z.enum(plans).describe("The plan of the workspace.");
export const roleSchema = z
  .enum(roles)
  .describe("The role of the authenticated user in the workspace.");

export const WorkspaceSchema = z
  .object({
    id: z.string().describe("The unique ID of the workspace."),
    name: z.string().describe("The name of the workspace."),
    slug: z.string().describe("The slug of the workspace."),
    logo: z
      .string()
      .nullable()
      .default(null)
      .describe("The logo of the workspace."),
    usage: z.number().describe("The usage of the workspace."),
    usageLimit: z.number().describe("The usage limit of the workspace."),
    linksUsage: z.number().describe("The links usage of the workspace."),
    linksLimit: z.number().describe("The links limit of the workspace."),
    usersLimit: z.number().describe("The users limit of the workspace."),
    plan: planSchema,
    stripeId: z.string().nullable().describe("The Stripe ID of the workspace."),
    billingCycleStart: z
      .number()
      .describe(
        "The date and time when the billing cycle starts for the workspace.",
      ),
    stripeConnectId: z
      .string()
      .nullable()
      .describe("[BETA]: The Stripe Connect ID of the workspace."),
    createdAt: z
      .date()
      .describe("The date and time when the workspace was created."),
    users: z
      .array(
        z.object({
          role: roleSchema,
        }),
      )
      .describe("The role of the authenticated user in the workspace."),

    inviteCode: z
      .string()
      .nullable()
      .describe("The invite code of the workspace."),
    betaTester: z
      .boolean()
      .optional()
      .describe(
        "Whether the workspace is enrolled in the beta testing program.",
      ),
  });

export const workspaces = createTRPCRouter({
  addWorkSpace: publicProcedure
    .input(z.object({ slug: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // try {
      // check if the slug exists
      if (
        (await isReservedKey(input.slug)) || DEFAULT_REDIRECTS[input.slug]
      ) {
        return "Project already in use";
      }
      const project = await ctx.db.project.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          slug: true,
        },
      });
      if (project) {
        return "Project already in use";
      } else {
        // lets check if the person can create more than one workspaces
        const freeWorkspaces = await ctx.db.project.count({
          where: {
            plan: "free",
            users: {
              some: {
                userId: ctx?.user?.id,
                role: "owner",
              },
            },
          },
        });

        if (freeWorkspaces >= 1) {
          throw new TRPCClientError(
            "You can only create up to 1 free workspace. Additional workspaces require a paid plan",
          );
        }

        const workspaceResponse = await ctx.db.project.create({
          data: {
            name: input.name,
            slug: input.slug,
            users: {
              create: {
                userId: ctx.user?.id!,
                role: "owner",
              },
            },
            billingCycleStart: new Date().getDate(),
            inviteCode: nanoid(24),
          },
          include: {
            users: {
              where: {
                userId: ctx?.session?.user?.id,
              },
              select: {
                role: true,
              },
            },
          },
        });
        waitUntil(
          (async () => {
            // @ts-ignore
            if (ctx?.session?.user["defaultWorkspace"] === null) {
              await ctx.db.user.update({
                where: {
                  id: ctx.session.user.id,
                },
                data: {
                  defaultWorkspace: workspaceResponse.slug,
                },
              });
            }
          })(),
        );

        return WorkspaceSchema.parse({
          ...workspaceResponse,
          id: `ws_${workspaceResponse.id}`,
        });
      }
      // } catch (cause) {
      //   console.log(cause);
      // }
    }),

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

  getSpecificWorkspace: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.project.findUnique({
        where: {
          slug: input.slug,
        },
        // select: {
        //   users: true,
        //   plan: true
        // },
        include: {
          users: true,
          // plan: true
        }
      });
      if (!workspace) {
          throw new TRPCClientError("No Workspace found with this slug")
      }

      return {
        workspace,
        isOwner: workspace?.users && workspace.users[0]?.role === 'owner',
        nextPlan: workspace?.plan
      };
    }),
});

export default workspaces;
