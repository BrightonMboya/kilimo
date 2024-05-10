import * as React from "react";
import SideBar from "./SideBar";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <div className="flex">
        <aside>
          <SideBar />
        </aside>
        <div className="ml-[200px] w-full">
          <Header />
          <main className="mt-10 md:mt-0">{children}</main>
        </div>
      </div>
    </>
  );
}
