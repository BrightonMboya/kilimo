import * as React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import SideBar from "./SideBar";
import LoginForm from "../auth/LoginPage";
import { monsterrat } from "~/pages/_app";

type Props = {
  children: React.ReactNode;
};
export default function AgriLayout({ children }: Props) {
  return (
    <main className={monsterrat.className}>
      <SignedIn>
        <section>
          <div className="flex space-x-[100px] ">
            <SideBar />
            <main className="">{children}</main>
          </div>
        </section>
      </SignedIn>
      <SignedOut>
        <LoginForm />
      </SignedOut>
    </main>
  );
}
