import type { AppRouter } from "@kilimo/api";
import { createTRPCReact } from "@trpc/react-query";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import Constants from "expo-constants";
import { useAuth } from '@clerk/clerk-expo';
import { httpBatchLink } from "@trpc/client";

export const trpc = createTRPCReact<AppRouter>();
 
/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost =
    Constants.manifest?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const localhost = debuggerHost?.split(":")[0];
  if (!localhost) {
    // Fallback to localhost for iOS simulator or Android emulator
    return "http://localhost:3000";
  }
  return `http://${localhost}:3000`;
};

const url = `${getBaseUrl()}/api/trpc`;

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url,
          async headers() {
            const authToken = await getToken();
            return {
              Authorization: authToken ?? undefined,
            };
          },
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@kilimo/api";