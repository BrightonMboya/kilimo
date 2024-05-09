import * as React from "react";

import SideBar from "./SideBar";
import LoginForm from "../auth/LoginPage";

type Props = {
  children: React.ReactNode;
};
export default function AgriLayout({ children }: Props) {
  return (
    <main>
      <section>
        <div className="flex space-x-[50px] ">
          <SideBar />
          <main className="">{children}</main>
        </div>
      </section>
    </main>
  );
}
