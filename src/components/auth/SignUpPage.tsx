import Image from "next/legacy/image";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/Button";
import { Toaster } from "~/components/ui/Toaster";
import { cn } from "~/utils/utils";
import SignUpComponent from "./SignupComponent";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <Toaster />

      <div className="container relative hidden h-screen flex-col items-center justify-center space-x-10 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900 " />
          <Image
            src="https://images.unsplash.com/photo-1621460249485-4e4f92c9de5d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZhcm1pbmd8ZW58MHwxfDB8fHww"
            alt="hero"
            layout="fill"
            className="object-cover opacity-40"
          />

          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="relative hidden h-[65px] w-[148px] lg:block"></div>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This software has streamlined every process of my
                company.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        {/* <SignUpComponent /> */}
        <SignUp path="/auth/sign-up" routing="path" signInUrl="/auth/sign-in" />
      </div>
    </>
  );
}
