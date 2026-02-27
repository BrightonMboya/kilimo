import * as React from "react";
import Footer from "~/components/landingPage/oldComponents/Footer";
import { Navigation } from "../landingPage/oldComponents/nav/navigation";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Navigation />
      <main className="font-montserrat">{children}</main>
      <Footer />
    </>
  );
}
