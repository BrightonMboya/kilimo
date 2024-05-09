import { createTRPCRouter, protectedProcedure } from "../trpc";

const auth = createTRPCRouter({
  getProfileData: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});

export default auth;