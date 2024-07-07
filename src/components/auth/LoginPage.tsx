import { Button } from "./Auth-Button";
import { HOME_DOMAIN, constructMetadata } from "~/utils";
import { Suspense } from "react";
import LoginForm from "~/components/auth/LoginForm";

export const metadata = constructMetadata({
  title: `Sign in to ${process.env.NEXT_PUBLIC_APP_NAME}`,
});

export default function LoginPage() {
  return (
    <div className="relative z-10 mt-[calc(30vh)] lg:mt-0 h-fit w-full max-w-md overflow-hidden border-y border-gray-200 sm:rounded-2xl sm:border sm:shadow-xl">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <a href={HOME_DOMAIN}>{/* <Logo className="h-10 w-10" /> */}</a>
        <h3 className="text-xl font-semibold">
          Sign in to {process.env.NEXT_PUBLIC_APP_NAME}
        </h3>
        <p className="text-sm text-gray-500">
          Start tracking your resources across the supply chain
        </p>
      </div>
      <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
        <Suspense
          fallback={
            <>
              <Button disabled={true} variant="secondary" />
              <Button disabled={true} variant="secondary" />
              <Button disabled={true} variant="secondary" />
              <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
            </>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
