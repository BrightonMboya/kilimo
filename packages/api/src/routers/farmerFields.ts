import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const createFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  crop: z.string().min(1, "Crop type is required"),
  variety: z.string().optional(),
  size: z.number().positive("Size must be positive"),
  sizeUnit: z.enum(["ha", "acres"]).default("ha"),
  status: z.enum(["active", "fallow", "harvested", "preparing"]).default("active"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  altitude: z.number().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  plantingDate: z.date().optional(),
  expectedHarvestDate: z.date().optional(),
  notes: z.string().optional(),
});

const updateFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  crop: z.string().min(1).optional(),
  variety: z.string().optional(),
  size: z.number().positive().optional(),
  sizeUnit: z.enum(["ha", "acres"]).optional(),
  status: z.enum(["active", "fallow", "harvested", "preparing"]).optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  altitude: z.number().nullable().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  plantingDate: z.date().optional(),
  expectedHarvestDate: z.date().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

const createActivitySchema = z.object({
  fieldId: z.string(),
  cropCycleId: z.string().optional(),
  activityType: z.enum([
    "planting",
    "fertilization",
    "spraying",
    "irrigation",
    "weeding",
    "pruning",
    "inspection",
    "harvest",
    "soil_testing",
    "other",
  ]),
  description: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  inputName: z.string().optional(),
  inputBatch: z.string().optional(),
  cost: z.number().optional(),
  currency: z.string().default("KES"),
  weather: z.string().optional(),
  temperature: z.number().optional(),
  imageUrl: z.string().optional(),
  date: z.date().default(() => new Date()),
});

const seasonInputSchema = z.object({
  seasonId: z.string().optional(),
});

const getYearBounds = (year: number) => {
  const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
  return { startDate, endDate };
};

const ensureUserRow = async (
  ctx: { db: any; session: any },
  userId: string,
  userName: string | null,
) => {
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
};

