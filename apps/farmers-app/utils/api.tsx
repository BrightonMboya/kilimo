import type { AppRouter } from "@kilimo/api";
import { createTRPCReact } from "@trpc/react-query";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import Constants from "expo-constants";
import { useAuth } from '@clerk/clerk-expo';
import { httpBatchLink } from "@trpc/client";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
const getBaseUrl = () => {
  // For production, set your API URL here
  // return "https://your-production-api.com";

  // Try to get the debugger host from Expo
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    return `http://${localhost}:3000`;
  }

  // Fallbacks for different environments
  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine
    return "http://10.0.2.2:3000";
  }

  // iOS simulator can use localhost
  return "http://localhost:3000";
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