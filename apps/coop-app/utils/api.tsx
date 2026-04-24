import type { AppRouter } from "@kilimo/api/client";
import { createTRPCReact } from "@trpc/react-query";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import Constants from "expo-constants";
import { useAuth } from '@clerk/clerk-expo';
import { httpBatchLink } from "@trpc/client";
import { Platform } from "react-native";

export const trpc = createTRPCReact<AppRouter>();

export const getBaseUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.debuggerHost ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;

  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    return `http://${localhost}:3000`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }

  return "http://localhost:3000";
};

const url = `${getBaseUrl()}/api/trpc`;

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
            return authToken ? { Authorization: authToken } : {};
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

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@kilimo/api/client";
