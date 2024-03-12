import * as React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import SideBar from "./SideBar";
import LoginForm from "../auth/LoginPage";

type Props = {
  children: React.ReactNode;
};
export default function AgriLayout({ children }: Props) {
  return (
    <React.Fragment>
      {/* <SignedIn> */}
        <section>
          <div className="flex space-x-[100px] font-sans ">
            <SideBar />
            <main className="">{children}</main>
          </div>
        </section>
      {/* </SignedIn> */}
      {/* <SignedOut>
        <LoginForm />
      </SignedOut> */}
    </React.Fragment>
  );
}
