import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const auth = createTRPCRouter({
  getProfileData: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  getAccountBySlug: protectedProcedure
    .input(z.object({
      accountSlug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { data: teamAccount, error } = await ctx.supabase.rpc(
          "get_account_by_slug",
          {
            slug: input.accountSlug,
          },
        );
        return teamAccount;
      } catch (cause) {
        console.log(cause);
      }
    }),

  getAccountInvitations: protectedProcedure
    .input(z.object({
      accountId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      try {
        const { data: invitations } = await ctx.supabase.rpc(
          "get_account_invitations",
          {
            account_id: input.accountId,
          },
        );
        return invitations;
      } catch (cause) {
        console.log(cause);
      }
    }),

  getAccountMembers: protectedProcedure
    .input(z.object({
      accountId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { data: members } = await ctx.supabase.rpc(
          "get_account_members",
          {
            account_id: input.accountId,
          },
        );
        const { data: user } = await ctx.supabase.auth.getUser();
        return {members, user};
      } catch (cause) {
        console.log(cause);
      }
    }),
});

export default auth;
