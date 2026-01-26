import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@kilimo/db";
// import { sendEmail, WelcomeEmail, LoginLink } from "@kilimo/emails";
// import Postmark from "next-auth/providers/postmark";
// import * as Sentry from "@sentry/nextjs";

function getProviders() {
  // if (!process.env.POSTMARK_API_KEY || !process.env.EMAIL_SERVER) {
  //   return authConfig.providers;
  // }

  return [
    ...authConfig.providers,
    // Postmark({
    //   apiKey: process.env.POSTMARK_API_KEY,
    //   server: process.env.EMAIL_SERVER,
    //   from: "reggie@jani-ai.com",
    //   async sendVerificationRequest({ identifier, url }) {
    //     await sendEmail({
    //       email: identifier,
    //       subject: `Your ${process.env.NEXT_PUBLIC_APP_NAME} Login Link`,
    //       react: LoginLink({ url, email: identifier }),
    //     });
    //   },
    // }),
  ];
}

export const config: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: authConfig.callbacks,
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  providers: getProviders(),
  adapter: PrismaAdapter(db),
  // events: {
  //   async signIn(message) {
  //     Sentry.setUser({ id: message?.user?.id });
  //
  //     if (!message.isNewUser || !message.user?.email) return;
  //
  //     const user = await db.user.findUnique({
  //       where: { email: message.user.email },
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         image: true,
  //         createdAt: true,
  //       },
  //     });
  //
  //     if (
  //         user?.createdAt &&
  //         new Date(user.createdAt).getTime() > Date.now() - 10_000
  //     ) {
  //       await sendEmail({
  //         subject: "Welcome to Jani AI!",
  //         email: user.email!,
  //         react: WelcomeEmail({
  //           email: user.email!,
  //           name: user.name || null,
  //         }),
  //         marketing: true,
  //       });
  //     }
  //   },
  //
  //   async signOut() {
  //     Sentry.setUser(null);
  //   },
  // },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
