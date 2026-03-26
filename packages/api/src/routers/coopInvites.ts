import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

async function getCooperativeId(db: any, userId: string | undefined) {
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated." });
  const cooperative = await db.cooperative.findFirst({
    where: { userId },
    select: { id: true, name: true },
  });
  if (!cooperative) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Cooperative not found." });
  }
  return cooperative;
}

const coopInvitesRouter = createTRPCRouter({
  // ─── Coop Manager Side ─────────────────────────────────

  /** Send an invite to a farmer by email */
  send: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        farmerName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const coop = await getCooperativeId(ctx.db, ctx.session.user.id);

      // Check for existing pending invite
      const existing = await ctx.db.coopInvite.findUnique({
        where: {
          cooperativeId_email: {
            cooperativeId: coop.id,
            email: input.email.toLowerCase(),
          },
        },
      });

      if (existing && existing.status === "accepted") {
        throw new TRPCError({ code: "CONFLICT", message: "This farmer has already accepted the invite." });
      }

      // Upsert — resend if pending/declined/expired
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14); // 2 weeks

      const invite = await ctx.db.coopInvite.upsert({
        where: {
          cooperativeId_email: {
            cooperativeId: coop.id,
            email: input.email.toLowerCase(),
          },
        },
        create: {
          cooperativeId: coop.id,
          email: input.email.toLowerCase(),
          farmerName: input.farmerName,
          expiresAt,
        },
        update: {
          status: "pending_invite",
          farmerName: input.farmerName ?? existing?.farmerName,
          expiresAt,
          acceptedAt: null,
        },
      });

      return invite;
    }),

  /** List all invites sent by this cooperative */
  listSent: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending_invite", "accepted", "declined", "expired"]).optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const coop = await getCooperativeId(ctx.db, ctx.session.user.id);

      const where: any = { cooperativeId: coop.id };
      if (input?.status) {
        where.status = input.status;
      }

      return ctx.db.coopInvite.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    }),

  /** Cancel/delete a pending invite */
  cancel: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const coop = await getCooperativeId(ctx.db, ctx.session.user.id);

      return ctx.db.coopInvite.delete({
        where: { id: input.inviteId, cooperativeId: coop.id },
      });
    }),

  // ─── Farmer Side ───────────────────────────────────────

  /** Get pending invites for the currently logged-in farmer (by email) */
  myPendingInvites: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Look up user's email from the User table
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) return [];

    // Find pending invites matching this email
    const invites = await ctx.db.coopInvite.findMany({
      where: {
        email: user.email.toLowerCase(),
        status: "pending_invite",
        expiresAt: { gte: new Date() },
      },
      include: {
        cooperative: {
          select: { id: true, name: true, location: true, contactName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invites;
  }),

  /** Accept an invite — links the farmer's account to the cooperative */
  accept: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });

      if (!user?.email) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User email not found." });
      }

      // Find the invite
      const invite = await ctx.db.coopInvite.findUnique({
        where: { id: input.inviteId },
      });

      if (!invite) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found." });
      }

      if (invite.email.toLowerCase() !== user.email.toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This invite is not for your account." });
      }

      if (invite.status === "accepted") {
        throw new TRPCError({ code: "CONFLICT", message: "Invite already accepted." });
      }

      if (invite.expiresAt < new Date()) {
        await ctx.db.coopInvite.update({
          where: { id: invite.id },
          data: { status: "expired" },
        });
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invite has expired." });
      }

      // Check if farmer already exists in this coop (by email or userId)
      let coopFarmer = await ctx.db.coopFarmer.findFirst({
        where: {
          cooperativeId: invite.cooperativeId,
          OR: [
            { userId: userId },
            { email: user.email.toLowerCase() },
          ],
        },
      });

      if (coopFarmer) {
        // Link existing CoopFarmer record to this user
        coopFarmer = await ctx.db.coopFarmer.update({
          where: { id: coopFarmer.id },
          data: { userId, email: user.email.toLowerCase() },
        });
      } else {
        // Create a new CoopFarmer linked to this user
        coopFarmer = await ctx.db.coopFarmer.create({
          data: {
            cooperativeId: invite.cooperativeId,
            userId,
            fullName: user.name ?? invite.farmerName ?? "Unknown",
            email: user.email.toLowerCase(),
          },
        });
      }

      // Mark invite as accepted
      await ctx.db.coopInvite.update({
        where: { id: invite.id },
        data: { status: "accepted", acceptedAt: new Date() },
      });

      return coopFarmer;
    }),

  /** Decline an invite */
  decline: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user?.email) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User email not found." });
      }

      const invite = await ctx.db.coopInvite.findUnique({
        where: { id: input.inviteId },
      });

      if (!invite || invite.email.toLowerCase() !== user.email.toLowerCase()) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found." });
      }

      return ctx.db.coopInvite.update({
        where: { id: invite.id },
        data: { status: "declined" },
      });
    }),

  /** Get cooperatives the farmer belongs to */
  myCooperatives: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const memberships = await ctx.db.coopFarmer.findMany({
      where: { userId },
      include: {
        cooperative: {
          select: { id: true, name: true, location: true, contactName: true },
        },
      },
    });

    return memberships;
  }),
});

export default coopInvitesRouter;
