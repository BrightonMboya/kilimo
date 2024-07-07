import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "./env";
import { db } from "./server/db";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { resend } from "./emails";
import WelcomeEmail from "./emails/welcome-email";

export default {
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      console.log({ user, account, profile });
      // if (!user.email || (await isBlacklistedEmail(user.email))) {
      //   return false;
      // }
      if (account?.provider === "google" || account?.provider === "github") {
        const userExists = await db.user.findUnique({
          where: { email: user.email! },
          select: { id: true, name: true, image: true },
        });
        if (!userExists || !profile) {
          return true;
        }
        // if the user already exists via email,
        // update the user with their name and image
        if (userExists && profile) {
          const profilePic =
            profile[account.provider === "google" ? "picture" : "avatar_url"];
          // let newAvatar: string | null = null;
          // // if the existing user doesn't have an image or the image is not stored in R2
          // if (
          //   (!userExists.image || !isStored(userExists.image)) &&
          //   profilePic
          // ) {
          //   const { url } = await storage.upload(
          //     `avatars/${userExists.id}`,
          //     profilePic,
          //   );
          //   newAvatar = url;
          // }
          // await db.user.update({
          //   where: { email: user.email! },
          //   // @ts-expect-error - this is a bug in the types, `login` is a valid on the `Profile` type
          //   data: {
          //     ...(!userExists.name && { name: profile.name || profile.login }),
          //     ...(newAvatar && { image: newAvatar }),
          //   },
          // });
        }
      }
      return true;
    },
    jwt: async ({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user: User | AdapterUser;
      trigger?: "signIn" | "update" | "signUp";
    }) => {
      if (user) {
        token.user = user;
      }

      // refresh the user's data if they update their name / email
      if (trigger === "update") {
        const refreshedUser = await db.user.findUnique({
          where: { id: token.sub },
        });
        if (refreshedUser) {
          token.user = refreshedUser;
        } else {
          return {};
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.sub,
        // @ts-ignore
        ...(token || session).user,
      };
      return session;
    },
  },
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
          resend.emails.send({
            subject: "Welcome to Jani AI",
            to: email,
            react: WelcomeEmail({
              email,
              name: user?.name || null,
              marketing: true,
            }),
            from: "brighton.mboya.io@gmail.com",
          });

          // await Promise.allSettled([
          //   sendEmail({
          //     subject: "Welcome to Jani AI!",
          //     email,
          //     react: WelcomeEmail({
          //       email,
          //       name: user.name || null,
          //     }),
          //     marketing: true,
          //   }),
          // ]);
        }
      }
    },
  },
} satisfies NextAuthConfig;
