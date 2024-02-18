import Image from "next/legacy/image";
import Link from "next/link";

import { buttonVariants } from "~/components/UI/Button";
import { Toaster } from "~/components/UI/Toaster";
import { cn } from "~/lib/utils";
import SignUpComponent from "./signupComponent";

export default function Page() {
  return (
    <>
      <Toaster />

      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8",
          )}
        >
          Login
        </Link>
        <div className="bg-muted relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900 " />
          <Image src="/phoneLady.webp" alt="hero" layout="fill" />

          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="relative hidden h-[65px] w-[148px] lg:block">
              <Image
                src="/new_logo.png"
                style={{
                  borderRadius: "12px",
                }}
                alt="logo"
                layout="fill"
              />
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This software has enabled me to focus on the core of my
                agribusiness and not worry about tech.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <SignUpComponent />
      </div>
    </>
  );
}
