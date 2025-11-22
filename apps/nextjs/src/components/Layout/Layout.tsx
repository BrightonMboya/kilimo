import * as React from "react";
import SideBar from "./sidebar/SideBar";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <div className="lg:flex">
        <SideBar />
        <div className=" w-full">
          <main className="mt-10 md:mt-0">{children}</main>
        </div>
      </div>
    </>
  );
}
