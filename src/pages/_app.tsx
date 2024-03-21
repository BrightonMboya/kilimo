import { type AppType } from "next/app";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { api } from "~/utils/api";
import type { ReactElement, ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";

import { Montserrat } from "next/font/google";
import Layout from "~/components/Layout/Layout";

export const monsterrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        variables: {
          colorPrimary: "#46783E",
        },
      }}
    >
      {getLayout(
        <main className={`${monsterrat.className}`}>
          <Component {...pageProps} />
        </main>,
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