const ensureCurrentSeason = async (
  ctx: { db: any; session: any },
  userId: string,
) => {
  const now = new Date();
  const activeSeason = await ctx.db.season.findFirst({
    where: { userId, isActive: true },
    orderBy: { startDate: "desc" },
  });

  if (activeSeason) return activeSeason;

  const inRangeSeason = await ctx.db.season.findFirst({
    where: {
      userId,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { startDate: "desc" },
  });

  if (inRangeSeason) {
    await ctx.db.season.update({
      where: { id: inRangeSeason.id },
      data: { isActive: true },
    });
    return { ...inRangeSeason, isActive: true };
  }

  const year = now.getFullYear();
  const { startDate, endDate } = getYearBounds(year);
  return ctx.db.season.create({
    data: {
      userId,
      name: `${year} Season`,
      startDate,
      endDate,
      isActive: true,
    },
  });
};

const farmerFields = createTRPCRouter({
  getSeasons: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userName = ctx.session.user.name ?? null;

    await ensureUserRow(ctx, userId, userName);
    const currentSeason = await ensureCurrentSeason(ctx, userId);

    const seasons = await ctx.db.season.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
    });

    return { currentSeason, seasons };
  }),

  createSeason: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        startDate: z.date(),
        endDate: z.date(),
        makeActive: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.endDate <= input.startDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Season end date must be after start date",
        });
      }

      const userId = ctx.session.user.id;
      const userName = ctx.session.user.name ?? null;
      await ensureUserRow(ctx, userId, userName);

      return ctx.db.$transaction(async (tx) => {
        if (input.makeActive) {
          await tx.season.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
          });
        }

        return tx.season.create({
          data: {
            userId,
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            isActive: input.makeActive,
          },
        });
      });
    }),

  setActiveSeason: protectedProcedure
    .input(z.object({ seasonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const season = await ctx.db.season.findFirst({
        where: { id: input.seasonId, userId },
      });

      if (!season) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Season not found",
        });
      }

      await ctx.db.$transaction([
        ctx.db.season.updateMany({
          where: { userId, isActive: true },
          data: { isActive: false },
        }),
        ctx.db.season.update({
          where: { id: input.seasonId },
          data: { isActive: true },
        }),
      ]);

      return true;
    }),

  createCropCycle: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        seasonId: z.string().optional(),
        crop: z.string().min(1),
        variety: z.string().optional(),
        notes: z.string().optional(),
        startedAt: z.date().optional(),
        endedAt: z.date().optional(),
        status: z.enum(["planned", "active", "completed"]).default("active"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userName = ctx.session.user.name ?? null;
      await ensureUserRow(ctx, userId, userName);

      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.fieldId, userId },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      const season = input.seasonId
        ? await ctx.db.season.findFirst({
          where: { id: input.seasonId, userId },
        })
        : await ensureCurrentSeason(ctx, userId);

      if (!season) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Season not found",
        });
      }

      return ctx.db.cropCycle.create({
        data: {
          userId,
          seasonId: season.id,
          fieldId: field.id,
          crop: input.crop,
          variety: input.variety,
          notes: input.notes,
          startedAt: input.startedAt ?? new Date(),
          endedAt: input.endedAt,
          status: input.status,
        },
      });
    }),

  myCropCycles: protectedProcedure
    .input(
      z.object({
        fieldId: z.string().optional(),
        seasonId: z.string().optional(),
        status: z.enum(["planned", "active", "completed"]).optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const season = input?.seasonId
        ? await ctx.db.season.findFirst({
          where: { id: input.seasonId, userId },
          select: { id: true },
        })
        : await ensureCurrentSeason(ctx, userId);

      return ctx.db.cropCycle.findMany({
        where: {
          userId,
          ...(season?.id ? { seasonId: season.id } : {}),
          ...(input?.fieldId ? { fieldId: input.fieldId } : {}),
          ...(input?.status ? { status: input.status } : {}),
        },
        include: {
          field: {
            select: { id: true, name: true, crop: true },
          },
          season: {
            select: { id: true, name: true, startDate: true, endDate: true },
          },
        },
        orderBy: { startedAt: "desc" },
      });
    }),

  myFields: protectedProcedure
    .input(seasonInputSchema.optional())
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const season = input?.seasonId
        ? await ctx.db.season.findFirst({
          where: { id: input.seasonId, userId },
        })
        : await ensureCurrentSeason(ctx, userId);

      const activitiesWhere = season
        ? {
          OR: [
            { cropCycle: { is: { seasonId: season.id } } },
            {
              cropCycleId: null,
              date: {
                gte: season.startDate,
                lte: season.endDate,
              },
            },
          ],
        }
        : undefined;

      return ctx.db.farmerFields.findMany({
        where: { userId },
        include: {
          activities: {
            where: activitiesWhere,
            orderBy: { date: "desc" },
            take: 1,
          },
          cropCycles: season
            ? {
              where: { seasonId: season.id },
              orderBy: { startedAt: "desc" },
              take: 3,
            }
            : {
              orderBy: { startedAt: "desc" },
              take: 3,
            },
        },
        orderBy: { updatedAt: "desc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string(), seasonId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const season = input.seasonId
        ? await ctx.db.season.findFirst({
          where: { id: input.seasonId, userId },
        })
        : await ensureCurrentSeason(ctx, userId);

      const activitiesWhere = season
        ? {
          OR: [
            { cropCycle: { is: { seasonId: season.id } } },
            {
              cropCycleId: null,
              date: { gte: season.startDate, lte: season.endDate },
            },
          ],
        }
        : undefined;

      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.id, userId },
        include: {
          activities: {
            where: activitiesWhere,
            orderBy: { date: "desc" },
          },
          cropCycles: season
            ? { where: { seasonId: season.id }, orderBy: { startedAt: "desc" } }
            : { orderBy: { startedAt: "desc" } },
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      return field;
    }),

  create: protectedProcedure
    .input(createFieldSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.farmerFields.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(updateFieldSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const field = await ctx.db.farmerFields.findFirst({
        where: { id, userId: ctx.session.user.id },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      return ctx.db.farmerFields.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      return ctx.db.farmerFields.delete({
        where: { id: input.id },
      });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const fields = await ctx.db.farmerFields.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        size: true,
        sizeUnit: true,
        status: true,
        complianceStatus: true,
      },
    });

    const totalFields = fields.length;
    const totalSize = fields.reduce((acc, f) => {
      const sizeInHa = f.sizeUnit === "acres" ? f.size * 0.404686 : f.size;
      return acc + sizeInHa;
    }, 0);

    const activeFields = fields.filter((f) => f.status === "active").length;
    const compliantFields = fields.filter((f) => f.complianceStatus === "compliant").length;

    return {
      totalFields,
      totalSize: Math.round(totalSize * 100) / 100,
      activeFields,
      compliantFields,
      complianceRate: totalFields > 0 ? Math.round((compliantFields / totalFields) * 100) : 0,
    };
  }),

  logActivity: protectedProcedure
    .input(createActivitySchema)
    .mutation(async ({ ctx, input }) => {
      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.fieldId, userId: ctx.session.user.id },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      if (input.cropCycleId) {
        const cycle = await ctx.db.cropCycle.findFirst({
          where: {
            id: input.cropCycleId,
            userId: ctx.session.user.id,
            fieldId: input.fieldId,
          },
        });

        if (!cycle) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid crop cycle for this field",
          });
        }
      }

      const [activity] = await ctx.db.$transaction([
        ctx.db.fieldActivity.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
          },
        }),
        ctx.db.farmerFields.update({
          where: { id: input.fieldId },
          data: { updatedAt: new Date() },
        }),
      ]);

      return activity;
    }),

  getActivities: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        seasonId: z.string().optional(),
        cropCycleId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.fieldId, userId },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      if (input.cropCycleId) {
        const cycle = await ctx.db.cropCycle.findFirst({
          where: { id: input.cropCycleId, userId, fieldId: input.fieldId },
        });
        if (!cycle) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Crop cycle not found",
          });
        }
      }

      const season = input.seasonId
        ? await ctx.db.season.findFirst({ where: { id: input.seasonId, userId } })
        : null;

      const seasonFilter = season
        ? {
          OR: [
            { cropCycle: { is: { seasonId: season.id } } },
            { cropCycleId: null, date: { gte: season.startDate, lte: season.endDate } },
          ],
        }
        : {};

      const activities = await ctx.db.fieldActivity.findMany({
        where: {
          fieldId: input.fieldId,
          ...(input.cropCycleId ? { cropCycleId: input.cropCycleId } : {}),
          ...seasonFilter,
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { date: "desc" },
      });

      let nextCursor: string | undefined;
      if (activities.length > input.limit) {
        const nextItem = activities.pop();
        nextCursor = nextItem?.id;
      }

      return { activities, nextCursor };
    }),

  deleteActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const activity = await ctx.db.fieldActivity.findFirst({
        where: { id: input.id },
        include: { field: true },
      });

      if (!activity || activity.field.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      return ctx.db.fieldActivity.delete({ where: { id: input.id } });
    }),

  recentActivities: protectedProcedure
    .input(
      z.object({
        seasonId: z.string().optional(),
        limit: z.number().min(1).max(20).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const season = input.seasonId
        ? await ctx.db.season.findFirst({ where: { id: input.seasonId, userId } })
        : null;

      const seasonFilter = season
        ? {
          OR: [
            { cropCycle: { is: { seasonId: season.id } } },
            { cropCycleId: null, date: { gte: season.startDate, lte: season.endDate } },
          ],
        }
        : {};

      return ctx.db.fieldActivity.findMany({
        where: {
          userId,
          ...seasonFilter,
        },
        include: {
          field: {
            select: { id: true, name: true, crop: true },
          },
        },
        orderBy: { date: "desc" },
        take: input.limit,
      });
    }),
});

export default farmerFields;
