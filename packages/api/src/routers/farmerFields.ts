import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Input validation schemas
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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  altitude: z.number().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  plantingDate: z.date().optional(),
  expectedHarvestDate: z.date().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

const createActivitySchema = z.object({
  fieldId: z.string(),
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

const farmerFields = createTRPCRouter({
  // Get all fields for the current user
  myFields: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.farmerFields.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        activities: {
          orderBy: { date: "desc" },
          take: 1, // Get only the latest activity for list view
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  // Get a single field by ID with all activities
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const field = await ctx.db.farmerFields.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          activities: {
            orderBy: { date: "desc" },
          },
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

  // Create a new field
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

  // Update a field
  update: protectedProcedure
    .input(updateFieldSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
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

  // Delete a field
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
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

  // Get field statistics for dashboard
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
      // Convert acres to hectares if needed
      const sizeInHa = f.sizeUnit === "acres" ? f.size * 0.404686 : f.size;
      return acc + sizeInHa;
    }, 0);

    const activeFields = fields.filter((f) => f.status === "active").length;
    const compliantFields = fields.filter(
      (f) => f.complianceStatus === "compliant"
    ).length;

    return {
      totalFields,
      totalSize: Math.round(totalSize * 100) / 100, // Round to 2 decimals
      activeFields,
      compliantFields,
      complianceRate:
        totalFields > 0
          ? Math.round((compliantFields / totalFields) * 100)
          : 0,
    };
  }),

  // ============================================
  // ACTIVITY LOGGING
  // ============================================

  // Log a new activity
  logActivity: protectedProcedure
    .input(createActivitySchema)
    .mutation(async ({ ctx, input }) => {
      // Verify field ownership
      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.fieldId, userId: ctx.session.user.id },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      // Create activity and update field's updatedAt
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

  // Get activities for a field
  getActivities: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify field ownership
      const field = await ctx.db.farmerFields.findFirst({
        where: { id: input.fieldId, userId: ctx.session.user.id },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Field not found",
        });
      }

      const activities = await ctx.db.fieldActivity.findMany({
        where: { fieldId: input.fieldId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { date: "desc" },
      });

      let nextCursor: string | undefined;
      if (activities.length > input.limit) {
        const nextItem = activities.pop();
        nextCursor = nextItem?.id;
      }

      return {
        activities,
        nextCursor,
      };
    }),

  // Delete an activity
  deleteActivity: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership through field
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

      return ctx.db.fieldActivity.delete({
        where: { id: input.id },
      });
    }),

  // Get recent activities across all fields (for dashboard)
  recentActivities: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.fieldActivity.findMany({
        where: { userId: ctx.session.user.id },
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
