"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import { api } from "~/trpc/react";
import { useToast } from "~/utils/hooks";

const PageCopy = ({ title, message }: { title: string; message: string }) => {
  return (
    <>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="max-w-lg text-gray-600 [text-wrap:balance] sm:text-lg">
        {message}
      </p>
    </>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const workspaceSlug = searchParams.get("workspaceSlug");
  const { toast } = useToast();
  const router = useRouter()

  const { mutateAsync, isLoading } = api.workspace.acceptInvite.useMutation({
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },

    onSettled: () => {
      // router.push(`/dashboard/${workspaceSlug}/farmers`)
      console.log("I have settled");
    },
  });
  useEffect(() => {
    mutateAsync({
      email: email!,
      workspaceSlug: workspaceSlug!,
    });
  }, [email, workspaceSlug]);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 text-center">
      {/* <Suspense
        fallback={
          <>
            <PageCopy
              title="Verifying Invite"
              message={`${APP_NAME} is verifying your invite link...`}
            />
            <LoadingSpinner className="h-7 w-7" />
          </>
        }
      >
        <VerifyInvite code={params.code} />
      </Suspense> */}
      <PageCopy
        title="Verifying Invite"
        message={`${process.env.NEXT_PUBLIC_APP_NAME} is verifying your invite link...`}
      />
      {isLoading && <LoadingSpinner className="h-7 w-7" />}
    </div>
  );
}
