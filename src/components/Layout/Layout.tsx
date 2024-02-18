import * as React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import SignUpForm from "../auth/signUpPage";
import SideBar from "./SideBar";

type Props = {
  children: React.ReactNode;
};
export default function AgriLayout({ children }: Props) {
  return (
    <React.Fragment>
      <SignedIn>
        <section>
          <div className="flex space-x-5 font-sans ">
            <SideBar />
            <main className="">{children}</main>
          </div>
        </section>
      </SignedIn>
      <SignedOut>
        <section className="flex h-screen items-center justify-center">
          <SignUpForm />
        </section>
      </SignedOut>
    </React.Fragment>
  );
}
