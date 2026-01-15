import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "./src/root";

export { appRouter, type AppRouter, createCaller } from "./src/root";
export { createCallerFactory, createTRPCContext } from "./src/trpc";
export * from "./src/schemas";

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;