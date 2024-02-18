import { type AppType } from "next/app";

import { api } from "~/utils/api";
import { Montserrat } from "next/font/google";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        variables: {
          colorPrimary: "#46783E",
        },
      }}
    >
      <main className={`${montserrat.variable} font-montserrat`}>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
