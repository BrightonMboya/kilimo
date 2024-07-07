import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./server/db";

export const config = {
  ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
