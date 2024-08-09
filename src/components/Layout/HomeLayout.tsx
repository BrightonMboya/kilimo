import * as React from "react";
// import Nav from "./Nav";
import Footer from "~/components/landingPage/Footer";
import { Navigation } from "../landingPage/nav/navigation";

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
