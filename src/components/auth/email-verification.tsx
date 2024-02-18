import { useState } from "react";
import { useRouter } from "next/router";
import { useSignUp } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { Input } from "~/components/UI";
import Button from "~/components/UI/Button";
import { Icons } from "~/components/UI/icons";
import { useToast } from "~/hooks/useToast";

export default function Index() {
  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync } = api.organization.signUp.useMutation();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });
      await setActive!({ session: completeSignUp?.createdSessionId });
      // navigate the user to the farmers page
      router.push("/agri/dashboard/farmers");

      // record the user on the database as we're signing them up

      mutateAsync({
        email: completeSignUp?.emailAddress as string,
        name: completeSignUp?.username as string,
      });
    } catch (cause) {
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
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your Email
          </h1>
          <p className="text-muted-foreground text-sm">
            We have sent a code to the email registered.
          </p>

          <form onSubmit={onSubmit}>
            <Input
              placeholder="4356"
              autoCapitalize="none"
              autoCorrect="off"
              className="mt-[20px] text-center tracking-[10px]"
              onChange={(e) => {
                e.preventDefault();
                setCode(e.target.value);
              }}
            />
            <Button disabled={!isLoaded} type="submit" className="mt-5 w-full">
              {!isLoaded && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
