import { TRPCError } from "@trpc/server";

export const NOT_FOUND_ERROR = new TRPCError({
    code: "NOT_FOUND",
    message: "Requested resource is not found"
})


export const FAILED_TO_CREATE = new TRPCError({
    code: "BAD_REQUEST",
    message: "Failed to perform this operation"
})