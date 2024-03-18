import * as React from "react";
import Nav from "./Nav";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Nav />
      <main className="font-montserrat">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
