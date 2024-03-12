"use client";
import { SignIn, SignUp } from "@clerk/nextjs";

export function LoginForm() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="grid gap-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to login
          </p>
        </div>

        <SignIn
        afterSignInUrl="/dashboard/farmers"
        routing="path"
        path="/auth/sign-in"
        signUpUrl="/auth/signin"
        />
        {/* <SignUp /> */}
      </div>
    </div>
  );
}
