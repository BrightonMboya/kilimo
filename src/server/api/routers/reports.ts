import { FAILED_TO_CREATE, NOT_FOUND_ERROR } from "~/utils/constants";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { reportSchema } from "~/app/(app)/dashboard/reports/_components/schema";
import z from "zod";


const reports = createTRPCRouter({
  fetchByOrganization: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.reports.findMany({
          where: {
            organization_id: ctx?.user.id,
          },
          include: {
            Harvests: {
              select: {
                name: true,
              }
            }
          }
        });
      } catch (cause) {
        console.log(cause);
        throw NOT_FOUND_ERROR;
      }
    }),
  add: protectedProcedure
    .input(reportSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.reports.create({
          data: {
            name: input.name,
            dateCreated: input.dateCreated,
            harvestsId: input.harvestId,
            organization_id: ctx.user?.id,
            ReportTrackingEvents: {
              createMany: {
                data: input.trackingEvents.map((event) => ({
                  eventName: event.eventName,
                  dateCreated: event.dateCreated,
                  description: event.description,
                  organization_id: ctx.user?.id,
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

    delete: protectedProcedure
    .input(z.object({ reportId: z.string() }))
    .mutation(async ({ctx, input}) => {})
});

export default reports;
