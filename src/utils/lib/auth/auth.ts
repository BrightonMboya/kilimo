import NextAuth, { type NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../../../server/db";
import { sendEmail } from "~/emails";
import WelcomeEmail from "~/emails/welcome-email";

const additionalConfig = {
  ...authConfig,
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        const email = message.user.email as string;
        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });
        if (!user) {
          return;
        }
        // only send the welcome email if the user was created in the last 10s
        // (this is a workaround because the `isNewUser` flag is triggered when a user does `dangerousEmailAccountLinking`)
        if (
          user.createdAt &&
          new Date(user.createdAt).getTime() > Date.now() - 10000
        ) {
          await Promise.allSettled([
            sendEmail({
              subject: "Welcome to Jani AI!",
              email,
              react: WelcomeEmail({
                email,
                name: user.name || null,
              }),
              marketing: true,
            }),
          ]);
        }
      }
    },
  },
} satisfies NextAuthConfig;

export const config = {
  // ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...additionalConfig,
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
