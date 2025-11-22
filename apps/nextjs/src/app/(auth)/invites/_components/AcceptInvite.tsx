"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function AcceptInvite() {
  const searchParams = useSearchParams();
  const workspaceSlug = searchParams.get("workspaceSlug");
  const email = searchParams.get("email");
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-primary p-4 text-primary-foreground">
          <MailOpenIcon className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {` You've been invited to ${process.env.NEXT_PUBLIC_APP_NAME}`}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {`
          You've been invited to join the workspace ${workspaceSlug}. To accept the
          invitation, please log in with the email address
        `}
          <strong>{email}</strong>.
        </p>
        <div className="mt-6">
          <Link
            href={`/register?invite=true&email=${email}&workspaceSlug=${workspaceSlug}`}
            className="inline-flex w-[200px] items-center justify-center rounded-md bg-primary px-4 py-2 text-center text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            prefetch={false}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

function MailOpenIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
    </svg>
  );
}
