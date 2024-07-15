import {
  FAILED_TO_CREATE,
  FAILED_TO_MUTATE,
  NOT_FOUND_ERROR,
} from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { reportSchema } from "~/app/(app)/dashboard/[accountSlug]/reports/_components/schema";
import z from "zod";

const reports = createTRPCRouter({
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
            Organization: {
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

  markAsFinishedTracking: protectedProcedure
    .input(z.object({ reportId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.reports.update({
          where: {
            id: input.reportId,
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

  delete: protectedProcedure
    .input(z.object({ reportId: z.string() }))
    .mutation(async ({ ctx, input }) => {}),

  deleteTrackingEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.reportTrackingEvents.delete({
          where: {
            id: input.eventId,
          },
        });
      } catch (cause) {
        console.log(cause);
        throw FAILED_TO_MUTATE;
      }
    }),
});

export default reports;
