import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const myReports = createTRPCRouter({
  myReports: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.reports.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        Harvests: {
          select: {
            name: true,
            crop: true,
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
      },
      orderBy: { dateCreated: "desc" },
    });
  }),

  createReportWithHarvest: protectedProcedure
    .input(
      z.object({
        fieldId: z.string().min(1),
        reportName: z.string().min(1),
        dateCreated: z.date(),
        quantity: z.number().int().positive(),
        unit: z.string().min(1),
        inputsUsed: z.string().default(""),
        trackingEvents: z
          .array(
            z.object({
              eventName: z.string().min(1),
              dateCreated: z.date(),
              description: z.string().min(1),
            })
          )
          .default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Look up the field to get crop name
      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.fieldId, userId },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      // Look up the farmer record to get farmersId and project_id
      const farmer = await ctx.db.farmers.findFirst({
        where: { userId },
      });

      if (!farmer) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You're not linked to a cooperative yet. Please contact your cooperative admin.",
        });
      }

      // Create harvest + report + tracking events in a transaction
      return ctx.db.$transaction(async (tx) => {
        const harvest = await tx.harvests.create({
          data: {
            name: `${field.crop} - ${field.name}`,
            date: input.dateCreated,
            crop: field.crop,
            size: input.quantity,
            unit: input.unit,
            inputsUsed: input.inputsUsed,
            farmersId: farmer.id,
            project_id: farmer.project_id,
            userId,
          },
        });

        const report = await tx.reports.create({
          data: {
            name: input.reportName,
            dateCreated: input.dateCreated,
            harvestsId: harvest.id,
            project_id: farmer.project_id,
            userId,
            ReportTrackingEvents: {
              createMany: {
                data: input.trackingEvents.map((event) => ({
                  eventName: event.eventName,
                  dateCreated: event.dateCreated,
                  description: event.description,
                  project_id: farmer.project_id,
                })),
              },
            },
          },
          include: {
            Harvests: {
              select: {
                name: true,
                crop: true,
              },
            },
            ReportTrackingEvents: true,
          },
        });

        return report;
      });
    }),
});
