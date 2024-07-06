import { TRPCError } from "@trpc/server";
import z from "zod";


export const HOME_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;


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
