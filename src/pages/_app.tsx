import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, AppType } from "next/app";
import { Montserrat } from "next/font/google";

import { api } from "../utils/api";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const montserrat = Montserrat({
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
        <main className={`${montserrat.variable} font-montserrat`}>
          <Component {...pageProps} />
        </main>,
      )}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
