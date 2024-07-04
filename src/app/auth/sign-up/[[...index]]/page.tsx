import Link from "next/link";
import Input from "~/components/ui/Input";
import Label from "~/components/ui/label";
import { cn } from "~/utils/utils";
import Image from "next/legacy/image";
import { signUp } from "~/app/auth/actions";

import { SubmitButton } from "../../_components/submit-button";

export default function Page({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900 " />
        <Image
          src="https://images.unsplash.com/photo-1618775293437-91b843a7bcc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGZhcm1lcnxlbnwwfDF8MHx8fDA%3D"
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
      <div className="mx-auto flex h-screen w-full flex-col items-center justify-center space-y-6  sm:w-[350px]">
        <div className="grid gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Thank you for chosing smas
            </h1>
            <p className="text-sm text-muted-foreground">
              Create an account to login
            </p>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className={cn("grid gap-6")}>
                <form className="animate-in flex w-full flex-1 flex-col justify-center gap-2 ">
                  <Label className="text-md" htmlFor="organization_name">
                    Organization Name
                  </Label>
                  <Input
                    className=" rounded-md border bg-inherit px-4 py-2"
                    placeholder="Sample Organization"
                    required
                    name="organization_name"
                  />
                  <Label className="text-md mt-5" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    className=" rounded-md border bg-inherit px-4 py-2"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                  <Label className="text-md mt-5" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    className=" rounded-md border bg-inherit px-4 py-2"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                  />
                  <SubmitButton
                    formAction={signUp}
                    className="bg-green-700 mb-2 rounded-md px-4 py-2 text-foreground"
                    pendingText="Signing In..."
                  >
                    Sign In
                  </SubmitButton>

                  {searchParams?.message && (
                    <p className="mt-4  p-4 text-center text-red-500">
                      {searchParams.message}
                    </p>
                  )}
                </form>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
                </Link>{" "}
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
