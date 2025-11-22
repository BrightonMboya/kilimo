import { createTRPCRouter, protectedProcedure } from "../trpc";

const auth = createTRPCRouter({
  getProfileData: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});

export default auth;