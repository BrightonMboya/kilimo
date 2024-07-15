import { TRPCError } from "@trpc/server";
import z from "zod";


export const HOME_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const DEFAULT_REDIRECTS = {
  home: "https://jani-ai.com",
  jani: "https://jani-ai.com",
  signin: "https://jani-ai.com/login",
  login: "https://jani-ai.com/login",
  register: "https://jani-ai.com/register",
  signup: "https://jani-ai.com/register",
  app: "https://jani-ai.com",
  dashboard: "https://jani-ai.com",
  settings: "https://jani-ai.com/settings",
  welcome: "https://jani-ai.com/welcome",
};

export const DICEBEAR_AVATAR_URL =
  "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&fontFamily=Helvetica&fontSize=40&seed=";


export const NOT_FOUND_ERROR = new TRPCError({
  code: "NOT_FOUND",
  message: "Requested resource is not found",
});

export const FAILED_TO_CREATE = new TRPCError({
  code: "BAD_REQUEST",
  message: "Failed to perform this operation",
});

export const organizationEmailSchema = z.object({
  organizationEmail: z.string(),
});


export const FAILED_TO_MUTATE =  new TRPCError({
  code: "BAD_REQUEST",
  message: "Failed to perform this operation"
})


export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://www.jani-ai.com`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:3000";