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
        console.log(teamAccount, ">>>>>>>")
        return teamAccount;
      } catch (cause) {
        console.log(cause);
      
      }
    }),
});

export default auth;
