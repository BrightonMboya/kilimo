import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const myReports = createTRPCRouter({
  myReports: protectedProcedure
    .input(z.object({ seasonId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const season = input?.seasonId
        ? await ctx.db.season.findFirst({
          where: { id: input.seasonId, userId },
        })
        : await ctx.db.season.findFirst({
          where: { userId, isActive: true },
          orderBy: { startDate: "desc" },
        });

      const seasonFilter = season
        ? {
          OR: [
            { cropCycle: { is: { seasonId: season.id } } },
            { cropCycleId: null, dateCreated: { gte: season.startDate, lte: season.endDate } },
          ],
        }
        : {};

      return ctx.db.reports.findMany({
        where: {
          userId,
          ...seasonFilter,
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
        cropCycleId: z.string().optional(),
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
      const userName = ctx.session.user.name ?? null;

      // Mobile (Clerk) users may authenticate without an existing row in `User`.
      // Ensure one exists so FK-constrained relations (ProjectUsers/Farmers/Harvests/Reports) don't fail.
      await ctx.db.user.upsert({
        where: { id: userId },
        update: {
          ...(userName ? { name: userName } : {}),
        },
        create: {
          id: userId,
          ...(userName ? { name: userName } : {}),
        },
      });

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

      const activeSeason = await ctx.db.season.findFirst({
        where: { userId, isActive: true },
        orderBy: { startDate: "desc" },
      });

      let cropCycle = input.cropCycleId
        ? await ctx.db.cropCycle.findFirst({
          where: {
            id: input.cropCycleId,
            userId,
            fieldId: input.fieldId,
          },
        })
        : null;

      if (input.cropCycleId && !cropCycle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid crop cycle selected for this field",
        });
      }

      if (!cropCycle && activeSeason) {
        cropCycle = await ctx.db.cropCycle.findFirst({
          where: {
            userId,
            fieldId: input.fieldId,
            seasonId: activeSeason.id,
            status: "active",
          },
          orderBy: { startedAt: "desc" },
        });
      }

      if (!cropCycle && activeSeason) {
        cropCycle = await ctx.db.cropCycle.create({
          data: {
            userId,
            seasonId: activeSeason.id,
            fieldId: input.fieldId,
            crop: field.crop,
            variety: field.variety ?? undefined,
            status: "active",
            startedAt: input.dateCreated,
          },
        });
      }

      // Look up the farmer record to get farmersId and project_id.
      // For mobile users without cooperative onboarding, auto-provision
      // a personal workspace + farmer profile so report generation works.
      let farmer = await ctx.db.farmers.findFirst({
        where: { userId },
      });

      if (!farmer) {
        farmer = await ctx.db.$transaction(async (tx) => {
          const existingMembership = await tx.projectUsers.findFirst({
            where: { userId },
            select: { projectId: true },
          });

          let projectId = existingMembership?.projectId;

          if (!projectId) {
            const slugBase = `farm-${userId.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20) || "user"}`;
            const newProject = await tx.project.create({
              data: {
                name: `${userName ?? "My"} Farm`,
                slug: `${slugBase}-${Date.now().toString(36)}`,
                billingCycleStart: new Date().getDate(),
              },
              select: { id: true },
            });
            projectId = newProject.id;

            await tx.projectUsers.create({
              data: {
                userId,
                projectId,
                role: "owner",
              },
            });
          }

          return tx.farmers.create({
            data: {
              fullName: ctx.session.user.name ?? "Farmer",
              phoneNumber: null,
              farmSize: Math.max(1, Math.round(field.size)),
              province: "Unknown",
              country: "Unknown",
              crops: field.crop,
              quantityCanSupply: input.quantity,
              project_id: projectId,
              userId,
            },
          });
        });
      }

      // Create harvest + report + tracking events in a transaction
      return ctx.db.$transaction(async (tx) => {
        const harvest = await tx.harvests.create({
          data: {
            name: `${cropCycle?.crop ?? field.crop} - ${field.name}`,
            date: input.dateCreated,
            crop: cropCycle?.crop ?? field.crop,
            size: input.quantity,
            unit: input.unit,
            inputsUsed: input.inputsUsed,
            farmersId: farmer.id,
            project_id: farmer.project_id,
            userId,
            cropCycleId: cropCycle?.id,
          },
        });

        const report = await tx.reports.create({
          data: {
            name: input.reportName,
            dateCreated: input.dateCreated,
            harvestsId: harvest.id,
            project_id: farmer.project_id,
            userId,
            cropCycleId: cropCycle?.id,
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
