"use client";

import * as React from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

import Button from "~/components/UI/Button";
import Input from "~/components/UI/Input";
import { Icons } from "~/components/UI/icons";
import Label from "~/components/UI/label";
import { useToast } from "~/hooks/useToast";
import { cn } from "~/lib/utils";

const schema = z.object({
  email: z.string(),
  // country: z.string(),
  organizationName: z.string(),
  password: z.string(),
});

type ValidationSchema = z.infer<typeof schema>;

export function UserAuthForm({
  setShowEmailVerification,
  className,
  ...props
}: any) {
  const { isLoaded, signUp } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) });
  const { toast } = useToast();

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    // console.log(data.email, data.organizationName, data.password);
    try {
      const res = await signUp?.create({
        emailAddress: data.email,
        username: data.organizationName,
        password: data.password,
      });
      // send the email verification
      await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
      setShowEmailVerification(true);
    } catch (cause) {
      console.log(cause, "I am the errorr");
      toast({
        variant: "destructive",
        title: "Sth went wrong",
        //@ts-ignore
        description: `${cause?.errors[0].longMessage}`,
        duration: 3500,
      });
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your company credentials to get started
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-3">
            <Label className="sr-only" htmlFor="email">
              Name
            </Label>

            <Input
              id="organization Name"
              placeholder="Shamba Data"
              autoCorrect="off"
              {...register("organizationName")}
              disabled={!isLoaded}
            />

            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="brighton@shamba-data.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={!isLoaded}
              {...register("email")}
            />
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="secret-password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={!isLoaded}
              {...register("password")}
            />
            {/* <Label className="sr-only" htmlFor="email">
              Country
            </Label>
            <Input placeholder="zambia" {...register("country")} /> */}
          </div>
          <Button disabled={!isLoaded} type="submit">
            {!isLoaded && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <p className="text-muted-foreground px-8 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
